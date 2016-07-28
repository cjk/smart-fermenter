import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
import preprocess from 'gulp-preprocess';

function build() {
  gulp.src(['./src/**/*.js'])
      .pipe(preprocess())
      .pipe(babel({
        presets: ['es2015-node5', 'stage-1'],
        plugins: ['transform-runtime', 'add-module-exports']
      }))
      .pipe(gulp.dest('app'));
}

gulp.task('build', build);

gulp.task('hotupdate', () =>
  watch('src/**/*.js', build, {ignoreInitial: false})
);

gulp.task('default', ['build', 'hotupdate']);
