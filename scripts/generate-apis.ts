import fs from 'fs/promises'
import path from 'path'

import { exec } from 'child_process'
import { promisify } from 'util'
import { addApis } from './add-apis'
import { addTsIgnoreToImports } from './add-ts-ignore-to-imports'

import { fileURLToPath } from 'url'

const SWAGGER_PATH =
  'https://raw.githubusercontent.com/traPtitech/Checkin-openapi/refs/heads/main/openapi.yaml'
const GENERATED_DIR = 'src/lib/apis/generated'

const generateCmd = [
  'docker run --rm -v "${PWD}:/local" -u $(id -u) openapitools/openapi-generator-cli:v7.5.0',
  'generate',
  '-g',
  'typescript-axios',
  '-i',
  SWAGGER_PATH,
  '-o',
  `/local/${GENERATED_DIR}`,
]

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const execPromise = promisify(exec)

;(async () => {
  await fs.mkdir(path.resolve(__dirname, '../', GENERATED_DIR), {
    recursive: true,
  })

  const { stdout, stderr } = await execPromise(generateCmd.join(' '))
  console.log(stdout)
  if (stderr) {
    console.error(stderr)
  }

  // generate Apis class
  await addApis(GENERATED_DIR)

  // importsNotUsedAsValuesでエラーが起きるのですべてのimportに@ts-ignoreを付与する
  await addTsIgnoreToImports(GENERATED_DIR)
})()
