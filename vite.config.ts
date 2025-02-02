import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path';
import electron from 'vite-plugin-electron/simple'
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({mode}: any): any => {

        console.log("Mode is [", mode, "]");

        let outputDir = 'dist';
        let indexHTML = 'index.html';

        switch (mode) {

            case 'electron':
                return {
                    plugins: [vue(),
                        electron({
                            main: {
                                entry: path.join(__dirname, 'electron/main.ts'),
                                vite: {
                                    build: {
                                        outDir: 'dist-electron',
                                    }
                                }
                            },
                            preload: {
                                input: path.join(__dirname, 'electron/preload.ts'),
                                vite: {
                                    build: {
                                        outDir: 'dist-electron',
                                    }
                                }
                            },
                        })
                    ],
                    build: {
                        rollupOptions: {
                            input: {
                                main: resolve(__dirname, indexHTML)
                            },
                            output: {
                                entryFileNames: '[name].js',
                                dir: 'dist'
                            }
                        }
                    }
                }


            case 'chrome':
                outputDir = 'dist-chrome';
                indexHTML = 'index_chrome.html';

                return {
                    plugins: [
                        vue()
                    ],
                    build: {
                        rollupOptions: {
                            input: {
                                main: resolve(__dirname, indexHTML),
                                worker: resolve(__dirname, '/chrome/worker.ts'),
                                inject: resolve(__dirname, '/chrome/inject.ts'),
                            },
                            output: {
                                entryFileNames: '[name].js',
                                dir: outputDir
                            }
                        }
                    }
                }

            case'telegram':
                outputDir = 'dist-telegram';
                indexHTML = 'index_telegram.html';
                break;
        }

        return {
            publicPath: '',
            pluginOptions: {
                cordovaPath: 'cordova'
            },
            plugins: [vue()],
            build: {
                rollupOptions: {
                    input: {
                        main: resolve(__dirname, indexHTML),
                    },
                    output: {
                        entryFileNames: '[name].js',
                        dir: outputDir
                    }
                }
            }
        }
    }
)
