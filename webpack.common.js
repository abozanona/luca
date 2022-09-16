const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');

const env = dotenv.config({ path: 'environments/.env' }).parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    entry: {
        main: path.resolve('./src/index.tsx'),
        backgound: path.resolve('./src/js/background.ts'),
        content: path.resolve('./src/js/content.ts'),
        'page-style': path.resolve('./src/style/page-style.scss'),
        'luca-website-style': path.resolve('./src/style/luca-website-style.scss'),
        'video-call-style': path.resolve('./src/style/video-call-style.scss'),
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        pathinfo: false,
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'string-replace-loader',
                        options: {
                            multiple: [
                                { search: /CHROME_CSS_START/ig, replace: '__MSG_@@bidi_start_edge__' },
                                { search: /CHROME_CSS_END/ig, replace: '__MSG_@@bidi_end_edge__' },
                                { search: /CHROME_CSS_DIR/ig, replace: '__MSG_@@bidi_dir__' },
                                { search: /CHROME_CSS_DIR_REVERSE/g, replace: '__MSG_@@bidi_reversed_dir__' },
                            ]
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/imgs/[hash][ext][query]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext][query]',
                },
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: '.', to: '.', context: 'public' }],
        }),
        new MiniCssExtractPlugin({ filename: 'style/[name].css' }),
        new webpack.DefinePlugin(envKeys),
    ],
};
