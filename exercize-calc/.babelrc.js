module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        debug: true,
        // useBuiltIns: 'usage',
        // corejs: 3,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { corejs: 3 }],
    // './src/plugin/auto-track-plugin2.js',
  ],
};
