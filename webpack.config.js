const webpack = require('webpack');

module.exports = (env, argv) => {
    const isDevelopment = env.NODE_ENV !== "production";

    return {
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'source-map' : 'false',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        entry: {
            index: "./src/index.js"
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: (chunkData) => {
                if(chunkData.chunk.name === "index")
                    return isDevelopment ? "mithril-scroll-restoration.js" : "mithril-scroll-restoration.min.js";

                return "[name].js";
            }
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
