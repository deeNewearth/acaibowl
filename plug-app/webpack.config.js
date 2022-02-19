const prod = process.env.NODE_ENV === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

var configCommon = {
  mode: prod ? 'production' : 'development',
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
    new NodePolyfillPlugin({
      excludeAliases: ["console"]
    }),
  ],
};

var verifier = Object.assign({}, configCommon, {
  name: "acai-verify",
  entry: {
    "acai-verify":'./src/index-verify.tsx'
  },
  output: {
    path: __dirname + '/../testwp/acaiBowl/public/js/dist/',
  },
});

var pageAdmin = Object.assign({}, configCommon, {
  name: "acai-padmin",
  entry: {
    "acai-padmin":'./src/index-pageAdmin.tsx'
  },
  output: {
    path: __dirname + '/../testwp/acaiBowl/admin/js/dist/',
  },
});



module.exports = [verifier,pageAdmin];