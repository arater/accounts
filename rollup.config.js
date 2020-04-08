import { DEFAULT_EXTENSIONS } from '@babel/core';
import rollup from 'rollup';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import visualizer from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import json from '@rollup/plugin-json';
import { uglify } from 'rollup-plugin-uglify';
import rimraf from 'rimraf';
import pkg from './package.json';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import fs from 'fs';
//import ssrBundler from './config/rollup.config.ssr' bu index.ssr.tsx

const isProd = process.env.BUILD === 'production';
process.env.NODE_ENV = isProd ? 'production' : 'development';
process.env.BABEL_ENV = isProd ? 'production' : 'development';

const reactNamedExports = [
  'Children',
  'Component',
  'Fragment',
  'Profiler',
  'PureComponent',
  'StrictMode',
  'Suspense',
  '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  'cloneElement',
  'createContext',
  'createElement',
  'createFactory',
  'createRef',
  'forwardRef',
  'isValidElement',
  'lazy',
  'memo',
  'useCallback',
  'useContext',
  'useDebugValue',
  'useEffect',
  'useImperativeHandle',
  'useLayoutEffect',
  'useMemo',
  'useReducer',
  'useRef',
  'useState',
  'version'
];

const reactDOMNamedExports = [
  '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  'createPortal',
  'findDOMNode',
  'flushSync',
  'hydrate',
  'render',
  'unmountComponentAtNode',
  'unstable_batchedUpdates',
  'unstable_createPortal',
  'unstable_renderSubtreeIntoContainer',
  'version'
];

const reactIsNamedExports = [
  'AsyncMode',
  'ConcurrentMode',
  'ContextConsumer',
  'ContextProvider',
  'Element',
  'ForwardRef',
  'Fragment',
  'Lazy',
  'Memo',
  'Portal',
  'Profiler',
  'StrictMode',
  'Suspense',
  'isAsyncMode',
  'isConcurrentMode',
  'isContextConsumer',
  'isContextProvider',
  'isElement',
  'isForwardRef',
  'isFragment',
  'isLazy',
  'isMemo',
  'isPortal',
  'isProfiler',
  'isStrictMode',
  'isSuspense',
  'isValidElementType',
  'typeOf'
];

const extensions = [...DEFAULT_EXTENSIONS, '.jsx', '.ts', '.tsx'];

const commonExternal = ['react', 'react-is', 'styled-components'];

const commonPlugins = [
  commonjs({
    include: 'node_modules/**',
    exclude: ['node_modules/process-es6/**'],
    extensions,
    namedExports: {
      react: reactNamedExports,
      'react-dom': reactDOMNamedExports,
      'react-is': reactIsNamedExports
    }
  }),
  resolve({
    extensions,
    preferBuiltins: true
  }),
  babel({
    extensions,
    exclude: 'node_modules/**'
  }),
  json({
    compact: true,
    namedExports: false
  }),
  isProd &&
    progress({
      clearLine: false
    }),
  isProd && filesize()
];

const commonOptions = {
  cache: true,
  treeshake: false
};

const clientConfig = {
  ...commonOptions,
  input: 'src/entry.tsx',
  external: isProd && [...commonExternal, 'react-dom', 'prop-types'],
  output: {
    name: pkg.name,
    file: `dist/public/${pkg.name}.js`,
    format: 'iife',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
      'styled-components': 'styled'
    }
  },
  plugins: [
    typescript({ check: isProd }),
    ...commonPlugins,
    replace({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
    }),
    isProd && visualizer(),
    isProd && uglify()
  ],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
};

// SSR Rendering frontend application file bundle
const appConfig = {
  input: 'src/app.tsx',
  ...commonOptions,
  external: [...commonExternal],
  output: { file: 'dist/app.js', format: 'cjs', compact: true },
  plugins: [typescript({ check: isProd, tsconfigOverride: { module: 'commonjs', jsx: 'react' } }), ...commonPlugins],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
};

const rollupBundler = hotReload => {
  const watcher = rollup.watch([clientConfig, appConfig]);

  watcher.on('event', event => {
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    if (event.code === 'BUNDLE_START' || event.code === 'BUNDLE_END') {
      console.info(`${event.code}: ${event.input}`);
    }
    if (event.code === 'END') hotReload();
  });
};

