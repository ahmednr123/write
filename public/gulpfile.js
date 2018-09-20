var gulp = require('gulp')
var watch = require('gulp-watch')
var pug = require('gulp-pug')
var stylus = require('gulp-stylus')

gulp.task('public', function(){

	return gulp.src('*.pug')
		.pipe(watch('*.pug'))
		.pipe(pug())
		.pipe(gulp.dest(''))

})

gulp.task('stylus', function(){

	return gulp.src('./css/*.styl')
		.pipe(watch('./css/*.styl'))
		.pipe(stylus())
		.pipe(gulp.dest('./css/'))		

})

gulp.task('default', ['public', 'stylus'])
