/* eslint-disable @typescript-eslint/no-require-imports */
import typescript from 'rollup-plugin-typescript';
import sourceMaps from 'rollup-plugin-sourcemaps';
import copy from 'rollup-plugin-copy';

export default {
  input: './src/cloudfunctions/cloud/index.ts',
  plugins: [
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    sourceMaps(),
    copy({
      targets: [
        {
          src: [
            './src/cloudfunctions/cloud/config.json',
            './src/cloudfunctions/cloud/package.json'
          ],
          dest: 'dist/cloudfunctions/cloud'
        }
      ]
    })
  ],
  output: [
    {
      format: 'cjs',
      file: 'dist/cloudfunctions/cloud/index.js'
    }
  ]
};
