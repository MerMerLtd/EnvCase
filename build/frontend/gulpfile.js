var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var open = require('gulp-open');

var Paths = {
  HERE: './',
  DIST: './assets/css/',
  CSS: './assets/css/',
  SCSS_TOOLKIT_SOURCES: './assets/scss/material-kit.scss',
  SCSS: './assets/scss/**/**'
};

gulp.task('compile-scss', function () {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.CSS));
});

gulp.task('watch', function () {
  // gulp.watch(Paths.SCSS, ['compile-scss']); 
  // To solve for gulp >4 when you are using gulp.task('default',['task'], function(){});
  // replace ['task'] with gulp.series('task') or gulp.parallel('task')
  gulp.watch(Paths.SCSS, gulp.series('compile-scss'));
});

gulp.task('open', function () {
  gulp.src('presentation.html')
    .pipe(open());
});

gulp.task('open-app', gulp.series('open', 'watch'));