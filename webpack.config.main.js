const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');

const DIST_DIR = path.resolve(__dirname, 'app', 'main');
const nodeModules = fs.readdirSync(path.resolve(__dirname, 'app', 'node_modules')).filter((x) => x !== '.bin');
const plugins = [
  new CleanWebpackPlugin([path.resolve(__dirname, DIST_DIR)]),
  new webpack.DefinePlugin({
    process: {
      env: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    },
  }),
];

module.exports = {
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'app', 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, DIST_DIR),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'app', 'node_modules'),
        ],
        use: 'babel-loader',
      },
    ],
  },
  plugins,
  target: 'electron-main',
  externals: nodeModules,
};
