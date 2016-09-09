'use strict';

var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    util = require('gulp-util');

var paths = {
    lint: ['./gulpfile.js', './src/**/*.js'],
    watch: ['./gulpfile.js', './src/**/*', './test/**/*.js', '!test/{temp,temp/**}'],
    tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
    build: ['./src/**/*', '!src/**/package.js']
};

var babelconf = {
    "presets": ["es2015-node4"],
    "comments": false,
    "ignore": "*/**/package.js"
};

gulp.task('build', function () {
    return gulp.src(paths.build)
        .pipe(sourcemaps.init())
        .pipe(babel(babelconf))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(paths.watch, ['build']);
});

gulp.task('default', ['build']);
