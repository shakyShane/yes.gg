const webpack = require('webpack');

module.exports = {
    entry: {
        bundle: './ts/app.ts'
    },
    output: {
        path: __dirname + '/public/js',
        filename: '[name].min.js',
        sourceMapFilename: '[name].min.js.map'
    },
    devtool: 'sourcemap',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle: {
                except: ['$']
            }
        })
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
};
