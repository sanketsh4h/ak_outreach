// Content validation. Filled in at milestone 2; for now it checks that the
// locale files parse.
import { readFileSync } from 'node:fs'

JSON.parse(readFileSync('locales/en.json', 'utf8'))
console.log('validate: ok')
