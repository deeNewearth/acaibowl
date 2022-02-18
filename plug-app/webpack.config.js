const prod = process.env.NODE_ENV === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const outPath = 

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: {
    "acai-verify":'./src/index.tsx'
  },
  output: {
    path: __dirname + '/../testwp/acaiBowl/public/js/dist/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      }
    ]
  },
  devtool: prod ? undefined : 'source-map',
  plugins: [
    /*new HtmlWebpackPlugin({
      template: 'index.html',
    }),*/
    new MiniCssExtractPlugin(),
  ],
};
