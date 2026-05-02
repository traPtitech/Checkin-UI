// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt().append(eslintConfigPrettier)
