var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
    // Note: The browserify task handles js recompiling with watchify
    gulp.watch('documentation/jade/**', ['jade']);
    gulp.watch('documentation/less/**', ['less']);
    gulp.watch('documentation/static/**', ['copy']);
});
