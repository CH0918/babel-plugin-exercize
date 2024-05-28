let imported;
path.traverse({
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
          api.types.importSpecifier(importIdentifier, importIdentifier)
        );
      }
    }
  },
  // 处理函数声明和函数表达式
  'FunctionDeclaration|FunctionExpression'(path) {
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
          api.template.ast(`const {localeData} = useContext(AppContext)`)
        );
      }
    }
  },
});
if (!imported) {
  // const uid = path.scope.generateUid('AppContext');
  const importAst = api.template.ast(`import { AppContext } from '@/store'`);
  path.node.body.unshift(importAst);
  state.intlUid = 'AppContext';
}
