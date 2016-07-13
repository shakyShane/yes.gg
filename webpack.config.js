const webpack = require('webpack');
const http = require('http');

module.exports = {
    entry: {
        bundle: './ts/app.ts'
    },
    output: {
        path: __dirname + '/public/js',
        filename: '[name].js',
        publicPath: '/js',
        sourceMapFilename: '[name].js.map'
    },
    devtool: 'sourcemap',
    plugins: [],
    resolve: {
        alias: {
            'react': 'react-lite',
            'react-dom': 'react-lite'
        },
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/,
                ]
            }
        ]
    }
};
