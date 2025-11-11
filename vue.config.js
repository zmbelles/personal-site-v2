module.exports = {
  publicPath: '/', // 👈 this fixes the 404s on your custom domain

  devServer: {
    historyApiFallback: true,
  },

  configureWebpack: {
    resolve: {
      fallback: {
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      },
    },
  },
};
