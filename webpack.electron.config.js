'use strict';

const path = require('path');
const webpack = require('webpack');

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
  commithashCommand: 'rev-list --max-count=1 --no-merges --abbrev-commit HEAD',
});

module.exports = [
  {
    mode: 'production',
    entry: './src/electron/main.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'build/electron')
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' },
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          resolve: {
              extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
          }
      },
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "src/react")],
        loader: "babel-loader",
        resolve: {
            extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
        }
    },
    {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        resolve: {
            extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
        }
      },
    {
        // loads .html files
        test: /\.(html)$/,
        include: [path.resolve(__dirname, "src/react")],
        use: {
            loader: "html-loader"
        }
    },
    {
        // loads .css files
        test: /\.css$/,
        include: [path.resolve(__dirname, "src/react")],
        use: [                    
            "style-loader",
            "css-loader"
        ]
    },
        // loads common image formats
    {
        test: /\.(svg|png|jpg|gif)$/,
        type: "asset/inline"
    },
      ]
    },
    plugins: [
      gitRevisionPlugin,
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
      })
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    // tell webpack that we're building for electron
    target: 'electron-main',
    node: {
      // tell webpack that we actually want a working __dirname value
      // (ref: https://webpack.js.org/configuration/node/#node-__dirname)
      __dirname: false
    }
  },
  {
    mode: 'development',
    entry: './src/electron/preload.js',
    output: {
      filename: 'preload.js',
      path: path.resolve(__dirname, 'build/electron')
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' },
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          resolve: {
              extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
          }
      },
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    target: 'electron-preload'
  }
];