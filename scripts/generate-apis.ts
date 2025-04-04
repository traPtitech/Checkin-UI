import fs from 'fs/promises'
import path from 'path'

import { exec } from 'child_process'
import { addApis } from './add-apis'
import { addTsIgnoreToImports } from './add-ts-ignore-to-imports'

import { fileURLToPath } from 'url'

const SWAGGER_PATH =
  'https://raw.githubusercontent.com/traPtitech/Checkin-openapi/refs/heads/main/openapi.yaml'
const GENERATED_DIR = 'src/lib/apis/generated'

const generateCmd = [
  'npx',
  'openapi-generator-cli',
  'generate',
  '-g',
  'typescript-axios',
  '-i',
  SWAGGER_PATH,
  '-o',
  GENERATED_DIR,
  '--enable-post-process-file',
]

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

;(async () => {
  await fs.mkdir(path.resolve(__dirname, '../', GENERATED_DIR), {
    recursive: true,
  })

  exec(
    generateCmd.join(' '),
    { env: { ...process.env, TS_POST_PROCESS_FILE: 'prettier --write' } },
    (error, stdout, stderr) => {
      if (error) {
        console.error(error.message)
        return
      }
      if (stderr) {
        console.error(stderr)
        return
      }
      console.log(stdout)
    },
  )

  // generate Apis class
  await addApis(GENERATED_DIR)

  // importsNotUsedAsValuesでエラーが起きるのですべてのimportに@ts-ignoreを付与する
  await addTsIgnoreToImports(GENERATED_DIR)
})()
