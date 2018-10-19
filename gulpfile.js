'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat'); //объединяет несколько файлов в один
var uglify = require('gulp-uglify'); //минификация
let cleanCSS = require('gulp-clean-css'); //минификация css
var debug = require('gulp-debug'); //все через себя пропускает и выводит в командной строке, что происходит
var sourcemaps = require('gulp-sourcemaps'); //спец.структура данных, которая при преобразовании файлов отражает что было и что стало и записывает эту инфу либо в самом файле либо в спец.файле рядом с ним
var del = require('del'); //удаляем директорию
var newer = require('gulp-newer'); //получает файлы и смотрит есть ли такой или более новый файл в папке, в которую копируем. Если да - не пропускает к дальнейшей перезаписи
var imagemin = require('gulp-imagemin'); //оптимизация изображений
var autoprefixer = require('gulp-autoprefixer'); //
var runSequence = require('run-sequence'); //таски исполняются последовательно и [параллельно, параллельно]
//var lastRun = require('last-run'); //возвращает дату последнего запуска этой задачи
var browserSync = require('browser-sync').create();




gulp.task('hello', function(){
   console.log('hello');
});

gulp.task('styles', function(){
    return gulp.src('src/scss/**/*.scss') //находим файлы в папке src по шаблону /**/*.scss
      .pipe(sourcemaps.init())   //плагин gulp когда в него поступает новый файл-создает спец.свойство file.sourceMap, в которое записывает, что пока что с файлом ничего не делали. 
      .pipe(sass())              //преобразуем в css
//      .pipe(debug({title: 'sass'})) //выводим в командную строку что происходит с пометкой 'sass'
      .pipe(autoprefixer([
        'last 15 versions', 
        '> 1%', 
        'ie 8', 
        'ie 7'
    ], { cascade: true }))          //добавляем браузерные префиксы
      .pipe(cleanCSS())             //минификация css
//      .pipe(concat('style.css'))  //объединяем в один файл с названием style.css
      .pipe(sourcemaps.write())     //добавляем итоговую sourceMap в сам файл или рядом ('.')
              //минифицируем код
      .pipe(gulp.dest('./dist/css'));     //записываем файл в папку dist
});

gulp.task('script', function () {
    gulp.src('./src/js/**/*.js')
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
}); // объединяем файлы JS в один, минифицируем, записываем в dist

gulp.task('clean', function(){
    return del('dist');
});

gulp.task('copyImages', function(){
    return gulp.src('src/img/**/*.*', {base:'src'})
        .pipe(newer('dist')) //получает файлы и смотрит есть ли такой или более новый файл в папке, в которую копируем 'dist'. Если да - не пропускает к дальнейшей обработке
        .pipe(debug({title: 'copyImages:'}))
        .pipe(imagemin())
        .pipe(gulp.dest('dist')); //записываем файлы (изображения оптимизируются) в директорию dist
    
    
});

gulp.task('copyHtml', function(){
    return gulp.src('src/**/*.html', {base:'src'})
        .pipe(newer('dist')) //получает файлы и смотрит есть ли такой или более новый файл в папке, в которую копируем 'dist'. Если да - не пропускает к дальнейшей обработке
        .pipe(debug({title: 'copyHtml:'}))
        .pipe(gulp.dest('dist')); //записываем файл в директорию dist
});

gulp.task('copyReset', function() {
    return gulp.src('./src/css/**/*.css')
        .pipe(cleanCSS())
		.pipe(gulp.dest('./dist/css'))
})

gulp.task('build', function(){
    runSequence('clean', ['copyReset', 'styles', 'copyImages', 'copyHtml', 'script'], function(){
    console.log('=== BUILD DONE ===');
    });
});  //последовательно запускаем команды


gulp.task('watch', function(){
    gulp.watch('src/scss/**/*.*', ['styles']);
    gulp.watch('src/img/**/*.*', ['copyImages']);
    gulp.watch('src/js/**/*.js', ['script']);
    gulp.watch('src/*.html', ['copyHtml']);
});

gulp.task('dev', ['serve', 'watch'], function(){
    console.log('=== DEV DONE ==='); 
});

gulp.task('serve', function(){
   browserSync.init({
       server: 'dist'
   }); //запускаем статический сервер и на нем содержимое папки 'dist'
   
   browserSync.watch('dist/**/*.*').on('change', browserSync.reload); //броузерсинковский вотчер следит за файлами 'dist/**/*.*' и при событии 'change' вызывает функцию reload, которой в качестве аргумента будет передан путь к изменненному файлу
}); 