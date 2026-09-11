import { build } from 'bun';

(async () => {
  await build({
    entrypoints: ['./bundle/src/js/app.js'],
    outdir: './public',
    target: 'browser',
    naming: 'bundle.js',
    /*minify: {
      whitespace: true,
      syntax: true,
      identifiers: true,
    },
    sourcemap: 'none',*/
  });
})();