const path = require('path');

const node_config = {
    entry: './src/server.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
        library: {
            type: 'commonjs-static'
        }
    }
};

const browser_config = {
    entry: './src/browser.js',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'browser.js',
        library: {
            name: 'spotifyweb',
            type: 'this',
        }
    }
};

module.exports = function (env, argv) {
    return [node_config, browser_config];
}