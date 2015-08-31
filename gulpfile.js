'use strict';

// Globals
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var name = "tiq";

// Tasks
gulp.task('lint', function() 
{
	return gulp.src(['src/*.js'])
	.pipe($.jshint())
	.pipe($.jshint.reporter('default'));
});

gulp.task('build', function () 
{
	return gulp.src('./src/_main.js')
	.pipe($.preprocess())
	.pipe($.rename(name+'.js'))
	.pipe($.size())
	.pipe(gulp.dest('./dist/'));
});

gulp.task('minify', ['build'], function() 
{
	return gulp.src(['./dist/'+name+'.js'])
	.pipe($.uglify())
	.pipe($.size())
	.pipe($.rename(name+'.min.js'))
	.pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() 
{
	gulp.watch(['src/*.js'], ['build', 'minify', 'lint']);
});

gulp.task('default', ['build', 'minify', 'lint']);