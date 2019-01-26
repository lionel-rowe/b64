const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "production",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
      filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
