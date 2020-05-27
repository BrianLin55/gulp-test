var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var gulpSequence = require('gulp-sequence')



var envOptions = {
    string: 'env',
    default: {env:'develop'}
}
var options = minimist(process.argv.slice(2),envOptions)

gulp.task('clean', function () {
    return gulp.src(['./tmp','./public'], {
            read: false
        })
        .pipe($.clean());
});

gulp.task('copyHTML', function () {
    return gulp.src('./source/**/*.html')
        .pipe(gulp.dest('./public/'))
})

gulp.task('jade', function () {
    // var YOUR_LOCALS = {};

    gulp.src('./source/*.jade')
        .pipe($.plumber())
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream())
});

gulp.task('sass', function () {
    var plugins = [
        autoprefixer({
            overrideBrowserslist: ['last 2 version']
        })
    ]
    return gulp.src('./source/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        //  編譯完成CSS
        .pipe($.postcss([autoprefixer()]))
        .pipe($.if(options.env ==='production',$.cleanCss()))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream())
});

gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
        presets: ['@babel/env']
    }))
    .pipe($.concat('all.js'))
    //  編譯完成JS
    .pipe($.uglify({
        compress:{
            drop_console: true
        }})
    )
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream())
);

gulp.task('bower', function () {
    return gulp.src(mainBowerFiles({
            "overrides": {
                "vue": { // 套件名稱
                    "main": "dist/vue.js" // 取用的資料夾路徑
                }
            }
        }))
        .pipe(gulp.dest('./.tmp/vendors'));
    cb(err);
});

gulp.task('venderJs', ['bower'], function () {
    return gulp.src(['./.tmp/vendors/**/**.js'])
        .pipe($.order([
            'jquery.js',
            'bootstrap.js'
        ]))
        .pipe($.concat('vendor.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./public/js'))
})

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
});

gulp.task('image-min',() =>
    gulp.src('./source/images/*')
        .pipe($.if(options.env === 'production', $.imagemin()))
        .pipe(gulp.dest('./public/images'))
);

gulp.task('deploy', function () {
    return gulp.src('./public/**/*')
        .pipe($.ghPages());
});

gulp.task('watch', function () {
    gulp.watch('./source/scss/**/*.scss', ['sass']);
    gulp.watch('./source/*.jade', ['jade']);
    gulp.watch('./source/js/**/*.js', ['babel']);
});

gulp.task('bulid', gulpSequence('clean','jade','sass','babel','venderJs'))

gulp.task('default', ['jade', 'sass', 'babel', 'venderJs', 'browser-sync', 'image-min', 'watch']);