path = require 'path'
gulp = require 'gulp'
plumber = require 'gulp-plumber'
concat = require 'gulp-concat'
livereload = require 'gulp-livereload'

gulp.task 'buildSrc', () ->
  srcList = require './src-list'
  gulp.src(srcList)
    .pipe(concat({ path: 'ng-image-input.js', newLine: ';' }))
    .pipe(gulp.dest(path.join(__dirname, '../dist')))
    .pipe(livereload())

gulp.task 'default', () ->
  livereload.listen()
  gulp.watch path.join(__dirname, '../src/*.js'), ['buildSrc']
