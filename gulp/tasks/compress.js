var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css');

gulp.task('compress', ['browserify', 'less'], function() {
  gulp.src('build/documentation/index.js')
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(gulp.dest('build/documentation'));

  gulp.src('build/documentation/index.css')
    .pipe(minify())
    .pipe(rename('index.min.css'))
    .pipe(gulp.dest('build/documentation'));
});
