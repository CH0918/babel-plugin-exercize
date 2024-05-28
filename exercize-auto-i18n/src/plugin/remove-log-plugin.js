const { declare } = require('@babel/helper-plugin-utils');
const types = require('@babel/types');

let intlIndex = 0;
function nextIntlKey() {
  ++intlIndex;
  return `intl${intlIndex}`;
}

const removeLogPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    visitor: {
      CallExpression(path) {
        const { node } = path;
        const callee = node.callee;
        if (
          types.isMemberExpression(callee) &&
          types.isIdentifier(callee.object, { name: 'console' }) &&
          types.isIdentifier(callee.property, { name: 'log' })
        ) {
          path.remove();
        }
      },
    },
  };
});
module.exports = removeLogPlugin;
