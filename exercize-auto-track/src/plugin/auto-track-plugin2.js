const { declare } = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');
const { template } = require('@babel/core');

const autoTrackPlugin2 = declare((api, options, dirname) => {
  // 判断是不是babel7
  api.assertVersion(7);
  return {
    visitor: {
      Program: {
        enter(path, state, dirname) {
          // 判断是不是导入了tracker方法
          path.traverse({
            ImportDeclaration(curPath) {
              const requirePath = curPath.get('source').node.value;

              // 判断导出的路径是否是tracker
              if (requirePath === options.trackerPath) {
                const specifierPath = curPath.get('specifiers.0');
                // 获取导入的名字
                if (
                  api.types.isImportSpecifier(specifierPath) ||
                  api.types.isImportDefaultSpecifier(specifierPath) ||
                  api.types.isImportNamespaceSpecifier(specifierPath)
                ) {
                  const specifierName = specifierPath.node.local.name;
                  state.trackerFunctionName = specifierName;
                }
              }
            },
          });

          // 如果没有导入tracker方法，就导入tracker方法
          if (!state.trackerFunctionName) {
            const trackerFunctionName = importModule.addDefault(
              path,
              options.trackerPath,
              {
                nameHint: 'tracker',
              }
            ).name;
            state.trackerFunctionName = trackerFunctionName;
          }
        },
      },
      'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod'(
        curPath,
        state
      ) {
        const blockStatement = curPath.get('body');
        if (!blockStatement.isBlockStatement()) {
          // 加上大括号
          const newBlockStatement = api.template.statement(
            `{ ${state.trackerFunctionName}();return BODY; }`
          )({
            BODY: blockStatement.node,
          });
          blockStatement.replaceWith(newBlockStatement);
        } else {
          // 在函数体的第一行加上tracker方法
          blockStatement.node.body.unshift(
            template.statement(`${state.trackerFunctionName}();`)()
          );
        }
      },
    },
  };
});

module.exports = autoTrackPlugin2;
