const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const { transformFromAstSync } = require('@babel/core');
const calcPlugin = require('./plugin/calc-plugin');

const sourceCode = fs.readFileSync(path.join(__dirname, 'sourceCode.js'), {
  encoding: 'utf-8',
});

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
});

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      calcPlugin,
      {
        sourcePath: '@/util/calc.js',
      },
    ],
  ],
});
fs.writeFileSync(path.join(__dirname, './output.js'), code);
