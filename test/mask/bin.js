import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { join, basename, sep } from 'path'
import { lstatSync } from 'fs'
import { equal } from 'assert'
import Context from '../context'
import { EOL } from 'os'

const { BIN } = Context

export default makeTestSuite('test/result/bin', {
  /**
   * @param {TempContext} tempContext
   */
  async getResults({ snapshot }) {
    const s = await snapshot()
    return s
      .replace(/\r?\n/g, EOL)
      .replace(/^# .+/mg, (m) => {
        return m.replace(new RegExp(sep.replace('\\', '\\\\'), 'g'), '/')
      })
  },
  fork: {
    module: BIN,
    getArgs(args, { TEMP }) {
      return [...args, '-o', TEMP]
    },
    preprocess(s) {
      return s.replace(/Transpiled code saved to .+/, (m) => {
        return m.replace(new RegExp(sep.replace('\\', '\\\\'), 'g'), '/')
      })
    },
    normaliseOutputs: true,
  },
  splitRe: /^\/\/\/ /mg,
  context: TempContext,
})

export const config = makeTestSuite('test/result/plain', {
  /**
   * @param {TempContext} tempContext
   */
  async getResults({ snapshot }) {
    const s = await snapshot('output')
    return s.replace(/\r?\n/g, EOL)
      .replace(/^#/gm, '//')
  },
  fork: {
    module: BIN,
    /**
     * @param
     * @param {TempContext} t
     */
    async getArgs(args, { write }) {
      const { ext = 'js', file, alamoderc } = this
      await write(`src/input.${ext}`, file)
      if (alamoderc) await write('.alamoderc.json', alamoderc)
      return [...args, '-o', 'output']
    },
    getOptions({ TEMP }) {
      return {
        cwd: TEMP,
      }
    },
    normaliseOutputs: true,
  },
  propStartRe: /```\S+/,
  propEndRe: /```/,
  context: TempContext,
})

export const rights = makeTestSuite('test/result/rights', {
  fork: {
    module: BIN,
    /**
     * @param {string[]}
     * @param {TempContext}
     */
    getArgs(src, { TEMP }) {
      return [...src, '-o', TEMP]
    },
  },
  getResults({ TEMP }) {
    const b = basename(this.input)
    const j = join(TEMP, b)
    equal(lstatSync(j).mode, lstatSync(this.input).mode)
    return 'ok'
  },
  context: TempContext,
})