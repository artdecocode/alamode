import Zoroaster from 'zoroaster'
import { EOL } from 'os'
import { JSHook } from '../../src'

/** @type {Object.<string, (z: Zoroaster)>} */
const ts = {
  context: Zoroaster,
  'does not add source maps when sourceMappingURL is present'({ snapshotExtension }) {
    snapshotExtension('js')
    const res = JSHook(`import test from 'test'

// #sourceMappingURL=typal.js.map`
      .replace(/\r?\n/g, EOL), 'test.js')
    return res
  },
}
export default ts