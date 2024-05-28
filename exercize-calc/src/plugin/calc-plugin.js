const { declare } = require('@babel/helper-plugin-utils');
const types = require('@babel/types');
const template = require('@babel/template').default;

const preOperationAST = template('FUN_NAME(ARGS)'); //将0.1+0.2转化为addCalc的模板
const operationMap = {
  '+': 'addCalc',
  '-': 'minusCalc',
  '*': 'multCalc',
  '/': 'diviCalc',
};
const calcPlugin = declare((api, { sourcePath }, dirname) => {
  api.assertVersion(7);
  if (!sourcePath) throw new Error('sourcePath can not empty!');
  return {
    visitor: {
      BinaryExpression: {
        enter: function (path, state) {
          const filename = state.file.opts.filename;
          if (filename?.includes('calc.js')) return;
          path.replaceWith(
            preOperationAST({
              FUN_NAME: types.identifier(operationMap[path.node.operator]),
              ARGS: [path.node.left, path.node.right],
            })
          );
        },
      },
      //path.unshiftContainer的作用就是在当前语法树插入节点，即这段代码的意思大概就是
      Program: {
        enter: function (path, state) {
          const filename = state.file.opts.filename;
          if (filename?.includes('calc.js')) return;
          console.log('处理文件：', filename);
          path.unshiftContainer(
            'body',
            types.importDeclaration(
              Object.values(operationMap).map((v) =>
                types.importSpecifier(
                  types.identifier(v),
                  types.identifier(v),
                  false,
                  true
                )
              ),
              types.stringLiteral(sourcePath)
            )
          );
        },
      },
    },
  };
});
module.exports = calcPlugin;
