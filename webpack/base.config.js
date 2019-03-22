/**
 * COMMON WEBPACK CONFIGURATION
 */
const path = require('path');
const hash = require('string-hash');
const webpack = require('webpack');
const HappyPack = require('happypack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const {
  isBuildingDll,
  getBuild,
} = require('./utils');

const extractVendorCSSPlugin = new ExtractTextPlugin('vendor.[contenthash].css');
const vendorCSSLoaders = extractVendorCSSPlugin.extract({
  fallback: 'style-loader',
  use: [
    { loader: 'css-loader', options: { minimize: true } },
  ],
  allChunks: true,
});

const assetsPluginInstance = new AssetsPlugin({
  path: path.join(process.cwd(), 'server', 'middlewares'),
  filename: 'generated.assets.json',
  includeManifest: true,
});

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

/**
 * Validates options for base configuration.
 *
 * @param {Object} options a set of options to customize the Webpack configuration
 */
function validateOptions(options) {
  // Warning messages
  const warningPrefix = '[web-contrib][warning]';
  const contextMessage = `It is recommended to set 'context' to an absolute path to a base directory.
Context is used to resolve relative entry points, loader configurations and SVG id hashing.
More about 'context': https://webpack.js.org/configuration/entry-context/#context`;
  /* eslint-disable no-console */
  const warn = (message) => console.warn(`
${warningPrefix} ${message}
`);
  /* eslint-enable no-console */

  // Warning logs
  if (!options.context) {
    warn(contextMessage);
  }
}

/**
 * @param {Object} options a set of options to customize the Webpack configuration
 * @param {string|Object|Function} options.entry Webpack entry configuration
 * @param {string} options.context Webpack context configuration
 * @param {Object} options.output Webpack output configuration
 * @param {Function} options.excludeFunc a condition to exclude files from module rules
 * @param {array} options.plugins Webpack plugins configuration
 * @param {Object} options.babelOptions babel-loader options
 * @param {Object} options.babelQuery babel-loader query
 * @param {array} options.env process.env key values
 * @param {array} options.resolve.modules Webpack resolve.modules configuration
 * @param {Object} options.resolve.alias Webpack resolve.alias configuration
 * @param {string|false} options.devtool Webpack devtool configuration
 * @param {Object} options.performance Webpack performance configuration
 */
module.exports = (options) => {
  validateOptions(options);

  return ({
    entry: options.entry,
    context: options.context,
    output: Object.assign({ // Compile into js/build.js
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    }, options.output), // Merge with env dependent settings
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.tsx?$/,
          exclude: options.excludeFunc,
          loader: 'happypack/loader?id=ts',
        },
        {
          test: /\.jsx?$/,
          exclude: options.excludeFunc,
          loader: 'happypack/loader?id=js',
        }, {
          // Preprocess our own .css files
          // This is the place to add your own loaders (e.g. sass/less etc.)
          // for a list of loaders, see https://webpack.js.org/loaders/#styling
          test: /\.css$/,
          exclude: options.excludeFunc,
          use: ['style-loader', 'css-loader'],
        }, {
          // Extract the dependencies css files to include them
          // through usage of AssetsWebpackPlugin
          test: /\.css$/,
          include: options.excludeFunc,
          use: vendorCSSLoaders,
        }, {
          test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
          exclude: /inline/,
          use: 'file-loader',
        }, {
          test: /\.(jpg|png|gif)$/,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                progressive: true,
                optimizationLevel: 7,
                interlaced: false,
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
              },
            },
          ],
        }, {
          test: /\.html$/,
          loader: 'html-loader',
        }, {
          test: /\.json$/,
          loader: 'json-loader',
        }, {
          test: /\.(mp4|webm)$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
          },
        },
        {
          test: /\.svg$/,
          exclude: /node_modules\/(?!block-party|godfather|mission-control|docx)/,
          include: /inline/,
          loaders: [
            'babel-loader',
            ({ resource }) => ({
              loader: 'react-svg-loader',
              options: {
                svgo: {
                  pretty: true,
                  plugins: [
                    { removeStyleElement: true },
                    { removeTitle: true },
                    {
                      cleanupIDs: {
                        minify: true,
                        prefix: `${hash(path.relative(options.context || process.cwd(), resource))}_`,
                      },
                    },
                  ],
                },
              },
            }),
          ],
        },
      ],
    },
    plugins: options.plugins.concat([
      extractVendorCSSPlugin,
      new HappyPack({
        id: 'ts',
        threads: 1,
        loaders: [
          {
            path: 'babel-loader',
            options: options.babelOptions,
            query: options.babelQuery,
          },
          {
            path: 'ts-loader',
            query: { happyPackMode: true },
          },
        ],
      }),
      new HappyPack({
        id: 'js',
        threads: 2,
        loaders: [
          {
            path: 'babel-loader',
            options: options.babelOptions,
            query: options.babelQuery,
          },
        ],
      }),

      new webpack.ProvidePlugin({
        // make fetch available
        fetch: 'exports-loader?self.fetch!whatwg-fetch',
      }),

      // Instead of creating one property with an object that contains all env vars, we create one key for each variable
      // so DefinePlugin can replace specifics usages instead inserting the entire process.env object which can cause
      // changes in one variable affecting chunks that reference any other variable.
      new webpack.DefinePlugin({
        ...Object.assign({}, ...Object.keys(options.env).map((key) => ({ [`process.env.${key}`]: options.env[key] }))),
        'process.env.BUILD': JSON.stringify(getBuild()),
      }),
      new webpack.NamedModulesPlugin(),
    ]).concat(
      isBuildingDll ? [] : [assetsPluginInstance]
    ),
    resolve: {
      modules: ['app', 'node_modules'].concat(options.resolve.modules),
      extensions: [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.react.js',
      ],
      mainFields: [
        'browser',
        'main',
      ],
      alias: options.alias,
    },
    devtool: options.devtool,
    target: 'web', // Make web variables accessible to webpack, e.g. window
    performance: options.performance || {},
  });
};
