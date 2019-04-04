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

          if (environment === 'prod') {
            stream = stream.pipe(g.htmlmin(HTML_MIN_OPTS));
          }

          stream.pipe(gulp.dest('./public'));

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
  buildHTML();
  copyAssets();
  setTimeout(createServer, 2000);
  gulp
    .watch(['./src/template.html', './src/styles.less', './src/scripts.js'], buildHTML)
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
