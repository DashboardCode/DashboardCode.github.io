// webpack.config interpretated by node and node by default do not support ES6 (that means import etc.)
//const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//const ManifestPlugin = require('webpack-manifest-plugin');
//const PathModule = require('path');

// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const outputFolderPath = PathModule.resolve(__dirname, 'wwwroot/dist');


var config = {
    entry: {
        index: './src/index.js',
        about: './src/about.js', 
        contacts: './src/contacts.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/about.html',
            inject: true,
            chunks: ['about'],
            filename: 'about.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/contacts.html',
            inject: true,
            chunks: ['contacts'],
            filename: 'contacts.html'
        })
    ],
    module: {
        rules: [
           {
                test: /\.css$/,
                use: [
                   "style-loader",
                   "css-loader"
                ]
           },
           { 
                test: /\.(html)$/,
                //include: path.join(__dirname, 'src/views'),
                use: {
                    loader: 'html-loader',
                    options: {
                       interpolate: true
                    }
                }
            }
        ]
    },
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        console.log('!!! devServer devServer devServer !!!');
        config.devServer = {
            port: 58080,
            writeToDisk: true
        };
    } else {
        config.plugins.push(new CleanWebpackPlugin() );
    }
    return config;
};