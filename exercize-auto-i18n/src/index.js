const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const autoI18nPlugin = require('./plugin/auto-i18n-plugin');
const removeLogPlugin = require('./plugin/remove-log-plugin');
const fs = require('fs');
const path = require('path');

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
  encoding: 'utf-8',
});

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
});

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      autoI18nPlugin,
      {
        outputDir: path.resolve(__dirname, './output'),
      },
    ],
  ],
});

fs.writeFileSync(path.resolve(__dirname, 'output.js'), code);
