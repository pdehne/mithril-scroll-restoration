const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
    return {
        mode: 'development',
        devtool: 'source-map',
        entry: {
            example: "./example.js"
        },
        devServer: {
            port: 8085,
            open: true,
            historyApiFallback: {
                index: 'example.html'
            },
        },
        module: {
            rules: [
                {
                    test: /\.m?(ts|js)x?$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    };
};
