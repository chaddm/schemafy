var gulp = require('gulp');

gulp.task('clean', function(cb) {
  var del = require('del');
  del([
      './coverage'
  ], cb);
});
