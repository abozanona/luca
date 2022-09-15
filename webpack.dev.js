const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    // devtool: 'inline-source-map',
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
            filename: 'index.html',
            inject: 'body',
            title: 'Development',
        }),
        new HtmlWebpackPlugin({
            template: './src/template-chat.html',
            filename: 'chat.html',
            inject: 'body',
            title: 'Development',
        }),
    ],
    optimization: {
        minimize: false,
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    watch: true,
    stats: {
        colors: true,
        hash: false,
        version: false,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: false,
        warnings: false,
        publicPath: false,
    },
});
