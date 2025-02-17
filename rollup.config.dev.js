import {babel} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import livereload from "rollup-plugin-livereload";
import image from "@rollup/plugin-image";
import omit from "object.omit";
import path from "path";
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import serve from "rollup-plugin-serve";

var pkg = require("./package.json");
var cache;

const plugins = [
  image({
    limit: 10000
  }),
  postcss({
    use: ['sass'],
    extensions: [".scss", ".css"],
    extract: "style.css",
    minimize: true,
    modules: {
      // customize the name of the css classes that are created
      generateScopedName: "[local]___[hash:base64:5]"
    },
    autoModules: false,
    sourceMap: "inline", // true, "inline" or false
  }),
  resolve({
    browser: true,
    moduleDirectories: ['node_modules'],
    extensions: [".js", ".jsx"],
    jsnext: true,
    main: true,
    module: true
  }),
  replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
  commonjs({
    include: ["node_modules/**"],
    exclude: ["node_modules/process-es6/**"],
  }),
  eslint({
    exclude: ["**/*.scss", "**/*.css", "node_modules/**"]
  }),
  babel({
    exclude: ["node_modules/**", "__tests__/**"],
    babelHelpers: 'bundled',
  }),
];

if (process.env.npm_lifecycle_event === 'start') {
  plugins.push(
    serve({
      open: true,
      verbose: true,
      contentBase: ["dev"],
      historyApiFallback: false,
      host: "localhost",
      port: 10001
    }),
    livereload()
  )
}

export default {
  input: "src/app.js",
  cache: cache,
  output: {
    file: "dev/script/index.iife.js",
    format: "iife",
    name: "pureReactCarousel",
    sourcemap: true,
    sourcemapFile: path.resolve("dev/main.iife.js"),
    globals: {
      react: "React",
      'react-dom/client': "ReactDOM",
    }
  },
  // exclude peerDependencies from our bundle, except for react, react-dom, prop-types when dev'ing
  external: Object.keys(omit(pkg.peerDependencies, ["react", "react-dom"])),
  plugins
};
