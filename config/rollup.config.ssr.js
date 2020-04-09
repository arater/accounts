import { pkg, isProd, commonExternal } from './utils';
import { typescript, replace, visualizer, uglify, commonPlugins } from './plugins';

const plugins = [
  typescript({
    check: isProd,
    tsconfigOverride: { module: 'commonjs', jsx: 'react' }
  }),
  ...commonPlugins
];

// returns rendered app.ts from renderToNodeStream
const input = 'src/entry.ssr.tsx';

const output = { name: 'ssr', file: 'dist/app.js', format: 'cjs', compact: true, sourcemap: !isProd };

const external = [...commonExternal, 'react-dom/server'];

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
    include: 'src/**',
    skipWrite: false
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
