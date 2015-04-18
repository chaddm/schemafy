var gulp = require('gulp');

gulp.task('coverage', function(cb) {
  var istanbul = require('gulp-istanbul');
  var mocha    = require('gulp-mocha');

  gulp
    // We actually have to read the files here, streams aren't supported later.
    .src(['src/**/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp
        .src(['test/**/*_spec.js'], {read: false})
        .pipe(mocha({reporter: 'min'}))
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});
