/* global describe, it */
const { expect } = require('chai')

describe('Notes', function () {
  it('#should create a note on the test object', function () {
    this.test.note('foo', 'bar')
    expect(this.test.notes).to.have.property('foo').that.equals('bar')
  })
})
