import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path';
import electron from 'vite-plugin-electron/simple'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from "node:path";

// https://vite.dev/config/


const buildConfig = (mode: string) => {
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
                            dir: outputDir
                        }
                    }
                }
            }


        case 'chrome':
            outputDir = 'dist-chrome';
            indexHTML = 'index_chrome.html';

            return {
                plugins: [
                    vue(),
                    viteStaticCopy({
                        targets: [
                            {
                                src: 'chrome/manifest.json',
                                dest: '../dist-chrome'
                            }
                        ]
                    })
                ],
                build: {
                    rollupOptions: {
                        input: {
                            main: resolve(__dirname, indexHTML),
                            worker: resolve(__dirname, '/chrome/worker.ts'),
                            inject: resolve(__dirname, '/chrome/inject.ts')
                        },
                        output: {
                            entryFileNames: '[name].js',
                            dir: outputDir
                        }
                    }
                },
                server: {
                    open: '/'+indexHTML,
                }
            }

        case'telegram':
            outputDir = 'dist-telegram';
            indexHTML = 'index_telegram.html';
            break;
    }

    return {
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
        },
        server: {
            open: '/'+indexHTML,
        }
    }
}

export default defineConfig(({mode}: any): any => {
    let config:any = buildConfig(mode);

    config = {
        ...config,
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src')
            }
        }
    }

    return config;
})
