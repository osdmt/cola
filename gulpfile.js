/* Base */
const gulp = require('gulp');
const data = require('gulp-data');
const watch = require('gulp-watch');
const debug = require('gulp-debug');

/* Plugin for webserver*/
const browserSync = require("browser-sync");
const reload = browserSync.reload;

/* Plugin for HTML*/
const htmlmin = require('gulp-htmlmin');

/* Plugin for SASS*/
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require("gulp-notify");

/* Plugin for JS*/
const concat = require('gulp-concat');
const minify = require('gulp-minify');
// const count = require('jquery-countdown');

/* Plugin for Images */
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

/* HELPERS*/
const newer = require('gulp-newer'); /*  Plugin look for new changes in files */
const clean = require('gulp-clean'); /* Plugin delete some folder, content */

/*Task for HTML*/
gulp.task('html', () => {
  gulp.src('./src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build'))
    .pipe(reload({ stream: true }));
});

/*Task for CSS*/
gulp.task('css', () => {
  gulp.src([
    // './node_modules/font-awesome/css/font-awesome.css',
    // './node_modules/fancybox/dist/css/jquery.fancybox.css',
    // './node_modules/fancybox/dist/helpers/css/jquery.fancybox-buttons.css',
    // './node_modules/fancybox/dist/helpers/css/jquery.fancybox-thumbs.css',
    './src/styles/main.scss'

    ])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', function (err) {
      return notify().write(err);
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))
    .pipe(reload({ stream: true }));
});

/*Task for JS*/
gulp.task('js', () => {
  gulp.src([
    './node_modules/jquery/dist/jquery.js',
    // './node_modules/fancybox/dist/js/jquery.fancybox.js',
    // './node_modules/fancybox/lib/jquery.mousewheel.pack.js',
    // './node_modules/fancybox//dist/helpers/js/jquery.fancybox-buttons.js',
    // './node_modules/fancybox//dist/helpers/js/jquery.fancybox-media.js',
    // './node_modules/fancybox//dist/helpers/js/jquery.fancybox-thumbs.js',
    // './node_modules/jquery-validation/dist/jquery.validate.js',
    // './node_modules/jquery-validation/dist/additional-methods.js',
    // './node_modules/jquery-parallax.js/parallax.js',
    // './node_modules/slick-carousel/slick/slick.js',
    // './node_modules/jquery.countdown/jquery.countdown.js',
    './src/js/main.js'
  ])
    .pipe(concat('main.js'))
    .pipe(minify({
      ext: {
        min: '.js'
      },
      compress: true,
      noSource: true,
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(reload({ stream: true }));
});

/* Task for PHP */
gulp.task('php', () => {
  gulp.src('./src/php/**/*.php')
    .pipe(newer('./build/'))
    .pipe(gulp.dest('./build/php/'))
    .pipe(reload({ stream: true }));
});

/*Task for Images*/
gulp.task('image', () => {
  gulp.src('./src/img/**/*.*')
    .pipe(newer('./build/img/'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest('./build/img/'))
    .pipe(reload({ stream: true }));
});

/* Task for Fonts */
gulp.task('fonts', () => {
  gulp.src('./src/fonts/**/*.*')
    .pipe(newer('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'))
    .pipe(reload({ stream: true }));
});

/* Task for file .htaccess */
gulp.task('htaccess', () => {
  gulp.src('./src/.htaccess')
    .pipe(gulp.dest('./build/'))
});

/* Task Build */
gulp.task('build', ['html', 'css', 'js', 'php', 'image', 'fonts', 'htaccess']);

/*Task for webserver*/
const config = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "dmitriy"
};

gulp.task('webserver', () => browserSync(config));

/* Task Watch */
gulp.task('watch', function () {
  watch('./src/*.html', () => gulp.run('html'));
  watch('./src/styles/**/*.scss', () => gulp.run('css'));
  watch('./src/js/**/*.js', () => gulp.run('js'));
  watch('./src/img/**/*.*', () => gulp.run('image'));
  watch('./src/fonts/**/*.*', () => gulp.run('fonts'));
});

/* Task Default */
gulp.task('default', ['build', 'webserver', 'watch']);

// /* Task Clean (delete folder [build/]) */  gulp clean
gulp.task('clean', () => {
  gulp.src('build', { read: false })
    .pipe(clean());
});
