//------------------------------------------------------------------
//-------------- Load Plugins And Their Settings -------------------
var gulp = require('gulp'),
	g = require('gulp-load-plugins')({
		lazy: false
	}),
	lazypipe = require('lazypipe'),
	stylish = require('jshint-stylish');

var htmlminOpts = {
	removeComments: true,
	collapseWhitespace: true,
	removeEmptyAttributes: false,
	collapseBooleanAttributes: true,
	removeRedundantAttributes: true
};

var isWatching = false;
var environment = 'dev';
var destPath = './dist';



//--------------------------------------------------------------
//------------------------- Util Functions ---------------------
function jshint(jshintfile) {
	return lazypipe()
		.pipe(g.jshint, jshintfile)
		.pipe(g.jshint.reporter, stylish)();
}

function buildJS() {

	var stream = gulp.src(__dirname + '/src/scripts.js')
		.pipe(jshint('.jshintrc'));

	if (environment === 'live') {
		stream = stream.pipe(g.uglify());
	}

	return stream;
}

function buildCSS() {

	var stream = gulp.src(__dirname + '/src/styles.less')
		.pipe(g.less())
		.pipe(g.csslint('.csslintrc'))
		.pipe(g.csslint.reporter('compact'));

	if (environment === 'live') {
		stream = stream.pipe(g.minifyCss());
	}

	return stream;
}

function buildHTML() {

	var stream = gulp.src(__dirname + '/src/template.html');
	var cssText;
	var jsText;

	buildCSS()
		.on('data', function(file) {

			cssText = file.contents.toString();

		})
		.on('end', function() {

			stream = stream.pipe(g.replace('/*INJECT:CSS*/', cssText));

			buildJS()
				.on('data', function(file) {

					jsText = file.contents.toString();

				})
				.on('end', function() {

					stream = stream
						.pipe(g.replace('//INJECT:JS', jsText))
						.pipe(g.htmlhint('.htmlhintrc'))
						.pipe(g.htmlhint.reporter());

					if (environment === 'live') {

						stream
							.pipe(g.htmlmin(htmlminOpts))
							.pipe(g.rename('home.html'))
							.pipe(gulp.dest(destPath + '/templates'));

					} else {

						stream
							.pipe(g.rename('index.html'))
							.pipe(gulp.dest(destPath));

					}

					g.util.log('BUILD HOME PAGE FILES');

				});

		});

}

function copyAssets() {

	gulp.src(__dirname + '/src/images/*.png')
		.pipe(gulp.dest(destPath + '/assets/home/images'));

}



//-------------------------------------------------------
//----------------- Main Tasks --------------------------
gulp.task('watch', function() {

	isWatching = true;

	gulp.watch([
		'./src/template.html',
		'./src/styles.less',
		'./src/scripts.js'
	], buildHTML);

	copyAssets();
	buildHTML();

});

gulp.task('default', ['watch']);



//-------------------------------------------------------
//----------------- Builds Tasks ------------------------
gulp.task('build-live', function() {

	environment = 'live';
	destPath = './../website-router';

	copyAssets();
	buildHTML();

});