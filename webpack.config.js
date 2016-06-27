module.exports = {
    entry: {
        bundle: './ts/app.ts'
    },
    output: {
        path: __dirname + '/public/js',
        filename: '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    devtool: 'sourcemap',
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
