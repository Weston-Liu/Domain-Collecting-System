var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    index: ['./client/index/main.js'],
    admin: ['./client/admin/main.js'],
    login: ['./client/login/main.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './server/public/'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          'scss': 'vue-style-loader!css-loader!sass-loader',
          'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
        }
        // other vue-loader options go here
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)(\?\S*)?$/,
      loader: 'file-loader'
    }]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval'
}

// dynamic configuration entries
if (process.env.NODE_ENV === 'production') {

  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
} else {
  // dev
  var collect = Object.keys(module.exports.entry);
  for (let key of collect) {
    module.exports.entry[key].push('webpack-hot-middleware/client');
  }

  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]);
}