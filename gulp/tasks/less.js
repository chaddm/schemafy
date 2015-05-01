var gulp = require('gulp');
var less = require('gulp-less');
var handleErrors = require('../util/handleErrors');
var sourceMaps = require('gulp-sourcemaps');

gulp.task('less', function() {
  return gulp
    .src('./documentation/less/index.less')
    .pipe(sourceMaps.init())
    .pipe(less())
    .pipe(sourceMaps.write())
    .on('error', handleErrors)
    .pipe(gulp.dest('build/documentation'));
});
