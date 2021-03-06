const path = require('path');
const webpack = require('webpack');
const qs = require('qs');
const autoprefixer = require('autoprefixer');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ROOT_DIR = 'renderer';
const DIST_DIR = path.resolve(__dirname, 'app', 'renderer');
const PROD = false;
const DEBUG = !PROD;

const autoprefixerConfig = {
  browsers: [
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 2.3',
    'bb >= 10',
  ],
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: DEBUG,
    plugins: () => [
      autoprefixer(autoprefixerConfig),
    ],
  },
};

const cssLoaderWithModule = qs.stringify({
  importLoaders: 1,
  modules: true,
  localIdentName: '[hash:base64:5]',
  sourceMap: DEBUG,
  minimize: PROD,
});

const cssLoaderWithoutModule = qs.stringify({
  sourceMap: DEBUG,
  minimize: PROD,
});

const lessLoader = qs.stringify({
  sourceMap: DEBUG,
});
const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/renderer`;

const plugins = [
  new webpack.IgnorePlugin(/utf-8-validate|bufferutil|vertx/),
  new CleanWebpackPlugin([path.resolve(__dirname, DIST_DIR)]),
  new ExtractTextPlugin('[name].[hash].css'),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, ROOT_DIR, 'src', 'index.html'),
    publicPath,
  }),
  new webpack.DefinePlugin({
    process: {
      env: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    },
    DEBUG: JSON.stringify(DEBUG),
  }),
  new BundleAnalyzerPlugin({
    analyzerPort: 8889,
  }),
  new webpack.HotModuleReplacementPlugin(),
];

module.exports = {
  cache: DEBUG,
  devtool: DEBUG ? 'inline-source-map' : false,
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${port}/`,
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, ROOT_DIR, 'src', 'main'),
  ],
  output: {
    path: path.resolve(__dirname, DIST_DIR),
    filename: '[name].[hash].js',
    publicPath,
  },
  node: {
    __filename: true,
  },
  resolve: {
    extensions: ['.js', '.scss', '.less'],
    alias: {
      shared: path.resolve(__dirname, ROOT_DIR, 'shared'),
      locales: path.resolve(__dirname, ROOT_DIR, 'locales'),
      src: path.resolve(__dirname, ROOT_DIR, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'shared/chart/src'),
          path.resolve(__dirname, 'shared/editor/src'),
          path.resolve(__dirname, 'shared/antlr/parser'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.json/,
        use: 'json-loader',
      },
      {
        test: /[^_]\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [`css-loader?${cssLoaderWithModule}`, postcssLoader, `less-loader?${lessLoader}`],
        }),
      },
      {
        test: /_\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [`css-loader?${cssLoaderWithoutModule}`, postcssLoader, `less-loader?${lessLoader}`],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [`css-loader?${cssLoaderWithoutModule}`, postcssLoader],
        }),
      },
      {
        test: /\.(png|jpg|jpeg|woff|eot|ttf|svg)/,
        use: 'file-loader',
      },
    ],
  },
  plugins,
  target: 'electron-renderer',
  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'app', 'pb_renderer'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
  },
};
