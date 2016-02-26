//////////////////////////////////////////////////
//
// Включаем задачи
//
/////////////////////////////////////////////////

var gulp        = require('gulp'),
notify          = require('gulp-notify'),
minifycss       = require('gulp-minify-css'),
sass            = require('gulp-sass'),
browserSync     = require('browser-sync'),
	reload          = browserSync.reload,
autoprefixer    = require('gulp-autoprefixer'),
plumber         = require('gulp-plumber'),
del             = require('del'),
rename          = require('gulp-rename'),
sourcemaps      = require('gulp-sourcemaps');

//////////////////////////////////////////////////
//
// Настройка переменных
// Задаём paths
//
/////////////////////////////////////////////////
var config = {
  scss    :[ 'src/scss/**/*.scss' ],
  css     :[ 'src/css/' ],
  html    :[ 'src/**/*.html' ],
  build   :[ 'build/' ],
  src     :[ 'src/' ]
};

//////////////////////////////////////////////////
//
// Задачи для CSS/Sass
//
/////////////////////////////////////////////////
gulp.task('styles',function(){
  return gulp.src(config.scss)
    .pipe(plumber({errorHandler: notify.onError(function(err) {
        return {
          title: 'Styles',
          message: err.message,
          sound: false
        };
      })
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    //.on('error', sass.logError)
    .pipe(autoprefixer('last 3 versions'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(''+config.css+''))
    .pipe(reload({stream:true}));
});

//////////////////////////////////////////////////
//
// Задачи для HTML
//
/////////////////////////////////////////////////
gulp.task('html', function(){
  return gulp.src(config.html)
    .pipe(reload({stream:true}));
});

//////////////////////////////////////////////////
//
// Задачи Browser-Sync
//
/////////////////////////////////////////////////
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: config.src
    }
  });
});

//////////////////////////////////////////////////
//
// Задачи сборки
// Создание папки build, очистка неиспользуемых файлов и папок
//
/////////////////////////////////////////////////

// Создание
gulp.task('build:create', function(){
  return gulp.src(config.src+'**/*')
    .pipe(gulp.dest(''+config.build+''));
});

// Очистка папки build
gulp.task('build:clean',['build:create'], function(){
  return del(['build/bower_components/',
              'build/scss/',
              'build/css/!(*.min.css)',
              'build/js/!(*.min.js)'
            ]);
});

// Задачи предварительного просмотра приложения
gulp.task('build:start', function() {
  browserSync({
    server: {
      baseDir: config.build
    }
  });
});

// Удаляем папку build
gulp.task('build:delete', function(res){
  return del([config.build+'/**'], res);
});

// Задача build
gulp.task('build', ['build:create', 'build:clean']);

//////////////////////////////////////////////////
//
// Задача watch
// Отслеживает любые изменения в файлах CSS, JS и HTML
//
/////////////////////////////////////////////////
gulp.task ('watch', function(){
  gulp.watch(config.scss, ['styles']);
  gulp.watch(config.html, ['html']);
});

//////////////////////////////////////////////////
// Задача по умолчанию
/////////////////////////////////////////////////

gulp.task('default', ['watch', 'browserSync','styles','html']);