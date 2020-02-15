var gulp = require('gulp');
var less = require('gulp-less');
var uglifyJs = require('gulp-uglifyjs');
var browserSync = require('browser-sync');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var minImg = require('gulp-imagemin');
var minHTML = require('gulp-htmlmin');
var clean = require('gulp-clean');
var order = require('gulp-order');

// Конфигурация
var config = {
    app:'./app',
    dest:'./dest'
};

/**
 * Gulp - 4 метода
 * 1) task - Объявляет новую задачу
 * 2) src - Выбор файлов для преобразования
 * 3) dest - Размещение итоговых файлов в директории
 * 4) watch - Метод отслеживания изменений
 */

 /**
 * Очистка сборочной директории
 */
gulp.task('clean', function () {
    gulp.src(config.dest, {read: false})
        .pipe(clean());
});


/**
 * Перенос контента
 */
gulp.task('packages', function(){
    gulp.src(config.app + '/packages/**/*')
        .pipe(gulp.dest(config.dest + '/packages'));
});


/**
 * Преобразование less
 */
gulp.task('less',function () {
    gulp.src(config.app+ '/css/**/*.less')
        .pipe(order([
            "_main.less",
            '*.less'
        ]))
        .pipe(concat('style.min.less'))
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.dest + '/css'));
        browserSync.reload({stream:false});
});

/**
 * Работа с JS
 */
gulp.task('js',function () {
    gulp.src(config.app+ '/js/**/*.js', )
        .pipe(concat('main.min.js'))
        .pipe(uglifyJs())
        .pipe(gulp.dest(config.dest + '/js'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Работа с PHP
 */
gulp.task('php',function () {
    gulp.src(config.app+ '/**/*.php')
    	.pipe(minHTML({collapseWhitespace: true}))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Работа с HTML
 */
gulp.task('html',function () {
    gulp.src(config.app+ '/**/*.html')
    	.pipe(minHTML({collapseWhitespace: true}))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Работа с img
 */
gulp.task('img', function(){
    gulp.src(config.app + '/images/*')
        .pipe(minImg())
        .pipe(gulp.dest(config.dest + '/images'));
});

/**
 * Работа с audio
 */
gulp.task('audio', function(){
    gulp.src(config.app + '/audio/*')
        .pipe(gulp.dest(config.dest + '/audio'));
});


/**
 * Отслеживание изменений
 */
gulp.task('watch',function () {
    gulp.watch(config.app + '/css/**/*.less',['less']);
    gulp.watch(config.app + '/js/**/*.js',['js']);
    gulp.watch(config.app + '/images/*',['img']);
    gulp.watch(config.app + '/**/*.html',['html']);
});

gulp.task('server',function () {
    browserSync({
    	server:{
            baseDir:config.dest
        }
    });
});

// Задача по умолчанию
gulp.task('default',['packages', 'less','js','html', 'img', 'audio', 'watch','server'],function () {
    console.log('Выполнено!');
});