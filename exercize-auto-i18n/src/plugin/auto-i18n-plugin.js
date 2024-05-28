const { declare } = require('@babel/helper-plugin-utils');
const { log } = require('console');
const fse = require('fs-extra');
const path = require('path');
const generate = require('@babel/generator').default;

let intlIndex = 0;
function nextIntlKey() {
  ++intlIndex;
  return `intl${intlIndex}`;
}

const autoTrackPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  if (!options.outputDir) {
    throw new Error('outputDir in empty');
  }

  function getReplaceExpression(path, value, intlUid) {
    const expressionParams = path.isTemplateLiteral()
      ? path.node.expressions.map((item) => generate(item).code)
      : null;

    let replaceExpression = api.template.ast(
      `localeData('${value}'${
        expressionParams ? ',' + expressionParams.join(',') : ''
      })`
    ).expression;
    if (
      path.findParent((p) => p.isJSXAttribute()) &&
      !path.findParent((p) => p.isJSXExpressionContainer())
    ) {
      replaceExpression = api.types.JSXExpressionContainer(replaceExpression);
    }
    return replaceExpression;
  }

  function save(file, key, value) {
    const allText = file.get('allText');
    allText.push({
      key,
      value,
    });
    file.set('allText', allText);
  }

  return {
    pre(file) {
      file.set('allText', []);
    },
    visitor: {
      Program: {
        enter(path, state) {
          let imported;
          path.traverse({
            // 处理导入导入
            // import {AppContext} from '@/store'
            // import {useContext} from 'react';
            ImportDeclaration(p) {
              const source = p.node.source.value;
              if (source === '@/store') {
                imported = true;
              }
              if (source === 'react') {
                const useContext = p.node.specifiers.find(
                  (item) => item.local?.name === 'useContext'
                );
                if (!useContext) {
                  // 没有导入useContext则添加
                  const importIdentifier = api.types.identifier('useContext');
                  p.node.specifiers.unshift(
                    api.types.importSpecifier(
                      importIdentifier,
                      importIdentifier
                    )
                  );
                }
              }
            },
            // 处理引用导入 const {localeData} = useContext(AppContext);
            'FunctionDeclaration|FunctionExpression'(path) {
              // 检测如果是返回jsx 表示是一个组件
              const returnStatement = path.node.body.body?.find((item) => {
                return api.types.isReturnStatement(item);
              });
              if (api.types.isJSXElement(returnStatement.argument)) {
                // 表示是函数式组件
                // 判断是否有 const { localeData } = useContext(AppContext);
                const declarations = [];
                path.node.body.body?.forEach((item) => {
                  if (item.declarations) {
                    declarations.push(...item.declarations);
                  }
                });
                const useContextNode = declarations.find((decl) => {
                  return decl.init?.callee?.name === 'useContext';
                });
                if (useContextNode && useContextNode.id?.properties) {
                  const localeData = useContextNode.id?.properties.find(
                    (item) => item?.key?.name === 'localeData'
                  );
                  if (!localeData) {
                    // 有useContext，但是没有没有localeData
                    useContextNode.id?.properties.unshift(
                      api.types.objectProperty(
                        api.types.identifier('localeData'),
                        api.types.identifier('localeData'),
                        false,
                        true
                      )
                    );
                  }
                } else {
                  path?.node?.body?.body?.unshift(
                    api.template.ast(
                      `const {localeData} = useContext(AppContext)`
                    )
                  );
                }
              }
            },
            // 忽略有/**i18n-disable */注释的字符串
            'StringLiteral|TemplateLiteral'(path) {
              if (path.node.leadingComments) {
                path.node.leadingComments = path.node.leadingComments.filter(
                  (comment, index) => {
                    if (comment.value.includes('i18n-disable')) {
                      path.node.skipTransform = true;
                      return false;
                    }
                    return true;
                  }
                );
              }
              if (path.findParent((p) => p.isImportDeclaration())) {
                path.node.skipTransform = true;
              }
            },
          });
          if (!imported) {
            // const uid = path.scope.generateUid('AppContext');
            const importAst = api.template.ast(
              `import { AppContext } from '@/store'`
            );
            path.node.body.unshift(importAst);
            state.intlUid = 'AppContext';
          }
        },
      },
      StringLiteral(path, state) {
        if (
          path.node.skipTransform ||
          path.findParent((p) => p.isJSXElement())
        ) {
          return;
        }
        let key = nextIntlKey();
        save(state.file, key, path.node.value);

        const replaceExpression = getReplaceExpression(
          path,
          key,
          state.intlUid
        );
        path.replaceWith(replaceExpression);
        path.skip();
      },
      TemplateLiteral(path, state) {
        if (
          path.node.skipTransform ||
          path.findParent((p) => p.isJSXElement())
        ) {
          return;
        }
        const value = path
          .get('quasis')
          .map((item) => item.node.value.raw)
          .join('{placeholder}');
        if (value) {
          let key = nextIntlKey();
          save(state.file, key, value);

          const replaceExpression = getReplaceExpression(
            path,
            key,
            state.intlUid
          );
          path.replaceWith(replaceExpression);
          path.skip();
        }
      },
      JSXElement(path, state) {
        if (path.node.skipTransform) {
          return;
        }
        const jsxTexts = path.node.children.filter(
          (item) => api.types.isJSXText(item) && item.value?.trim()
        );
        jsxTexts.forEach((text, index) => {
          const value = text.value;
          const key = nextIntlKey();
          save(state.file, key, value);
          const replaceExpression = getReplaceExpression(
            path,
            key,
            state.intlUid
          );
          // path.replaceWith(replaceExpression);
          path.node.children[index] =
            api.types.jsxExpressionContainer(replaceExpression);
        });
      },
    },
    post(file) {
      const allText = file.get('allText');
      const intlData = allText.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {});

      const content = `const resource = ${JSON.stringify(
        intlData,
        null,
        4
      )};\nexport default resource;`;
      fse.ensureDirSync(options.outputDir);
      fse.writeFileSync(path.join(options.outputDir, 'zh_CN.js'), content);
      fse.writeFileSync(path.join(options.outputDir, 'en_US.js'), content);
    },
  };
});
module.exports = autoTrackPlugin;
