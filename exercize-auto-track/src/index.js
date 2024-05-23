const { transformFromAstSync } = require('@babel/core');
const parser = require('@babel/parser');
const autoTrackPlugin = require('./plugin/auto-track-plugin');
const autoTrackPlugin2 = require('./plugin/auto-track-plugin2');
const fs = require('fs');
const path = require('path');

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
  encoding: 'utf-8',
});

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
});

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [
    [
      autoTrackPlugin2,
      {
        trackerPath: './tracker',
      },
    ],
  ],
});
fs.writeFileSync(path.join(__dirname, './output.js'), code);