const rollupBuild = async () => {
  console.log('rollUpBuild');
  await rimraf.sync('dist');
  const fragmentManifest = './dist/public';

  if (!fs.existsSync(fragmentManifest)) {
    await fs.mkdirSync(fragmentManifest, { recursive: true });
  }

  const adapter = new FileSync(`${fragmentManifest}/fragment.json`);
  const db = low(adapter);

  db.set('name', pkg.name).write();
  db.set('version', pkg.version).write();

  const clientSideBuild = async () => {
    const bundle = await rollup.rollup({
      input: clientConfig.input,
      ...commonOptions,
      external: [...commonExternal],
      plugins: clientConfig.plugins
    });

    const bundleOutput = await bundle.generate(clientConfig.output);

    for (const chunkOrAsset of bundleOutput.output) {
      if (chunkOrAsset.type === 'asset') {
        // console.log('Asset', chunkOrAsset)
      } else {
        db.set(chunkOrAsset.fileName, chunkOrAsset.code).write();
      }
    }
    await bundle.write(clientConfig.output);
  };

  // const ssrBuild = async () => {
  //   const bundle = await rollup.rollup(ssrBundler.rollupInputOptions);

  //   await bundle.write(ssrBundler.rollupOutputOptions);

  //   const reactDomBodyStreamFile = require.resolve(`./${ssrBundler.rollupOutputOptions.file}`);
  //   if (reactDomBodyStreamFile) {
  //     let html;

  //     const ReactDomBodyStream = require(reactDomBodyStreamFile);

  //     ReactDomBodyStream.on('data', (chunk) => (html += chunk.toString()));

  //     ReactDomBodyStream.on('end', () => db.set('html', `<div id="${pkg.name}-root">${html}</div>`).write());
  //   }
  // };

  const serverBuild = async () => {
    const bundle = await rollup.rollup({
      input: serverConfig.input,
      ...commonOptions,
      external: [...commonExternal],
      plugins: serverConfig.plugins
    });
    // not to run runServer infinitely
    await bundle.write({ file: 'dist/server.js', format: 'cjs', compact: true });
  };

  await clientSideBuild();
  await serverBuild();
  //   const bundleOutput = await bundle.generate(clientBundler.rollupOutputOptions);

  //   for (const chunkOrAsset of bundleOutput.output) {
  //     if (chunkOrAsset.type === 'asset') {
  //       // console.log('Asset', chunkOrAsset)
  //     } else {
  //       db.set(chunkOrAsset.fileName, chunkOrAsset.code).write();
  //     }
  //   }

  //   await bundle.write(clientBundler.rollupOutputOptions);
  // };
};

const runServer = () => ({
  name: 'server-run',
  writeBundle: ({ file }) => {
    const bundleServerPath = require.resolve(`./${file}`);
    console.log('Run Server');
    rollupBuild();

    //const { run, build } = require(bundleServerPath);
    // if (!isProd) {
    //   build(rollupBuild);
    //   //run(rollupBundler);
    // } else {
    //   build(rollupBuild);
    // }
  }
});

const serverConfig = {
  ...commonOptions,
  input: 'src/server.tsx',
  external: [...commonExternal, 'react-dom/server', 'express', 'path', 'http', 'reload', './app'],
  output: { file: 'dist/server.js', format: 'cjs', compact: true, plugins: [runServer()] },
  plugins: [
    typescript({
      check: isProd,
      tsconfigOverride: { module: 'commonjs', jsx: 'react' }
    }),
    ...commonPlugins
  ],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
};

export default serverConfig;

// export default {
//   input: 'src/index.tsx',
//   external: isProd && ['react', 'react-dom', 'prop-types', 'styled-components'],
//   output: {
//     name,
//     file: 'public/dist/app.js',
//     format: 'iife',
//     globals: {
//       react: 'React',
//       'react-dom': 'ReactDOM',
//       'prop-types': 'PropTypes',
//       'styled-components': 'styled',
//     },
//   },
//   plugins: [
//     replace({
//       'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
//     }),
//     resolve(),
//     commonjs({
//       include: 'node_modules/**',
//       namedExports: {
//         react: reactNamedExports,
//         'react-dom': reactDOMNamedExports,
//         'react-is': reactIsNamedExports,
//       },
//     }),
//     babel({
//       extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
//       exclude: 'node_modules/**',
//     }),
//     filesize(),
//     typescript(),
//     alias({
//       entries: [{ find: 'components', replacement: path.join(__dirname, 'src/components') }],
//     }),
//     progress({
//       clearLine: false,
//     }),
//     isProd && visualizer(),
//     isProd && uglify(),
//     !isProd && browsersync({ server: 'public', files: 'public/dist/app.js' }),
//   ],
//   watch: {
//     exclude: 'node_modules/**',
//     include: 'src/**',
//   },
// };
