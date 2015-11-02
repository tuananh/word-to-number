'use strict'

let assert = require('assert'),
    convertWordToNumber = require('../index').convertWordToNumber,
    validateString = require('../index').validateString

describe('convert words to number tests', function() {
    it('one hundred and thirty one -> 131', function(done) {
        convertWordToNumber('one hundred and thirty one').then(function (val) {
            assert.equal(val, 131, 'should equal')
            done()
        })
    })

    it('one thousand -> 1,000', function(done) {
        convertWordToNumber('one thousand').then(function (val) {
            assert.equal(val, 1000, 'should equal')
            done()
        })
    })

    it('one thousand one hundred and thirty one -> 1,131', function(done) {
        convertWordToNumber('one thousand one hundred and thirty one').then(function (val) {
            assert.equal(val, 1131, 'should equal')
            done()
        })
    })

    it('one million two thousand -> 1,002,000', function(done) {
        convertWordToNumber('one million two thousand').then(function (val) {
            assert.equal(val, 1002000, 'should equal')
            done()
        })
    })

    it('one billion nine thousands one hundred and thirty one -> 1,000,009,131', function(done) {
        convertWordToNumber('one billion nine thousands one hundred and thirty one').then(function (val) {
            assert.equal(val, 1000009131, 'should equal')
            done()
        })
    })

    it('one -> 1', function(done) {
        convertWordToNumber('one').then(function (val) {
            assert.equal(val, 1, 'should equal')
            done()
        })
    })

    it('two billion three hundred sixty one million fifty three thousand and seven hundred ninety one -> 2,361,053,791', function(done) {
        convertWordToNumber('two billion three hundred sixty one million fifty three thousand and seven hundred ninety one').then(function (val) {
            assert.equal(val, 2361053791, 'should equal')
            done()
        })
    })

    it('two billion three  hundreds sixty one million fifty three thousand and seven hundred ninety one -> 2,361,053,791', function(done) {
        convertWordToNumber('two billion three hundred sixty one million fifty three thousand and seven hundred ninety nine').then(function (val) {
            assert.equal(val, 2361053799, 'should equal')
            done()
        })
    })
})

describe('validate string tests', function() {
    it('one -> true (valid string)', function(done) {
        validateString('one').then(function (result) {
            assert.equal(result, true, 'should be valid')
            done()
        })
    })

    it('ones -> false (invalid string)', function(done) {
        validateString('ones').then(function (result) {
            assert.equal(result, false, '"ones" should be invalid')
            done()
        })
    })
})
