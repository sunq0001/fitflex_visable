// ~~~~~~~~~~~~~~~ use Express, Node.js to run server ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const express = require('express');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const port = 3000;
const config = require('./webpack.common.js');
const compiler = webpack(config);

app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
}));

app.use(WebpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
}));

app.listen(port, function () {
    console.log('example app listening on port ' + port + '!\n');
})

//~~~~~~~~~~ use npm start to launch dev-server~~~~~~~~~~~
// const webpackDevServer = require('webpack-dev-server');
// const webpack = require('webpack');

// const config = require('./webpack.config.js');
// const options = {
//   contentBase: './dist',
//   hot: true,
//   host: 'localhost'
// };

// webpackDevServer.addDevServerEntrypoints(config, options);
// const compiler = webpack(config);
// const server = new webpackDevServer(compiler, options);

// server.listen(5000, 'localhost', () => {
//   console.log('dev server listening on port 5000');
// });