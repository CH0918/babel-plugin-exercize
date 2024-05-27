const { declare } = require('@babel/helper-plugin-utils');
const types = require('@babel/types');
const template = require('@babel/template').default;

var preOperationAST = template('FUN_NAME(ARGS)'); //将0.1+0.2转化为addCalc的模板
var operationMap = {
  '+': 'addCalc',
  '-': 'minusCalc',
  '*': 'multCalc',
  '/': 'diviCalc',
};
var calcPlugin = declare((api, { sourcePath }, dirname) => {
  api.assertVersion(7);
  if (!sourcePath) throw new Error('sourcePath can not empty!');
  return {
    visitor: {
      BinaryExpression: {
        enter: function (path) {
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
        enter: function (path) {
          path.unshiftContainer(
            'body',
            types.importDeclaration(
              [
                types.importSpecifier(
                  types.identifier('addCalc'),
                  types.identifier('addCalc'),
                  false,
                  true
                ),
                types.importSpecifier(
                  types.identifier('minusCalc'),
                  types.identifier('minusCalc'),
                  false,
                  true
                ),
                types.importSpecifier(
                  types.identifier('multCalc'),
                  types.identifier('multCalc'),
                  false,
                  true
                ),
                types.importSpecifier(
                  types.identifier('diviCalc'),
                  types.identifier('diviCalc'),
                  false,
                  true
                ),
              ],
              types.stringLiteral(sourcePath)
            )
          );
        },
      },
    },
  };
});
module.exports = calcPlugin;
