var gulp = require( 'gulp' ),
  jade = require( 'gulp-jade' ),
  sass = require( 'gulp-sass' ),
  coffee = require( 'gulp-coffee' ),
  connect = require( 'gulp-connect' ),
  livereload = require( 'gulp-livereload' ),
  clean = require( 'gulp-clean' ),
  clone = require( 'gulp-clone' ),
	wiredep = require( 'wiredep' ).stream,
  useref = require( 'gulp-useref' ),
  gutil = require( 'gulp-util' );

// Запуск сервера для живой перегрузки страниц в браузере
gulp.task( 'connect', function() {
  connect.server( {
    port: 3000,
    livereload: true
  } );
} );

// Работа с Jade
gulp.task( 'jade', function() {
  var assets = useref.assets();

	return gulp.src( 'app/index.jade' )
		.pipe( jade( {
      pretty: true
    } ) )
    .pipe( connect.reload() )
    .pipe( wiredep( {
      directory: 'app/libs'
    } ) )
    .pipe( connect.reload() )
    .pipe( assets )
    .pipe( assets.restore())
    .pipe( useref())
    .pipe( gulp.dest( 'dest' ) );
} );

// Работа с SCSS
gulp.task( 'sass', function() {
  return gulp.src( 'app/sass/*.scss' )
    .pipe( sass( {
      outputStyle: 'expanded'
    } ).on( 'error', sass.logError ) )
    .pipe( connect.reload() )
    .pipe( gulp.dest( 'dest/css' ) );
} );

// Работа с CoffeeScript
gulp.task( 'coffee', function() {
  return gulp.src( 'app/coffee/*.coffee' )
    .pipe( coffee( { bare: true } ).on( 'error', gutil.log ) )
    .pipe( connect.reload() )
    .pipe( gulp.dest( 'dest/js' ) );
});

// Следим за изменениями исходников и при необходимости перекомпилируем их
gulp.task( 'watch' , function() {
  gulp.watch( [ 'app/index.jade', 'bower.json' ], [ 'jade' ] );
  gulp.watch( 'app/coffee/*.coffee', [ 'coffee' ] );
  gulp.watch( 'app/sass/*.scss', [ 'sass' ] );
  //gulp.watch( 'bower.json', [ 'jade' ] );
} );

// Копирование неизменяемых файлов
gulp.task( 'clone', function() {
  gulp.src( 'app/img/*.*' )
    .pipe( clone() )
    .pipe( gulp.dest( 'dest/img' ) );
  gulp.src( 'app/fonts/*.*' )
    .pipe( clone() )
    .pipe( gulp.dest( 'dest/fonts' ) );
} );

// Задача очистки папки назначанеия
gulp.task( 'clean', function() {
  return gulp.src( 'dest' )
    .pipe( clean() );
});

gulp.task( 'default', [ 'connect', 'jade', 'sass', 'coffee','clone', 'watch' ] );