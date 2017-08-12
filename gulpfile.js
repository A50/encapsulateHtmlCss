'use strict';

const gulp = require('gulp');
const encapsulateHtmlCss = require("gulp-encapsulate-htmlcss")
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const stylus = require('gulp-stylus');
const fileinclude = require('gulp-file-include');
const serve = require('gulp-serve');
const concatCss = require('gulp-concat-css');
const plugins = [
    autoprefixer({ browsers: ['last 3 version'] }),
    cssnano()
];

gulp.task('styl', () => {
    gulp.src(['./src/styl/*.styl'])
        .pipe(stylus())
        .pipe(gulp.dest('./src/styl/'));
    return gulp.src(['./src/components/*/*.styl'])
        .pipe(stylus())
        .pipe(gulp.dest('./src/components/'));

});
gulp.task('encapsulate', ['styl'], () => {

    return gulp.src(['./src/components/*/*.*'])
        .pipe(encapsulateHtmlCss())
        .pipe(gulp.dest('./build/components'))
})

gulp.task('cssBundler', ['encapsulate'], () => {
    return gulp.src(['./src/styl/*.css', './build/**/*.css'])
        .pipe(concatCss("css/bundle.css"))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/'));
});

gulp.task('fileinclude', ['encapsulate'], () => {
    return gulp.src(['./src/index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build'));

});
gulp.task('copyImages', () => {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('./build/images'))
})
gulp.task('serve', serve('./build'));
gulp.task('default', ['styl', 'encapsulate', 'cssBundler', 'fileinclude', 'copyImages', 'serve']);