import fs from 'fs/promises'
import path from 'path'

import { exec } from 'child_process'
import { addApis } from './add-apis'
import { addTsIgnoreToImports } from './add-ts-ignore-to-imports'

import { fileURLToPath } from 'url'
import { promisify } from 'util'

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

const execAsync = promisify(exec)

;(async () => {
  await fs.mkdir(path.resolve(__dirname, '../', GENERATED_DIR), {
    recursive: true,
  })

  const { stdout, stderr } = await execAsync(generateCmd.join(' '), {
    env: { ...process.env, TS_POST_PROCESS_FILE: 'prettier --write' },
  })
  if (stderr) {
    console.error(stderr)
    return
  }
  console.log(stdout)

  // generate Apis class
  await addApis(GENERATED_DIR)

  // importsNotUsedAsValuesでエラーが起きるのですべてのimportに@ts-ignoreを付与する
  await addTsIgnoreToImports(GENERATED_DIR)
})()
