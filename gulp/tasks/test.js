var gulp = require('gulp');

gulp.task('test', function() {
  var mocha = require('gulp-mocha');
  var argv  = require('minimist')(process.argv.slice(2));

  if (argv.watch || argv.w) {
    // Run the tests immediately.
    gulp
      .src('test/**/*_spec.js', {read: false})
      .pipe(mocha({
        reporter : 'min',
        ui       : 'bdd',
        growl    : true
      }))
      .on('error', function() {});

    // Now start the watcher and run them on file changes.
    return gulp
      .watch(['src/**', 'test/**'], function() {
        return gulp
          .src('test/**/*_spec.js', {read: false})
          .pipe(mocha({
            reporter : 'min',
            ui       : 'bdd',
            growl    : true
          }))
          .on('error', function() {});
      });
  } else {
    return gulp
      .src('test/**/*_spec.js', {read: false})
      .pipe(mocha({
        reporter : 'spec',
        ui       : 'bdd'
      }));
  }
});
