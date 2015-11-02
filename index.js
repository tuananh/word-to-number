'use strict'

let debug = require('debug')('w2n:index'),
    helper = require('./helper')

function convertWordToNumber(str) {
    debug('convertWordToNumber')
    return helper.sanitize(str)
        .then(helper.vectorize)
        .then(helper.validate)
        .then(helper.groupTokens)
        .then(helper.calculateValue)
        .catch(function (err) {
            // console.log(err)
        })
}

function validateString(string) {
    debug('validateString')
    return helper.validateString(string)
}

exports.convertWordToNumber = convertWordToNumber
exports.validateString = validateString
