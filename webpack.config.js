const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = {
    tsConfig: path.resolve(__dirname, 'tsconfig.json'),
    entry: path.resolve(__dirname, 'src/index.ts'),
    outDir: path.resolve(__dirname, 'dist'),
    outFile: 'index.js',
    externals: [
        nodeExternals()
    ]
}

module.exports = {
    entry: config.entry,
    devtool: 'inline-source-map',
    mode: 'production',
    output: {
        libraryTarget: 'commonjs',
        filename: config.outFile,
        path: config.outDir
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    externals: config.externals,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: config.tsConfig,
                    compilerOptions: {
                        declarationDir: config.outDir
                    },
                }
            }
        ]
    }
}
