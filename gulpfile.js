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
const readData = stream => {
  return new Promise((resolve, reject) => {
    let content;
    stream
      .on('data', file => (content = file.contents.toString()))
      .on('end', () => {
        resolve(content);
      });
  });
};

const buildJS = page => {
  let stream = gulp.src(`./src/js/${page}.js`);

  if (environment === 'prod') {
    stream = stream.pipe(g.terser());
  }

  return stream;
};

const buildCSS = page => {
  let stream = gulp.src(`./src/styles/${page}.less`).pipe(g.less());

  if (environment === 'prod') {
    stream = stream.pipe(g.minifyCss());
  }

  return stream;
};

const buildHTML = page => {
  Promise.all([readData(buildCSS(page)), readData(buildJS(page))]).then(
    ([cssText, jsText]) => {
      let stream = gulp
        .src(`./src/pages/${page}.html`)
        .pipe(g.replace('/*INJECT:CSS*/', cssText))
        .pipe(g.replace('//INJECT:JS', jsText));

      if (environment === 'prod') {
        stream = stream.pipe(g.htmlmin(HTML_MIN_OPTS));
      }

      stream.pipe(gulp.dest('./public'));
      g.util.log(`BUILD ${page} FILES => ${new Date().toLocaleString()}`);
    },
  );
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

  buildHTML('index');
  buildHTML('about');
  buildHTML('sign-in');
  copyAssets();

  gulp
    .watch(
      ['./src/pages/index.html', './src/styles/index.less', './src/scripts.js'],
      () => {
        buildHTML('index');
      },
    )
    .on('change', browserSync.reload);

  gulp
    .watch(
      ['./src/pages/about.html', './src/styles/about.less', './src/scripts.js'],
      () => {
        buildHTML('about');
      },
    )
    .on('change', browserSync.reload);

  gulp
    .watch(['./src/pages/sign-in.html'], () => {
      buildHTML('sign-in');
    })
    .on('change', browserSync.reload);
});

gulp.task('default', ['watch']);

//-------------------------------------------------------
//----------------- Builds Tasks ------------------------
gulp.task('build', () => {
  environment = 'prod';
  buildHTML('index');
  buildHTML('about');
  buildHTML('sign-in');
  copyAssets();
});
