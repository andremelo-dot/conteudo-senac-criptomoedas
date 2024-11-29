import { resolve } from 'path';
import { readdirSync } from 'fs';
import autoprefixer from 'autoprefixer';
import genScorm from './genscorm';
import { defineConfig } from 'vite';

const config = {
  base: './',
  htmlFilenamePattern: 'sco',
  outDir: './dist/course/',
  initPage: '',
  root: './dist/course/',
  xmlEnconding: 'WINDOWS-1252',
  havePrerequisites: true,
  organizationTitle: 'Cultura Analítica'
}

const func = async function () {
	return new Promise(async (res) =>{
		const scoDir = resolve(__dirname);
		let files = await readdirSync(scoDir);
		let scos = {};
		const scoFiles = files.filter(file => file.startsWith(config.htmlFilenamePattern) && file.endsWith('.html'));
		scoFiles.forEach(sco => {
		  scos[sco.replace('.html', '').replace('-', '')] = resolve(scoDir, sco);
		});
		res(scos);
	})
}

let scos = await func();

export default defineConfig({
  plugins: [{
    name: 'genscorm-plugin',
    order: 'post',
    sequential: true,
    closeBundle: async () => genScorm(config)
  }],
  appType: 'mpa',
  base: './',
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  build: {
    outDir: `./dist/course`,
    minify: 'terser',
    emptyOutDir: true,
    terserOptions: {
      compress: {
        module: true,
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: scos,
      output: {
        entryFileNames: `assets/js/index.js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: (args) => {
          let { name } = args;
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return `assets/images/[name].[ext]`;
          }

          if (/\.css$/.test(name ?? '')) {
            return `assets/css/[name].[ext]`;
          }
          return `assets/[ext]/[name].[ext]`;
        },
      },
    },
  },
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@styles': resolve(__dirname, 'src/styles/'),
      '@scripts': resolve(__dirname, 'src/scripts/'),
    },
    extensions: ['.js'],
  },
});