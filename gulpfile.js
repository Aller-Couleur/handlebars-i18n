var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;

// Minifying JavaScript ES6
gulp.task('compress', function() {
  return gulp.src('dist/handlebars-i18n.js')
    .pipe(rename('handlebars-i18n.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});