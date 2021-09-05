/* eslint-disable no-ternary, no-process-env */

const PathModule = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const PostCSSPresetEnv = require("postcss-preset-env");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputFolderPath = PathModule.resolve(__dirname, 'wwwroot/webpackapp');


// const isDev = process.env.NODE_ENV !== "production";
// const esLintOptions = {
//   extensions: ["js"],
//   exclude: [
//     "node_modules",
//     "./config",
//   ],
// }

module.exports = {
    /*
  mode: isDev
    ? "development"
    : "production",
  stats: {
    colors: true,
    preset: "minimal",
  },
  ignoreWarnings: [
    {
      file: /bootstrap/,
    },
  ],
  performance: {
    hints: isDev
      ? false
      : "warning",
  },
  devtool: isDev
    ? "cheap-module-source-map"
    : "source-map",

  
  output: {
    publicPath: "/assets/",
    path: path.resolve(__dirname, "dist/assets"),
    filename: isDev
      ? "[name].js"
      : "[name].[contenthash].js",
  },
  resolve: {
    alias: {
      // Helpful alias for importing assets
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
  */
  entry: [
    PathModule.resolve(__dirname, "src/webpackapp/index.js"),
    PathModule.resolve(__dirname, "src/webpackapp/index.html"),
  ],
  resolve: {
    alias: {
        //'datatables.net-buttons#buttons.colVis': 'datatables.net-buttons/js/buttons.colVis.js',
        '@popperjs/core': '@popperjs/core/dist/umd/popper.js',
        //'bootstrap#umd': 'bootstrap/dist/js/bootstrap.js',
        //'@dashboardcode/bsmultiselect#umd':'@dashboardcode/bsmultiselect/dist/js/BsMultiSelect.js'
        
       // 'handlebars': 'handlebars/dist/handlebars.js',
       // 'corejs-typeahead': 'corejs-typeahead/dist/typeahead.jquery.js'
    }
  },
  output: {
    path: outputFolderPath,
    //mode: 'development',
    filename: '[name].js',  // filename: '[name].[contenthash].js' produce main.bca50319635bfdec741b.js - also add HashedModuleIdsPlugin if you want to use "constant" hashs
    //publicPath: '/dist/'
    },
  plugins: [
    //new ESLintPlugin(esLintOptions),
    
    // new StylelintPlugin({
    //   files: "src/styles/**/*.scss",
    // }),
    // new MiniCssExtractPlugin({
    //   filename: isDev
    //     ? "[name].css"
    //     : "[name].[contenthash].css",
    // }),
    new WebpackManifestPlugin(),
    new CleanWebpackPlugin()
  ],
//   ...(!isDev && {
//     optimization: {
//       minimizer: [
//         (compiler) => {
//           Reflect.apply(
//             new TerserPlugin({
//               terserOptions: {
//                 compress: {},
//               },
//             }),
//             compiler
//           );
//         },
//         new CssMinimizerPlugin(),
//       ],
//     },
//   }),
  module: {
    rules: [
    {
        test: /\.html/,
        type: 'asset/resource',
        generator: {
            filename: '[name][ext]'//'static/[hash][ext][query]'
        }
    },

    //   {
    //     enforce: "pre",
    //     test: /\.scss/,
    //     loader: "import-glob-loader",
    //   },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    //   {
    //     test: /\.s?css/i,
    //     use: [
    //       MiniCssExtractPlugin.loader,
    //       "css-loader",
    //       {
    //         loader: "postcss-loader",
    //         options: { postcssOptions: { plugins: [PostCSSPresetEnv] } },
    //       },
    //       "sass-loader",
    //     ],
    //   },
    //   {
    //     test: /\.(png|jpe?g|gif|svg)$/i,
    //     type: "asset/resource",
    //     generator: {
    //       filename: `images/${isDev
    //         ? "[name][ext]"
    //         : "[contenthash][ext]"}`,
    //     },
    //   },
    //   {
    //     test: /\.(woff|woff2|eot|ttf|otf)$/i,
    //     type: "asset/resource",
    //     generator: {
    //       filename: `fonts/${isDev
    //         ? "[name][ext]"
    //         : "[contenthash][ext]"}`,
    //     },
    //   },
    ],
  }
  
};