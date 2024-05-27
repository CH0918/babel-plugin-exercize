const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // 入口文件
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist'), // 输出路径
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'], // 处理的扩展名
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置路径别名
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/, // 匹配所有的 .ts 和 .tsx 文件
        exclude: /node_modules/, // 排除 node_modules 目录
        use: [
          {
            loader: 'babel-loader', // 使用 Babel 进行转译
          },
          {
            loader: 'ts-loader', // 使用 TypeScript 进行转译
            options: {
              transpileOnly: true, // 只进行转译，不做类型检查
            },
          },
        ],
      },
      {
        test: /\.css$/, // 匹配所有的 .css 文件
        use: ['style-loader', 'css-loader'], // 使用的 loader
      },
      {
        test: /\.js$/, // 匹配所有的 .js 文件
        exclude: /node_modules/, // 排除 node_modules 目录
        use: {
          loader: 'babel-loader', // 使用 babel-loader
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板文件
      filename: 'index.html', // 输出的 HTML 文件名
    }),
  ],

  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'), // 开发服务器的内容目录
    compress: true, // 启用 gzip 压缩
    port: 9000, // 服务器端口
  },
  mode: 'development', // 模式设置为开发模式
};
