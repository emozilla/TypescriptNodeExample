const gulp = require('gulp')
const gts = require('gulp-typescript')
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

const tsProject = gts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
    return gulp.src(JSON_FILES).pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);