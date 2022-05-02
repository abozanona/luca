const common = require("./webpack.common");
const { merge } = require('webpack-merge');


module.exports = merge(common, {
    mode: "production",
    devtool: "inline-source-map",
    watch: true,
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: false,
        errorDetails: false,
        warnings: false,
        publicPath: false
      }
});