module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        // debug: true,
        // useBuiltIns: 'usage',
        // corejs: 3,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    [
      './src/plugin/calc-plugin.js',
      {
        sourcePath: '@/util/calc',
      },
    ],
  ],
};
