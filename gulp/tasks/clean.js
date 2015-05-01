var gulp = require('gulp');

gulp.task('clean', function(cb) {
  var del = require('del');
  del([
      'index.html',
      'index.css',
      'index.js'
  ], cb);
});
