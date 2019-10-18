let gulp = require('gulp');
let path = require('path');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let open = require('gulp-open');

let Paths = {
  HERE: './build/frontend/',
  DIST: './build/frontend/assets/css/',
  CSS: './build/frontend/assets/css/',
  SCSS_TOOLKIT_SOURCES: './build/frontend/assets/scss/material-kit.scss',
  SCSS: './build/frontend/assets/scss/**/**',
};

gulp.task('compile-scss', () => {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.CSS));
});

gulp.task('watch', () => {
  // gulp.watch(Paths.SCSS, ['compile-scss']); 
  // To solve for gulp >4 when you are using gulp.task('default',['task'], function(){});
  // replace ['task'] with gulp.series('task') or gulp.parallel('task')
  gulp.watch(Paths.SCSS, gulp.series('compile-scss'));
});

gulp.task('open', () => {
  gulp.src('presentation.html')
    .pipe(open());
});

gulp.task('open-app', gulp.series('open', 'watch'));
