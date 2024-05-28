// const { transformFromAstSync } = require('@babel/core');
// const parser = require('@babel/parser');
// const autoTrackPlugin = require('./plugin/auto-track-plugin');
// const autoTrackPlugin2 = require('./plugin/auto-track-plugin2');
// const fs = require('fs');
// const path = require('path');
import { transformFromAstSync } from '@babel/core';
import parser from '@babel/parser';
import autoTrackPlugin2 from './plugin/auto-track-plugin2.mjs';
import fs from 'fs';
import path from 'path';

const sourceCode = fs.readFileSync(path.join('./sourceCode.js'), {
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
fs.writeFileSync(path.join('./output.js'), code);
