const { commonExternal, isProd } = require('./utils');
const { typescript, run, commonPlugins } = require('./plugins');

const plugins = [
  typescript({
    check: isProd,
    tsconfigOverride: { module: 'commonjs', jsx: 'react' }
  }),
  ...commonPlugins,
  !isProd &&
    run({
      execArgv: ['-r', 'source-map-support/register']
    })
];

const input = isProd ? 'src/server/prod.server' : 'src/server/dev.server';

const output = { name: 'server', file: 'dist/server.js', format: 'cjs', compact: true, sourcemap: !isProd };

const external = [...commonExternal, './app', 'express', 'fs', 'path', 'http', 'reload', 'compression'];

const options = {
  cache: true,
  treeshake: false,
  external
};

const watchOptions = {
  input,
  output,
  plugins,
  ...options,
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
};

const rollupInputOptions = {
  input,
  ...options,
  plugins
};

const rollupOutputOptions = output;

module.exports = {
  watchOptions,
  rollupInputOptions,
  rollupOutputOptions
};
