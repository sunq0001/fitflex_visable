const webpack = require('webpack');
const path = require('path');
module.exports ={
    resolve:{
        extensions: [".js", ".jsx"]
    },
    entry: {
       myDll:['fitflex', 'watch-in-depth']
    },
    output: {
        filename:'[name].dll.js',
        path: path.join(__dirname, "dist","dll"),
        library:'[name]_dll_[hash]',
       
    },
    plugins:[
        new webpack.DllPlugin({
            name:'[name]_dll_[hash]',
            path:path.join(__dirname, 'dist','dll','[name].manifest.json')
        })
    ]
}