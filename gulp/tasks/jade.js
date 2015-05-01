var gulp = require('gulp');
var jade = require('gulp-jade');
var handleErrors = require('../util/handleErrors');

gulp.task('jade', function() {
  return gulp
    .src('./documentation/jade/index.jade')
    .pipe(jade({ pretty: true }))
    .on('error', handleErrors)
    .pipe(gulp.dest('./build/documentation'));
});
