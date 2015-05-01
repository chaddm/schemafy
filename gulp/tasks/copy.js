var gulp = require('gulp');

gulp.task('copy', function() {
    return gulp.src('documentation/static/**')
        .pipe(gulp.dest('build/documentation'));
});
