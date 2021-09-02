/* eslint-disable no-ternary, no-process-env */

const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const PostCSSPresetEnv = require("postcss-preset-env");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

const esLintOptions = {
  extensions: ["js"],
  exclude: [
    "node_modules",
    "./config",
  ],
}

module.exports = {
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
  entry: [
    path.resolve(__dirname, "src/scripts/main.js"),
    path.resolve(__dirname, "src/styles/main.scss"),
  ],
  output: {
    publicPath: "/assets/",
    path: path.resolve(__dirname, "dist/assets"),
    filename: isDev
      ? "[name].js"
      : "[name].[contenthash].js",
  },
  plugins: [
    new ESLintPlugin(esLintOptions),
    new WebpackManifestPlugin(),
    new StylelintPlugin({
      files: "src/styles/**/*.scss",
    }),
    new MiniCssExtractPlugin({
      filename: isDev
        ? "[name].css"
        : "[name].[contenthash].css",
    }),
  ],
  ...(!isDev && {
    optimization: {
      minimizer: [
        (compiler) => {
          Reflect.apply(
            new TerserPlugin({
              terserOptions: {
                compress: {},
              },
            }),
            compiler
          );
        },
        new CssMinimizerPlugin(),
      ],
    },
  }),
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.scss/,
        loader: "import-glob-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: [PostCSSPresetEnv] } },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: `images/${isDev
            ? "[name][ext]"
            : "[contenthash][ext]"}`,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: `fonts/${isDev
            ? "[name][ext]"
            : "[contenthash][ext]"}`,
        },
      },
    ],
  },
  resolve: {
    alias: {
      // Helpful alias for importing assets
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
};