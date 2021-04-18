// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/node-libs-browser/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/node-libs-browser/node_modules/buffer/index.js"}],"node_modules/socket.io/client-dist/socket.io.min.js":[function(require,module,exports) {
var define;
var Buffer = require("buffer").Buffer;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * Socket.IO v4.0.1
 * (c) 2014-2021 Guillermo Rauch
 * Released under the MIT License.
 */
!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.io = e() : t.io = e();
}(self, function () {
  return function (t) {
    var e = {};

    function n(r) {
      if (e[r]) return e[r].exports;
      var o = e[r] = {
        i: r,
        l: !1,
        exports: {}
      };
      return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }

    return n.m = t, n.c = e, n.d = function (t, e, r) {
      n.o(t, e) || Object.defineProperty(t, e, {
        enumerable: !0,
        get: r
      });
    }, n.r = function (t) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(t, "__esModule", {
        value: !0
      });
    }, n.t = function (t, e) {
      if (1 & e && (t = n(t)), 8 & e) return t;
      if (4 & e && "object" == _typeof(t) && t && t.__esModule) return t;
      var r = Object.create(null);
      if (n.r(r), Object.defineProperty(r, "default", {
        enumerable: !0,
        value: t
      }), 2 & e && "string" != typeof t) for (var o in t) {
        n.d(r, o, function (e) {
          return t[e];
        }.bind(null, o));
      }
      return r;
    }, n.n = function (t) {
      var e = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };
      return n.d(e, "a", e), e;
    }, n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, n.p = "", n(n.s = 18);
  }([function (t, e, n) {
    var r = n(24),
        o = n(25),
        i = String.fromCharCode(30);
    t.exports = {
      protocol: 4,
      encodePacket: r,
      encodePayload: function encodePayload(t, e) {
        var n = t.length,
            o = new Array(n),
            s = 0;
        t.forEach(function (t, c) {
          r(t, !1, function (t) {
            o[c] = t, ++s === n && e(o.join(i));
          });
        });
      },
      decodePacket: o,
      decodePayload: function decodePayload(t, e) {
        for (var n = t.split(i), r = [], s = 0; s < n.length; s++) {
          var c = o(n[s], e);
          if (r.push(c), "error" === c.type) break;
        }

        return r;
      }
    };
  }, function (t, e, n) {
    function r(t) {
      if (t) return function (t) {
        for (var e in r.prototype) {
          t[e] = r.prototype[e];
        }

        return t;
      }(t);
    }

    t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
      return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
    }, r.prototype.once = function (t, e) {
      function n() {
        this.off(t, n), e.apply(this, arguments);
      }

      return n.fn = e, this.on(t, n), this;
    }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
      if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
      var n,
          r = this._callbacks["$" + t];
      if (!r) return this;
      if (1 == arguments.length) return delete this._callbacks["$" + t], this;

      for (var o = 0; o < r.length; o++) {
        if ((n = r[o]) === e || n.fn === e) {
          r.splice(o, 1);
          break;
        }
      }

      return 0 === r.length && delete this._callbacks["$" + t], this;
    }, r.prototype.emit = function (t) {
      this._callbacks = this._callbacks || {};

      for (var e = new Array(arguments.length - 1), n = this._callbacks["$" + t], r = 1; r < arguments.length; r++) {
        e[r - 1] = arguments[r];
      }

      if (n) {
        r = 0;

        for (var o = (n = n.slice(0)).length; r < o; ++r) {
          n[r].apply(this, e);
        }
      }

      return this;
    }, r.prototype.listeners = function (t) {
      return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
    }, r.prototype.hasListeners = function (t) {
      return !!this.listeners(t).length;
    };
  }, function (t, e) {
    t.exports = "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this")();
  }, function (t, e, n) {
    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function i(t, e) {
      return (i = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function s(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = a(t);

        if (e) {
          var o = a(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return c(this, n);
      };
    }

    function c(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function a(t) {
      return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    var u = n(0),
        f = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && i(t, e);
      }(a, t);
      var e,
          n,
          r,
          c = s(a);

      function a(t) {
        var e;
        return function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, a), (e = c.call(this)).opts = t, e.query = t.query, e.readyState = "", e.socket = t.socket, e;
      }

      return e = a, (n = [{
        key: "onError",
        value: function value(t, e) {
          var n = new Error(t);
          return n.type = "TransportError", n.description = e, this.emit("error", n), this;
        }
      }, {
        key: "open",
        value: function value() {
          return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this;
        }
      }, {
        key: "close",
        value: function value() {
          return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this;
        }
      }, {
        key: "send",
        value: function value(t) {
          "open" === this.readyState && this.write(t);
        }
      }, {
        key: "onOpen",
        value: function value() {
          this.readyState = "open", this.writable = !0, this.emit("open");
        }
      }, {
        key: "onData",
        value: function value(t) {
          var e = u.decodePacket(t, this.socket.binaryType);
          this.onPacket(e);
        }
      }, {
        key: "onPacket",
        value: function value(t) {
          this.emit("packet", t);
        }
      }, {
        key: "onClose",
        value: function value() {
          this.readyState = "closed", this.emit("close");
        }
      }]) && o(e.prototype, n), r && o(e, r), a;
    }(n(1));

    t.exports = f;
  }, function (t, e) {
    e.encode = function (t) {
      var e = "";

      for (var n in t) {
        t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
      }

      return e;
    }, e.decode = function (t) {
      for (var e = {}, n = t.split("&"), r = 0, o = n.length; r < o; r++) {
        var i = n[r].split("=");
        e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
      }

      return e;
    };
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e, n) {
      return (o = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
        var r = function (t, e) {
          for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = a(t));) {
            ;
          }

          return t;
        }(t, e);

        if (r) {
          var o = Object.getOwnPropertyDescriptor(r, e);
          return o.get ? o.get.call(n) : o.value;
        }
      })(t, e, n || t);
    }

    function i(t, e) {
      return (i = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function s(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = a(t);

        if (e) {
          var o = a(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return c(this, n);
      };
    }

    function c(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function a(t) {
      return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    function u(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    function f(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function p(t, e, n) {
      return e && f(t.prototype, e), n && f(t, n), t;
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.Decoder = e.Encoder = e.PacketType = e.protocol = void 0;
    var l,
        h = n(1),
        y = n(30),
        d = n(15);
    e.protocol = 5, function (t) {
      t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
    }(l = e.PacketType || (e.PacketType = {}));

    var v = function () {
      function t() {
        u(this, t);
      }

      return p(t, [{
        key: "encode",
        value: function value(t) {
          return t.type !== l.EVENT && t.type !== l.ACK || !d.hasBinary(t) ? [this.encodeAsString(t)] : (t.type = t.type === l.EVENT ? l.BINARY_EVENT : l.BINARY_ACK, this.encodeAsBinary(t));
        }
      }, {
        key: "encodeAsString",
        value: function value(t) {
          var e = "" + t.type;
          return t.type !== l.BINARY_EVENT && t.type !== l.BINARY_ACK || (e += t.attachments + "-"), t.nsp && "/" !== t.nsp && (e += t.nsp + ","), null != t.id && (e += t.id), null != t.data && (e += JSON.stringify(t.data)), e;
        }
      }, {
        key: "encodeAsBinary",
        value: function value(t) {
          var e = y.deconstructPacket(t),
              n = this.encodeAsString(e.packet),
              r = e.buffers;
          return r.unshift(n), r;
        }
      }]), t;
    }();

    e.Encoder = v;

    var b = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && i(t, e);
      }(n, t);
      var e = s(n);

      function n() {
        return u(this, n), e.call(this);
      }

      return p(n, [{
        key: "add",
        value: function value(t) {
          var e;
          if ("string" == typeof t) (e = this.decodeString(t)).type === l.BINARY_EVENT || e.type === l.BINARY_ACK ? (this.reconstructor = new m(e), 0 === e.attachments && o(a(n.prototype), "emit", this).call(this, "decoded", e)) : o(a(n.prototype), "emit", this).call(this, "decoded", e);else {
            if (!d.isBinary(t) && !t.base64) throw new Error("Unknown type: " + t);
            if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
            (e = this.reconstructor.takeBinaryData(t)) && (this.reconstructor = null, o(a(n.prototype), "emit", this).call(this, "decoded", e));
          }
        }
      }, {
        key: "decodeString",
        value: function value(t) {
          var e = 0,
              r = {
            type: Number(t.charAt(0))
          };
          if (void 0 === l[r.type]) throw new Error("unknown packet type " + r.type);

          if (r.type === l.BINARY_EVENT || r.type === l.BINARY_ACK) {
            for (var o = e + 1; "-" !== t.charAt(++e) && e != t.length;) {
              ;
            }

            var i = t.substring(o, e);
            if (i != Number(i) || "-" !== t.charAt(e)) throw new Error("Illegal attachments");
            r.attachments = Number(i);
          }

          if ("/" === t.charAt(e + 1)) {
            for (var s = e + 1; ++e;) {
              if ("," === t.charAt(e)) break;
              if (e === t.length) break;
            }

            r.nsp = t.substring(s, e);
          } else r.nsp = "/";

          var c = t.charAt(e + 1);

          if ("" !== c && Number(c) == c) {
            for (var a = e + 1; ++e;) {
              var u = t.charAt(e);

              if (null == u || Number(u) != u) {
                --e;
                break;
              }

              if (e === t.length) break;
            }

            r.id = Number(t.substring(a, e + 1));
          }

          if (t.charAt(++e)) {
            var f = function (t) {
              try {
                return JSON.parse(t);
              } catch (t) {
                return !1;
              }
            }(t.substr(e));

            if (!n.isPayloadValid(r.type, f)) throw new Error("invalid payload");
            r.data = f;
          }

          return r;
        }
      }, {
        key: "destroy",
        value: function value() {
          this.reconstructor && this.reconstructor.finishedReconstruction();
        }
      }], [{
        key: "isPayloadValid",
        value: function value(t, e) {
          switch (t) {
            case l.CONNECT:
              return "object" === r(e);

            case l.DISCONNECT:
              return void 0 === e;

            case l.CONNECT_ERROR:
              return "string" == typeof e || "object" === r(e);

            case l.EVENT:
            case l.BINARY_EVENT:
              return Array.isArray(e) && e.length > 0;

            case l.ACK:
            case l.BINARY_ACK:
              return Array.isArray(e);
          }
        }
      }]), n;
    }(h);

    e.Decoder = b;

    var m = function () {
      function t(e) {
        u(this, t), this.packet = e, this.buffers = [], this.reconPack = e;
      }

      return p(t, [{
        key: "takeBinaryData",
        value: function value(t) {
          if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
            var e = y.reconstructPacket(this.reconPack, this.buffers);
            return this.finishedReconstruction(), e;
          }

          return null;
        }
      }, {
        key: "finishedReconstruction",
        value: function value() {
          this.reconPack = null, this.buffers = [];
        }
      }]), t;
    }();
  }, function (t, e) {
    var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        r = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];

    t.exports = function (t) {
      var e = t,
          o = t.indexOf("["),
          i = t.indexOf("]");
      -1 != o && -1 != i && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));

      for (var s, c, a = n.exec(t || ""), u = {}, f = 14; f--;) {
        u[r[f]] = a[f] || "";
      }

      return -1 != o && -1 != i && (u.source = e, u.host = u.host.substring(1, u.host.length - 1).replace(/;/g, ":"), u.authority = u.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), u.ipv6uri = !0), u.pathNames = function (t, e) {
        var n = e.replace(/\/{2,9}/g, "/").split("/");
        "/" != e.substr(0, 1) && 0 !== e.length || n.splice(0, 1);
        "/" == e.substr(e.length - 1, 1) && n.splice(n.length - 1, 1);
        return n;
      }(0, u.path), u.queryKey = (s = u.query, c = {}, s.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (t, e, n) {
        e && (c[e] = n);
      }), c), u;
    };
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function i(t, e) {
      return (i = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function s(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = a(t);

        if (e) {
          var o = a(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return c(this, n);
      };
    }

    function c(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function a(t) {
      return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.Manager = void 0;

    var u = n(20),
        f = n(14),
        p = n(5),
        l = n(16),
        h = n(31),
        y = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && i(t, e);
      }(y, t);
      var e,
          n,
          c,
          a = s(y);

      function y(t, e) {
        var n;
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, y), (n = a.call(this)).nsps = {}, n.subs = [], t && "object" === r(t) && (e = t, t = void 0), (e = e || {}).path = e.path || "/socket.io", n.opts = e, n.reconnection(!1 !== e.reconnection), n.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), n.reconnectionDelay(e.reconnectionDelay || 1e3), n.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), n.randomizationFactor(e.randomizationFactor || .5), n.backoff = new h({
          min: n.reconnectionDelay(),
          max: n.reconnectionDelayMax(),
          jitter: n.randomizationFactor()
        }), n.timeout(null == e.timeout ? 2e4 : e.timeout), n._readyState = "closed", n.uri = t;
        var o = e.parser || p;
        return n.encoder = new o.Encoder(), n.decoder = new o.Decoder(), n._autoConnect = !1 !== e.autoConnect, n._autoConnect && n.open(), n;
      }

      return e = y, (n = [{
        key: "reconnection",
        value: function value(t) {
          return arguments.length ? (this._reconnection = !!t, this) : this._reconnection;
        }
      }, {
        key: "reconnectionAttempts",
        value: function value(t) {
          return void 0 === t ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this);
        }
      }, {
        key: "reconnectionDelay",
        value: function value(t) {
          var e;
          return void 0 === t ? this._reconnectionDelay : (this._reconnectionDelay = t, null === (e = this.backoff) || void 0 === e || e.setMin(t), this);
        }
      }, {
        key: "randomizationFactor",
        value: function value(t) {
          var e;
          return void 0 === t ? this._randomizationFactor : (this._randomizationFactor = t, null === (e = this.backoff) || void 0 === e || e.setJitter(t), this);
        }
      }, {
        key: "reconnectionDelayMax",
        value: function value(t) {
          var e;
          return void 0 === t ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, null === (e = this.backoff) || void 0 === e || e.setMax(t), this);
        }
      }, {
        key: "timeout",
        value: function value(t) {
          return arguments.length ? (this._timeout = t, this) : this._timeout;
        }
      }, {
        key: "maybeReconnectOnOpen",
        value: function value() {
          !this._reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
        }
      }, {
        key: "open",
        value: function value(t) {
          var e = this;
          if (~this._readyState.indexOf("open")) return this;
          this.engine = u(this.uri, this.opts);
          var n = this.engine,
              r = this;
          this._readyState = "opening", this.skipReconnect = !1;
          var o = l.on(n, "open", function () {
            r.onopen(), t && t();
          }),
              i = l.on(n, "error", function (n) {
            r.cleanup(), r._readyState = "closed", e.emitReserved("error", n), t ? t(n) : r.maybeReconnectOnOpen();
          });

          if (!1 !== this._timeout) {
            var s = this._timeout;
            0 === s && o();
            var c = setTimeout(function () {
              o(), n.close(), n.emit("error", new Error("timeout"));
            }, s);
            this.opts.autoUnref && c.unref(), this.subs.push(function () {
              clearTimeout(c);
            });
          }

          return this.subs.push(o), this.subs.push(i), this;
        }
      }, {
        key: "connect",
        value: function value(t) {
          return this.open(t);
        }
      }, {
        key: "onopen",
        value: function value() {
          this.cleanup(), this._readyState = "open", this.emitReserved("open");
          var t = this.engine;
          this.subs.push(l.on(t, "ping", this.onping.bind(this)), l.on(t, "data", this.ondata.bind(this)), l.on(t, "error", this.onerror.bind(this)), l.on(t, "close", this.onclose.bind(this)), l.on(this.decoder, "decoded", this.ondecoded.bind(this)));
        }
      }, {
        key: "onping",
        value: function value() {
          this.emitReserved("ping");
        }
      }, {
        key: "ondata",
        value: function value(t) {
          this.decoder.add(t);
        }
      }, {
        key: "ondecoded",
        value: function value(t) {
          this.emitReserved("packet", t);
        }
      }, {
        key: "onerror",
        value: function value(t) {
          this.emitReserved("error", t);
        }
      }, {
        key: "socket",
        value: function value(t, e) {
          var n = this.nsps[t];
          return n || (n = new f.Socket(this, t, e), this.nsps[t] = n), n;
        }
      }, {
        key: "_destroy",
        value: function value(t) {
          for (var e = 0, n = Object.keys(this.nsps); e < n.length; e++) {
            var r = n[e];
            if (this.nsps[r].active) return;
          }

          this._close();
        }
      }, {
        key: "_packet",
        value: function value(t) {
          for (var e = this.encoder.encode(t), n = 0; n < e.length; n++) {
            this.engine.write(e[n], t.options);
          }
        }
      }, {
        key: "cleanup",
        value: function value() {
          this.subs.forEach(function (t) {
            return t();
          }), this.subs.length = 0, this.decoder.destroy();
        }
      }, {
        key: "_close",
        value: function value() {
          this.skipReconnect = !0, this._reconnecting = !1, "opening" === this._readyState && this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.engine && this.engine.close();
        }
      }, {
        key: "disconnect",
        value: function value() {
          return this._close();
        }
      }, {
        key: "onclose",
        value: function value(t) {
          this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", t), this._reconnection && !this.skipReconnect && this.reconnect();
        }
      }, {
        key: "reconnect",
        value: function value() {
          var t = this;
          if (this._reconnecting || this.skipReconnect) return this;
          var e = this;
          if (this.backoff.attempts >= this._reconnectionAttempts) this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;else {
            var n = this.backoff.duration();
            this._reconnecting = !0;
            var r = setTimeout(function () {
              e.skipReconnect || (t.emitReserved("reconnect_attempt", e.backoff.attempts), e.skipReconnect || e.open(function (n) {
                n ? (e._reconnecting = !1, e.reconnect(), t.emitReserved("reconnect_error", n)) : e.onreconnect();
              }));
            }, n);
            this.opts.autoUnref && r.unref(), this.subs.push(function () {
              clearTimeout(r);
            });
          }
        }
      }, {
        key: "onreconnect",
        value: function value() {
          var t = this.backoff.attempts;
          this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", t);
        }
      }]) && o(e.prototype, n), c && o(e, c), y;
    }(n(17).StrictEventEmitter);

    e.Manager = y;
  }, function (t, e, n) {
    var r = n(9),
        o = n(23),
        i = n(27),
        s = n(28);
    e.polling = function (t) {
      var e = !1,
          n = !1,
          s = !1 !== t.jsonp;

      if ("undefined" != typeof location) {
        var c = "https:" === location.protocol,
            a = location.port;
        a || (a = c ? 443 : 80), e = t.hostname !== location.hostname || a !== t.port, n = t.secure !== c;
      }

      if (t.xdomain = e, t.xscheme = n, "open" in new r(t) && !t.forceJSONP) return new o(t);
      if (!s) throw new Error("JSONP disabled");
      return new i(t);
    }, e.websocket = s;
  }, function (t, e, n) {
    var r = n(22),
        o = n(2);

    t.exports = function (t) {
      var e = t.xdomain,
          n = t.xscheme,
          i = t.enablesXDR;

      try {
        if ("undefined" != typeof XMLHttpRequest && (!e || r)) return new XMLHttpRequest();
      } catch (t) {}

      try {
        if ("undefined" != typeof XDomainRequest && !n && i) return new XDomainRequest();
      } catch (t) {}

      if (!e) try {
        return new o[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
      } catch (t) {}
    };
  }, function (t, e, n) {
    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    function i(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function s(t, e) {
      return (s = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function c(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = u(t);

        if (e) {
          var o = u(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return a(this, n);
      };
    }

    function a(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function u(t) {
      return (u = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    var f = n(3),
        p = n(4),
        l = n(0),
        h = n(12),
        y = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && s(t, e);
      }(u, t);
      var e,
          n,
          r,
          a = c(u);

      function u() {
        return o(this, u), a.apply(this, arguments);
      }

      return e = u, (n = [{
        key: "doOpen",
        value: function value() {
          this.poll();
        }
      }, {
        key: "pause",
        value: function value(t) {
          var e = this;

          function n() {
            e.readyState = "paused", t();
          }

          if (this.readyState = "pausing", this.polling || !this.writable) {
            var r = 0;
            this.polling && (r++, this.once("pollComplete", function () {
              --r || n();
            })), this.writable || (r++, this.once("drain", function () {
              --r || n();
            }));
          } else n();
        }
      }, {
        key: "poll",
        value: function value() {
          this.polling = !0, this.doPoll(), this.emit("poll");
        }
      }, {
        key: "onData",
        value: function value(t) {
          var e = this;
          l.decodePayload(t, this.socket.binaryType).forEach(function (t, n, r) {
            if ("opening" === e.readyState && "open" === t.type && e.onOpen(), "close" === t.type) return e.onClose(), !1;
            e.onPacket(t);
          }), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState && this.poll());
        }
      }, {
        key: "doClose",
        value: function value() {
          var t = this;

          function e() {
            t.write([{
              type: "close"
            }]);
          }

          "open" === this.readyState ? e() : this.once("open", e);
        }
      }, {
        key: "write",
        value: function value(t) {
          var e = this;
          this.writable = !1, l.encodePayload(t, function (t) {
            e.doWrite(t, function () {
              e.writable = !0, e.emit("drain");
            });
          });
        }
      }, {
        key: "uri",
        value: function value() {
          var t = this.query || {},
              e = this.opts.secure ? "https" : "http",
              n = "";
          return !1 !== this.opts.timestampRequests && (t[this.opts.timestampParam] = h()), this.supportsBinary || t.sid || (t.b64 = 1), t = p.encode(t), this.opts.port && ("https" === e && 443 !== Number(this.opts.port) || "http" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port), t.length && (t = "?" + t), e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + t;
        }
      }, {
        key: "name",
        get: function get() {
          return "polling";
        }
      }]) && i(e.prototype, n), r && i(e, r), u;
    }(f);

    t.exports = y;
  }, function (t, e) {
    var n = Object.create(null);
    n.open = "0", n.close = "1", n.ping = "2", n.pong = "3", n.message = "4", n.upgrade = "5", n.noop = "6";
    var r = Object.create(null);
    Object.keys(n).forEach(function (t) {
      r[n[t]] = t;
    });
    t.exports = {
      PACKET_TYPES: n,
      PACKET_TYPES_REVERSE: r,
      ERROR_PACKET: {
        type: "error",
        data: "parser error"
      }
    };
  }, function (t, e, n) {
    "use strict";

    var r,
        o = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
        i = {},
        s = 0,
        c = 0;

    function a(t) {
      var e = "";

      do {
        e = o[t % 64] + e, t = Math.floor(t / 64);
      } while (t > 0);

      return e;
    }

    function u() {
      var t = a(+new Date());
      return t !== r ? (s = 0, r = t) : t + "." + a(s++);
    }

    for (; c < 64; c++) {
      i[o[c]] = c;
    }

    u.encode = a, u.decode = function (t) {
      var e = 0;

      for (c = 0; c < t.length; c++) {
        e = 64 * e + i[t.charAt(c)];
      }

      return e;
    }, t.exports = u;
  }, function (t, e) {
    t.exports.pick = function (t) {
      for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) {
        n[r - 1] = arguments[r];
      }

      return n.reduce(function (e, n) {
        return t.hasOwnProperty(n) && (e[n] = t[n]), e;
      }, {});
    };
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e) {
      var _n;

      if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
        if (Array.isArray(t) || (_n = function (t, e) {
          if (!t) return;
          if ("string" == typeof t) return i(t, e);
          var n = Object.prototype.toString.call(t).slice(8, -1);
          "Object" === n && t.constructor && (n = t.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(t);
          if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e);
        }(t)) || e && t && "number" == typeof t.length) {
          _n && (t = _n);

          var r = 0,
              o = function o() {};

          return {
            s: o,
            n: function n() {
              return r >= t.length ? {
                done: !0
              } : {
                done: !1,
                value: t[r++]
              };
            },
            e: function e(t) {
              throw t;
            },
            f: o
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var s,
          c = !0,
          a = !1;
      return {
        s: function s() {
          _n = t[Symbol.iterator]();
        },
        n: function n() {
          var t = _n.next();

          return c = t.done, t;
        },
        e: function e(t) {
          a = !0, s = t;
        },
        f: function f() {
          try {
            c || null == _n.return || _n.return();
          } finally {
            if (a) throw s;
          }
        }
      };
    }

    function i(t, e) {
      (null == e || e > t.length) && (e = t.length);

      for (var n = 0, r = new Array(e); n < e; n++) {
        r[n] = t[n];
      }

      return r;
    }

    function s(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function c(t, e, n) {
      return (c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
        var r = function (t, e) {
          for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = p(t));) {
            ;
          }

          return t;
        }(t, e);

        if (r) {
          var o = Object.getOwnPropertyDescriptor(r, e);
          return o.get ? o.get.call(n) : o.value;
        }
      })(t, e, n || t);
    }

    function a(t, e) {
      return (a = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function u(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = p(t);

        if (e) {
          var o = p(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return f(this, n);
      };
    }

    function f(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function p(t) {
      return (p = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.Socket = void 0;

    var l = n(5),
        h = n(16),
        y = n(17),
        d = Object.freeze({
      connect: 1,
      connect_error: 1,
      disconnect: 1,
      disconnecting: 1,
      newListener: 1,
      removeListener: 1
    }),
        v = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && a(t, e);
      }(f, t);
      var e,
          n,
          r,
          i = u(f);

      function f(t, e, n) {
        var r;
        return function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, f), (r = i.call(this)).receiveBuffer = [], r.sendBuffer = [], r.ids = 0, r.acks = {}, r.flags = {}, r.io = t, r.nsp = e, r.ids = 0, r.acks = {}, r.receiveBuffer = [], r.sendBuffer = [], r.connected = !1, r.disconnected = !0, r.flags = {}, n && n.auth && (r.auth = n.auth), r.io._autoConnect && r.open(), r;
      }

      return e = f, (n = [{
        key: "subEvents",
        value: function value() {
          if (!this.subs) {
            var t = this.io;
            this.subs = [h.on(t, "open", this.onopen.bind(this)), h.on(t, "packet", this.onpacket.bind(this)), h.on(t, "error", this.onerror.bind(this)), h.on(t, "close", this.onclose.bind(this))];
          }
        }
      }, {
        key: "connect",
        value: function value() {
          return this.connected || (this.subEvents(), this.io._reconnecting || this.io.open(), "open" === this.io._readyState && this.onopen()), this;
        }
      }, {
        key: "open",
        value: function value() {
          return this.connect();
        }
      }, {
        key: "send",
        value: function value() {
          for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) {
            e[n] = arguments[n];
          }

          return e.unshift("message"), this.emit.apply(this, e), this;
        }
      }, {
        key: "emit",
        value: function value(t) {
          if (d.hasOwnProperty(t)) throw new Error('"' + t + '" is a reserved event name');

          for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) {
            n[r - 1] = arguments[r];
          }

          n.unshift(t);
          var o = {
            type: l.PacketType.EVENT,
            data: n,
            options: {}
          };
          o.options.compress = !1 !== this.flags.compress, "function" == typeof n[n.length - 1] && (this.acks[this.ids] = n.pop(), o.id = this.ids++);
          var i = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable,
              s = this.flags.volatile && (!i || !this.connected);
          return s || (this.connected ? this.packet(o) : this.sendBuffer.push(o)), this.flags = {}, this;
        }
      }, {
        key: "packet",
        value: function value(t) {
          t.nsp = this.nsp, this.io._packet(t);
        }
      }, {
        key: "onopen",
        value: function value() {
          var t = this;
          "function" == typeof this.auth ? this.auth(function (e) {
            t.packet({
              type: l.PacketType.CONNECT,
              data: e
            });
          }) : this.packet({
            type: l.PacketType.CONNECT,
            data: this.auth
          });
        }
      }, {
        key: "onerror",
        value: function value(t) {
          this.connected || this.emitReserved("connect_error", t);
        }
      }, {
        key: "onclose",
        value: function value(t) {
          this.connected = !1, this.disconnected = !0, delete this.id, this.emitReserved("disconnect", t);
        }
      }, {
        key: "onpacket",
        value: function value(t) {
          if (t.nsp === this.nsp) switch (t.type) {
            case l.PacketType.CONNECT:
              if (t.data && t.data.sid) {
                var e = t.data.sid;
                this.onconnect(e);
              } else this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));

              break;

            case l.PacketType.EVENT:
            case l.PacketType.BINARY_EVENT:
              this.onevent(t);
              break;

            case l.PacketType.ACK:
            case l.PacketType.BINARY_ACK:
              this.onack(t);
              break;

            case l.PacketType.DISCONNECT:
              this.ondisconnect();
              break;

            case l.PacketType.CONNECT_ERROR:
              var n = new Error(t.data.message);
              n.data = t.data.data, this.emitReserved("connect_error", n);
          }
        }
      }, {
        key: "onevent",
        value: function value(t) {
          var e = t.data || [];
          null != t.id && e.push(this.ack(t.id)), this.connected ? this.emitEvent(e) : this.receiveBuffer.push(Object.freeze(e));
        }
      }, {
        key: "emitEvent",
        value: function value(t) {
          if (this._anyListeners && this._anyListeners.length) {
            var e,
                n = o(this._anyListeners.slice());

            try {
              for (n.s(); !(e = n.n()).done;) {
                e.value.apply(this, t);
              }
            } catch (t) {
              n.e(t);
            } finally {
              n.f();
            }
          }

          c(p(f.prototype), "emit", this).apply(this, t);
        }
      }, {
        key: "ack",
        value: function value(t) {
          var e = this,
              n = !1;
          return function () {
            if (!n) {
              n = !0;

              for (var r = arguments.length, o = new Array(r), i = 0; i < r; i++) {
                o[i] = arguments[i];
              }

              e.packet({
                type: l.PacketType.ACK,
                id: t,
                data: o
              });
            }
          };
        }
      }, {
        key: "onack",
        value: function value(t) {
          var e = this.acks[t.id];
          "function" == typeof e && (e.apply(this, t.data), delete this.acks[t.id]);
        }
      }, {
        key: "onconnect",
        value: function value(t) {
          this.id = t, this.connected = !0, this.disconnected = !1, this.emitReserved("connect"), this.emitBuffered();
        }
      }, {
        key: "emitBuffered",
        value: function value() {
          var t = this;
          this.receiveBuffer.forEach(function (e) {
            return t.emitEvent(e);
          }), this.receiveBuffer = [], this.sendBuffer.forEach(function (e) {
            return t.packet(e);
          }), this.sendBuffer = [];
        }
      }, {
        key: "ondisconnect",
        value: function value() {
          this.destroy(), this.onclose("io server disconnect");
        }
      }, {
        key: "destroy",
        value: function value() {
          this.subs && (this.subs.forEach(function (t) {
            return t();
          }), this.subs = void 0), this.io._destroy(this);
        }
      }, {
        key: "disconnect",
        value: function value() {
          return this.connected && this.packet({
            type: l.PacketType.DISCONNECT
          }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
        }
      }, {
        key: "close",
        value: function value() {
          return this.disconnect();
        }
      }, {
        key: "compress",
        value: function value(t) {
          return this.flags.compress = t, this;
        }
      }, {
        key: "onAny",
        value: function value(t) {
          return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this;
        }
      }, {
        key: "prependAny",
        value: function value(t) {
          return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this;
        }
      }, {
        key: "offAny",
        value: function value(t) {
          if (!this._anyListeners) return this;

          if (t) {
            for (var e = this._anyListeners, n = 0; n < e.length; n++) {
              if (t === e[n]) return e.splice(n, 1), this;
            }
          } else this._anyListeners = [];

          return this;
        }
      }, {
        key: "listenersAny",
        value: function value() {
          return this._anyListeners || [];
        }
      }, {
        key: "active",
        get: function get() {
          return !!this.subs;
        }
      }, {
        key: "volatile",
        get: function get() {
          return this.flags.volatile = !0, this;
        }
      }]) && s(e.prototype, n), r && s(e, r), f;
    }(y.StrictEventEmitter);

    e.Socket = v;
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.hasBinary = e.isBinary = void 0;
    var o = "function" == typeof ArrayBuffer,
        i = Object.prototype.toString,
        s = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === i.call(Blob),
        c = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === i.call(File);

    function a(t) {
      return o && (t instanceof ArrayBuffer || function (t) {
        return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer;
      }(t)) || s && t instanceof Blob || c && t instanceof File;
    }

    e.isBinary = a, e.hasBinary = function t(e, n) {
      if (!e || "object" !== r(e)) return !1;

      if (Array.isArray(e)) {
        for (var o = 0, i = e.length; o < i; o++) {
          if (t(e[o])) return !0;
        }

        return !1;
      }

      if (a(e)) return !0;
      if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length) return t(e.toJSON(), !0);

      for (var s in e) {
        if (Object.prototype.hasOwnProperty.call(e, s) && t(e[s])) return !0;
      }

      return !1;
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.on = void 0, e.on = function (t, e, n) {
      return t.on(e, n), function () {
        t.off(e, n);
      };
    };
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    function i(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function s(t, e, n) {
      return (s = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
        var r = function (t, e) {
          for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = f(t));) {
            ;
          }

          return t;
        }(t, e);

        if (r) {
          var o = Object.getOwnPropertyDescriptor(r, e);
          return o.get ? o.get.call(n) : o.value;
        }
      })(t, e, n || t);
    }

    function c(t, e) {
      return (c = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function a(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = f(t);

        if (e) {
          var o = f(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return u(this, n);
      };
    }

    function u(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function f(t) {
      return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.StrictEventEmitter = void 0;

    var p = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && c(t, e);
      }(p, t);
      var e,
          n,
          r,
          u = a(p);

      function p() {
        return o(this, p), u.apply(this, arguments);
      }

      return e = p, (n = [{
        key: "on",
        value: function value(t, e) {
          return s(f(p.prototype), "on", this).call(this, t, e), this;
        }
      }, {
        key: "once",
        value: function value(t, e) {
          return s(f(p.prototype), "once", this).call(this, t, e), this;
        }
      }, {
        key: "emit",
        value: function value(t) {
          for (var e, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) {
            r[o - 1] = arguments[o];
          }

          return (e = s(f(p.prototype), "emit", this)).call.apply(e, [this, t].concat(r)), this;
        }
      }, {
        key: "emitReserved",
        value: function value(t) {
          for (var e, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) {
            r[o - 1] = arguments[o];
          }

          return (e = s(f(p.prototype), "emit", this)).call.apply(e, [this, t].concat(r)), this;
        }
      }, {
        key: "listeners",
        value: function value(t) {
          return s(f(p.prototype), "listeners", this).call(this, t);
        }
      }]) && i(e.prototype, n), r && i(e, r), p;
    }(n(1));

    e.StrictEventEmitter = p;
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.Socket = e.io = e.Manager = e.protocol = void 0;
    var o = n(19),
        i = n(7),
        s = n(14);
    Object.defineProperty(e, "Socket", {
      enumerable: !0,
      get: function get() {
        return s.Socket;
      }
    }), t.exports = e = a;
    var c = e.managers = {};

    function a(t, e) {
      "object" === r(t) && (e = t, t = void 0), e = e || {};
      var n,
          s = o.url(t, e.path),
          a = s.source,
          u = s.id,
          f = s.path,
          p = c[u] && f in c[u].nsps;
      return e.forceNew || e["force new connection"] || !1 === e.multiplex || p ? n = new i.Manager(a, e) : (c[u] || (c[u] = new i.Manager(a, e)), n = c[u]), s.query && !e.query && (e.query = s.queryKey), n.socket(s.path, e);
    }

    e.io = a;
    var u = n(5);
    Object.defineProperty(e, "protocol", {
      enumerable: !0,
      get: function get() {
        return u.protocol;
      }
    }), e.connect = a;
    var f = n(7);
    Object.defineProperty(e, "Manager", {
      enumerable: !0,
      get: function get() {
        return f.Manager;
      }
    }), e.default = a;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.url = void 0;
    var r = n(6);

    e.url = function (t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
          n = arguments.length > 2 ? arguments[2] : void 0,
          o = t;
      n = n || "undefined" != typeof location && location, null == t && (t = n.protocol + "//" + n.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t), /^(https?|wss?):\/\//.test(t) || (t = void 0 !== n ? n.protocol + "//" + t : "https://" + t), o = r(t)), o.port || (/^(http|ws)$/.test(o.protocol) ? o.port = "80" : /^(http|ws)s$/.test(o.protocol) && (o.port = "443")), o.path = o.path || "/";
      var i = -1 !== o.host.indexOf(":"),
          s = i ? "[" + o.host + "]" : o.host;
      return o.id = o.protocol + "://" + s + ":" + o.port + e, o.href = o.protocol + "://" + s + (n && n.port === o.port ? "" : ":" + o.port), o;
    };
  }, function (t, e, n) {
    var r = n(21);
    t.exports = function (t, e) {
      return new r(t, e);
    }, t.exports.Socket = r, t.exports.protocol = r.protocol, t.exports.Transport = n(3), t.exports.transports = n(8), t.exports.parser = n(0);
  }, function (t, e, n) {
    function r() {
      return (r = Object.assign || function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];

          for (var r in n) {
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
          }
        }

        return t;
      }).apply(this, arguments);
    }

    function o(t) {
      return (o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function i(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    function s(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function c(t, e) {
      return (c = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function a(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = f(t);

        if (e) {
          var o = f(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return u(this, n);
      };
    }

    function u(t, e) {
      return !e || "object" !== o(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function f(t) {
      return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    var p = n(8),
        l = n(1),
        h = n(0),
        y = n(6),
        d = n(4),
        v = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && c(t, e);
      }(l, t);
      var e,
          n,
          u,
          f = a(l);

      function l(t) {
        var e,
            n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return i(this, l), e = f.call(this), t && "object" === o(t) && (n = t, t = null), t ? (t = y(t), n.hostname = t.host, n.secure = "https" === t.protocol || "wss" === t.protocol, n.port = t.port, t.query && (n.query = t.query)) : n.host && (n.hostname = y(n.host).host), e.secure = null != n.secure ? n.secure : "undefined" != typeof location && "https:" === location.protocol, n.hostname && !n.port && (n.port = e.secure ? "443" : "80"), e.hostname = n.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), e.port = n.port || ("undefined" != typeof location && location.port ? location.port : e.secure ? 443 : 80), e.transports = n.transports || ["polling", "websocket"], e.readyState = "", e.writeBuffer = [], e.prevBufferLen = 0, e.opts = r({
          path: "/engine.io",
          agent: !1,
          withCredentials: !1,
          upgrade: !0,
          jsonp: !0,
          timestampParam: "t",
          rememberUpgrade: !1,
          rejectUnauthorized: !0,
          perMessageDeflate: {
            threshold: 1024
          },
          transportOptions: {}
        }, n), e.opts.path = e.opts.path.replace(/\/$/, "") + "/", "string" == typeof e.opts.query && (e.opts.query = d.decode(e.opts.query)), e.id = null, e.upgrades = null, e.pingInterval = null, e.pingTimeout = null, e.pingTimeoutTimer = null, "function" == typeof addEventListener && (addEventListener("beforeunload", function () {
          e.transport && (e.transport.removeAllListeners(), e.transport.close());
        }, !1), "localhost" !== e.hostname && (e.offlineEventListener = function () {
          e.onClose("transport close");
        }, addEventListener("offline", e.offlineEventListener, !1))), e.open(), e;
      }

      return e = l, (n = [{
        key: "createTransport",
        value: function value(t) {
          var e = function (t) {
            var e = {};

            for (var n in t) {
              t.hasOwnProperty(n) && (e[n] = t[n]);
            }

            return e;
          }(this.opts.query);

          e.EIO = h.protocol, e.transport = t, this.id && (e.sid = this.id);
          var n = r({}, this.opts.transportOptions[t], this.opts, {
            query: e,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
          });
          return new p[t](n);
        }
      }, {
        key: "open",
        value: function value() {
          var t;
          if (this.opts.rememberUpgrade && l.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) t = "websocket";else {
            if (0 === this.transports.length) {
              var e = this;
              return void setTimeout(function () {
                e.emit("error", "No transports available");
              }, 0);
            }

            t = this.transports[0];
          }
          this.readyState = "opening";

          try {
            t = this.createTransport(t);
          } catch (t) {
            return this.transports.shift(), void this.open();
          }

          t.open(), this.setTransport(t);
        }
      }, {
        key: "setTransport",
        value: function value(t) {
          var e = this;
          this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", function () {
            e.onDrain();
          }).on("packet", function (t) {
            e.onPacket(t);
          }).on("error", function (t) {
            e.onError(t);
          }).on("close", function () {
            e.onClose("transport close");
          });
        }
      }, {
        key: "probe",
        value: function value(t) {
          var e = this.createTransport(t, {
            probe: 1
          }),
              n = !1,
              r = this;

          function o() {
            if (r.onlyBinaryUpgrades) {
              var t = !this.supportsBinary && r.transport.supportsBinary;
              n = n || t;
            }

            n || (e.send([{
              type: "ping",
              data: "probe"
            }]), e.once("packet", function (t) {
              if (!n) if ("pong" === t.type && "probe" === t.data) {
                if (r.upgrading = !0, r.emit("upgrading", e), !e) return;
                l.priorWebsocketSuccess = "websocket" === e.name, r.transport.pause(function () {
                  n || "closed" !== r.readyState && (f(), r.setTransport(e), e.send([{
                    type: "upgrade"
                  }]), r.emit("upgrade", e), e = null, r.upgrading = !1, r.flush());
                });
              } else {
                var o = new Error("probe error");
                o.transport = e.name, r.emit("upgradeError", o);
              }
            }));
          }

          function i() {
            n || (n = !0, f(), e.close(), e = null);
          }

          function s(t) {
            var n = new Error("probe error: " + t);
            n.transport = e.name, i(), r.emit("upgradeError", n);
          }

          function c() {
            s("transport closed");
          }

          function a() {
            s("socket closed");
          }

          function u(t) {
            e && t.name !== e.name && i();
          }

          function f() {
            e.removeListener("open", o), e.removeListener("error", s), e.removeListener("close", c), r.removeListener("close", a), r.removeListener("upgrading", u);
          }

          l.priorWebsocketSuccess = !1, e.once("open", o), e.once("error", s), e.once("close", c), this.once("close", a), this.once("upgrading", u), e.open();
        }
      }, {
        key: "onOpen",
        value: function value() {
          if (this.readyState = "open", l.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.opts.upgrade && this.transport.pause) for (var t = 0, e = this.upgrades.length; t < e; t++) {
            this.probe(this.upgrades[t]);
          }
        }
      }, {
        key: "onPacket",
        value: function value(t) {
          if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (this.emit("packet", t), this.emit("heartbeat"), t.type) {
            case "open":
              this.onHandshake(JSON.parse(t.data));
              break;

            case "ping":
              this.resetPingTimeout(), this.sendPacket("pong"), this.emit("pong");
              break;

            case "error":
              var e = new Error("server error");
              e.code = t.data, this.onError(e);
              break;

            case "message":
              this.emit("data", t.data), this.emit("message", t.data);
          }
        }
      }, {
        key: "onHandshake",
        value: function value(t) {
          this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && this.resetPingTimeout();
        }
      }, {
        key: "resetPingTimeout",
        value: function value() {
          var t = this;
          clearTimeout(this.pingTimeoutTimer), this.pingTimeoutTimer = setTimeout(function () {
            t.onClose("ping timeout");
          }, this.pingInterval + this.pingTimeout), this.opts.autoUnref && this.pingTimeoutTimer.unref();
        }
      }, {
        key: "onDrain",
        value: function value() {
          this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush();
        }
      }, {
        key: "flush",
        value: function value() {
          "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"));
        }
      }, {
        key: "write",
        value: function value(t, e, n) {
          return this.sendPacket("message", t, e, n), this;
        }
      }, {
        key: "send",
        value: function value(t, e, n) {
          return this.sendPacket("message", t, e, n), this;
        }
      }, {
        key: "sendPacket",
        value: function value(t, e, n, r) {
          if ("function" == typeof e && (r = e, e = void 0), "function" == typeof n && (r = n, n = null), "closing" !== this.readyState && "closed" !== this.readyState) {
            (n = n || {}).compress = !1 !== n.compress;
            var o = {
              type: t,
              data: e,
              options: n
            };
            this.emit("packetCreate", o), this.writeBuffer.push(o), r && this.once("flush", r), this.flush();
          }
        }
      }, {
        key: "close",
        value: function value() {
          var t = this;

          function e() {
            t.onClose("forced close"), t.transport.close();
          }

          function n() {
            t.removeListener("upgrade", n), t.removeListener("upgradeError", n), e();
          }

          function r() {
            t.once("upgrade", n), t.once("upgradeError", n);
          }

          return "opening" !== this.readyState && "open" !== this.readyState || (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", function () {
            this.upgrading ? r() : e();
          }) : this.upgrading ? r() : e()), this;
        }
      }, {
        key: "onError",
        value: function value(t) {
          l.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t);
        }
      }, {
        key: "onClose",
        value: function value(t, e) {
          "opening" !== this.readyState && "open" !== this.readyState && "closing" !== this.readyState || (clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), "function" == typeof removeEventListener && removeEventListener("offline", this.offlineEventListener, !1), this.readyState = "closed", this.id = null, this.emit("close", t, e), this.writeBuffer = [], this.prevBufferLen = 0);
        }
      }, {
        key: "filterUpgrades",
        value: function value(t) {
          for (var e = [], n = 0, r = t.length; n < r; n++) {
            ~this.transports.indexOf(t[n]) && e.push(t[n]);
          }

          return e;
        }
      }]) && s(e.prototype, n), u && s(e, u), l;
    }(l);

    v.priorWebsocketSuccess = !1, v.protocol = h.protocol, t.exports = v;
  }, function (t, e) {
    try {
      t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
    } catch (e) {
      t.exports = !1;
    }
  }, function (t, e, n) {
    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o() {
      return (o = Object.assign || function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];

          for (var r in n) {
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
          }
        }

        return t;
      }).apply(this, arguments);
    }

    function i(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }

    function s(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function c(t, e, n) {
      return e && s(t.prototype, e), n && s(t, n), t;
    }

    function a(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
      t.prototype = Object.create(e && e.prototype, {
        constructor: {
          value: t,
          writable: !0,
          configurable: !0
        }
      }), e && u(t, e);
    }

    function u(t, e) {
      return (u = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function f(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = l(t);

        if (e) {
          var o = l(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return p(this, n);
      };
    }

    function p(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function l(t) {
      return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    var h = n(9),
        y = n(10),
        d = n(1),
        v = n(13).pick,
        b = n(2);

    function m() {}

    var g = null != new h({
      xdomain: !1
    }).responseType,
        k = function (t) {
      a(n, t);
      var e = f(n);

      function n(t) {
        var r;

        if (i(this, n), r = e.call(this, t), "undefined" != typeof location) {
          var o = "https:" === location.protocol,
              s = location.port;
          s || (s = o ? 443 : 80), r.xd = "undefined" != typeof location && t.hostname !== location.hostname || s !== t.port, r.xs = t.secure !== o;
        }

        var c = t && t.forceBase64;
        return r.supportsBinary = g && !c, r;
      }

      return c(n, [{
        key: "request",
        value: function value() {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          return o(t, {
            xd: this.xd,
            xs: this.xs
          }, this.opts), new w(this.uri(), t);
        }
      }, {
        key: "doWrite",
        value: function value(t, e) {
          var n = this.request({
            method: "POST",
            data: t
          }),
              r = this;
          n.on("success", e), n.on("error", function (t) {
            r.onError("xhr post error", t);
          });
        }
      }, {
        key: "doPoll",
        value: function value() {
          var t = this.request(),
              e = this;
          t.on("data", function (t) {
            e.onData(t);
          }), t.on("error", function (t) {
            e.onError("xhr poll error", t);
          }), this.pollXhr = t;
        }
      }]), n;
    }(y),
        w = function (t) {
      a(n, t);
      var e = f(n);

      function n(t, r) {
        var o;
        return i(this, n), (o = e.call(this)).opts = r, o.method = r.method || "GET", o.uri = t, o.async = !1 !== r.async, o.data = void 0 !== r.data ? r.data : null, o.create(), o;
      }

      return c(n, [{
        key: "create",
        value: function value() {
          var t = v(this.opts, "agent", "enablesXDR", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
          t.xdomain = !!this.opts.xd, t.xscheme = !!this.opts.xs;
          var e = this.xhr = new h(t),
              r = this;

          try {
            e.open(this.method, this.uri, this.async);

            try {
              if (this.opts.extraHeaders) for (var o in e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0), this.opts.extraHeaders) {
                this.opts.extraHeaders.hasOwnProperty(o) && e.setRequestHeader(o, this.opts.extraHeaders[o]);
              }
            } catch (t) {}

            if ("POST" === this.method) try {
              e.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
            } catch (t) {}

            try {
              e.setRequestHeader("Accept", "*/*");
            } catch (t) {}

            "withCredentials" in e && (e.withCredentials = this.opts.withCredentials), this.opts.requestTimeout && (e.timeout = this.opts.requestTimeout), this.hasXDR() ? (e.onload = function () {
              r.onLoad();
            }, e.onerror = function () {
              r.onError(e.responseText);
            }) : e.onreadystatechange = function () {
              4 === e.readyState && (200 === e.status || 1223 === e.status ? r.onLoad() : setTimeout(function () {
                r.onError("number" == typeof e.status ? e.status : 0);
              }, 0));
            }, e.send(this.data);
          } catch (t) {
            return void setTimeout(function () {
              r.onError(t);
            }, 0);
          }

          "undefined" != typeof document && (this.index = n.requestsCount++, n.requests[this.index] = this);
        }
      }, {
        key: "onSuccess",
        value: function value() {
          this.emit("success"), this.cleanup();
        }
      }, {
        key: "onData",
        value: function value(t) {
          this.emit("data", t), this.onSuccess();
        }
      }, {
        key: "onError",
        value: function value(t) {
          this.emit("error", t), this.cleanup(!0);
        }
      }, {
        key: "cleanup",
        value: function value(t) {
          if (void 0 !== this.xhr && null !== this.xhr) {
            if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = m : this.xhr.onreadystatechange = m, t) try {
              this.xhr.abort();
            } catch (t) {}
            "undefined" != typeof document && delete n.requests[this.index], this.xhr = null;
          }
        }
      }, {
        key: "onLoad",
        value: function value() {
          var t = this.xhr.responseText;
          null !== t && this.onData(t);
        }
      }, {
        key: "hasXDR",
        value: function value() {
          return "undefined" != typeof XDomainRequest && !this.xs && this.enablesXDR;
        }
      }, {
        key: "abort",
        value: function value() {
          this.cleanup();
        }
      }]), n;
    }(d);

    if (w.requestsCount = 0, w.requests = {}, "undefined" != typeof document) if ("function" == typeof attachEvent) attachEvent("onunload", _);else if ("function" == typeof addEventListener) {
      addEventListener("onpagehide" in b ? "pagehide" : "unload", _, !1);
    }

    function _() {
      for (var t in w.requests) {
        w.requests.hasOwnProperty(t) && w.requests[t].abort();
      }
    }

    t.exports = k, t.exports.Request = w;
  }, function (t, e, n) {
    var r = n(11).PACKET_TYPES,
        o = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob),
        i = "function" == typeof ArrayBuffer,
        s = function s(t, e) {
      var n = new FileReader();
      return n.onload = function () {
        var t = n.result.split(",")[1];
        e("b" + t);
      }, n.readAsDataURL(t);
    };

    t.exports = function (t, e, n) {
      var c,
          a = t.type,
          u = t.data;
      return o && u instanceof Blob ? e ? n(u) : s(u, n) : i && (u instanceof ArrayBuffer || (c = u, "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(c) : c && c.buffer instanceof ArrayBuffer)) ? e ? n(u instanceof ArrayBuffer ? u : u.buffer) : s(new Blob([u]), n) : n(r[a] + (u || ""));
    };
  }, function (t, e, n) {
    var r,
        o = n(11),
        i = o.PACKET_TYPES_REVERSE,
        s = o.ERROR_PACKET;
    "function" == typeof ArrayBuffer && (r = n(26));

    var c = function c(t, e) {
      if (r) {
        var n = r.decode(t);
        return a(n, e);
      }

      return {
        base64: !0,
        data: t
      };
    },
        a = function a(t, e) {
      switch (e) {
        case "blob":
          return t instanceof ArrayBuffer ? new Blob([t]) : t;

        case "arraybuffer":
        default:
          return t;
      }
    };

    t.exports = function (t, e) {
      if ("string" != typeof t) return {
        type: "message",
        data: a(t, e)
      };
      var n = t.charAt(0);
      return "b" === n ? {
        type: "message",
        data: c(t.substring(1), e)
      } : i[n] ? t.length > 1 ? {
        type: i[n],
        data: t.substring(1)
      } : {
        type: i[n]
      } : s;
    };
  }, function (t, e) {
    !function (t) {
      "use strict";

      e.encode = function (e) {
        var n,
            r = new Uint8Array(e),
            o = r.length,
            i = "";

        for (n = 0; n < o; n += 3) {
          i += t[r[n] >> 2], i += t[(3 & r[n]) << 4 | r[n + 1] >> 4], i += t[(15 & r[n + 1]) << 2 | r[n + 2] >> 6], i += t[63 & r[n + 2]];
        }

        return o % 3 == 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 == 1 && (i = i.substring(0, i.length - 2) + "=="), i;
      }, e.decode = function (e) {
        var n,
            r,
            o,
            i,
            s,
            c = .75 * e.length,
            a = e.length,
            u = 0;
        "=" === e[e.length - 1] && (c--, "=" === e[e.length - 2] && c--);
        var f = new ArrayBuffer(c),
            p = new Uint8Array(f);

        for (n = 0; n < a; n += 4) {
          r = t.indexOf(e[n]), o = t.indexOf(e[n + 1]), i = t.indexOf(e[n + 2]), s = t.indexOf(e[n + 3]), p[u++] = r << 2 | o >> 4, p[u++] = (15 & o) << 4 | i >> 2, p[u++] = (3 & i) << 6 | 63 & s;
        }

        return f;
      };
    }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
  }, function (t, e, n) {
    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function i(t, e, n) {
      return (i = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
        var r = function (t, e) {
          for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = f(t));) {
            ;
          }

          return t;
        }(t, e);

        if (r) {
          var o = Object.getOwnPropertyDescriptor(r, e);
          return o.get ? o.get.call(n) : o.value;
        }
      })(t, e, n || t);
    }

    function s(t, e) {
      return (s = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function c(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = f(t);

        if (e) {
          var o = f(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return a(this, n);
      };
    }

    function a(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? u(t) : e;
    }

    function u(t) {
      if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return t;
    }

    function f(t) {
      return (f = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    var p,
        l = n(10),
        h = n(2),
        y = /\n/g,
        d = /\\n/g,
        v = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && s(t, e);
      }(l, t);
      var e,
          n,
          r,
          a = c(l);

      function l(t) {
        var e;
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, l), (e = a.call(this, t)).query = e.query || {}, p || (p = h.___eio = h.___eio || []), e.index = p.length;
        var n = u(e);
        return p.push(function (t) {
          n.onData(t);
        }), e.query.j = e.index, e;
      }

      return e = l, (n = [{
        key: "doClose",
        value: function value() {
          this.script && (this.script.onerror = function () {}, this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i(f(l.prototype), "doClose", this).call(this);
        }
      }, {
        key: "doPoll",
        value: function value() {
          var t = this,
              e = document.createElement("script");
          this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) {
            t.onError("jsonp poll error", e);
          };
          var n = document.getElementsByTagName("script")[0];
          n ? n.parentNode.insertBefore(e, n) : (document.head || document.body).appendChild(e), this.script = e, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function () {
            var t = document.createElement("iframe");
            document.body.appendChild(t), document.body.removeChild(t);
          }, 100);
        }
      }, {
        key: "doWrite",
        value: function value(t, e) {
          var n,
              r = this;

          if (!this.form) {
            var o = document.createElement("form"),
                i = document.createElement("textarea"),
                s = this.iframeId = "eio_iframe_" + this.index;
            o.className = "socketio", o.style.position = "absolute", o.style.top = "-1000px", o.style.left = "-1000px", o.target = s, o.method = "POST", o.setAttribute("accept-charset", "utf-8"), i.name = "d", o.appendChild(i), document.body.appendChild(o), this.form = o, this.area = i;
          }

          function c() {
            a(), e();
          }

          function a() {
            if (r.iframe) try {
              r.form.removeChild(r.iframe);
            } catch (t) {
              r.onError("jsonp polling iframe removal error", t);
            }

            try {
              var t = '<iframe src="javascript:0" name="' + r.iframeId + '">';
              n = document.createElement(t);
            } catch (t) {
              (n = document.createElement("iframe")).name = r.iframeId, n.src = "javascript:0";
            }

            n.id = r.iframeId, r.form.appendChild(n), r.iframe = n;
          }

          this.form.action = this.uri(), a(), t = t.replace(d, "\\\n"), this.area.value = t.replace(y, "\\n");

          try {
            this.form.submit();
          } catch (t) {}

          this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
            "complete" === r.iframe.readyState && c();
          } : this.iframe.onload = c;
        }
      }, {
        key: "supportsBinary",
        get: function get() {
          return !1;
        }
      }]) && o(e.prototype, n), r && o(e, r), l;
    }(l);

    t.exports = v;
  }, function (t, e, n) {
    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    function o(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
      }
    }

    function i(t, e) {
      return (i = Object.setPrototypeOf || function (t, e) {
        return t.__proto__ = e, t;
      })(t, e);
    }

    function s(t) {
      var e = function () {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;

        try {
          return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
        } catch (t) {
          return !1;
        }
      }();

      return function () {
        var n,
            r = a(t);

        if (e) {
          var o = a(this).constructor;
          n = Reflect.construct(r, arguments, o);
        } else n = r.apply(this, arguments);

        return c(this, n);
      };
    }

    function c(t, e) {
      return !e || "object" !== r(e) && "function" != typeof e ? function (t) {
        if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
      }(t) : e;
    }

    function a(t) {
      return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t);
      })(t);
    }

    var u = n(3),
        f = n(0),
        p = n(4),
        l = n(12),
        h = n(13).pick,
        y = n(29),
        d = y.WebSocket,
        v = y.usingBrowserWebSocket,
        b = y.defaultBinaryType,
        m = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(),
        g = function (t) {
      !function (t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && i(t, e);
      }(a, t);
      var e,
          n,
          r,
          c = s(a);

      function a(t) {
        var e;
        return function (t, e) {
          if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
        }(this, a), (e = c.call(this, t)).supportsBinary = !t.forceBase64, e;
      }

      return e = a, (n = [{
        key: "doOpen",
        value: function value() {
          if (this.check()) {
            var t = this.uri(),
                e = this.opts.protocols,
                n = m ? {} : h(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
            this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);

            try {
              this.ws = v && !m ? e ? new d(t, e) : new d(t) : new d(t, e, n);
            } catch (t) {
              return this.emit("error", t);
            }

            this.ws.binaryType = this.socket.binaryType || b, this.addEventListeners();
          }
        }
      }, {
        key: "addEventListeners",
        value: function value() {
          var t = this;
          this.ws.onopen = function () {
            t.opts.autoUnref && t.ws._socket.unref(), t.onOpen();
          }, this.ws.onclose = this.onClose.bind(this), this.ws.onmessage = function (e) {
            return t.onData(e.data);
          }, this.ws.onerror = function (e) {
            return t.onError("websocket error", e);
          };
        }
      }, {
        key: "write",
        value: function value(t) {
          var e = this;
          this.writable = !1;

          for (var n = t.length, r = 0, o = n; r < o; r++) {
            !function (t) {
              f.encodePacket(t, e.supportsBinary, function (r) {
                var o = {};
                v || (t.options && (o.compress = t.options.compress), e.opts.perMessageDeflate && ("string" == typeof r ? Buffer.byteLength(r) : r.length) < e.opts.perMessageDeflate.threshold && (o.compress = !1));

                try {
                  v ? e.ws.send(r) : e.ws.send(r, o);
                } catch (t) {}

                --n || (e.emit("flush"), setTimeout(function () {
                  e.writable = !0, e.emit("drain");
                }, 0));
              });
            }(t[r]);
          }
        }
      }, {
        key: "onClose",
        value: function value() {
          u.prototype.onClose.call(this);
        }
      }, {
        key: "doClose",
        value: function value() {
          void 0 !== this.ws && (this.ws.close(), this.ws = null);
        }
      }, {
        key: "uri",
        value: function value() {
          var t = this.query || {},
              e = this.opts.secure ? "wss" : "ws",
              n = "";
          return this.opts.port && ("wss" === e && 443 !== Number(this.opts.port) || "ws" === e && 80 !== Number(this.opts.port)) && (n = ":" + this.opts.port), this.opts.timestampRequests && (t[this.opts.timestampParam] = l()), this.supportsBinary || (t.b64 = 1), (t = p.encode(t)).length && (t = "?" + t), e + "://" + (-1 !== this.opts.hostname.indexOf(":") ? "[" + this.opts.hostname + "]" : this.opts.hostname) + n + this.opts.path + t;
        }
      }, {
        key: "check",
        value: function value() {
          return !(!d || "__initialize" in d && this.name === a.prototype.name);
        }
      }, {
        key: "name",
        get: function get() {
          return "websocket";
        }
      }]) && o(e.prototype, n), r && o(e, r), a;
    }(u);

    t.exports = g;
  }, function (t, e, n) {
    var r = n(2);
    t.exports = {
      WebSocket: r.WebSocket || r.MozWebSocket,
      usingBrowserWebSocket: !0,
      defaultBinaryType: "arraybuffer"
    };
  }, function (t, e, n) {
    "use strict";

    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
        return _typeof(t);
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : _typeof(t);
      })(t);
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.reconstructPacket = e.deconstructPacket = void 0;
    var o = n(15);
    e.deconstructPacket = function (t) {
      var e = [],
          n = t.data,
          i = t;
      return i.data = function t(e, n) {
        if (!e) return e;

        if (o.isBinary(e)) {
          var i = {
            _placeholder: !0,
            num: n.length
          };
          return n.push(e), i;
        }

        if (Array.isArray(e)) {
          for (var s = new Array(e.length), c = 0; c < e.length; c++) {
            s[c] = t(e[c], n);
          }

          return s;
        }

        if ("object" === r(e) && !(e instanceof Date)) {
          var a = {};

          for (var u in e) {
            e.hasOwnProperty(u) && (a[u] = t(e[u], n));
          }

          return a;
        }

        return e;
      }(n, e), i.attachments = e.length, {
        packet: i,
        buffers: e
      };
    }, e.reconstructPacket = function (t, e) {
      return t.data = function t(e, n) {
        if (!e) return e;
        if (e && e._placeholder) return n[e.num];
        if (Array.isArray(e)) for (var o = 0; o < e.length; o++) {
          e[o] = t(e[o], n);
        } else if ("object" === r(e)) for (var i in e) {
          e.hasOwnProperty(i) && (e[i] = t(e[i], n));
        }
        return e;
      }(t.data, e), t.attachments = void 0, t;
    };
  }, function (t, e) {
    function n(t) {
      t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
    }

    t.exports = n, n.prototype.duration = function () {
      var t = this.ms * Math.pow(this.factor, this.attempts++);

      if (this.jitter) {
        var e = Math.random(),
            n = Math.floor(e * this.jitter * t);
        t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n;
      }

      return 0 | Math.min(t, this.max);
    }, n.prototype.reset = function () {
      this.attempts = 0;
    }, n.prototype.setMin = function (t) {
      this.ms = t;
    }, n.prototype.setMax = function (t) {
      this.max = t;
    }, n.prototype.setJitter = function (t) {
      this.jitter = t;
    };
  }]);
});
},{"buffer":"node_modules/node-libs-browser/node_modules/buffer/index.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _socketIoMin = _interopRequireDefault(require("socket.io/client-dist/socket.io.min.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var acc = {};
var socket;

function requestOrientationPermission() {
  return _requestOrientationPermission.apply(this, arguments);
}

function _requestOrientationPermission() {
  _requestOrientationPermission = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var state;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof DeviceOrientationEvent.requestPermission == 'function')) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return DeviceOrientationEvent.requestPermission();

          case 3:
            state = _context.sent;

            if (!(state != 'granted')) {
              _context.next = 7;
              break;
            }

            document.querySelector('.dialog').innerHTML = 'granting permissions is required if you want to parttake in this experience';
            return _context.abrupt("return");

          case 7:
            window.addEventListener('deviceorientation', function (e) {
              document.querySelector('.x span').textContent = e.beta;
              document.querySelector('.y span').textContent = e.gamma;
              document.querySelector('.z span').textContent = e.alpha;
              acc.x = e.beta;
              acc.y = e.gamma;
              acc.z = e.alpha;
              socket.emit('REQ_UPDATE_INPUTS', acc);
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _requestOrientationPermission.apply(this, arguments);
}

window.addEventListener('load', function () {
  socket = (0, _socketIoMin.default)('http://localhost:8001');
  socket.on('connect', function () {
    console.log('Connected to websocket server');
  });
  document.addEventListener('click', function (e) {
    var target = e.target;

    if (target.nodeName == 'BUTTON') {
      requestOrientationPermission();
    }
  });
});
},{"socket.io/client-dist/socket.io.min.js":"node_modules/socket.io/client-dist/socket.io.min.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51475" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map