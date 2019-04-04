//------------------------------------------------------------------
//-------------- Load Plugins And Their Settings -------------------
const gulp = require('gulp');
const g = require('gulp-load-plugins')({ lazy: false });
const browserSync = require('browser-sync').create();

const HTML_MIN_OPTS = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true,
};

let environment = 'dev';

//--------------------------------------------------------------
//------------------------- Util Functions ---------------------
const buildJS = () => {
  let stream = gulp.src('./src/scripts.js');

  if (environment === 'prod') {
    stream = stream.pipe(g.terser());
  }

  return stream;
};

const buildCSS = () => {
  let stream = gulp.src('./src/styles.less').pipe(g.less());

  if (environment === 'prod') {
    stream = stream.pipe(g.minifyCss());
  }

  return stream;
};

const buildHTML = () => {
  let stream = gulp.src('./src/template.html');
  let signInStream;
  let cssText;

  buildCSS()
    .on('data', file => (cssText = file.contents.toString()))
    .on('end', () => {
      stream = stream.pipe(g.replace('/*INJECT:CSS*/', cssText));

      let jsText;

      buildJS()
        .on('data', file => (jsText = file.contents.toString()))
        .on('end', () => {
          stream = stream
            .pipe(g.replace('//INJECT:JS', jsText))
            .pipe(g.rename('index.html'));

          signInStream = gulp.src('./src/sign-in.html');

          if (environment === 'prod') {
            stream = stream.pipe(g.htmlmin(HTML_MIN_OPTS));
            signInStream = signInStream.pipe(g.htmlmin(HTML_MIN_OPTS));
          }

          stream.pipe(gulp.dest('./public'));
          signInStream.pipe(gulp.dest('./public'));

          g.util.log(`BUILD HOME PAGE FILES => ${new Date().toLocaleString()}`);
        });
    });
};

const copyAssets = () => {
  gulp
    .src(['./assets/**/*'])
    .pipe(g.imagemin())
    .pipe(gulp.dest('./public'));
};

const createServer = () => {
  browserSync.init({
    server: {
      baseDir: './public',
    },
  });
};

//-------------------------------------------------------
//----------------- Main Tasks --------------------------
gulp.task('watch', () => {
  setTimeout(createServer, 1000);
  buildHTML();
  copyAssets();
  gulp
    .watch(['./src/*.html', './src/styles.less', './src/scripts.js'], buildHTML)
    .on('change', browserSync.reload);
});

gulp.task('default', ['watch']);

//-------------------------------------------------------
//----------------- Builds Tasks ------------------------
gulp.task('build', () => {
  environment = 'prod';
  buildHTML();
  copyAssets();
});
