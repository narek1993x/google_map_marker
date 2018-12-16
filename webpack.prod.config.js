const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: ['babel-polyfill', './src/index.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      chunkFilename: '[id].js',
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: 'babel-loader',
          include: __dirname + '/src',
          query: {
            presets: ['react', 'es2015', 'stage-1'],
            plugins: ["transform-decorators-legacy"]
          }
        },
        // {
        //   test: /\.css/,
        //   loaders: ['style', 'css'],
        //   include: __dirname + '/src'
        // },
        { 
          test: /\.styl$/,
          loader: 'style-loader!css-loader!stylus-loader',
          include: __dirname + '/src'
        }
      ]
      
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    devServer: {
      historyApiFallback: true,
      contentBase: './',
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
  };