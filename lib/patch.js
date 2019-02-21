'use strict'

const patchTest = function (Test) {
  if (Test._noteSupport) {
    return
  }

  Test._noteSupport = 1

  Test.prototype.note = function (key, value) {
    this.notes = this.notes || {}
    this.notes[key] = value
  }
}

try {
  const mocha = require.resolve('mocha/lib/mocha.js')
  if (require.cache[mocha]) {
    patchTest(require.cache[mocha].exports.Test)
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}
