
'use strict';

// pull in the 'path' module from node
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
  commithashCommand: 'rev-list --max-count=1 --no-merges --abbrev-commit HEAD',
});

// export the configuration as an object
module.exports = {
  mode: 'production',
  // the entry point is the top of the tree of modules.
  // webpack will bundle this file and everything it references.
  entry: './src/react/index.tsx',
  // we specify we want to put the bundled result in the matching build/ folder
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build/react'),
  },
  module: {
    // rules tell webpack how to handle certain types of files
    rules: [
      // at the moment the only custom handling we have is for typescript files
      // .ts and .tsx files get passed to ts-loader
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
    ],
  },
  resolve: {
    // specify certain file extensions to get automatically appended to imports
    // ie we can write `import 'index'` instead of `import 'index.ts'`
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/react/index.html',
    }),
    gitRevisionPlugin,
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.version()),
      COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
      BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
    })
  ],
  target: 'electron-renderer'
};
