const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getExternals() {
  const nodeModules = fs.readdirSync(path.join(process.cwd(), 'node_modules'));
  return nodeModules.reduce((ext, mod) => {
    ext[mod] = `commonjs ${mod}`;
    return ext;
  }, {});
}

const frontend = {
  mode: 'none',
  entry: {
    frontend: path.resolve(__dirname, 'src/frontend/main.js'),
    style: path.resolve(__dirname, 'src/frontend/style/main.sass'),
  },
  output: {
    path: path.resolve(__dirname, 'build/frontend'),
    filename: 'main.js',
    chunkFilename: '[id].js',
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: './bundle.min.css',
      allChunks: true,
    }),
  ],
};

const backend = {
  mode: 'none',
  target: 'node',
  entry: path.resolve(__dirname, 'src/backend/main.js'),
  output: {
    path: path.resolve(__dirname, 'build/backend'),
    filename: 'main.js',
    chunkFilename: '[id].js',
  },
  externals: getExternals(),
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
    }],
    exprContextCritical: false,
  },
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less|scss|svg|png|jpe?g|png)$/),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],
};

module.exports = [
  frontend,
];
