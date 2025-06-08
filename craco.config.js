const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, {env, paths}) => {
      // Add the fallback for the 'e
      // vents' module
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback, // Spread existing fallbacks
        events: require.resolve("events/")
      };

      return webpackConfig;
    },

    alias: {
      "~": path.resolve(__dirname, "src"),
      "@": path.resolve(__dirname, "src")
    }
  }
};
