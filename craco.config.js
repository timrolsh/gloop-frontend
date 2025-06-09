const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, {env, paths}) => {
      // Add the fallback for the 'e
      // vents' module
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback, // Spread existing fallbacks
        events: require.resolve("events/"),
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer/"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "httpsa": require.resolve("https-browserify"),
        // "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url"),
        "zlib": require.resolve("zlib-browserify"),
        "assert": require.resolve("assert/"),
        "path": require.resolve("path-browserify")
      };

      return webpackConfig;
    },

    alias: {
      "~": path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src")
    }
  }
};
