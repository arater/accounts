import fs from 'fs';
import path from 'path';
import { reactNamedExports, reactDOMNamedExports, reactIsNamedExports, isProd, extensions } from './utils';
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
import run from '@rollup/plugin-run';

const resolverPlugin = () => ({
  resolveId(source, importer) {
    console.log('importer', importer);
    if (/\.(gif|jpe?g|tiff|png|svg|webp|bmp)$/i.test(source)) {
      return path.resolve(path.dirname(importer), source);
    }
  },
  load(id) {
    if (/\.(gif|jpe?g|tiff|png|svg|webp|bmp)$/i.test(id)) {
      const referenceId = this.emitFile({
        type: 'asset',
        name: path.basename(id),
        source: fs.readFileSync(id)
      });
      return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
    }
  }
});

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

module.exports = {
  replace,
  typescript,
  babel,
  commonjs,
  resolve,
  visualizer,
  filesize,
  progress,
  json,
  uglify,
  resolverPlugin,
  commonPlugins,
  run
};
