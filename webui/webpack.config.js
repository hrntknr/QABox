const path = require('path')

module.exports = {
  context: path.join(__dirname, './src'),
  entry: './main.jsx',
  output: {
    publicPath: '/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules'],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: './img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [],
}
