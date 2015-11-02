'use strict'

let Promise = require('bluebird'),
    debug = require('debug')('w2n:helper')

let TOKENS = require('./tokens'),
    MAPPED_VALUES = require('./mapped-values'),
    STOP_POINTS = require('./stop-points')

function sanitize(searchText) {
    debug('sanitize', searchText)
    // remove and, dash, (s) from thousands, hundreds, ...
    let out = searchText.toLowerCase()

    out = out
        .replace(/ and /g, '\ ') // remove `and`
        .replace(/ +(?= )/g,'') // multiple spaces
        .replace(/-/g, '')
        .replace(/thousands/g, 'thousand') // common mistakes
        .replace(/millions/g, 'million')
        .replace(/billions/g, 'billion')

    return Promise.resolve(out)
        .bind(this)
}

function vectorize(sanitizedString) {
    debug('vectorize', sanitizedString)
    let arr = sanitizedString.split(' ')
    this.arr = arr
    this.parsedArr = arr.map((item) => { return getType(item) })
    return arr
}

function validate(arr) {
    let isValid = arr.every((item) => { return getType(item) !== null })
    if (!isValid) throw new Error('not a valid string')
    return isValid
}

function getType(str) {
    for (let key in TOKENS) {
        if (TOKENS[key].indexOf(str) !== -1)
            return key
    }

    return null
}

function isSameArr(leftArr, rightArr) {
    if (!(Array.isArray(leftArr) && Array.isArray(rightArr) && leftArr.length === rightArr.length)) {
        return false
    } else {
        return leftArr.every((item, idx) => { return leftArr[idx] === rightArr[idx] })
    }
}

function isStopPoint(inputArr) {
    for (let idx in STOP_POINTS) {
        if (isSameArr(STOP_POINTS[idx], inputArr)) {
            return true
        }
    }

    return false
}

function groupTokens() {
    debug('groupTokens')
    let parsedArr = this.arr,
        tmpArr = [],
        groups = [],
        currentToken

    while (parsedArr.length) {
        currentToken = parsedArr.pop()
        tmpArr.unshift(currentToken)
        let typeArr = tmpArr.map(item => getType(item))

        if (getType(currentToken) === 'power' || isStopPoint(typeArr)) {
            groups.unshift(tmpArr)
            tmpArr = []
        }
    }

    this.groups = groups
}

function calculateValue() {
    debug('calculateValue', this.groups)
    let groups = this.groups,
        currentStack = 0,
        sum = 0

    groups.forEach(function (arr, idx) {
        if (getType(arr[0]) === 'power') {
            sum += currentStack * MAPPED_VALUES[arr[0]]
            currentStack = 0
        } else {
            let valueArr = arr.map(item => MAPPED_VALUES[item])
            currentStack += reduceArr(valueArr)
            if (idx === groups.length-1) { // last item yet to see power
                sum += currentStack
            }
        }
    })

    return sum
}

function reduceArr(arr) {
    debug('reduceArr', arr)
    let sum = 0
    for (let idx in arr) {
        let curr = arr[idx],
            next = arr[parseInt(idx)+1]

        if (next === 100) {
            sum += curr * 100
        } else if (curr !== 100) {
            sum += curr
        }
    }

    return sum
}

function validateString(string) {
    debug('validateString')
    return sanitize(string)
        .bind(this)
        .then(vectorize)
        .then(validate)
        .catch(function (err) {
            return false
        })
}

exports.sanitize       = sanitize
exports.vectorize      = vectorize
exports.getType        = getType
exports.isSameArr      = isSameArr
exports.isStopPoint    = isStopPoint
exports.groupTokens    = groupTokens
exports.calculateValue = calculateValue
exports.validateString = validateString
