var gulp = require('gulp');

gulp.task('lint', function () {
  var jshint = require('gulp-jshint');

  return gulp
    .src([
      'src/**/*.js',
      'test/**/*_spec.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default', {
      verbose: true
    }))
    .pipe(jshint.reporter('fail'));
});
