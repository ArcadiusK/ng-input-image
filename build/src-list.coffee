fs = require 'fs'
path = require 'path'
srcPath = path.join __dirname, '../src'

files = (path.join(srcPath, file) for file in fs.readdirSync srcPath)[0...-2]
files.unshift path.join(srcPath, './intro.js')
files.push path.join(srcPath, './outro.js')

module.exports = files
