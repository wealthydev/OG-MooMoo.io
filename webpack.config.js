const path = require('path');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'bundle/src/js'),
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map'
};