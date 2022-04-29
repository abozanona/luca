const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        popup: path.resolve(__dirname, "src", "js", "popup.ts"),
        background: path.resolve(__dirname, "src", "js", "background.ts"),
        content: path.resolve(__dirname, "src", "js", "content.ts"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "js/[name].js",
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }]
        }),
    ],
};