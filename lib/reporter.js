'use strict'

/**
 * @module JSONWithNotes
 */
/**
 * Module dependencies.
 */

const mocha = require('mocha')
const Base = mocha.reporters.Base
const constants = mocha.Runner.constants
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL
const EVENT_TEST_END = constants.EVENT_TEST_END
const EVENT_RUN_END = constants.EVENT_RUN_END
const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING

/**
 * Initialize a new `JSONWithNotes` reporter.
 *
 * @public
 * @class JSON
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner
 */
function JSONReporterWithNotes (runner) {
  Base.call(this, runner)

  var self = this
  var tests = []
  var pending = []
  var failures = []
  var passes = []

  runner.on(EVENT_TEST_END, function (test) {
    tests.push(test)
  })

  runner.on(EVENT_TEST_PASS, function (test) {
    passes.push(test)
  })

  runner.on(EVENT_TEST_FAIL, function (test) {
    failures.push(test)
  })

  runner.on(EVENT_TEST_PENDING, function (test) {
    pending.push(test)
  })

  runner.once(EVENT_RUN_END, function () {
    var obj = {
      stats: self.stats,
      pending: pending.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    }

    runner.testResults = obj

    process.stdout.write(JSON.stringify(obj, null, 2))
  })
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @private
 * @param {Object} test
 * @return {Object}
 */
function clean (test) {
  var err = test.err || {}
  if (err instanceof Error) {
    err = errorJSON(err)
  }

  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    notes: cleanCycles(test.notes),
    err: cleanCycles(err)
  }
}

/**
 * Replaces any circular references inside `obj` with '[object Object]'
 *
 * @private
 * @param {Object} obj
 * @return {Object}
 */
function cleanCycles (obj) {
  var cache = []
  return JSON.parse(
    JSON.stringify(obj, function (key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Instead of going in a circle, we'll print [object Object]
          return '' + value
        }
        cache.push(value)
      }

      return value
    }))
}

/**
 * Transform an Error object into a JSON object.
 *
 * @private
 * @param {Error} err
 * @return {Object}
 */
function errorJSON (err) {
  var res = {}
  Object.getOwnPropertyNames(err).forEach(function (key) {
    res[key] = err[key]
  }, err)

  return res
}

JSONReporterWithNotes.description = 'single JSON object'

/**
 * Expose `JSONWithNotes`.
 */
exports = module.exports = JSONReporterWithNotes
