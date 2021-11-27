const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log("__dirname");
console.log(__dirname);

module.exports = {
    mode: 'none',
    entry: {
        app: path.join(__dirname, 'src/webpackReact', 'index.tsx')
    },
    target: 'web',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'wwwroot/webpackReact')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/webpackReact', 'index.html')
        })
    ]
}