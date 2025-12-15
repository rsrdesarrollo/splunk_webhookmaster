const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        credentials: path.join(__dirname, 'src/index.jsx'),
    },
    output: {
        path: path.join(__dirname, '../../appserver/static/pages/'),
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        publicPath: '',
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        fallback: {
            'querystring': require.resolve('querystring-es3'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                        ],
                    },
                },
            },
        ],
    },
    performance: {
        hints: false,
    },
};
