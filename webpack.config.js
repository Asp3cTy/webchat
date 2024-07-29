const path = require('path');

module.exports = {
  entry: './node_modules/emoji-picker-element/index.js',
  output: {
    filename: 'picker.js',
    path: path.resolve(__dirname, 'public/js'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
