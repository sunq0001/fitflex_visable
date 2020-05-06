const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        app: [
            // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', // only for webpack-hot-middleware
            path.resolve(__dirname, './src/index.js'),
        ],

    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: '/'// used for Node.js middleware  
    },
    plugins: [
        new ManifestPlugin(),
        new CleanWebpackPlugin({
            verbose:true,
            // cleanAfterEveryBuildPatterns: ['!myDll.dll.js', '!myDll.manifest.json'],
            cleanOnceBeforeBuildPatterns: [ '!myDll']
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'production',
            minify: {
                collapseWhitespace: true,
                minifyCSS: true,
            },
            filename: 'index.html',
            template: 'index.html',
            hash: true,
        }),
        // new webpack.ProvidePlugin({
        //     $:'fitflex',
        //     watchInDepth:'watch-in-depth'
        // }),
        new webpack.DllReferencePlugin({
            context:__dirname,
            manifest: path.join( 'dist','dll', `myDll.manifest.json`),
        }),
        
      
    ],
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },

    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            // {
            //     test: require.resolve('./src/index.js'),
            //     use: 'imports-loader?this=>window'
            // },

            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};
