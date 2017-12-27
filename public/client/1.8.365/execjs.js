/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.1';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256;

  /** Used as default options for `_.trunc`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */
  var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
  var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0[xX]/;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to match words to create compound words. */
  var reWords = (function() {
    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
  }());

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'isFinite',
    'parseFloat', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled regexes. */
  var regexpEscapes = {
    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;

    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * ((order === 'asc' || order === true) ? 1 : -1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */
  function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
    if (leadingChar) {
      chr = regexpEscapes[chr];
    } else if (whitespaceChar) {
      chr = stringEscapes[chr];
    }
    return '\\' + chr;
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */
  function isSpace(charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See https://es5.github.io/#x11.1.5 for more details.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references. */
    var arrayProto = Array.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method references. */
    var ArrayBuffer = context.ArrayBuffer,
        clearTimeout = context.clearTimeout,
        parseFloat = context.parseFloat,
        pow = Math.pow,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        Set = getNative(context, 'Set'),
        setTimeout = context.setTimeout,
        splice = arrayProto.splice,
        Uint8Array = context.Uint8Array,
        WeakMap = getNative(context, 'WeakMap');

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeCreate = getNative(Object, 'create'),
        nativeFloor = Math.floor,
        nativeIsArray = getNative(Array, 'isArray'),
        nativeIsFinite = context.isFinite,
        nativeKeys = getNative(Object, 'keys'),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = getNative(Date, 'now'),
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used as references for `-Infinity` and `Infinity`. */
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = 4294967295,
        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */
    function LodashWrapper(value, chainAll, actions) {
      this.__wrapped__ = value;
      this.__actions__ = actions || [];
      this.__chain__ = !!chainAll;
    }

    /**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = POSITIVE_INFINITY;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = arrayCopy(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = arrayCopy(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = arrayCopy(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
        return baseWrapperValue((isRight && isArr) ? array.reverse() : array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */
    function MapCache() {
      this.__data__ = {};
    }

    /**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */
    function mapDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */
    function mapGet(key) {
      return key == '__proto__' ? undefined : this.__data__[key];
    }

    /**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }

    /**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */
    function mapSet(key, value) {
      if (key != '__proto__') {
        this.__data__[key] = value;
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var length = values ? values.length : 0;

      this.data = { 'hash': nativeCreate(null), 'set': new Set };
      while (length--) {
        this.push(values[length]);
      }
    }

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */
    function arrayConcat(array, other) {
      var index = -1,
          length = array.length,
          othIndex = -1,
          othLength = other.length,
          result = Array(length + othLength);

      while (++index < length) {
        result[index] = array[index];
      }
      while (++othIndex < othLength) {
        result[index++] = other[othIndex];
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function arrayCopy(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function arrayExtremum(array, iteratee, comparator, exValue) {
      var index = -1,
          length = array.length,
          computed = exValue,
          result = computed;

      while (++index < length) {
        var value = array[index],
            current = +iteratee(value);

        if (comparator(current, computed)) {
          computed = current;
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
          length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
      var length = array.length;
      if (initFromArray && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function arraySum(array, iteratee) {
      var length = array.length,
          result = 0;

      while (length--) {
        result += +iteratee(array[length]) || 0;
      }
      return result;
    }

    /**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : objectValue;
    }

    /**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
      return (objectValue === undefined || !hasOwnProperty.call(object, key))
        ? sourceValue
        : objectValue;
    }

    /**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */
    function assignWith(object, source, customizer) {
      var index = -1,
          props = keys(source),
          length = props.length;

      while (++index < length) {
        var key = props[index],
            value = object[key],
            result = customizer(value, source[key], key, object, source);

        if ((result === result ? (result !== value) : (value === value)) ||
            (value === undefined && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return source == null
        ? object
        : baseCopy(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(collection, props) {
      var index = -1,
          isNil = collection == null,
          isArr = !isNil && isArrayLike(collection),
          length = isArr ? collection.length : 0,
          propsLength = props.length,
          result = Array(propsLength);

      while(++index < propsLength) {
        var key = props[index];
        if (isArr) {
          result[index] = isIndex(key, length) ? collection[key] : undefined;
        } else {
          result[index] = isNil ? undefined : collection[key];
        }
      }
      return result;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, props, object) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return thisArg === undefined
          ? func
          : bindCallback(func, thisArg, argCount);
      }
      if (func == null) {
        return identity;
      }
      if (type == 'object') {
        return baseMatches(func);
      }
      return thisArg === undefined
        ? property(func)
        : baseMatchesProperty(func, thisArg);
    }

    /**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var tag = objToString.call(value),
            isFunc = tag == funcTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return baseAssign(result, value);
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      // Check for circular references and return its corresponding clone.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      // Add the source value to the stack of traversed objects and associate it with its clone.
      stackA.push(value);
      stackB.push(result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          object.prototype = prototype;
          var result = new object;
          object.prototype = undefined;
        }
        return result || {};
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
          result = [];

      if (!length) {
        return result;
      }
      var index = -1,
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
          valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon && value === value) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value, 0) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(collection, iteratee, comparator, exValue) {
      var computed = exValue,
          result = computed;

      baseEach(collection, function(value, index, collection) {
        var current = +iteratee(value, index, collection);
        if (comparator(current, computed) || (current === exValue && current === result)) {
          computed = current;
          result = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : (end >>> 0);
      start >>>= 0;

      while (start < length) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isObjectLike(value) && isArrayLike(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, isDeep, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      var index = -1,
          length = props.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (isFunction(object[key])) {
          result[++resIndex] = key;
        }
      }
      return result;
    }

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path, pathKey) {
      if (object == null) {
        return;
      }
      if (pathKey !== undefined && pathKey in toObject(object)) {
        path = [pathKey];
      }
      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      if (!isLoose) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      // Add `object` and `other` to the stack of traversed objects.
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = toObject(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value && (value !== undefined || (key in toObject(object)));
        };
      }
      return function(object) {
        return baseIsMatch(object, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      var isArr = isArray(path),
          isCommon = isKey(path) && isStrictComparable(srcValue),
          pathKey = (path + '');

      path = toPath(path);
      return function(object) {
        if (object == null) {
          return false;
        }
        var key = pathKey;
        object = toObject(object);
        if ((isArr || !isCommon) && !(key in object)) {
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          if (object == null) {
            return false;
          }
          key = last(path);
          object = toObject(object);
        }
        return object[key] === srcValue
          ? (srcValue !== undefined || (key in object))
          : baseIsEqual(srcValue, object[key], undefined, true);
      };
    }

    /**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */
    function baseMerge(object, source, customizer, stackA, stackB) {
      if (!isObject(object)) {
        return object;
      }
      var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
          props = isSrcArr ? undefined : keys(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObjectLike(srcValue)) {
          stackA || (stackA = []);
          stackB || (stackB = []);
          baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
        }
        else {
          var value = object[key],
              result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
              isCommon = result === undefined;

          if (isCommon) {
            result = srcValue;
          }
          if ((result !== undefined || (isSrcArr && !(key in object))) &&
              (isCommon || (result === result ? (result !== value) : (value === value)))) {
            object[key] = result;
          }
        }
      });
      return object;
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
      var length = stackA.length,
          srcValue = source[key];

      while (length--) {
        if (stackA[length] == srcValue) {
          object[key] = stackB[length];
          return;
        }
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
        if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
          result = isArray(value)
            ? value
            : (isArrayLike(value) ? arrayCopy(value) : []);
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          result = isArguments(value)
            ? toPlainObject(value)
            : (isPlainObject(value) ? value : {});
        }
        else {
          isCommon = false;
        }
      }
      // Add the source value to the stack of traversed objects and associate
      // it with its merged value.
      stackA.push(srcValue);
      stackB.push(result);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
      } else if (result === result ? (result !== value) : (value === value)) {
        object[key] = result;
      }
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      var pathKey = (path + '');
      path = toPath(path);
      return function(object) {
        return baseGet(object, path, pathKey);
      };
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0;
      while (length--) {
        var index = indexes[length];
        if (index != previous && isIndex(index)) {
          var previous = index;
          splice.call(array, index, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + nativeFloor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseSortByOrder(collection, iteratees, orders) {
      var callback = getCallback(),
          index = -1;

      iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });

      var result = baseMap(collection, function(value) {
        var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function baseSum(collection, iteratee) {
      var result = 0;
      baseEach(collection, function(value, index, collection) {
        result += +iteratee(value, index, collection) || 0;
      });
      return result;
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array.length,
          isCommon = indexOf == baseIndexOf,
          isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
          seen = isLarge ? createCache() : null,
          result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

        if (isCommon && value === value) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (indexOf(seen, computed, 0) < 0) {
          if (iteratee || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      var index = -1,
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      var index = -1,
          length = actions.length;

      while (++index < length) {
        var action = actions[index];
        result = action.func.apply(action.thisArg, arrayPush([result], action.args));
      }
      return result;
    }

    /**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return binaryIndexBy(array, value, identity, retHighest);
    }

    /**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (thisArg === undefined) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
        case 5: return function(value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
      }
      return function() {
        return func.apply(thisArg, arguments);
      };
    }

    /**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function bufferClone(buffer) {
      var result = new ArrayBuffer(buffer.byteLength),
          view = new Uint8Array(result);

      view.set(new Uint8Array(buffer));
      return result;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partials.length,
          result = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders) {
      var holdersIndex = -1,
          holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partials.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee, thisArg) {
        var result = initializer ? initializer() : {};
        iteratee = getCallback(iteratee, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, iteratee(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return restParam(function(object, sources) {
        var index = -1,
            length = object == null ? 0 : sources.length,
            customizer = length > 2 ? sources[length - 2] : undefined,
            guard = length > 2 ? sources[2] : undefined,
            thisArg = length > 1 ? sources[length - 1] : undefined;

        if (typeof customizer == 'function') {
          customizer = bindCallback(customizer, thisArg, 5);
          length -= 2;
        } else {
          customizer = typeof thisArg == 'function' ? thisArg : undefined;
          length -= (customizer ? 1 : 0);
        }
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
          return eachFunc(collection, iteratee);
        }
        var index = fromRight ? length : -1,
            iterable = toObject(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var iterable = toObject(object),
            props = keysFunc(object),
            length = props.length,
            index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length)) {
          var key = props[index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBindWrapper(func, thisArg) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(thisArg, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */
    function createCache(values) {
      return (nativeCreate && Set) ? new SetCache(values) : null;
    }

    /**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        var index = -1,
            array = words(deburr(string)),
            length = array.length,
            result = '';

        while (++index < length) {
          result = callback(result, array[index], index);
        }
        return result;
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */
    function createCurry(flag) {
      function curryFunc(func, arity, guard) {
        if (guard && isIterateeCall(func, arity, guard)) {
          arity = undefined;
        }
        var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
        result.placeholder = curryFunc.placeholder;
        return result;
      }
      return curryFunc;
    }

    /**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */
    function createDefaults(assigner, customizer) {
      return restParam(function(args) {
        var object = args[0];
        if (object == null) {
          return object;
        }
        args.push(customizer);
        return assigner.apply(undefined, args);
      });
    }

    /**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */
    function createExtremum(comparator, exValue) {
      return function(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
          iteratee = undefined;
        }
        iteratee = getCallback(iteratee, thisArg, 3);
        if (iteratee.length == 1) {
          collection = isArray(collection) ? collection : toIterable(collection);
          var result = arrayExtremum(collection, iteratee, comparator, exValue);
          if (!(collection.length && result === exValue)) {
            return result;
          }
        }
        return baseExtremum(collection, iteratee, comparator, exValue);
      };
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFind(eachFunc, fromRight) {
      return function(collection, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        if (isArray(collection)) {
          var index = baseFindIndex(collection, predicate, fromRight);
          return index > -1 ? collection[index] : undefined;
        }
        return baseFind(collection, predicate, eachFunc);
      };
    }

    /**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFindIndex(fromRight) {
      return function(array, predicate, thisArg) {
        if (!(array && array.length)) {
          return -1;
        }
        predicate = getCallback(predicate, thisArg, 3);
        return baseFindIndex(array, predicate, fromRight);
      };
    }

    /**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */
    function createFindKey(objectFunc) {
      return function(object, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        return baseFind(object, predicate, objectFunc, true);
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return function() {
        var wrapper,
            length = arguments.length,
            index = fromRight ? length : -1,
            leftIndex = 0,
            funcs = Array(length);

        while ((fromRight ? index-- : ++index < length)) {
          var func = funcs[leftIndex++] = arguments[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
            wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? -1 : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      };
    }

    /**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createForEach(arrayFunc, eachFunc) {
      return function(collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee)
          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
      };
    }

    /**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForIn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee, keysIn);
      };
    }

    /**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForOwn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee);
      };
    }

    /**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */
    function createObjectMapper(isMapKeys) {
      return function(object, iteratee, thisArg) {
        var result = {};
        iteratee = getCallback(iteratee, thisArg, 3);

        baseForOwn(object, function(value, key, object) {
          var mapped = iteratee(value, key, object);
          key = isMapKeys ? mapped : key;
          value = isMapKeys ? value : mapped;
          result[key] = value;
        });
        return result;
      };
    }

    /**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */
    function createPadDir(fromRight) {
      return function(string, length, chars) {
        string = baseToString(string);
        return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
      };
    }

    /**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */
    function createPartial(flag) {
      var partialFunc = restParam(function(func, partials) {
        var holders = replaceHolders(partials, partialFunc.placeholder);
        return createWrapper(func, flag, undefined, partials, holders);
      });
      return partialFunc;
    }

    /**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createReduce(arrayFunc, eachFunc) {
      return function(collection, iteratee, accumulator, thisArg) {
        var initFromArray = arguments.length < 3;
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it to other functions.
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            var newArgPos = argPos ? arrayCopy(argPos) : undefined,
                newArity = nativeMax(arity - length, 0),
                newsHolders = isCurry ? argsHolders : undefined,
                newHoldersRight = isCurry ? undefined : argsHolders,
                newPartials = isCurry ? args : undefined,
                newPartialsRight = isCurry ? undefined : args;

            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

            if (!isCurryBound) {
              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
            }
            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
                result = createHybridWrapper.apply(undefined, newData);

            if (isLaziable(func)) {
              setData(result, newData);
            }
            result.placeholder = placeholder;
            return result;
          }
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        if (argPos) {
          args = reorder(args, argPos);
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(func);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPadding(string, length, chars) {
      var strLength = string.length;
      length = +length;

      if (strLength >= length || !nativeIsFinite(length)) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : (chars + '');
      return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it `func`.
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength);

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        precision = precision === undefined ? 0 : (+precision || 0);
        if (precision) {
          precision = pow(10, precision);
          return func(number * precision) / precision;
        }
        return func(number);
      };
    }

    /**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */
    function createSortedIndex(retHighest) {
      return function(array, value, iteratee, thisArg) {
        var callback = getCallback(iteratee);
        return (iteratee == null && callback === baseCallback)
          ? binaryIndex(array, value, retHighest)
          : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      length -= (holders ? holders.length : 0);
      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data) {
        mergeData(newData, data);
        bitmask = newData[1];
        arity = newData[9];
      }
      newData[9] = arity == null
        ? (isBindKey ? 0 : func.length)
        : (nativeMax(arity - length, 0) || 0);

      if (bitmask == BIND_FLAG) {
        var result = createBindWrapper(newData[0], newData[2]);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
        result = createPartialWrapper.apply(undefined, newData);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var index = -1,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
        return false;
      }
      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index],
            result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isLoose) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
              })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object)
            ? other != +other
            : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isLoose) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var skipCtor = isLoose;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key],
            result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

        // Recursively compare objects (susceptible to call stack limits).
        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */
    function getCallback(func, thisArg, argCount) {
      var result = lodash.callback || callback;
      result = result === callback ? baseCallback : result;
      return argCount ? result(func, thisArg, argCount) : result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = func.name,
          array = realNames[result],
          length = array ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */
    function getIndexOf(collection, target, fromIndex) {
      var result = lodash.indexOf || indexOf;
      result = result === indexOf ? baseIndexOf : result;
      return collection ? result(collection, target, fromIndex) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = pairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add array properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      var Ctor = object.constructor;
      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
        Ctor = Object;
      }
      return new Ctor;
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return bufferClone(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          var buffer = object.buffer;
          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          var result = new Ctor(object.source, reFlags.exec(object));
          result.lastIndex = object.lastIndex;
      }
      return result;
    }

    /**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function invokePath(object, path, args) {
      if (object != null && !isKey(path, object)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : func.apply(object, args);
    }

    /**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      var type = typeof value;
      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
        return true;
      }
      if (isArray(value)) {
        return false;
      }
      var result = !reIsDeepProp.test(value);
      return result || (object != null && value in toObject(object));
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func);
      if (!(funcName in LazyWrapper.prototype)) {
        return false;
      }
      var other = lodash[funcName];
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < ARY_FLAG;

      var isCombo =
        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = arrayCopy(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function mergeDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = arrayCopy(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
          propsLength = props.length,
          length = propsLength && object.length;

      var allowIndexes = !!length && isLength(length) &&
        (isArray(object) || isArguments(object));

      var index = -1,
          result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */
    function toIterable(value) {
      if (value == null) {
        return [];
      }
      if (!isArrayLike(value)) {
        return values(value);
      }
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function toPath(value) {
      if (isArray(value)) {
        return value;
      }
      var result = [];
      baseToString(value).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      return wrapper instanceof LazyWrapper
        ? wrapper.clone()
        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size == null) {
        size = 1;
      } else {
        size = nativeMax(nativeFloor(size) || 1, 1);
      }
      var index = 0,
          length = array ? array.length : 0,
          resIndex = -1,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */
    var difference = restParam(function(array, values) {
      return (isObjectLike(array) && isArrayLike(array))
        ? baseDifference(array, baseFlatten(values, false, true))
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */
    var findIndex = createFindIndex();

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    var findLastIndex = createFindIndex(true);

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */
    function flatten(array, isDeep, guard) {
      var length = array ? array.length : 0;
      if (guard && isIterateeCall(array, isDeep, guard)) {
        isDeep = false;
      }
      return length ? baseFlatten(array, isDeep) : [];
    }

    /**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
      } else if (fromIndex) {
        var index = binaryIndex(array, value);
        if (index < length &&
            (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
          return index;
        }
        return -1;
      }
      return baseIndexOf(array, value, fromIndex || 0);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */
    var intersection = restParam(function(arrays) {
      var othLength = arrays.length,
          othIndex = othLength,
          caches = Array(length),
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          result = [];

      while (othIndex--) {
        var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
        caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
      }
      var array = arrays[0],
          index = -1,
          length = array ? array.length : 0,
          seen = caches[0];

      outer:
      while (++index < length) {
        value = array[index];
        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
          var othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(value);
          }
          result.push(value);
        }
      }
      return result;
    });

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
      } else if (fromIndex) {
        index = binaryIndex(array, value, true) - 1;
        var other = array[index];
        if (value === value ? (value === other) : (other !== other)) {
          return index;
        }
        return -1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull() {
      var args = arguments,
          array = args[0];

      if (!(array && array.length)) {
        return array;
      }
      var index = 0,
          indexOf = getIndexOf(),
          length = args.length;

      while (++index < length) {
        var fromIndex = 0,
            value = args[index];

        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = restParam(function(array, indexes) {
      indexes = baseFlatten(indexes);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(baseCompareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate, thisArg) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */
    var sortedIndex = createSortedIndex();

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */
    var sortedLastIndex = createSortedIndex(true);

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */
    function takeRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */
    function takeWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */
    var union = restParam(function(arrays) {
      return baseUniq(baseFlatten(arrays, false, true));
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (isSorted != null && typeof isSorted != 'boolean') {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
        isSorted = false;
      }
      var callback = getCallback();
      if (!(iteratee == null && callback === baseCallback)) {
        iteratee = callback(iteratee, thisArg, 3);
      }
      return (isSorted && getIndexOf() == baseIndexOf)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var index = -1,
          length = 0;

      array = arrayFilter(array, function(group) {
        if (isArrayLike(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      var result = Array(length);
      while (++index < length) {
        result[index] = arrayMap(array, baseProperty(index));
      }
      return result;
    }

    /**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      iteratee = bindCallback(iteratee, thisArg, 4);
      return arrayMap(result, function(group) {
        return arrayReduce(group, iteratee, undefined, true);
      });
    }

    /**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = restParam(function(array, values) {
      return isArrayLike(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArrayLike(array)) {
          var result = result
            ? arrayPush(baseDifference(result, array), baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = restParam(unzip);

    /**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(props, values) {
      var index = -1,
          length = props ? props.length : 0,
          result = {};

      if (length && !values && !isArray(props[0])) {
        values = [];
      }
      while (++index < length) {
        var key = props[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */
    var zipWith = restParam(function(arrays) {
      var length = arrays.length,
          iteratee = length > 2 ? arrays[length - 2] : undefined,
          thisArg = length > 1 ? arrays[length - 1] : undefined;

      if (length > 2 && typeof iteratee == 'function') {
        length -= 2;
      } else {
        iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
        thisArg = undefined;
      }
      arrays.length = length;
      return unzipWith(arrays, iteratee, thisArg);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor, thisArg) {
      return interceptor.call(thisArg, value);
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var wrapperConcat = restParam(function(values) {
      values = baseFlatten(values);
      return this.thru(function(array) {
        return arrayConcat(isArray(array) ? array : [toObject(array)], values);
      });
    });

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;

      var interceptor = function(value) {
        return (wrapped && wrapped.__dir__ < 0) ? value : value.reverse();
      };
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(interceptor);
    }

    /**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return (this.value() + '');
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */
    var at = restParam(function(collection, props) {
      return baseAt(collection, baseFlatten(props));
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */
    var find = createFind(baseEach);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(baseEachRight, true);

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */
    function findWhere(collection, source) {
      return find(collection, baseMatches(source));
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    var forEach = createForEach(arrayEach, baseEach);

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */
    var forEachRight = createForEach(arrayEachRight, baseEachRight);

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, target, fromIndex, guard) {
      var length = collection ? getLength(collection) : 0;
      if (!isLength(length)) {
        collection = values(collection);
        length = collection.length;
      }
      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
        fromIndex = 0;
      } else {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      }
      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
        ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
        : (!!length && getIndexOf(collection, target, fromIndex) > -1);
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invoke = restParam(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
      });
      return result;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = getCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */
    function pluck(collection, path) {
      return map(collection, property(path));
    }

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */
    var reduce = createReduce(arrayReduce, baseEach);

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    var reduceRight = createReduce(arrayReduceRight, baseEachRight);

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */
    function reject(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
        collection = toIterable(collection);
        var length = collection.length;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = nativeMin(n < 0 ? 0 : (+n || 0), length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sample(collection, POSITIVE_INFINITY);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? getLength(collection) : 0;
      return isLength(length) ? length : keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, thisArg) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      if (collection == null) {
        return [];
      }
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      var index = -1;
      iteratee = getCallback(iteratee, thisArg, 3);

      var result = baseMap(collection, function(value, key, collection) {
        return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
      });
      return baseSortBy(result, compareAscending);
    }

    /**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortByAll = restParam(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var guard = iteratees[2];
      if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
        iteratees.length = 1;
      }
      return baseSortByOrder(collection, baseFlatten(iteratees), []);
    });

    /**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function sortByOrder(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (guard && isIterateeCall(iteratees, orders, guard)) {
        orders = undefined;
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseSortByOrder(collection, iteratees, orders);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */
    function where(collection, source) {
      return filter(collection, baseMatches(source));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      n = nativeIsFinite(n = +n) ? n : 0;
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      if (guard && isIterateeCall(func, n, guard)) {
        n = undefined;
      }
      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = restParam(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bind.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */
    var bindAll = restParam(function(object, methodNames) {
      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

      var index = -1,
          length = methodNames.length;

      while (++index < length) {
        var key = methodNames[index];
        object[key] = createWrapper(object[key], BIND_FLAG, object);
      }
      return object;
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = restParam(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bindKey.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    var curry = createCurry(CURRY_FLAG);

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    var curryRight = createCurry(CURRY_RIGHT_FLAG);

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : (+wait || 0);
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    var defer = restParam(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = restParam(function(func, wait, args) {
      return baseDelay(func, wait, args);
    });

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */
    var modArgs = restParam(function(func, transforms) {
      transforms = baseFlatten(transforms);
      if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = transforms.length;
      return restParam(function(args) {
        var index = nativeMin(args.length, length);
        while (index--) {
          args[index] = transforms[index](args[index]);
        }
        return func.apply(this, args);
      });
    });

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = createPartial(PARTIAL_FLAG);

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */
    var rearg = restParam(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function restParam(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            rest = Array(length);

        while (++index < length) {
          rest[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, rest);
          case 1: return func.call(this, args[0], rest);
          case 2: return func.call(this, args[0], args[1], rest);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = rest;
        return func.apply(this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function(array) {
        return func.apply(this, array);
      };
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, customizer, thisArg) {
      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
        isDeep = false;
      }
      else if (typeof isDeep == 'function') {
        thisArg = customizer;
        customizer = isDeep;
        isDeep = false;
      }
      return typeof customizer == 'function'
        ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
        : baseClone(value, isDeep);
    }

    /**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */
    function cloneDeep(value, customizer, thisArg) {
      return typeof customizer == 'function'
        ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
        : baseClone(value, true);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return isObjectLike(value) && isArrayLike(value) &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
    };

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
          (isObjectLike(value) && isFunction(value.splice)))) {
        return !value.length;
      }
      return !keys(value).length;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */
    function isEqual(value, other, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return isObject(value) && objToString.call(value) == funcTag;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isMatch(object, source, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      return baseIsMatch(object, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(fnToString.call(value));
      }
      return isObjectLike(value) && reIsHostCtor.test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      var Ctor;

      // Exit early for non `Object` objects.
      if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
          (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
        return false;
      }
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      var result;
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      baseForIn(value, function(subValue, key) {
        result = key;
      });
      return result === undefined || hasOwnProperty.call(value, result);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */
    function toArray(value) {
      var length = value ? getLength(value) : 0;
      if (!isLength(length)) {
        return values(value);
      }
      if (!length) {
        return [];
      }
      return arrayCopy(value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return baseCopy(value, keysIn(value));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var merge = createAssigner(baseMerge);

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(function(object, source, customizer) {
      return customizer
        ? assignWith(object, source, customizer)
        : baseAssign(object, source);
    });

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties, guard) {
      var result = baseCreate(prototype);
      if (guard && isIterateeCall(prototype, properties, guard)) {
        properties = undefined;
      }
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = createDefaults(assign, assignDefaults);

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = createDefaults(merge, mergeDefaults);

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    var findKey = createFindKey(baseForOwn);

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    var findLastKey = createFindKey(baseForOwnRight);

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */
    var forIn = createForIn(baseFor);

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */
    var forInRight = createForIn(baseForRight);

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */
    var forOwn = createForOwn(baseForOwn);

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */
    var forOwnRight = createForOwn(baseForOwnRight);

    /**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */
    function functions(object) {
      return baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */
    function has(object, path) {
      if (object == null) {
        return false;
      }
      var result = hasOwnProperty.call(object, path);
      if (!result && !isKey(path)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        if (object == null) {
          return false;
        }
        path = last(path);
        result = hasOwnProperty.call(object, path);
      }
      return result || (isLength(object.length) && isIndex(path, object.length) &&
        (isArray(object) || isArguments(object)));
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function invert(object, multiValue, guard) {
      if (guard && isIterateeCall(object, multiValue, guard)) {
        multiValue = undefined;
      }
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      var Ctor = object == null ? undefined : object.constructor;
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
          (typeof object != 'function' && isArrayLike(object))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || isArguments(object)) && length) || 0;

      var Ctor = object.constructor,
          index = -1,
          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
          result = Array(length),
          skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    var mapKeys = createObjectMapper(true);

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    var mapValues = createObjectMapper();

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    var omit = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      if (typeof props[0] != 'function') {
        var props = arrayMap(baseFlatten(props), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      var predicate = bindCallback(props[0], props[1], 3);
      return pickByCallback(object, function(value, key, object) {
        return !predicate(value, key, object);
      });
    });

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      object = toObject(object);

      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    var pick = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      return typeof props[0] == 'function'
        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
        : pickByArray(object, baseFlatten(props));
    });

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      var result = object == null ? undefined : object[path];
      if (result === undefined) {
        if (object != null && !isKey(path, object)) {
          path = toPath(path);
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          result = object == null ? undefined : object[last(path)];
        }
        result = result === undefined ? defaultValue : result;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      if (object == null) {
        return object;
      }
      var pathKey = (path + '');
      path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          if (index == lastIndex) {
            nested[key] = value;
          } else if (nested[key] == null) {
            nested[key] = isIndex(path[index + 1]) ? [] : {};
          }
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */
    function transform(object, iteratee, accumulator, thisArg) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getCallback(iteratee, thisArg, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */
    function inRange(value, start, end) {
      start = +start || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      return value >= nativeMin(start, end) && value < nativeMax(start, end);
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      if (floating && isIterateeCall(min, max, floating)) {
        max = floating = undefined;
      }
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      string = baseToString(string);
      return string && (string.charAt(0).toUpperCase() + string.slice(1));
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = baseToString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = baseToString(string);
      target = (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : nativeMin(position < 0 ? 0 : (+position || 0), length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
      string = baseToString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */
    function escapeRegExp(string) {
      string = baseToString(string);
      return (string && reHasRegExpChars.test(string))
        ? string.replace(reRegExpChars, escapeRegExpChar)
        : (string || '(?:)');
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = baseToString(string);
      length = +length;

      var strLength = string.length;
      if (strLength >= length || !nativeIsFinite(length)) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      chars = createPadding('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    var padLeft = createPadDir();

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    var padRight = createPadDir(true);

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
      if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = trim(string);
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      string = baseToString(string);
      n = +n;
      if (n < 1 || !string || !nativeIsFinite(n)) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = baseToString(string);
      position = position == null
        ? 0
        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, otherOptions) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
        options = otherOptions = undefined;
      }
      string = baseToString(string);
      options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

      var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
      }
      chars = (chars + '');
      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimLeft(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string));
      }
      return string.slice(charsLeftIndex(string, (chars + '')));
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimRight(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(0, trimmedRightIndex(string) + 1);
      }
      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function trunc(string, options, guard) {
      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (options != null) {
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? (+options.length || 0) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        } else {
          length = +options || 0;
        }
      }
      string = baseToString(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = baseToString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      if (guard && isIterateeCall(string, pattern, guard)) {
        pattern = undefined;
      }
      string = baseToString(string);
      return string.match(pattern || reWords) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = restParam(function(func, args) {
      try {
        return func.apply(undefined, args);
      } catch(e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function callback(func, thisArg, guard) {
      if (guard && isIterateeCall(func, thisArg, guard)) {
        thisArg = undefined;
      }
      return isObjectLike(func)
        ? matches(func)
        : baseCallback(func, thisArg);
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = restParam(function(path, args) {
      return function(object) {
        return invokePath(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = restParam(function(object, args) {
      return function(path) {
        return invokePath(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      if (options == null) {
        var isObj = isObject(source),
            props = isObj ? keys(source) : undefined,
            methodNames = (props && props.length) ? baseFunctions(source, props) : undefined;

        if (!(methodNames ? methodNames.length : isObj)) {
          methodNames = false;
          options = source;
          source = object;
          object = this;
        }
      }
      if (!methodNames) {
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = true,
          index = -1,
          isFunc = isFunction(object),
          length = methodNames.length;

      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      while (++index < length) {
        var methodName = methodNames[index],
            func = source[methodName];

        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                    actions = result.__actions__ = arrayCopy(this.__actions__);

                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }(func));
        }
      }
      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      root._ = oldDash;
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return baseGet(object, toPath(path), path + '');
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      if (step && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */
    function times(n, iteratee, thisArg) {
      n = nativeFloor(n);

      // Exit early to avoid a JSC JIT bug in Safari 8
      // where `Array(0)` is treated as `Array(1)`.
      if (n < 1 || !nativeIsFinite(n)) {
        return [];
      }
      var index = -1,
          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

      iteratee = bindCallback(iteratee, thisArg, 1);
      while (++index < n) {
        if (index < MAX_ARRAY_LENGTH) {
          result[index] = iteratee(index);
        } else {
          iteratee(index);
        }
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return baseToString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      return (+augend || 0) + (+addend || 0);
    }

    /**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */
    var max = createExtremum(gt, NEGATIVE_INFINITY);

    /**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */
    var min = createExtremum(lt, POSITIVE_INFINITY);

    /**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */
    function sum(collection, iteratee, thisArg) {
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      return iteratee.length == 1
        ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
        : baseSum(collection, iteratee);
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Add functions to the `Map` cache.
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `Set` cache.
    SetCache.prototype.push = cachePush;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.callback = callback;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.modArgs = modArgs;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.restParam = restParam;
    lodash.set = set;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortByAll = sortByAll;
    lodash.sortByOrder = sortByOrder;
    lodash.spread = spread;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.backflow = flowRight;
    lodash.collect = map;
    lodash.compose = flowRight;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.iteratee = callback;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.findWhere = findWhere;
    lodash.first = first;
    lodash.floor = floor;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isMatch = isMatch;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.min = min;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.sum = sum;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.trunc = trunc;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.words = words;

    // Add aliases.
    lodash.all = every;
    lodash.any = some;
    lodash.contains = includes;
    lodash.eq = isEqual;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.head = first;
    lodash.include = includes;
    lodash.inject = reduce;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }()), false);

    /*------------------------------------------------------------------------*/

    // Add functions capable of returning wrapped and unwrapped values when chaining.
    lodash.sample = sample;

    lodash.prototype.sample = function(n) {
      if (!this.__chain__ && n == null) {
        return sample(this.value());
      }
      return this.thru(function(value) {
        return sample(value, n);
      });
    };

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(result.__takeCount__, n);
        } else {
          result.__views__.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type != LAZY_MAP_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
        var result = this.clone();
        result.__iteratees__.push({ 'iteratee': getCallback(iteratee, thisArg, 1), 'type': type });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.first` and `_.last`.
    arrayEach(['first', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
    arrayEach(['initial', 'rest'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
    arrayEach(['pluck', 'where'], function(methodName, index) {
      var operationName = index ? 'filter' : 'map',
          createCallback = index ? baseMatches : property;

      LazyWrapper.prototype[methodName] = function(value) {
        return this[operationName](createCallback(value));
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.reject = function(predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 1);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = start == null ? 0 : (+start || 0);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = (+end || 0);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
      return this.reverse().takeWhile(predicate, thisArg).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(POSITIVE_INFINITY);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
          retUnwrapped = /^(?:first|last)$/.test(methodName),
          lodashFunc = lodash[retUnwrapped ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName];

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var args = retUnwrapped ? [1] : arguments,
            chainAll = this.__chain__,
            value = this.__wrapped__,
            isHybrid = !!this.__actions__.length,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var interceptor = function(value) {
          return (retUnwrapped && chainAll)
            ? lodashFunc(value, 1)[0]
            : lodashFunc.apply(undefined, arrayPush([value], args));
        };

        var action = { 'func': thru, 'args': [interceptor], 'thisArg': undefined },
            onlyLazy = isLazy && !isHybrid;

        if (retUnwrapped && !chainAll) {
          if (onlyLazy) {
            value = value.clone();
            value.__actions__.push(action);
            return func.call(value);
          }
          return lodashFunc.call(undefined, this.value())[0];
        }
        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push(action);
          return new LodashWrapper(result, chainAll);
        }
        return this.thru(interceptor);
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name,
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.concat = wrapperConcat;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add function aliases to the `lodash` wrapper.
    lodash.prototype.collect = lodash.prototype.map;
    lodash.prototype.head = lodash.prototype.first;
    lodash.prototype.select = lodash.prototype.filter;
    lodash.prototype.tail = lodash.prototype.rest;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports._ = _;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._ = _;
  }
}.call(this));

/* jshint maxerr: 10000 */
/* jslint unused: true */
/* jshint shadow: true */
/* jshint -W075 */
(function(ns){
    // this list must be ordered from largest length of the value array, index 0, to the shortest
    ns.emojioneList = {":kiss_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","1f469-2764-1f48b-1f469"],"fname":"1f469-2764-1f48b-1f469","uc":"1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","isCanonical": true},":couplekiss_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","1f469-2764-1f48b-1f469"],"fname":"1f469-2764-1f48b-1f469","uc":"1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","isCanonical": false},":kiss_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","1f468-2764-1f48b-1f468"],"fname":"1f468-2764-1f48b-1f468","uc":"1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","isCanonical": true},":couplekiss_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","1f468-2764-1f48b-1f468"],"fname":"1f468-2764-1f48b-1f468","uc":"1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","isCanonical": false},":family_mmbb:":{"unicode":["1f468-200d-1f468-200d-1f466-200d-1f466","1f468-1f468-1f466-1f466"],"fname":"1f468-1f468-1f466-1f466","uc":"1f468-200d-1f468-200d-1f466-200d-1f466","isCanonical": true},":family_mmgb:":{"unicode":["1f468-200d-1f468-200d-1f467-200d-1f466","1f468-1f468-1f467-1f466"],"fname":"1f468-1f468-1f467-1f466","uc":"1f468-200d-1f468-200d-1f467-200d-1f466","isCanonical": true},":family_mmgg:":{"unicode":["1f468-200d-1f468-200d-1f467-200d-1f467","1f468-1f468-1f467-1f467"],"fname":"1f468-1f468-1f467-1f467","uc":"1f468-200d-1f468-200d-1f467-200d-1f467","isCanonical": true},":family_mwbb:":{"unicode":["1f468-200d-1f469-200d-1f466-200d-1f466","1f468-1f469-1f466-1f466"],"fname":"1f468-1f469-1f466-1f466","uc":"1f468-200d-1f469-200d-1f466-200d-1f466","isCanonical": true},":family_mwgb:":{"unicode":["1f468-200d-1f469-200d-1f467-200d-1f466","1f468-1f469-1f467-1f466"],"fname":"1f468-1f469-1f467-1f466","uc":"1f468-200d-1f469-200d-1f467-200d-1f466","isCanonical": true},":family_mwgg:":{"unicode":["1f468-200d-1f469-200d-1f467-200d-1f467","1f468-1f469-1f467-1f467"],"fname":"1f468-1f469-1f467-1f467","uc":"1f468-200d-1f469-200d-1f467-200d-1f467","isCanonical": true},":family_wwbb:":{"unicode":["1f469-200d-1f469-200d-1f466-200d-1f466","1f469-1f469-1f466-1f466"],"fname":"1f469-1f469-1f466-1f466","uc":"1f469-200d-1f469-200d-1f466-200d-1f466","isCanonical": true},":family_wwgb:":{"unicode":["1f469-200d-1f469-200d-1f467-200d-1f466","1f469-1f469-1f467-1f466"],"fname":"1f469-1f469-1f467-1f466","uc":"1f469-200d-1f469-200d-1f467-200d-1f466","isCanonical": true},":family_wwgg:":{"unicode":["1f469-200d-1f469-200d-1f467-200d-1f467","1f469-1f469-1f467-1f467"],"fname":"1f469-1f469-1f467-1f467","uc":"1f469-200d-1f469-200d-1f467-200d-1f467","isCanonical": true},":couple_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f469","1f469-2764-1f469"],"fname":"1f469-2764-1f469","uc":"1f469-200d-2764-fe0f-200d-1f469","isCanonical": true},":couple_with_heart_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f469","1f469-2764-1f469"],"fname":"1f469-2764-1f469","uc":"1f469-200d-2764-fe0f-200d-1f469","isCanonical": false},":couple_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f468","1f468-2764-1f468"],"fname":"1f468-2764-1f468","uc":"1f468-200d-2764-fe0f-200d-1f468","isCanonical": true},":couple_with_heart_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f468","1f468-2764-1f468"],"fname":"1f468-2764-1f468","uc":"1f468-200d-2764-fe0f-200d-1f468","isCanonical": false},":family_mmb:":{"unicode":["1f468-200d-1f468-200d-1f466","1f468-1f468-1f466"],"fname":"1f468-1f468-1f466","uc":"1f468-200d-1f468-200d-1f466","isCanonical": true},":family_mmg:":{"unicode":["1f468-200d-1f468-200d-1f467","1f468-1f468-1f467"],"fname":"1f468-1f468-1f467","uc":"1f468-200d-1f468-200d-1f467","isCanonical": true},":family_mwg:":{"unicode":["1f468-200d-1f469-200d-1f467","1f468-1f469-1f467"],"fname":"1f468-1f469-1f467","uc":"1f468-200d-1f469-200d-1f467","isCanonical": true},":family_wwb:":{"unicode":["1f469-200d-1f469-200d-1f466","1f469-1f469-1f466"],"fname":"1f469-1f469-1f466","uc":"1f469-200d-1f469-200d-1f466","isCanonical": true},":family_wwg:":{"unicode":["1f469-200d-1f469-200d-1f467","1f469-1f469-1f467"],"fname":"1f469-1f469-1f467","uc":"1f469-200d-1f469-200d-1f467","isCanonical": true},":rainbow_flag:":{"unicode":["1f3f3-fe0f-200d-1f308","1f3f3-1f308"],"fname":"1f3f3-1f308","uc":"1f3f3-fe0f-200d-1f308","isCanonical": true},":gay_pride_flag:":{"unicode":["1f3f3-fe0f-200d-1f308","1f3f3-1f308"],"fname":"1f3f3-1f308","uc":"1f3f3-fe0f-200d-1f308","isCanonical": false},":eye_in_speech_bubble:":{"unicode":["1f441-200d-1f5e8","1f441-1f5e8"],"fname":"1f441-1f5e8","uc":"1f441-200d-1f5e8","isCanonical": true},":hash:":{"unicode":["0023-fe0f-20e3","0023-20e3"],"fname":"0023-20e3","uc":"0023-20e3","isCanonical": true},":zero:":{"unicode":["0030-fe0f-20e3","0030-20e3"],"fname":"0030-20e3","uc":"0030-20e3","isCanonical": true},":one:":{"unicode":["0031-fe0f-20e3","0031-20e3"],"fname":"0031-20e3","uc":"0031-20e3","isCanonical": true},":two:":{"unicode":["0032-fe0f-20e3","0032-20e3"],"fname":"0032-20e3","uc":"0032-20e3","isCanonical": true},":three:":{"unicode":["0033-fe0f-20e3","0033-20e3"],"fname":"0033-20e3","uc":"0033-20e3","isCanonical": true},":four:":{"unicode":["0034-fe0f-20e3","0034-20e3"],"fname":"0034-20e3","uc":"0034-20e3","isCanonical": true},":five:":{"unicode":["0035-fe0f-20e3","0035-20e3"],"fname":"0035-20e3","uc":"0035-20e3","isCanonical": true},":six:":{"unicode":["0036-fe0f-20e3","0036-20e3"],"fname":"0036-20e3","uc":"0036-20e3","isCanonical": true},":seven:":{"unicode":["0037-fe0f-20e3","0037-20e3"],"fname":"0037-20e3","uc":"0037-20e3","isCanonical": true},":eight:":{"unicode":["0038-fe0f-20e3","0038-20e3"],"fname":"0038-20e3","uc":"0038-20e3","isCanonical": true},":nine:":{"unicode":["0039-fe0f-20e3","0039-20e3"],"fname":"0039-20e3","uc":"0039-20e3","isCanonical": true},":asterisk:":{"unicode":["002a-fe0f-20e3","002a-20e3"],"fname":"002a-20e3","uc":"002a-20e3","isCanonical": true},":keycap_asterisk:":{"unicode":["002a-fe0f-20e3","002a-20e3"],"fname":"002a-20e3","uc":"002a-20e3","isCanonical": false},":handball_tone5:":{"unicode":["1f93e-1f3ff"],"fname":"1f93e-1f3ff","uc":"1f93e-1f3ff","isCanonical": true},":handball_tone4:":{"unicode":["1f93e-1f3fe"],"fname":"1f93e-1f3fe","uc":"1f93e-1f3fe","isCanonical": true},":handball_tone3:":{"unicode":["1f93e-1f3fd"],"fname":"1f93e-1f3fd","uc":"1f93e-1f3fd","isCanonical": true},":handball_tone2:":{"unicode":["1f93e-1f3fc"],"fname":"1f93e-1f3fc","uc":"1f93e-1f3fc","isCanonical": true},":handball_tone1:":{"unicode":["1f93e-1f3fb"],"fname":"1f93e-1f3fb","uc":"1f93e-1f3fb","isCanonical": true},":water_polo_tone5:":{"unicode":["1f93d-1f3ff"],"fname":"1f93d-1f3ff","uc":"1f93d-1f3ff","isCanonical": true},":water_polo_tone4:":{"unicode":["1f93d-1f3fe"],"fname":"1f93d-1f3fe","uc":"1f93d-1f3fe","isCanonical": true},":water_polo_tone3:":{"unicode":["1f93d-1f3fd"],"fname":"1f93d-1f3fd","uc":"1f93d-1f3fd","isCanonical": true},":water_polo_tone2:":{"unicode":["1f93d-1f3fc"],"fname":"1f93d-1f3fc","uc":"1f93d-1f3fc","isCanonical": true},":water_polo_tone1:":{"unicode":["1f93d-1f3fb"],"fname":"1f93d-1f3fb","uc":"1f93d-1f3fb","isCanonical": true},":wrestlers_tone5:":{"unicode":["1f93c-1f3ff"],"fname":"1f93c-1f3ff","uc":"1f93c-1f3ff","isCanonical": true},":wrestling_tone5:":{"unicode":["1f93c-1f3ff"],"fname":"1f93c-1f3ff","uc":"1f93c-1f3ff","isCanonical": false},":wrestlers_tone4:":{"unicode":["1f93c-1f3fe"],"fname":"1f93c-1f3fe","uc":"1f93c-1f3fe","isCanonical": true},":wrestling_tone4:":{"unicode":["1f93c-1f3fe"],"fname":"1f93c-1f3fe","uc":"1f93c-1f3fe","isCanonical": false},":wrestlers_tone3:":{"unicode":["1f93c-1f3fd"],"fname":"1f93c-1f3fd","uc":"1f93c-1f3fd","isCanonical": true},":wrestling_tone3:":{"unicode":["1f93c-1f3fd"],"fname":"1f93c-1f3fd","uc":"1f93c-1f3fd","isCanonical": false},":wrestlers_tone2:":{"unicode":["1f93c-1f3fc"],"fname":"1f93c-1f3fc","uc":"1f93c-1f3fc","isCanonical": true},":wrestling_tone2:":{"unicode":["1f93c-1f3fc"],"fname":"1f93c-1f3fc","uc":"1f93c-1f3fc","isCanonical": false},":wrestlers_tone1:":{"unicode":["1f93c-1f3fb"],"fname":"1f93c-1f3fb","uc":"1f93c-1f3fb","isCanonical": true},":wrestling_tone1:":{"unicode":["1f93c-1f3fb"],"fname":"1f93c-1f3fb","uc":"1f93c-1f3fb","isCanonical": false},":juggling_tone5:":{"unicode":["1f939-1f3ff"],"fname":"1f939-1f3ff","uc":"1f939-1f3ff","isCanonical": true},":juggler_tone5:":{"unicode":["1f939-1f3ff"],"fname":"1f939-1f3ff","uc":"1f939-1f3ff","isCanonical": false},":juggling_tone4:":{"unicode":["1f939-1f3fe"],"fname":"1f939-1f3fe","uc":"1f939-1f3fe","isCanonical": true},":juggler_tone4:":{"unicode":["1f939-1f3fe"],"fname":"1f939-1f3fe","uc":"1f939-1f3fe","isCanonical": false},":juggling_tone3:":{"unicode":["1f939-1f3fd"],"fname":"1f939-1f3fd","uc":"1f939-1f3fd","isCanonical": true},":juggler_tone3:":{"unicode":["1f939-1f3fd"],"fname":"1f939-1f3fd","uc":"1f939-1f3fd","isCanonical": false},":juggling_tone2:":{"unicode":["1f939-1f3fc"],"fname":"1f939-1f3fc","uc":"1f939-1f3fc","isCanonical": true},":juggler_tone2:":{"unicode":["1f939-1f3fc"],"fname":"1f939-1f3fc","uc":"1f939-1f3fc","isCanonical": false},":juggling_tone1:":{"unicode":["1f939-1f3fb"],"fname":"1f939-1f3fb","uc":"1f939-1f3fb","isCanonical": true},":juggler_tone1:":{"unicode":["1f939-1f3fb"],"fname":"1f939-1f3fb","uc":"1f939-1f3fb","isCanonical": false},":cartwheel_tone5:":{"unicode":["1f938-1f3ff"],"fname":"1f938-1f3ff","uc":"1f938-1f3ff","isCanonical": true},":person_doing_cartwheel_tone5:":{"unicode":["1f938-1f3ff"],"fname":"1f938-1f3ff","uc":"1f938-1f3ff","isCanonical": false},":cartwheel_tone4:":{"unicode":["1f938-1f3fe"],"fname":"1f938-1f3fe","uc":"1f938-1f3fe","isCanonical": true},":person_doing_cartwheel_tone4:":{"unicode":["1f938-1f3fe"],"fname":"1f938-1f3fe","uc":"1f938-1f3fe","isCanonical": false},":cartwheel_tone3:":{"unicode":["1f938-1f3fd"],"fname":"1f938-1f3fd","uc":"1f938-1f3fd","isCanonical": true},":person_doing_cartwheel_tone3:":{"unicode":["1f938-1f3fd"],"fname":"1f938-1f3fd","uc":"1f938-1f3fd","isCanonical": false},":cartwheel_tone2:":{"unicode":["1f938-1f3fc"],"fname":"1f938-1f3fc","uc":"1f938-1f3fc","isCanonical": true},":person_doing_cartwheel_tone2:":{"unicode":["1f938-1f3fc"],"fname":"1f938-1f3fc","uc":"1f938-1f3fc","isCanonical": false},":cartwheel_tone1:":{"unicode":["1f938-1f3fb"],"fname":"1f938-1f3fb","uc":"1f938-1f3fb","isCanonical": true},":person_doing_cartwheel_tone1:":{"unicode":["1f938-1f3fb"],"fname":"1f938-1f3fb","uc":"1f938-1f3fb","isCanonical": false},":shrug_tone5:":{"unicode":["1f937-1f3ff"],"fname":"1f937-1f3ff","uc":"1f937-1f3ff","isCanonical": true},":shrug_tone4:":{"unicode":["1f937-1f3fe"],"fname":"1f937-1f3fe","uc":"1f937-1f3fe","isCanonical": true},":shrug_tone3:":{"unicode":["1f937-1f3fd"],"fname":"1f937-1f3fd","uc":"1f937-1f3fd","isCanonical": true},":shrug_tone2:":{"unicode":["1f937-1f3fc"],"fname":"1f937-1f3fc","uc":"1f937-1f3fc","isCanonical": true},":shrug_tone1:":{"unicode":["1f937-1f3fb"],"fname":"1f937-1f3fb","uc":"1f937-1f3fb","isCanonical": true},":mrs_claus_tone5:":{"unicode":["1f936-1f3ff"],"fname":"1f936-1f3ff","uc":"1f936-1f3ff","isCanonical": true},":mother_christmas_tone5:":{"unicode":["1f936-1f3ff"],"fname":"1f936-1f3ff","uc":"1f936-1f3ff","isCanonical": false},":mrs_claus_tone4:":{"unicode":["1f936-1f3fe"],"fname":"1f936-1f3fe","uc":"1f936-1f3fe","isCanonical": true},":mother_christmas_tone4:":{"unicode":["1f936-1f3fe"],"fname":"1f936-1f3fe","uc":"1f936-1f3fe","isCanonical": false},":mrs_claus_tone3:":{"unicode":["1f936-1f3fd"],"fname":"1f936-1f3fd","uc":"1f936-1f3fd","isCanonical": true},":mother_christmas_tone3:":{"unicode":["1f936-1f3fd"],"fname":"1f936-1f3fd","uc":"1f936-1f3fd","isCanonical": false},":mrs_claus_tone2:":{"unicode":["1f936-1f3fc"],"fname":"1f936-1f3fc","uc":"1f936-1f3fc","isCanonical": true},":mother_christmas_tone2:":{"unicode":["1f936-1f3fc"],"fname":"1f936-1f3fc","uc":"1f936-1f3fc","isCanonical": false},":mrs_claus_tone1:":{"unicode":["1f936-1f3fb"],"fname":"1f936-1f3fb","uc":"1f936-1f3fb","isCanonical": true},":mother_christmas_tone1:":{"unicode":["1f936-1f3fb"],"fname":"1f936-1f3fb","uc":"1f936-1f3fb","isCanonical": false},":man_in_tuxedo_tone5:":{"unicode":["1f935-1f3ff"],"fname":"1f935-1f3ff","uc":"1f935-1f3ff","isCanonical": true},":tuxedo_tone5:":{"unicode":["1f935-1f3ff"],"fname":"1f935-1f3ff","uc":"1f935-1f3ff","isCanonical": false},":man_in_tuxedo_tone4:":{"unicode":["1f935-1f3fe"],"fname":"1f935-1f3fe","uc":"1f935-1f3fe","isCanonical": true},":tuxedo_tone4:":{"unicode":["1f935-1f3fe"],"fname":"1f935-1f3fe","uc":"1f935-1f3fe","isCanonical": false},":man_in_tuxedo_tone3:":{"unicode":["1f935-1f3fd"],"fname":"1f935-1f3fd","uc":"1f935-1f3fd","isCanonical": true},":tuxedo_tone3:":{"unicode":["1f935-1f3fd"],"fname":"1f935-1f3fd","uc":"1f935-1f3fd","isCanonical": false},":man_in_tuxedo_tone2:":{"unicode":["1f935-1f3fc"],"fname":"1f935-1f3fc","uc":"1f935-1f3fc","isCanonical": true},":tuxedo_tone2:":{"unicode":["1f935-1f3fc"],"fname":"1f935-1f3fc","uc":"1f935-1f3fc","isCanonical": false},":man_in_tuxedo_tone1:":{"unicode":["1f935-1f3fb"],"fname":"1f935-1f3fb","uc":"1f935-1f3fb","isCanonical": true},":tuxedo_tone1:":{"unicode":["1f935-1f3fb"],"fname":"1f935-1f3fb","uc":"1f935-1f3fb","isCanonical": false},":prince_tone5:":{"unicode":["1f934-1f3ff"],"fname":"1f934-1f3ff","uc":"1f934-1f3ff","isCanonical": true},":prince_tone4:":{"unicode":["1f934-1f3fe"],"fname":"1f934-1f3fe","uc":"1f934-1f3fe","isCanonical": true},":prince_tone3:":{"unicode":["1f934-1f3fd"],"fname":"1f934-1f3fd","uc":"1f934-1f3fd","isCanonical": true},":prince_tone2:":{"unicode":["1f934-1f3fc"],"fname":"1f934-1f3fc","uc":"1f934-1f3fc","isCanonical": true},":prince_tone1:":{"unicode":["1f934-1f3fb"],"fname":"1f934-1f3fb","uc":"1f934-1f3fb","isCanonical": true},":selfie_tone5:":{"unicode":["1f933-1f3ff"],"fname":"1f933-1f3ff","uc":"1f933-1f3ff","isCanonical": true},":selfie_tone4:":{"unicode":["1f933-1f3fe"],"fname":"1f933-1f3fe","uc":"1f933-1f3fe","isCanonical": true},":selfie_tone3:":{"unicode":["1f933-1f3fd"],"fname":"1f933-1f3fd","uc":"1f933-1f3fd","isCanonical": true},":selfie_tone2:":{"unicode":["1f933-1f3fc"],"fname":"1f933-1f3fc","uc":"1f933-1f3fc","isCanonical": true},":selfie_tone1:":{"unicode":["1f933-1f3fb"],"fname":"1f933-1f3fb","uc":"1f933-1f3fb","isCanonical": true},":pregnant_woman_tone5:":{"unicode":["1f930-1f3ff"],"fname":"1f930-1f3ff","uc":"1f930-1f3ff","isCanonical": true},":expecting_woman_tone5:":{"unicode":["1f930-1f3ff"],"fname":"1f930-1f3ff","uc":"1f930-1f3ff","isCanonical": false},":pregnant_woman_tone4:":{"unicode":["1f930-1f3fe"],"fname":"1f930-1f3fe","uc":"1f930-1f3fe","isCanonical": true},":expecting_woman_tone4:":{"unicode":["1f930-1f3fe"],"fname":"1f930-1f3fe","uc":"1f930-1f3fe","isCanonical": false},":pregnant_woman_tone3:":{"unicode":["1f930-1f3fd"],"fname":"1f930-1f3fd","uc":"1f930-1f3fd","isCanonical": true},":expecting_woman_tone3:":{"unicode":["1f930-1f3fd"],"fname":"1f930-1f3fd","uc":"1f930-1f3fd","isCanonical": false},":pregnant_woman_tone2:":{"unicode":["1f930-1f3fc"],"fname":"1f930-1f3fc","uc":"1f930-1f3fc","isCanonical": true},":expecting_woman_tone2:":{"unicode":["1f930-1f3fc"],"fname":"1f930-1f3fc","uc":"1f930-1f3fc","isCanonical": false},":pregnant_woman_tone1:":{"unicode":["1f930-1f3fb"],"fname":"1f930-1f3fb","uc":"1f930-1f3fb","isCanonical": true},":expecting_woman_tone1:":{"unicode":["1f930-1f3fb"],"fname":"1f930-1f3fb","uc":"1f930-1f3fb","isCanonical": false},":face_palm_tone5:":{"unicode":["1f926-1f3ff"],"fname":"1f926-1f3ff","uc":"1f926-1f3ff","isCanonical": true},":facepalm_tone5:":{"unicode":["1f926-1f3ff"],"fname":"1f926-1f3ff","uc":"1f926-1f3ff","isCanonical": false},":face_palm_tone4:":{"unicode":["1f926-1f3fe"],"fname":"1f926-1f3fe","uc":"1f926-1f3fe","isCanonical": true},":facepalm_tone4:":{"unicode":["1f926-1f3fe"],"fname":"1f926-1f3fe","uc":"1f926-1f3fe","isCanonical": false},":face_palm_tone3:":{"unicode":["1f926-1f3fd"],"fname":"1f926-1f3fd","uc":"1f926-1f3fd","isCanonical": true},":facepalm_tone3:":{"unicode":["1f926-1f3fd"],"fname":"1f926-1f3fd","uc":"1f926-1f3fd","isCanonical": false},":face_palm_tone2:":{"unicode":["1f926-1f3fc"],"fname":"1f926-1f3fc","uc":"1f926-1f3fc","isCanonical": true},":facepalm_tone2:":{"unicode":["1f926-1f3fc"],"fname":"1f926-1f3fc","uc":"1f926-1f3fc","isCanonical": false},":face_palm_tone1:":{"unicode":["1f926-1f3fb"],"fname":"1f926-1f3fb","uc":"1f926-1f3fb","isCanonical": true},":facepalm_tone1:":{"unicode":["1f926-1f3fb"],"fname":"1f926-1f3fb","uc":"1f926-1f3fb","isCanonical": false},":fingers_crossed_tone5:":{"unicode":["1f91e-1f3ff"],"fname":"1f91e-1f3ff","uc":"1f91e-1f3ff","isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone5:":{"unicode":["1f91e-1f3ff"],"fname":"1f91e-1f3ff","uc":"1f91e-1f3ff","isCanonical": false},":fingers_crossed_tone4:":{"unicode":["1f91e-1f3fe"],"fname":"1f91e-1f3fe","uc":"1f91e-1f3fe","isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone4:":{"unicode":["1f91e-1f3fe"],"fname":"1f91e-1f3fe","uc":"1f91e-1f3fe","isCanonical": false},":fingers_crossed_tone3:":{"unicode":["1f91e-1f3fd"],"fname":"1f91e-1f3fd","uc":"1f91e-1f3fd","isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone3:":{"unicode":["1f91e-1f3fd"],"fname":"1f91e-1f3fd","uc":"1f91e-1f3fd","isCanonical": false},":fingers_crossed_tone2:":{"unicode":["1f91e-1f3fc"],"fname":"1f91e-1f3fc","uc":"1f91e-1f3fc","isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone2:":{"unicode":["1f91e-1f3fc"],"fname":"1f91e-1f3fc","uc":"1f91e-1f3fc","isCanonical": false},":fingers_crossed_tone1:":{"unicode":["1f91e-1f3fb"],"fname":"1f91e-1f3fb","uc":"1f91e-1f3fb","isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone1:":{"unicode":["1f91e-1f3fb"],"fname":"1f91e-1f3fb","uc":"1f91e-1f3fb","isCanonical": false},":handshake_tone5:":{"unicode":["1f91d-1f3ff"],"fname":"1f91d-1f3ff","uc":"1f91d-1f3ff","isCanonical": true},":shaking_hands_tone5:":{"unicode":["1f91d-1f3ff"],"fname":"1f91d-1f3ff","uc":"1f91d-1f3ff","isCanonical": false},":handshake_tone4:":{"unicode":["1f91d-1f3fe"],"fname":"1f91d-1f3fe","uc":"1f91d-1f3fe","isCanonical": true},":shaking_hands_tone4:":{"unicode":["1f91d-1f3fe"],"fname":"1f91d-1f3fe","uc":"1f91d-1f3fe","isCanonical": false},":handshake_tone3:":{"unicode":["1f91d-1f3fd"],"fname":"1f91d-1f3fd","uc":"1f91d-1f3fd","isCanonical": true},":shaking_hands_tone3:":{"unicode":["1f91d-1f3fd"],"fname":"1f91d-1f3fd","uc":"1f91d-1f3fd","isCanonical": false},":handshake_tone2:":{"unicode":["1f91d-1f3fc"],"fname":"1f91d-1f3fc","uc":"1f91d-1f3fc","isCanonical": true},":shaking_hands_tone2:":{"unicode":["1f91d-1f3fc"],"fname":"1f91d-1f3fc","uc":"1f91d-1f3fc","isCanonical": false},":handshake_tone1:":{"unicode":["1f91d-1f3fb"],"fname":"1f91d-1f3fb","uc":"1f91d-1f3fb","isCanonical": true},":shaking_hands_tone1:":{"unicode":["1f91d-1f3fb"],"fname":"1f91d-1f3fb","uc":"1f91d-1f3fb","isCanonical": false},":right_facing_fist_tone5:":{"unicode":["1f91c-1f3ff"],"fname":"1f91c-1f3ff","uc":"1f91c-1f3ff","isCanonical": true},":right_fist_tone5:":{"unicode":["1f91c-1f3ff"],"fname":"1f91c-1f3ff","uc":"1f91c-1f3ff","isCanonical": false},":right_facing_fist_tone4:":{"unicode":["1f91c-1f3fe"],"fname":"1f91c-1f3fe","uc":"1f91c-1f3fe","isCanonical": true},":right_fist_tone4:":{"unicode":["1f91c-1f3fe"],"fname":"1f91c-1f3fe","uc":"1f91c-1f3fe","isCanonical": false},":right_facing_fist_tone3:":{"unicode":["1f91c-1f3fd"],"fname":"1f91c-1f3fd","uc":"1f91c-1f3fd","isCanonical": true},":right_fist_tone3:":{"unicode":["1f91c-1f3fd"],"fname":"1f91c-1f3fd","uc":"1f91c-1f3fd","isCanonical": false},":right_facing_fist_tone2:":{"unicode":["1f91c-1f3fc"],"fname":"1f91c-1f3fc","uc":"1f91c-1f3fc","isCanonical": true},":right_fist_tone2:":{"unicode":["1f91c-1f3fc"],"fname":"1f91c-1f3fc","uc":"1f91c-1f3fc","isCanonical": false},":right_facing_fist_tone1:":{"unicode":["1f91c-1f3fb"],"fname":"1f91c-1f3fb","uc":"1f91c-1f3fb","isCanonical": true},":right_fist_tone1:":{"unicode":["1f91c-1f3fb"],"fname":"1f91c-1f3fb","uc":"1f91c-1f3fb","isCanonical": false},":left_facing_fist_tone5:":{"unicode":["1f91b-1f3ff"],"fname":"1f91b-1f3ff","uc":"1f91b-1f3ff","isCanonical": true},":left_fist_tone5:":{"unicode":["1f91b-1f3ff"],"fname":"1f91b-1f3ff","uc":"1f91b-1f3ff","isCanonical": false},":left_facing_fist_tone4:":{"unicode":["1f91b-1f3fe"],"fname":"1f91b-1f3fe","uc":"1f91b-1f3fe","isCanonical": true},":left_fist_tone4:":{"unicode":["1f91b-1f3fe"],"fname":"1f91b-1f3fe","uc":"1f91b-1f3fe","isCanonical": false},":left_facing_fist_tone3:":{"unicode":["1f91b-1f3fd"],"fname":"1f91b-1f3fd","uc":"1f91b-1f3fd","isCanonical": true},":left_fist_tone3:":{"unicode":["1f91b-1f3fd"],"fname":"1f91b-1f3fd","uc":"1f91b-1f3fd","isCanonical": false},":left_facing_fist_tone2:":{"unicode":["1f91b-1f3fc"],"fname":"1f91b-1f3fc","uc":"1f91b-1f3fc","isCanonical": true},":left_fist_tone2:":{"unicode":["1f91b-1f3fc"],"fname":"1f91b-1f3fc","uc":"1f91b-1f3fc","isCanonical": false},":left_facing_fist_tone1:":{"unicode":["1f91b-1f3fb"],"fname":"1f91b-1f3fb","uc":"1f91b-1f3fb","isCanonical": true},":left_fist_tone1:":{"unicode":["1f91b-1f3fb"],"fname":"1f91b-1f3fb","uc":"1f91b-1f3fb","isCanonical": false},":raised_back_of_hand_tone5:":{"unicode":["1f91a-1f3ff"],"fname":"1f91a-1f3ff","uc":"1f91a-1f3ff","isCanonical": true},":back_of_hand_tone5:":{"unicode":["1f91a-1f3ff"],"fname":"1f91a-1f3ff","uc":"1f91a-1f3ff","isCanonical": false},":raised_back_of_hand_tone4:":{"unicode":["1f91a-1f3fe"],"fname":"1f91a-1f3fe","uc":"1f91a-1f3fe","isCanonical": true},":back_of_hand_tone4:":{"unicode":["1f91a-1f3fe"],"fname":"1f91a-1f3fe","uc":"1f91a-1f3fe","isCanonical": false},":raised_back_of_hand_tone3:":{"unicode":["1f91a-1f3fd"],"fname":"1f91a-1f3fd","uc":"1f91a-1f3fd","isCanonical": true},":back_of_hand_tone3:":{"unicode":["1f91a-1f3fd"],"fname":"1f91a-1f3fd","uc":"1f91a-1f3fd","isCanonical": false},":raised_back_of_hand_tone2:":{"unicode":["1f91a-1f3fc"],"fname":"1f91a-1f3fc","uc":"1f91a-1f3fc","isCanonical": true},":back_of_hand_tone2:":{"unicode":["1f91a-1f3fc"],"fname":"1f91a-1f3fc","uc":"1f91a-1f3fc","isCanonical": false},":raised_back_of_hand_tone1:":{"unicode":["1f91a-1f3fb"],"fname":"1f91a-1f3fb","uc":"1f91a-1f3fb","isCanonical": true},":back_of_hand_tone1:":{"unicode":["1f91a-1f3fb"],"fname":"1f91a-1f3fb","uc":"1f91a-1f3fb","isCanonical": false},":call_me_tone5:":{"unicode":["1f919-1f3ff"],"fname":"1f919-1f3ff","uc":"1f919-1f3ff","isCanonical": true},":call_me_hand_tone5:":{"unicode":["1f919-1f3ff"],"fname":"1f919-1f3ff","uc":"1f919-1f3ff","isCanonical": false},":call_me_tone4:":{"unicode":["1f919-1f3fe"],"fname":"1f919-1f3fe","uc":"1f919-1f3fe","isCanonical": true},":call_me_hand_tone4:":{"unicode":["1f919-1f3fe"],"fname":"1f919-1f3fe","uc":"1f919-1f3fe","isCanonical": false},":call_me_tone3:":{"unicode":["1f919-1f3fd"],"fname":"1f919-1f3fd","uc":"1f919-1f3fd","isCanonical": true},":call_me_hand_tone3:":{"unicode":["1f919-1f3fd"],"fname":"1f919-1f3fd","uc":"1f919-1f3fd","isCanonical": false},":call_me_tone2:":{"unicode":["1f919-1f3fc"],"fname":"1f919-1f3fc","uc":"1f919-1f3fc","isCanonical": true},":call_me_hand_tone2:":{"unicode":["1f919-1f3fc"],"fname":"1f919-1f3fc","uc":"1f919-1f3fc","isCanonical": false},":call_me_tone1:":{"unicode":["1f919-1f3fb"],"fname":"1f919-1f3fb","uc":"1f919-1f3fb","isCanonical": true},":call_me_hand_tone1:":{"unicode":["1f919-1f3fb"],"fname":"1f919-1f3fb","uc":"1f919-1f3fb","isCanonical": false},":metal_tone5:":{"unicode":["1f918-1f3ff"],"fname":"1f918-1f3ff","uc":"1f918-1f3ff","isCanonical": true},":sign_of_the_horns_tone5:":{"unicode":["1f918-1f3ff"],"fname":"1f918-1f3ff","uc":"1f918-1f3ff","isCanonical": false},":metal_tone4:":{"unicode":["1f918-1f3fe"],"fname":"1f918-1f3fe","uc":"1f918-1f3fe","isCanonical": true},":sign_of_the_horns_tone4:":{"unicode":["1f918-1f3fe"],"fname":"1f918-1f3fe","uc":"1f918-1f3fe","isCanonical": false},":metal_tone3:":{"unicode":["1f918-1f3fd"],"fname":"1f918-1f3fd","uc":"1f918-1f3fd","isCanonical": true},":sign_of_the_horns_tone3:":{"unicode":["1f918-1f3fd"],"fname":"1f918-1f3fd","uc":"1f918-1f3fd","isCanonical": false},":metal_tone2:":{"unicode":["1f918-1f3fc"],"fname":"1f918-1f3fc","uc":"1f918-1f3fc","isCanonical": true},":sign_of_the_horns_tone2:":{"unicode":["1f918-1f3fc"],"fname":"1f918-1f3fc","uc":"1f918-1f3fc","isCanonical": false},":metal_tone1:":{"unicode":["1f918-1f3fb"],"fname":"1f918-1f3fb","uc":"1f918-1f3fb","isCanonical": true},":sign_of_the_horns_tone1:":{"unicode":["1f918-1f3fb"],"fname":"1f918-1f3fb","uc":"1f918-1f3fb","isCanonical": false},":bath_tone5:":{"unicode":["1f6c0-1f3ff"],"fname":"1f6c0-1f3ff","uc":"1f6c0-1f3ff","isCanonical": true},":bath_tone4:":{"unicode":["1f6c0-1f3fe"],"fname":"1f6c0-1f3fe","uc":"1f6c0-1f3fe","isCanonical": true},":bath_tone3:":{"unicode":["1f6c0-1f3fd"],"fname":"1f6c0-1f3fd","uc":"1f6c0-1f3fd","isCanonical": true},":bath_tone2:":{"unicode":["1f6c0-1f3fc"],"fname":"1f6c0-1f3fc","uc":"1f6c0-1f3fc","isCanonical": true},":bath_tone1:":{"unicode":["1f6c0-1f3fb"],"fname":"1f6c0-1f3fb","uc":"1f6c0-1f3fb","isCanonical": true},":walking_tone5:":{"unicode":["1f6b6-1f3ff"],"fname":"1f6b6-1f3ff","uc":"1f6b6-1f3ff","isCanonical": true},":walking_tone4:":{"unicode":["1f6b6-1f3fe"],"fname":"1f6b6-1f3fe","uc":"1f6b6-1f3fe","isCanonical": true},":walking_tone3:":{"unicode":["1f6b6-1f3fd"],"fname":"1f6b6-1f3fd","uc":"1f6b6-1f3fd","isCanonical": true},":walking_tone2:":{"unicode":["1f6b6-1f3fc"],"fname":"1f6b6-1f3fc","uc":"1f6b6-1f3fc","isCanonical": true},":walking_tone1:":{"unicode":["1f6b6-1f3fb"],"fname":"1f6b6-1f3fb","uc":"1f6b6-1f3fb","isCanonical": true},":mountain_bicyclist_tone5:":{"unicode":["1f6b5-1f3ff"],"fname":"1f6b5-1f3ff","uc":"1f6b5-1f3ff","isCanonical": true},":mountain_bicyclist_tone4:":{"unicode":["1f6b5-1f3fe"],"fname":"1f6b5-1f3fe","uc":"1f6b5-1f3fe","isCanonical": true},":mountain_bicyclist_tone3:":{"unicode":["1f6b5-1f3fd"],"fname":"1f6b5-1f3fd","uc":"1f6b5-1f3fd","isCanonical": true},":mountain_bicyclist_tone2:":{"unicode":["1f6b5-1f3fc"],"fname":"1f6b5-1f3fc","uc":"1f6b5-1f3fc","isCanonical": true},":mountain_bicyclist_tone1:":{"unicode":["1f6b5-1f3fb"],"fname":"1f6b5-1f3fb","uc":"1f6b5-1f3fb","isCanonical": true},":bicyclist_tone5:":{"unicode":["1f6b4-1f3ff"],"fname":"1f6b4-1f3ff","uc":"1f6b4-1f3ff","isCanonical": true},":bicyclist_tone4:":{"unicode":["1f6b4-1f3fe"],"fname":"1f6b4-1f3fe","uc":"1f6b4-1f3fe","isCanonical": true},":bicyclist_tone3:":{"unicode":["1f6b4-1f3fd"],"fname":"1f6b4-1f3fd","uc":"1f6b4-1f3fd","isCanonical": true},":bicyclist_tone2:":{"unicode":["1f6b4-1f3fc"],"fname":"1f6b4-1f3fc","uc":"1f6b4-1f3fc","isCanonical": true},":bicyclist_tone1:":{"unicode":["1f6b4-1f3fb"],"fname":"1f6b4-1f3fb","uc":"1f6b4-1f3fb","isCanonical": true},":rowboat_tone5:":{"unicode":["1f6a3-1f3ff"],"fname":"1f6a3-1f3ff","uc":"1f6a3-1f3ff","isCanonical": true},":rowboat_tone4:":{"unicode":["1f6a3-1f3fe"],"fname":"1f6a3-1f3fe","uc":"1f6a3-1f3fe","isCanonical": true},":rowboat_tone3:":{"unicode":["1f6a3-1f3fd"],"fname":"1f6a3-1f3fd","uc":"1f6a3-1f3fd","isCanonical": true},":rowboat_tone2:":{"unicode":["1f6a3-1f3fc"],"fname":"1f6a3-1f3fc","uc":"1f6a3-1f3fc","isCanonical": true},":rowboat_tone1:":{"unicode":["1f6a3-1f3fb"],"fname":"1f6a3-1f3fb","uc":"1f6a3-1f3fb","isCanonical": true},":pray_tone5:":{"unicode":["1f64f-1f3ff"],"fname":"1f64f-1f3ff","uc":"1f64f-1f3ff","isCanonical": true},":pray_tone4:":{"unicode":["1f64f-1f3fe"],"fname":"1f64f-1f3fe","uc":"1f64f-1f3fe","isCanonical": true},":pray_tone3:":{"unicode":["1f64f-1f3fd"],"fname":"1f64f-1f3fd","uc":"1f64f-1f3fd","isCanonical": true},":pray_tone2:":{"unicode":["1f64f-1f3fc"],"fname":"1f64f-1f3fc","uc":"1f64f-1f3fc","isCanonical": true},":pray_tone1:":{"unicode":["1f64f-1f3fb"],"fname":"1f64f-1f3fb","uc":"1f64f-1f3fb","isCanonical": true},":person_with_pouting_face_tone5:":{"unicode":["1f64e-1f3ff"],"fname":"1f64e-1f3ff","uc":"1f64e-1f3ff","isCanonical": true},":person_with_pouting_face_tone4:":{"unicode":["1f64e-1f3fe"],"fname":"1f64e-1f3fe","uc":"1f64e-1f3fe","isCanonical": true},":person_with_pouting_face_tone3:":{"unicode":["1f64e-1f3fd"],"fname":"1f64e-1f3fd","uc":"1f64e-1f3fd","isCanonical": true},":person_with_pouting_face_tone2:":{"unicode":["1f64e-1f3fc"],"fname":"1f64e-1f3fc","uc":"1f64e-1f3fc","isCanonical": true},":person_with_pouting_face_tone1:":{"unicode":["1f64e-1f3fb"],"fname":"1f64e-1f3fb","uc":"1f64e-1f3fb","isCanonical": true},":person_frowning_tone5:":{"unicode":["1f64d-1f3ff"],"fname":"1f64d-1f3ff","uc":"1f64d-1f3ff","isCanonical": true},":person_frowning_tone4:":{"unicode":["1f64d-1f3fe"],"fname":"1f64d-1f3fe","uc":"1f64d-1f3fe","isCanonical": true},":person_frowning_tone3:":{"unicode":["1f64d-1f3fd"],"fname":"1f64d-1f3fd","uc":"1f64d-1f3fd","isCanonical": true},":person_frowning_tone2:":{"unicode":["1f64d-1f3fc"],"fname":"1f64d-1f3fc","uc":"1f64d-1f3fc","isCanonical": true},":person_frowning_tone1:":{"unicode":["1f64d-1f3fb"],"fname":"1f64d-1f3fb","uc":"1f64d-1f3fb","isCanonical": true},":raised_hands_tone5:":{"unicode":["1f64c-1f3ff"],"fname":"1f64c-1f3ff","uc":"1f64c-1f3ff","isCanonical": true},":raised_hands_tone4:":{"unicode":["1f64c-1f3fe"],"fname":"1f64c-1f3fe","uc":"1f64c-1f3fe","isCanonical": true},":raised_hands_tone3:":{"unicode":["1f64c-1f3fd"],"fname":"1f64c-1f3fd","uc":"1f64c-1f3fd","isCanonical": true},":raised_hands_tone2:":{"unicode":["1f64c-1f3fc"],"fname":"1f64c-1f3fc","uc":"1f64c-1f3fc","isCanonical": true},":raised_hands_tone1:":{"unicode":["1f64c-1f3fb"],"fname":"1f64c-1f3fb","uc":"1f64c-1f3fb","isCanonical": true},":raising_hand_tone5:":{"unicode":["1f64b-1f3ff"],"fname":"1f64b-1f3ff","uc":"1f64b-1f3ff","isCanonical": true},":raising_hand_tone4:":{"unicode":["1f64b-1f3fe"],"fname":"1f64b-1f3fe","uc":"1f64b-1f3fe","isCanonical": true},":raising_hand_tone3:":{"unicode":["1f64b-1f3fd"],"fname":"1f64b-1f3fd","uc":"1f64b-1f3fd","isCanonical": true},":raising_hand_tone2:":{"unicode":["1f64b-1f3fc"],"fname":"1f64b-1f3fc","uc":"1f64b-1f3fc","isCanonical": true},":raising_hand_tone1:":{"unicode":["1f64b-1f3fb"],"fname":"1f64b-1f3fb","uc":"1f64b-1f3fb","isCanonical": true},":bow_tone5:":{"unicode":["1f647-1f3ff"],"fname":"1f647-1f3ff","uc":"1f647-1f3ff","isCanonical": true},":bow_tone4:":{"unicode":["1f647-1f3fe"],"fname":"1f647-1f3fe","uc":"1f647-1f3fe","isCanonical": true},":bow_tone3:":{"unicode":["1f647-1f3fd"],"fname":"1f647-1f3fd","uc":"1f647-1f3fd","isCanonical": true},":bow_tone2:":{"unicode":["1f647-1f3fc"],"fname":"1f647-1f3fc","uc":"1f647-1f3fc","isCanonical": true},":bow_tone1:":{"unicode":["1f647-1f3fb"],"fname":"1f647-1f3fb","uc":"1f647-1f3fb","isCanonical": true},":ok_woman_tone5:":{"unicode":["1f646-1f3ff"],"fname":"1f646-1f3ff","uc":"1f646-1f3ff","isCanonical": true},":ok_woman_tone4:":{"unicode":["1f646-1f3fe"],"fname":"1f646-1f3fe","uc":"1f646-1f3fe","isCanonical": true},":ok_woman_tone3:":{"unicode":["1f646-1f3fd"],"fname":"1f646-1f3fd","uc":"1f646-1f3fd","isCanonical": true},":ok_woman_tone2:":{"unicode":["1f646-1f3fc"],"fname":"1f646-1f3fc","uc":"1f646-1f3fc","isCanonical": true},":ok_woman_tone1:":{"unicode":["1f646-1f3fb"],"fname":"1f646-1f3fb","uc":"1f646-1f3fb","isCanonical": true},":no_good_tone5:":{"unicode":["1f645-1f3ff"],"fname":"1f645-1f3ff","uc":"1f645-1f3ff","isCanonical": true},":no_good_tone4:":{"unicode":["1f645-1f3fe"],"fname":"1f645-1f3fe","uc":"1f645-1f3fe","isCanonical": true},":no_good_tone3:":{"unicode":["1f645-1f3fd"],"fname":"1f645-1f3fd","uc":"1f645-1f3fd","isCanonical": true},":no_good_tone2:":{"unicode":["1f645-1f3fc"],"fname":"1f645-1f3fc","uc":"1f645-1f3fc","isCanonical": true},":no_good_tone1:":{"unicode":["1f645-1f3fb"],"fname":"1f645-1f3fb","uc":"1f645-1f3fb","isCanonical": true},":vulcan_tone5:":{"unicode":["1f596-1f3ff"],"fname":"1f596-1f3ff","uc":"1f596-1f3ff","isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone5:":{"unicode":["1f596-1f3ff"],"fname":"1f596-1f3ff","uc":"1f596-1f3ff","isCanonical": false},":vulcan_tone4:":{"unicode":["1f596-1f3fe"],"fname":"1f596-1f3fe","uc":"1f596-1f3fe","isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone4:":{"unicode":["1f596-1f3fe"],"fname":"1f596-1f3fe","uc":"1f596-1f3fe","isCanonical": false},":vulcan_tone3:":{"unicode":["1f596-1f3fd"],"fname":"1f596-1f3fd","uc":"1f596-1f3fd","isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone3:":{"unicode":["1f596-1f3fd"],"fname":"1f596-1f3fd","uc":"1f596-1f3fd","isCanonical": false},":vulcan_tone2:":{"unicode":["1f596-1f3fc"],"fname":"1f596-1f3fc","uc":"1f596-1f3fc","isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone2:":{"unicode":["1f596-1f3fc"],"fname":"1f596-1f3fc","uc":"1f596-1f3fc","isCanonical": false},":vulcan_tone1:":{"unicode":["1f596-1f3fb"],"fname":"1f596-1f3fb","uc":"1f596-1f3fb","isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone1:":{"unicode":["1f596-1f3fb"],"fname":"1f596-1f3fb","uc":"1f596-1f3fb","isCanonical": false},":middle_finger_tone5:":{"unicode":["1f595-1f3ff"],"fname":"1f595-1f3ff","uc":"1f595-1f3ff","isCanonical": true},":reversed_hand_with_middle_finger_extended_tone5:":{"unicode":["1f595-1f3ff"],"fname":"1f595-1f3ff","uc":"1f595-1f3ff","isCanonical": false},":middle_finger_tone4:":{"unicode":["1f595-1f3fe"],"fname":"1f595-1f3fe","uc":"1f595-1f3fe","isCanonical": true},":reversed_hand_with_middle_finger_extended_tone4:":{"unicode":["1f595-1f3fe"],"fname":"1f595-1f3fe","uc":"1f595-1f3fe","isCanonical": false},":middle_finger_tone3:":{"unicode":["1f595-1f3fd"],"fname":"1f595-1f3fd","uc":"1f595-1f3fd","isCanonical": true},":reversed_hand_with_middle_finger_extended_tone3:":{"unicode":["1f595-1f3fd"],"fname":"1f595-1f3fd","uc":"1f595-1f3fd","isCanonical": false},":middle_finger_tone2:":{"unicode":["1f595-1f3fc"],"fname":"1f595-1f3fc","uc":"1f595-1f3fc","isCanonical": true},":reversed_hand_with_middle_finger_extended_tone2:":{"unicode":["1f595-1f3fc"],"fname":"1f595-1f3fc","uc":"1f595-1f3fc","isCanonical": false},":middle_finger_tone1:":{"unicode":["1f595-1f3fb"],"fname":"1f595-1f3fb","uc":"1f595-1f3fb","isCanonical": true},":reversed_hand_with_middle_finger_extended_tone1:":{"unicode":["1f595-1f3fb"],"fname":"1f595-1f3fb","uc":"1f595-1f3fb","isCanonical": false},":hand_splayed_tone5:":{"unicode":["1f590-1f3ff"],"fname":"1f590-1f3ff","uc":"1f590-1f3ff","isCanonical": true},":raised_hand_with_fingers_splayed_tone5:":{"unicode":["1f590-1f3ff"],"fname":"1f590-1f3ff","uc":"1f590-1f3ff","isCanonical": false},":hand_splayed_tone4:":{"unicode":["1f590-1f3fe"],"fname":"1f590-1f3fe","uc":"1f590-1f3fe","isCanonical": true},":raised_hand_with_fingers_splayed_tone4:":{"unicode":["1f590-1f3fe"],"fname":"1f590-1f3fe","uc":"1f590-1f3fe","isCanonical": false},":hand_splayed_tone3:":{"unicode":["1f590-1f3fd"],"fname":"1f590-1f3fd","uc":"1f590-1f3fd","isCanonical": true},":raised_hand_with_fingers_splayed_tone3:":{"unicode":["1f590-1f3fd"],"fname":"1f590-1f3fd","uc":"1f590-1f3fd","isCanonical": false},":hand_splayed_tone2:":{"unicode":["1f590-1f3fc"],"fname":"1f590-1f3fc","uc":"1f590-1f3fc","isCanonical": true},":raised_hand_with_fingers_splayed_tone2:":{"unicode":["1f590-1f3fc"],"fname":"1f590-1f3fc","uc":"1f590-1f3fc","isCanonical": false},":hand_splayed_tone1:":{"unicode":["1f590-1f3fb"],"fname":"1f590-1f3fb","uc":"1f590-1f3fb","isCanonical": true},":raised_hand_with_fingers_splayed_tone1:":{"unicode":["1f590-1f3fb"],"fname":"1f590-1f3fb","uc":"1f590-1f3fb","isCanonical": false},":man_dancing_tone5:":{"unicode":["1f57a-1f3ff"],"fname":"1f57a-1f3ff","uc":"1f57a-1f3ff","isCanonical": true},":male_dancer_tone5:":{"unicode":["1f57a-1f3ff"],"fname":"1f57a-1f3ff","uc":"1f57a-1f3ff","isCanonical": false},":man_dancing_tone4:":{"unicode":["1f57a-1f3fe"],"fname":"1f57a-1f3fe","uc":"1f57a-1f3fe","isCanonical": true},":male_dancer_tone4:":{"unicode":["1f57a-1f3fe"],"fname":"1f57a-1f3fe","uc":"1f57a-1f3fe","isCanonical": false},":man_dancing_tone3:":{"unicode":["1f57a-1f3fd"],"fname":"1f57a-1f3fd","uc":"1f57a-1f3fd","isCanonical": true},":male_dancer_tone3:":{"unicode":["1f57a-1f3fd"],"fname":"1f57a-1f3fd","uc":"1f57a-1f3fd","isCanonical": false},":man_dancing_tone2:":{"unicode":["1f57a-1f3fc"],"fname":"1f57a-1f3fc","uc":"1f57a-1f3fc","isCanonical": true},":male_dancer_tone2:":{"unicode":["1f57a-1f3fc"],"fname":"1f57a-1f3fc","uc":"1f57a-1f3fc","isCanonical": false},":man_dancing_tone1:":{"unicode":["1f57a-1f3fb"],"fname":"1f57a-1f3fb","uc":"1f57a-1f3fb","isCanonical": true},":male_dancer_tone1:":{"unicode":["1f57a-1f3fb"],"fname":"1f57a-1f3fb","uc":"1f57a-1f3fb","isCanonical": false},":spy_tone5:":{"unicode":["1f575-1f3ff"],"fname":"1f575-1f3ff","uc":"1f575-1f3ff","isCanonical": true},":sleuth_or_spy_tone5:":{"unicode":["1f575-1f3ff"],"fname":"1f575-1f3ff","uc":"1f575-1f3ff","isCanonical": false},":spy_tone4:":{"unicode":["1f575-1f3fe"],"fname":"1f575-1f3fe","uc":"1f575-1f3fe","isCanonical": true},":sleuth_or_spy_tone4:":{"unicode":["1f575-1f3fe"],"fname":"1f575-1f3fe","uc":"1f575-1f3fe","isCanonical": false},":spy_tone3:":{"unicode":["1f575-1f3fd"],"fname":"1f575-1f3fd","uc":"1f575-1f3fd","isCanonical": true},":sleuth_or_spy_tone3:":{"unicode":["1f575-1f3fd"],"fname":"1f575-1f3fd","uc":"1f575-1f3fd","isCanonical": false},":spy_tone2:":{"unicode":["1f575-1f3fc"],"fname":"1f575-1f3fc","uc":"1f575-1f3fc","isCanonical": true},":sleuth_or_spy_tone2:":{"unicode":["1f575-1f3fc"],"fname":"1f575-1f3fc","uc":"1f575-1f3fc","isCanonical": false},":spy_tone1:":{"unicode":["1f575-1f3fb"],"fname":"1f575-1f3fb","uc":"1f575-1f3fb","isCanonical": true},":sleuth_or_spy_tone1:":{"unicode":["1f575-1f3fb"],"fname":"1f575-1f3fb","uc":"1f575-1f3fb","isCanonical": false},":muscle_tone5:":{"unicode":["1f4aa-1f3ff"],"fname":"1f4aa-1f3ff","uc":"1f4aa-1f3ff","isCanonical": true},":muscle_tone4:":{"unicode":["1f4aa-1f3fe"],"fname":"1f4aa-1f3fe","uc":"1f4aa-1f3fe","isCanonical": true},":muscle_tone3:":{"unicode":["1f4aa-1f3fd"],"fname":"1f4aa-1f3fd","uc":"1f4aa-1f3fd","isCanonical": true},":muscle_tone2:":{"unicode":["1f4aa-1f3fc"],"fname":"1f4aa-1f3fc","uc":"1f4aa-1f3fc","isCanonical": true},":muscle_tone1:":{"unicode":["1f4aa-1f3fb"],"fname":"1f4aa-1f3fb","uc":"1f4aa-1f3fb","isCanonical": true},":haircut_tone5:":{"unicode":["1f487-1f3ff"],"fname":"1f487-1f3ff","uc":"1f487-1f3ff","isCanonical": true},":haircut_tone4:":{"unicode":["1f487-1f3fe"],"fname":"1f487-1f3fe","uc":"1f487-1f3fe","isCanonical": true},":haircut_tone3:":{"unicode":["1f487-1f3fd"],"fname":"1f487-1f3fd","uc":"1f487-1f3fd","isCanonical": true},":haircut_tone2:":{"unicode":["1f487-1f3fc"],"fname":"1f487-1f3fc","uc":"1f487-1f3fc","isCanonical": true},":haircut_tone1:":{"unicode":["1f487-1f3fb"],"fname":"1f487-1f3fb","uc":"1f487-1f3fb","isCanonical": true},":massage_tone5:":{"unicode":["1f486-1f3ff"],"fname":"1f486-1f3ff","uc":"1f486-1f3ff","isCanonical": true},":massage_tone4:":{"unicode":["1f486-1f3fe"],"fname":"1f486-1f3fe","uc":"1f486-1f3fe","isCanonical": true},":massage_tone3:":{"unicode":["1f486-1f3fd"],"fname":"1f486-1f3fd","uc":"1f486-1f3fd","isCanonical": true},":massage_tone2:":{"unicode":["1f486-1f3fc"],"fname":"1f486-1f3fc","uc":"1f486-1f3fc","isCanonical": true},":massage_tone1:":{"unicode":["1f486-1f3fb"],"fname":"1f486-1f3fb","uc":"1f486-1f3fb","isCanonical": true},":nail_care_tone5:":{"unicode":["1f485-1f3ff"],"fname":"1f485-1f3ff","uc":"1f485-1f3ff","isCanonical": true},":nail_care_tone4:":{"unicode":["1f485-1f3fe"],"fname":"1f485-1f3fe","uc":"1f485-1f3fe","isCanonical": true},":nail_care_tone3:":{"unicode":["1f485-1f3fd"],"fname":"1f485-1f3fd","uc":"1f485-1f3fd","isCanonical": true},":nail_care_tone2:":{"unicode":["1f485-1f3fc"],"fname":"1f485-1f3fc","uc":"1f485-1f3fc","isCanonical": true},":nail_care_tone1:":{"unicode":["1f485-1f3fb"],"fname":"1f485-1f3fb","uc":"1f485-1f3fb","isCanonical": true},":dancer_tone5:":{"unicode":["1f483-1f3ff"],"fname":"1f483-1f3ff","uc":"1f483-1f3ff","isCanonical": true},":dancer_tone4:":{"unicode":["1f483-1f3fe"],"fname":"1f483-1f3fe","uc":"1f483-1f3fe","isCanonical": true},":dancer_tone3:":{"unicode":["1f483-1f3fd"],"fname":"1f483-1f3fd","uc":"1f483-1f3fd","isCanonical": true},":dancer_tone2:":{"unicode":["1f483-1f3fc"],"fname":"1f483-1f3fc","uc":"1f483-1f3fc","isCanonical": true},":dancer_tone1:":{"unicode":["1f483-1f3fb"],"fname":"1f483-1f3fb","uc":"1f483-1f3fb","isCanonical": true},":guardsman_tone5:":{"unicode":["1f482-1f3ff"],"fname":"1f482-1f3ff","uc":"1f482-1f3ff","isCanonical": true},":guardsman_tone4:":{"unicode":["1f482-1f3fe"],"fname":"1f482-1f3fe","uc":"1f482-1f3fe","isCanonical": true},":guardsman_tone3:":{"unicode":["1f482-1f3fd"],"fname":"1f482-1f3fd","uc":"1f482-1f3fd","isCanonical": true},":guardsman_tone2:":{"unicode":["1f482-1f3fc"],"fname":"1f482-1f3fc","uc":"1f482-1f3fc","isCanonical": true},":guardsman_tone1:":{"unicode":["1f482-1f3fb"],"fname":"1f482-1f3fb","uc":"1f482-1f3fb","isCanonical": true},":information_desk_person_tone5:":{"unicode":["1f481-1f3ff"],"fname":"1f481-1f3ff","uc":"1f481-1f3ff","isCanonical": true},":information_desk_person_tone4:":{"unicode":["1f481-1f3fe"],"fname":"1f481-1f3fe","uc":"1f481-1f3fe","isCanonical": true},":information_desk_person_tone3:":{"unicode":["1f481-1f3fd"],"fname":"1f481-1f3fd","uc":"1f481-1f3fd","isCanonical": true},":information_desk_person_tone2:":{"unicode":["1f481-1f3fc"],"fname":"1f481-1f3fc","uc":"1f481-1f3fc","isCanonical": true},":information_desk_person_tone1:":{"unicode":["1f481-1f3fb"],"fname":"1f481-1f3fb","uc":"1f481-1f3fb","isCanonical": true},":angel_tone5:":{"unicode":["1f47c-1f3ff"],"fname":"1f47c-1f3ff","uc":"1f47c-1f3ff","isCanonical": true},":angel_tone4:":{"unicode":["1f47c-1f3fe"],"fname":"1f47c-1f3fe","uc":"1f47c-1f3fe","isCanonical": true},":angel_tone3:":{"unicode":["1f47c-1f3fd"],"fname":"1f47c-1f3fd","uc":"1f47c-1f3fd","isCanonical": true},":angel_tone2:":{"unicode":["1f47c-1f3fc"],"fname":"1f47c-1f3fc","uc":"1f47c-1f3fc","isCanonical": true},":angel_tone1:":{"unicode":["1f47c-1f3fb"],"fname":"1f47c-1f3fb","uc":"1f47c-1f3fb","isCanonical": true},":princess_tone5:":{"unicode":["1f478-1f3ff"],"fname":"1f478-1f3ff","uc":"1f478-1f3ff","isCanonical": true},":princess_tone4:":{"unicode":["1f478-1f3fe"],"fname":"1f478-1f3fe","uc":"1f478-1f3fe","isCanonical": true},":princess_tone3:":{"unicode":["1f478-1f3fd"],"fname":"1f478-1f3fd","uc":"1f478-1f3fd","isCanonical": true},":princess_tone2:":{"unicode":["1f478-1f3fc"],"fname":"1f478-1f3fc","uc":"1f478-1f3fc","isCanonical": true},":princess_tone1:":{"unicode":["1f478-1f3fb"],"fname":"1f478-1f3fb","uc":"1f478-1f3fb","isCanonical": true},":construction_worker_tone5:":{"unicode":["1f477-1f3ff"],"fname":"1f477-1f3ff","uc":"1f477-1f3ff","isCanonical": true},":construction_worker_tone4:":{"unicode":["1f477-1f3fe"],"fname":"1f477-1f3fe","uc":"1f477-1f3fe","isCanonical": true},":construction_worker_tone3:":{"unicode":["1f477-1f3fd"],"fname":"1f477-1f3fd","uc":"1f477-1f3fd","isCanonical": true},":construction_worker_tone2:":{"unicode":["1f477-1f3fc"],"fname":"1f477-1f3fc","uc":"1f477-1f3fc","isCanonical": true},":construction_worker_tone1:":{"unicode":["1f477-1f3fb"],"fname":"1f477-1f3fb","uc":"1f477-1f3fb","isCanonical": true},":baby_tone5:":{"unicode":["1f476-1f3ff"],"fname":"1f476-1f3ff","uc":"1f476-1f3ff","isCanonical": true},":baby_tone4:":{"unicode":["1f476-1f3fe"],"fname":"1f476-1f3fe","uc":"1f476-1f3fe","isCanonical": true},":baby_tone3:":{"unicode":["1f476-1f3fd"],"fname":"1f476-1f3fd","uc":"1f476-1f3fd","isCanonical": true},":baby_tone2:":{"unicode":["1f476-1f3fc"],"fname":"1f476-1f3fc","uc":"1f476-1f3fc","isCanonical": true},":baby_tone1:":{"unicode":["1f476-1f3fb"],"fname":"1f476-1f3fb","uc":"1f476-1f3fb","isCanonical": true},":older_woman_tone5:":{"unicode":["1f475-1f3ff"],"fname":"1f475-1f3ff","uc":"1f475-1f3ff","isCanonical": true},":grandma_tone5:":{"unicode":["1f475-1f3ff"],"fname":"1f475-1f3ff","uc":"1f475-1f3ff","isCanonical": false},":older_woman_tone4:":{"unicode":["1f475-1f3fe"],"fname":"1f475-1f3fe","uc":"1f475-1f3fe","isCanonical": true},":grandma_tone4:":{"unicode":["1f475-1f3fe"],"fname":"1f475-1f3fe","uc":"1f475-1f3fe","isCanonical": false},":older_woman_tone3:":{"unicode":["1f475-1f3fd"],"fname":"1f475-1f3fd","uc":"1f475-1f3fd","isCanonical": true},":grandma_tone3:":{"unicode":["1f475-1f3fd"],"fname":"1f475-1f3fd","uc":"1f475-1f3fd","isCanonical": false},":older_woman_tone2:":{"unicode":["1f475-1f3fc"],"fname":"1f475-1f3fc","uc":"1f475-1f3fc","isCanonical": true},":grandma_tone2:":{"unicode":["1f475-1f3fc"],"fname":"1f475-1f3fc","uc":"1f475-1f3fc","isCanonical": false},":older_woman_tone1:":{"unicode":["1f475-1f3fb"],"fname":"1f475-1f3fb","uc":"1f475-1f3fb","isCanonical": true},":grandma_tone1:":{"unicode":["1f475-1f3fb"],"fname":"1f475-1f3fb","uc":"1f475-1f3fb","isCanonical": false},":older_man_tone5:":{"unicode":["1f474-1f3ff"],"fname":"1f474-1f3ff","uc":"1f474-1f3ff","isCanonical": true},":older_man_tone4:":{"unicode":["1f474-1f3fe"],"fname":"1f474-1f3fe","uc":"1f474-1f3fe","isCanonical": true},":older_man_tone3:":{"unicode":["1f474-1f3fd"],"fname":"1f474-1f3fd","uc":"1f474-1f3fd","isCanonical": true},":older_man_tone2:":{"unicode":["1f474-1f3fc"],"fname":"1f474-1f3fc","uc":"1f474-1f3fc","isCanonical": true},":older_man_tone1:":{"unicode":["1f474-1f3fb"],"fname":"1f474-1f3fb","uc":"1f474-1f3fb","isCanonical": true},":man_with_turban_tone5:":{"unicode":["1f473-1f3ff"],"fname":"1f473-1f3ff","uc":"1f473-1f3ff","isCanonical": true},":man_with_turban_tone4:":{"unicode":["1f473-1f3fe"],"fname":"1f473-1f3fe","uc":"1f473-1f3fe","isCanonical": true},":man_with_turban_tone3:":{"unicode":["1f473-1f3fd"],"fname":"1f473-1f3fd","uc":"1f473-1f3fd","isCanonical": true},":man_with_turban_tone2:":{"unicode":["1f473-1f3fc"],"fname":"1f473-1f3fc","uc":"1f473-1f3fc","isCanonical": true},":man_with_turban_tone1:":{"unicode":["1f473-1f3fb"],"fname":"1f473-1f3fb","uc":"1f473-1f3fb","isCanonical": true},":man_with_gua_pi_mao_tone5:":{"unicode":["1f472-1f3ff"],"fname":"1f472-1f3ff","uc":"1f472-1f3ff","isCanonical": true},":man_with_gua_pi_mao_tone4:":{"unicode":["1f472-1f3fe"],"fname":"1f472-1f3fe","uc":"1f472-1f3fe","isCanonical": true},":man_with_gua_pi_mao_tone3:":{"unicode":["1f472-1f3fd"],"fname":"1f472-1f3fd","uc":"1f472-1f3fd","isCanonical": true},":man_with_gua_pi_mao_tone2:":{"unicode":["1f472-1f3fc"],"fname":"1f472-1f3fc","uc":"1f472-1f3fc","isCanonical": true},":man_with_gua_pi_mao_tone1:":{"unicode":["1f472-1f3fb"],"fname":"1f472-1f3fb","uc":"1f472-1f3fb","isCanonical": true},":person_with_blond_hair_tone5:":{"unicode":["1f471-1f3ff"],"fname":"1f471-1f3ff","uc":"1f471-1f3ff","isCanonical": true},":person_with_blond_hair_tone4:":{"unicode":["1f471-1f3fe"],"fname":"1f471-1f3fe","uc":"1f471-1f3fe","isCanonical": true},":person_with_blond_hair_tone3:":{"unicode":["1f471-1f3fd"],"fname":"1f471-1f3fd","uc":"1f471-1f3fd","isCanonical": true},":person_with_blond_hair_tone2:":{"unicode":["1f471-1f3fc"],"fname":"1f471-1f3fc","uc":"1f471-1f3fc","isCanonical": true},":person_with_blond_hair_tone1:":{"unicode":["1f471-1f3fb"],"fname":"1f471-1f3fb","uc":"1f471-1f3fb","isCanonical": true},":bride_with_veil_tone5:":{"unicode":["1f470-1f3ff"],"fname":"1f470-1f3ff","uc":"1f470-1f3ff","isCanonical": true},":bride_with_veil_tone4:":{"unicode":["1f470-1f3fe"],"fname":"1f470-1f3fe","uc":"1f470-1f3fe","isCanonical": true},":bride_with_veil_tone3:":{"unicode":["1f470-1f3fd"],"fname":"1f470-1f3fd","uc":"1f470-1f3fd","isCanonical": true},":bride_with_veil_tone2:":{"unicode":["1f470-1f3fc"],"fname":"1f470-1f3fc","uc":"1f470-1f3fc","isCanonical": true},":bride_with_veil_tone1:":{"unicode":["1f470-1f3fb"],"fname":"1f470-1f3fb","uc":"1f470-1f3fb","isCanonical": true},":cop_tone5:":{"unicode":["1f46e-1f3ff"],"fname":"1f46e-1f3ff","uc":"1f46e-1f3ff","isCanonical": true},":cop_tone4:":{"unicode":["1f46e-1f3fe"],"fname":"1f46e-1f3fe","uc":"1f46e-1f3fe","isCanonical": true},":cop_tone3:":{"unicode":["1f46e-1f3fd"],"fname":"1f46e-1f3fd","uc":"1f46e-1f3fd","isCanonical": true},":cop_tone2:":{"unicode":["1f46e-1f3fc"],"fname":"1f46e-1f3fc","uc":"1f46e-1f3fc","isCanonical": true},":cop_tone1:":{"unicode":["1f46e-1f3fb"],"fname":"1f46e-1f3fb","uc":"1f46e-1f3fb","isCanonical": true},":woman_tone5:":{"unicode":["1f469-1f3ff"],"fname":"1f469-1f3ff","uc":"1f469-1f3ff","isCanonical": true},":woman_tone4:":{"unicode":["1f469-1f3fe"],"fname":"1f469-1f3fe","uc":"1f469-1f3fe","isCanonical": true},":woman_tone3:":{"unicode":["1f469-1f3fd"],"fname":"1f469-1f3fd","uc":"1f469-1f3fd","isCanonical": true},":woman_tone2:":{"unicode":["1f469-1f3fc"],"fname":"1f469-1f3fc","uc":"1f469-1f3fc","isCanonical": true},":woman_tone1:":{"unicode":["1f469-1f3fb"],"fname":"1f469-1f3fb","uc":"1f469-1f3fb","isCanonical": true},":man_tone5:":{"unicode":["1f468-1f3ff"],"fname":"1f468-1f3ff","uc":"1f468-1f3ff","isCanonical": true},":man_tone4:":{"unicode":["1f468-1f3fe"],"fname":"1f468-1f3fe","uc":"1f468-1f3fe","isCanonical": true},":man_tone3:":{"unicode":["1f468-1f3fd"],"fname":"1f468-1f3fd","uc":"1f468-1f3fd","isCanonical": true},":man_tone2:":{"unicode":["1f468-1f3fc"],"fname":"1f468-1f3fc","uc":"1f468-1f3fc","isCanonical": true},":man_tone1:":{"unicode":["1f468-1f3fb"],"fname":"1f468-1f3fb","uc":"1f468-1f3fb","isCanonical": true},":girl_tone5:":{"unicode":["1f467-1f3ff"],"fname":"1f467-1f3ff","uc":"1f467-1f3ff","isCanonical": true},":girl_tone4:":{"unicode":["1f467-1f3fe"],"fname":"1f467-1f3fe","uc":"1f467-1f3fe","isCanonical": true},":girl_tone3:":{"unicode":["1f467-1f3fd"],"fname":"1f467-1f3fd","uc":"1f467-1f3fd","isCanonical": true},":girl_tone2:":{"unicode":["1f467-1f3fc"],"fname":"1f467-1f3fc","uc":"1f467-1f3fc","isCanonical": true},":girl_tone1:":{"unicode":["1f467-1f3fb"],"fname":"1f467-1f3fb","uc":"1f467-1f3fb","isCanonical": true},":boy_tone5:":{"unicode":["1f466-1f3ff"],"fname":"1f466-1f3ff","uc":"1f466-1f3ff","isCanonical": true},":boy_tone4:":{"unicode":["1f466-1f3fe"],"fname":"1f466-1f3fe","uc":"1f466-1f3fe","isCanonical": true},":boy_tone3:":{"unicode":["1f466-1f3fd"],"fname":"1f466-1f3fd","uc":"1f466-1f3fd","isCanonical": true},":boy_tone2:":{"unicode":["1f466-1f3fc"],"fname":"1f466-1f3fc","uc":"1f466-1f3fc","isCanonical": true},":boy_tone1:":{"unicode":["1f466-1f3fb"],"fname":"1f466-1f3fb","uc":"1f466-1f3fb","isCanonical": true},":open_hands_tone5:":{"unicode":["1f450-1f3ff"],"fname":"1f450-1f3ff","uc":"1f450-1f3ff","isCanonical": true},":open_hands_tone4:":{"unicode":["1f450-1f3fe"],"fname":"1f450-1f3fe","uc":"1f450-1f3fe","isCanonical": true},":open_hands_tone3:":{"unicode":["1f450-1f3fd"],"fname":"1f450-1f3fd","uc":"1f450-1f3fd","isCanonical": true},":open_hands_tone2:":{"unicode":["1f450-1f3fc"],"fname":"1f450-1f3fc","uc":"1f450-1f3fc","isCanonical": true},":open_hands_tone1:":{"unicode":["1f450-1f3fb"],"fname":"1f450-1f3fb","uc":"1f450-1f3fb","isCanonical": true},":clap_tone5:":{"unicode":["1f44f-1f3ff"],"fname":"1f44f-1f3ff","uc":"1f44f-1f3ff","isCanonical": true},":clap_tone4:":{"unicode":["1f44f-1f3fe"],"fname":"1f44f-1f3fe","uc":"1f44f-1f3fe","isCanonical": true},":clap_tone3:":{"unicode":["1f44f-1f3fd"],"fname":"1f44f-1f3fd","uc":"1f44f-1f3fd","isCanonical": true},":clap_tone2:":{"unicode":["1f44f-1f3fc"],"fname":"1f44f-1f3fc","uc":"1f44f-1f3fc","isCanonical": true},":clap_tone1:":{"unicode":["1f44f-1f3fb"],"fname":"1f44f-1f3fb","uc":"1f44f-1f3fb","isCanonical": true},":thumbsdown_tone5:":{"unicode":["1f44e-1f3ff"],"fname":"1f44e-1f3ff","uc":"1f44e-1f3ff","isCanonical": true},":-1_tone5:":{"unicode":["1f44e-1f3ff"],"fname":"1f44e-1f3ff","uc":"1f44e-1f3ff","isCanonical": false},":thumbdown_tone5:":{"unicode":["1f44e-1f3ff"],"fname":"1f44e-1f3ff","uc":"1f44e-1f3ff","isCanonical": false},":thumbsdown_tone4:":{"unicode":["1f44e-1f3fe"],"fname":"1f44e-1f3fe","uc":"1f44e-1f3fe","isCanonical": true},":-1_tone4:":{"unicode":["1f44e-1f3fe"],"fname":"1f44e-1f3fe","uc":"1f44e-1f3fe","isCanonical": false},":thumbdown_tone4:":{"unicode":["1f44e-1f3fe"],"fname":"1f44e-1f3fe","uc":"1f44e-1f3fe","isCanonical": false},":thumbsdown_tone3:":{"unicode":["1f44e-1f3fd"],"fname":"1f44e-1f3fd","uc":"1f44e-1f3fd","isCanonical": true},":-1_tone3:":{"unicode":["1f44e-1f3fd"],"fname":"1f44e-1f3fd","uc":"1f44e-1f3fd","isCanonical": false},":thumbdown_tone3:":{"unicode":["1f44e-1f3fd"],"fname":"1f44e-1f3fd","uc":"1f44e-1f3fd","isCanonical": false},":thumbsdown_tone2:":{"unicode":["1f44e-1f3fc"],"fname":"1f44e-1f3fc","uc":"1f44e-1f3fc","isCanonical": true},":-1_tone2:":{"unicode":["1f44e-1f3fc"],"fname":"1f44e-1f3fc","uc":"1f44e-1f3fc","isCanonical": false},":thumbdown_tone2:":{"unicode":["1f44e-1f3fc"],"fname":"1f44e-1f3fc","uc":"1f44e-1f3fc","isCanonical": false},":thumbsdown_tone1:":{"unicode":["1f44e-1f3fb"],"fname":"1f44e-1f3fb","uc":"1f44e-1f3fb","isCanonical": true},":-1_tone1:":{"unicode":["1f44e-1f3fb"],"fname":"1f44e-1f3fb","uc":"1f44e-1f3fb","isCanonical": false},":thumbdown_tone1:":{"unicode":["1f44e-1f3fb"],"fname":"1f44e-1f3fb","uc":"1f44e-1f3fb","isCanonical": false},":thumbsup_tone5:":{"unicode":["1f44d-1f3ff"],"fname":"1f44d-1f3ff","uc":"1f44d-1f3ff","isCanonical": true},":+1_tone5:":{"unicode":["1f44d-1f3ff"],"fname":"1f44d-1f3ff","uc":"1f44d-1f3ff","isCanonical": false},":thumbup_tone5:":{"unicode":["1f44d-1f3ff"],"fname":"1f44d-1f3ff","uc":"1f44d-1f3ff","isCanonical": false},":thumbsup_tone4:":{"unicode":["1f44d-1f3fe"],"fname":"1f44d-1f3fe","uc":"1f44d-1f3fe","isCanonical": true},":+1_tone4:":{"unicode":["1f44d-1f3fe"],"fname":"1f44d-1f3fe","uc":"1f44d-1f3fe","isCanonical": false},":thumbup_tone4:":{"unicode":["1f44d-1f3fe"],"fname":"1f44d-1f3fe","uc":"1f44d-1f3fe","isCanonical": false},":thumbsup_tone3:":{"unicode":["1f44d-1f3fd"],"fname":"1f44d-1f3fd","uc":"1f44d-1f3fd","isCanonical": true},":+1_tone3:":{"unicode":["1f44d-1f3fd"],"fname":"1f44d-1f3fd","uc":"1f44d-1f3fd","isCanonical": false},":thumbup_tone3:":{"unicode":["1f44d-1f3fd"],"fname":"1f44d-1f3fd","uc":"1f44d-1f3fd","isCanonical": false},":thumbsup_tone2:":{"unicode":["1f44d-1f3fc"],"fname":"1f44d-1f3fc","uc":"1f44d-1f3fc","isCanonical": true},":+1_tone2:":{"unicode":["1f44d-1f3fc"],"fname":"1f44d-1f3fc","uc":"1f44d-1f3fc","isCanonical": false},":thumbup_tone2:":{"unicode":["1f44d-1f3fc"],"fname":"1f44d-1f3fc","uc":"1f44d-1f3fc","isCanonical": false},":thumbsup_tone1:":{"unicode":["1f44d-1f3fb"],"fname":"1f44d-1f3fb","uc":"1f44d-1f3fb","isCanonical": true},":+1_tone1:":{"unicode":["1f44d-1f3fb"],"fname":"1f44d-1f3fb","uc":"1f44d-1f3fb","isCanonical": false},":thumbup_tone1:":{"unicode":["1f44d-1f3fb"],"fname":"1f44d-1f3fb","uc":"1f44d-1f3fb","isCanonical": false},":ok_hand_tone5:":{"unicode":["1f44c-1f3ff"],"fname":"1f44c-1f3ff","uc":"1f44c-1f3ff","isCanonical": true},":ok_hand_tone4:":{"unicode":["1f44c-1f3fe"],"fname":"1f44c-1f3fe","uc":"1f44c-1f3fe","isCanonical": true},":ok_hand_tone3:":{"unicode":["1f44c-1f3fd"],"fname":"1f44c-1f3fd","uc":"1f44c-1f3fd","isCanonical": true},":ok_hand_tone2:":{"unicode":["1f44c-1f3fc"],"fname":"1f44c-1f3fc","uc":"1f44c-1f3fc","isCanonical": true},":ok_hand_tone1:":{"unicode":["1f44c-1f3fb"],"fname":"1f44c-1f3fb","uc":"1f44c-1f3fb","isCanonical": true},":wave_tone5:":{"unicode":["1f44b-1f3ff"],"fname":"1f44b-1f3ff","uc":"1f44b-1f3ff","isCanonical": true},":wave_tone4:":{"unicode":["1f44b-1f3fe"],"fname":"1f44b-1f3fe","uc":"1f44b-1f3fe","isCanonical": true},":wave_tone3:":{"unicode":["1f44b-1f3fd"],"fname":"1f44b-1f3fd","uc":"1f44b-1f3fd","isCanonical": true},":wave_tone2:":{"unicode":["1f44b-1f3fc"],"fname":"1f44b-1f3fc","uc":"1f44b-1f3fc","isCanonical": true},":wave_tone1:":{"unicode":["1f44b-1f3fb"],"fname":"1f44b-1f3fb","uc":"1f44b-1f3fb","isCanonical": true},":punch_tone5:":{"unicode":["1f44a-1f3ff"],"fname":"1f44a-1f3ff","uc":"1f44a-1f3ff","isCanonical": true},":punch_tone4:":{"unicode":["1f44a-1f3fe"],"fname":"1f44a-1f3fe","uc":"1f44a-1f3fe","isCanonical": true},":punch_tone3:":{"unicode":["1f44a-1f3fd"],"fname":"1f44a-1f3fd","uc":"1f44a-1f3fd","isCanonical": true},":punch_tone2:":{"unicode":["1f44a-1f3fc"],"fname":"1f44a-1f3fc","uc":"1f44a-1f3fc","isCanonical": true},":punch_tone1:":{"unicode":["1f44a-1f3fb"],"fname":"1f44a-1f3fb","uc":"1f44a-1f3fb","isCanonical": true},":point_right_tone5:":{"unicode":["1f449-1f3ff"],"fname":"1f449-1f3ff","uc":"1f449-1f3ff","isCanonical": true},":point_right_tone4:":{"unicode":["1f449-1f3fe"],"fname":"1f449-1f3fe","uc":"1f449-1f3fe","isCanonical": true},":point_right_tone3:":{"unicode":["1f449-1f3fd"],"fname":"1f449-1f3fd","uc":"1f449-1f3fd","isCanonical": true},":point_right_tone2:":{"unicode":["1f449-1f3fc"],"fname":"1f449-1f3fc","uc":"1f449-1f3fc","isCanonical": true},":point_right_tone1:":{"unicode":["1f449-1f3fb"],"fname":"1f449-1f3fb","uc":"1f449-1f3fb","isCanonical": true},":point_left_tone5:":{"unicode":["1f448-1f3ff"],"fname":"1f448-1f3ff","uc":"1f448-1f3ff","isCanonical": true},":point_left_tone4:":{"unicode":["1f448-1f3fe"],"fname":"1f448-1f3fe","uc":"1f448-1f3fe","isCanonical": true},":point_left_tone3:":{"unicode":["1f448-1f3fd"],"fname":"1f448-1f3fd","uc":"1f448-1f3fd","isCanonical": true},":point_left_tone2:":{"unicode":["1f448-1f3fc"],"fname":"1f448-1f3fc","uc":"1f448-1f3fc","isCanonical": true},":point_left_tone1:":{"unicode":["1f448-1f3fb"],"fname":"1f448-1f3fb","uc":"1f448-1f3fb","isCanonical": true},":point_down_tone5:":{"unicode":["1f447-1f3ff"],"fname":"1f447-1f3ff","uc":"1f447-1f3ff","isCanonical": true},":point_down_tone4:":{"unicode":["1f447-1f3fe"],"fname":"1f447-1f3fe","uc":"1f447-1f3fe","isCanonical": true},":point_down_tone3:":{"unicode":["1f447-1f3fd"],"fname":"1f447-1f3fd","uc":"1f447-1f3fd","isCanonical": true},":point_down_tone2:":{"unicode":["1f447-1f3fc"],"fname":"1f447-1f3fc","uc":"1f447-1f3fc","isCanonical": true},":point_down_tone1:":{"unicode":["1f447-1f3fb"],"fname":"1f447-1f3fb","uc":"1f447-1f3fb","isCanonical": true},":point_up_2_tone5:":{"unicode":["1f446-1f3ff"],"fname":"1f446-1f3ff","uc":"1f446-1f3ff","isCanonical": true},":point_up_2_tone4:":{"unicode":["1f446-1f3fe"],"fname":"1f446-1f3fe","uc":"1f446-1f3fe","isCanonical": true},":point_up_2_tone3:":{"unicode":["1f446-1f3fd"],"fname":"1f446-1f3fd","uc":"1f446-1f3fd","isCanonical": true},":point_up_2_tone2:":{"unicode":["1f446-1f3fc"],"fname":"1f446-1f3fc","uc":"1f446-1f3fc","isCanonical": true},":point_up_2_tone1:":{"unicode":["1f446-1f3fb"],"fname":"1f446-1f3fb","uc":"1f446-1f3fb","isCanonical": true},":nose_tone5:":{"unicode":["1f443-1f3ff"],"fname":"1f443-1f3ff","uc":"1f443-1f3ff","isCanonical": true},":nose_tone4:":{"unicode":["1f443-1f3fe"],"fname":"1f443-1f3fe","uc":"1f443-1f3fe","isCanonical": true},":nose_tone3:":{"unicode":["1f443-1f3fd"],"fname":"1f443-1f3fd","uc":"1f443-1f3fd","isCanonical": true},":nose_tone2:":{"unicode":["1f443-1f3fc"],"fname":"1f443-1f3fc","uc":"1f443-1f3fc","isCanonical": true},":nose_tone1:":{"unicode":["1f443-1f3fb"],"fname":"1f443-1f3fb","uc":"1f443-1f3fb","isCanonical": true},":ear_tone5:":{"unicode":["1f442-1f3ff"],"fname":"1f442-1f3ff","uc":"1f442-1f3ff","isCanonical": true},":ear_tone4:":{"unicode":["1f442-1f3fe"],"fname":"1f442-1f3fe","uc":"1f442-1f3fe","isCanonical": true},":ear_tone3:":{"unicode":["1f442-1f3fd"],"fname":"1f442-1f3fd","uc":"1f442-1f3fd","isCanonical": true},":ear_tone2:":{"unicode":["1f442-1f3fc"],"fname":"1f442-1f3fc","uc":"1f442-1f3fc","isCanonical": true},":ear_tone1:":{"unicode":["1f442-1f3fb"],"fname":"1f442-1f3fb","uc":"1f442-1f3fb","isCanonical": true},":lifter_tone5:":{"unicode":["1f3cb-1f3ff"],"fname":"1f3cb-1f3ff","uc":"1f3cb-1f3ff","isCanonical": true},":weight_lifter_tone5:":{"unicode":["1f3cb-1f3ff"],"fname":"1f3cb-1f3ff","uc":"1f3cb-1f3ff","isCanonical": false},":lifter_tone4:":{"unicode":["1f3cb-1f3fe"],"fname":"1f3cb-1f3fe","uc":"1f3cb-1f3fe","isCanonical": true},":weight_lifter_tone4:":{"unicode":["1f3cb-1f3fe"],"fname":"1f3cb-1f3fe","uc":"1f3cb-1f3fe","isCanonical": false},":lifter_tone3:":{"unicode":["1f3cb-1f3fd"],"fname":"1f3cb-1f3fd","uc":"1f3cb-1f3fd","isCanonical": true},":weight_lifter_tone3:":{"unicode":["1f3cb-1f3fd"],"fname":"1f3cb-1f3fd","uc":"1f3cb-1f3fd","isCanonical": false},":lifter_tone2:":{"unicode":["1f3cb-1f3fc"],"fname":"1f3cb-1f3fc","uc":"1f3cb-1f3fc","isCanonical": true},":weight_lifter_tone2:":{"unicode":["1f3cb-1f3fc"],"fname":"1f3cb-1f3fc","uc":"1f3cb-1f3fc","isCanonical": false},":lifter_tone1:":{"unicode":["1f3cb-1f3fb"],"fname":"1f3cb-1f3fb","uc":"1f3cb-1f3fb","isCanonical": true},":weight_lifter_tone1:":{"unicode":["1f3cb-1f3fb"],"fname":"1f3cb-1f3fb","uc":"1f3cb-1f3fb","isCanonical": false},":swimmer_tone5:":{"unicode":["1f3ca-1f3ff"],"fname":"1f3ca-1f3ff","uc":"1f3ca-1f3ff","isCanonical": true},":swimmer_tone4:":{"unicode":["1f3ca-1f3fe"],"fname":"1f3ca-1f3fe","uc":"1f3ca-1f3fe","isCanonical": true},":swimmer_tone3:":{"unicode":["1f3ca-1f3fd"],"fname":"1f3ca-1f3fd","uc":"1f3ca-1f3fd","isCanonical": true},":swimmer_tone2:":{"unicode":["1f3ca-1f3fc"],"fname":"1f3ca-1f3fc","uc":"1f3ca-1f3fc","isCanonical": true},":swimmer_tone1:":{"unicode":["1f3ca-1f3fb"],"fname":"1f3ca-1f3fb","uc":"1f3ca-1f3fb","isCanonical": true},":horse_racing_tone5:":{"unicode":["1f3c7-1f3ff"],"fname":"1f3c7-1f3ff","uc":"1f3c7-1f3ff","isCanonical": true},":horse_racing_tone4:":{"unicode":["1f3c7-1f3fe"],"fname":"1f3c7-1f3fe","uc":"1f3c7-1f3fe","isCanonical": true},":horse_racing_tone3:":{"unicode":["1f3c7-1f3fd"],"fname":"1f3c7-1f3fd","uc":"1f3c7-1f3fd","isCanonical": true},":horse_racing_tone2:":{"unicode":["1f3c7-1f3fc"],"fname":"1f3c7-1f3fc","uc":"1f3c7-1f3fc","isCanonical": true},":horse_racing_tone1:":{"unicode":["1f3c7-1f3fb"],"fname":"1f3c7-1f3fb","uc":"1f3c7-1f3fb","isCanonical": true},":surfer_tone5:":{"unicode":["1f3c4-1f3ff"],"fname":"1f3c4-1f3ff","uc":"1f3c4-1f3ff","isCanonical": true},":surfer_tone4:":{"unicode":["1f3c4-1f3fe"],"fname":"1f3c4-1f3fe","uc":"1f3c4-1f3fe","isCanonical": true},":surfer_tone3:":{"unicode":["1f3c4-1f3fd"],"fname":"1f3c4-1f3fd","uc":"1f3c4-1f3fd","isCanonical": true},":surfer_tone2:":{"unicode":["1f3c4-1f3fc"],"fname":"1f3c4-1f3fc","uc":"1f3c4-1f3fc","isCanonical": true},":surfer_tone1:":{"unicode":["1f3c4-1f3fb"],"fname":"1f3c4-1f3fb","uc":"1f3c4-1f3fb","isCanonical": true},":runner_tone5:":{"unicode":["1f3c3-1f3ff"],"fname":"1f3c3-1f3ff","uc":"1f3c3-1f3ff","isCanonical": true},":runner_tone4:":{"unicode":["1f3c3-1f3fe"],"fname":"1f3c3-1f3fe","uc":"1f3c3-1f3fe","isCanonical": true},":runner_tone3:":{"unicode":["1f3c3-1f3fd"],"fname":"1f3c3-1f3fd","uc":"1f3c3-1f3fd","isCanonical": true},":runner_tone2:":{"unicode":["1f3c3-1f3fc"],"fname":"1f3c3-1f3fc","uc":"1f3c3-1f3fc","isCanonical": true},":runner_tone1:":{"unicode":["1f3c3-1f3fb"],"fname":"1f3c3-1f3fb","uc":"1f3c3-1f3fb","isCanonical": true},":santa_tone5:":{"unicode":["1f385-1f3ff"],"fname":"1f385-1f3ff","uc":"1f385-1f3ff","isCanonical": true},":santa_tone4:":{"unicode":["1f385-1f3fe"],"fname":"1f385-1f3fe","uc":"1f385-1f3fe","isCanonical": true},":santa_tone3:":{"unicode":["1f385-1f3fd"],"fname":"1f385-1f3fd","uc":"1f385-1f3fd","isCanonical": true},":santa_tone2:":{"unicode":["1f385-1f3fc"],"fname":"1f385-1f3fc","uc":"1f385-1f3fc","isCanonical": true},":santa_tone1:":{"unicode":["1f385-1f3fb"],"fname":"1f385-1f3fb","uc":"1f385-1f3fb","isCanonical": true},":flag_zw:":{"unicode":["1f1ff-1f1fc"],"fname":"1f1ff-1f1fc","uc":"1f1ff-1f1fc","isCanonical": true},":zw:":{"unicode":["1f1ff-1f1fc"],"fname":"1f1ff-1f1fc","uc":"1f1ff-1f1fc","isCanonical": false},":flag_zm:":{"unicode":["1f1ff-1f1f2"],"fname":"1f1ff-1f1f2","uc":"1f1ff-1f1f2","isCanonical": true},":zm:":{"unicode":["1f1ff-1f1f2"],"fname":"1f1ff-1f1f2","uc":"1f1ff-1f1f2","isCanonical": false},":flag_za:":{"unicode":["1f1ff-1f1e6"],"fname":"1f1ff-1f1e6","uc":"1f1ff-1f1e6","isCanonical": true},":za:":{"unicode":["1f1ff-1f1e6"],"fname":"1f1ff-1f1e6","uc":"1f1ff-1f1e6","isCanonical": false},":flag_yt:":{"unicode":["1f1fe-1f1f9"],"fname":"1f1fe-1f1f9","uc":"1f1fe-1f1f9","isCanonical": true},":yt:":{"unicode":["1f1fe-1f1f9"],"fname":"1f1fe-1f1f9","uc":"1f1fe-1f1f9","isCanonical": false},":flag_ye:":{"unicode":["1f1fe-1f1ea"],"fname":"1f1fe-1f1ea","uc":"1f1fe-1f1ea","isCanonical": true},":ye:":{"unicode":["1f1fe-1f1ea"],"fname":"1f1fe-1f1ea","uc":"1f1fe-1f1ea","isCanonical": false},":flag_xk:":{"unicode":["1f1fd-1f1f0"],"fname":"1f1fd-1f1f0","uc":"1f1fd-1f1f0","isCanonical": true},":xk:":{"unicode":["1f1fd-1f1f0"],"fname":"1f1fd-1f1f0","uc":"1f1fd-1f1f0","isCanonical": false},":flag_ws:":{"unicode":["1f1fc-1f1f8"],"fname":"1f1fc-1f1f8","uc":"1f1fc-1f1f8","isCanonical": true},":ws:":{"unicode":["1f1fc-1f1f8"],"fname":"1f1fc-1f1f8","uc":"1f1fc-1f1f8","isCanonical": false},":flag_wf:":{"unicode":["1f1fc-1f1eb"],"fname":"1f1fc-1f1eb","uc":"1f1fc-1f1eb","isCanonical": true},":wf:":{"unicode":["1f1fc-1f1eb"],"fname":"1f1fc-1f1eb","uc":"1f1fc-1f1eb","isCanonical": false},":flag_vu:":{"unicode":["1f1fb-1f1fa"],"fname":"1f1fb-1f1fa","uc":"1f1fb-1f1fa","isCanonical": true},":vu:":{"unicode":["1f1fb-1f1fa"],"fname":"1f1fb-1f1fa","uc":"1f1fb-1f1fa","isCanonical": false},":flag_vn:":{"unicode":["1f1fb-1f1f3"],"fname":"1f1fb-1f1f3","uc":"1f1fb-1f1f3","isCanonical": true},":vn:":{"unicode":["1f1fb-1f1f3"],"fname":"1f1fb-1f1f3","uc":"1f1fb-1f1f3","isCanonical": false},":flag_vi:":{"unicode":["1f1fb-1f1ee"],"fname":"1f1fb-1f1ee","uc":"1f1fb-1f1ee","isCanonical": true},":vi:":{"unicode":["1f1fb-1f1ee"],"fname":"1f1fb-1f1ee","uc":"1f1fb-1f1ee","isCanonical": false},":flag_vg:":{"unicode":["1f1fb-1f1ec"],"fname":"1f1fb-1f1ec","uc":"1f1fb-1f1ec","isCanonical": true},":vg:":{"unicode":["1f1fb-1f1ec"],"fname":"1f1fb-1f1ec","uc":"1f1fb-1f1ec","isCanonical": false},":flag_ve:":{"unicode":["1f1fb-1f1ea"],"fname":"1f1fb-1f1ea","uc":"1f1fb-1f1ea","isCanonical": true},":ve:":{"unicode":["1f1fb-1f1ea"],"fname":"1f1fb-1f1ea","uc":"1f1fb-1f1ea","isCanonical": false},":flag_vc:":{"unicode":["1f1fb-1f1e8"],"fname":"1f1fb-1f1e8","uc":"1f1fb-1f1e8","isCanonical": true},":vc:":{"unicode":["1f1fb-1f1e8"],"fname":"1f1fb-1f1e8","uc":"1f1fb-1f1e8","isCanonical": false},":flag_va:":{"unicode":["1f1fb-1f1e6"],"fname":"1f1fb-1f1e6","uc":"1f1fb-1f1e6","isCanonical": true},":va:":{"unicode":["1f1fb-1f1e6"],"fname":"1f1fb-1f1e6","uc":"1f1fb-1f1e6","isCanonical": false},":flag_uz:":{"unicode":["1f1fa-1f1ff"],"fname":"1f1fa-1f1ff","uc":"1f1fa-1f1ff","isCanonical": true},":uz:":{"unicode":["1f1fa-1f1ff"],"fname":"1f1fa-1f1ff","uc":"1f1fa-1f1ff","isCanonical": false},":flag_uy:":{"unicode":["1f1fa-1f1fe"],"fname":"1f1fa-1f1fe","uc":"1f1fa-1f1fe","isCanonical": true},":uy:":{"unicode":["1f1fa-1f1fe"],"fname":"1f1fa-1f1fe","uc":"1f1fa-1f1fe","isCanonical": false},":flag_us:":{"unicode":["1f1fa-1f1f8"],"fname":"1f1fa-1f1f8","uc":"1f1fa-1f1f8","isCanonical": true},":us:":{"unicode":["1f1fa-1f1f8"],"fname":"1f1fa-1f1f8","uc":"1f1fa-1f1f8","isCanonical": false},":flag_um:":{"unicode":["1f1fa-1f1f2"],"fname":"1f1fa-1f1f2","uc":"1f1fa-1f1f2","isCanonical": true},":um:":{"unicode":["1f1fa-1f1f2"],"fname":"1f1fa-1f1f2","uc":"1f1fa-1f1f2","isCanonical": false},":flag_ug:":{"unicode":["1f1fa-1f1ec"],"fname":"1f1fa-1f1ec","uc":"1f1fa-1f1ec","isCanonical": true},":ug:":{"unicode":["1f1fa-1f1ec"],"fname":"1f1fa-1f1ec","uc":"1f1fa-1f1ec","isCanonical": false},":flag_ua:":{"unicode":["1f1fa-1f1e6"],"fname":"1f1fa-1f1e6","uc":"1f1fa-1f1e6","isCanonical": true},":ua:":{"unicode":["1f1fa-1f1e6"],"fname":"1f1fa-1f1e6","uc":"1f1fa-1f1e6","isCanonical": false},":flag_tz:":{"unicode":["1f1f9-1f1ff"],"fname":"1f1f9-1f1ff","uc":"1f1f9-1f1ff","isCanonical": true},":tz:":{"unicode":["1f1f9-1f1ff"],"fname":"1f1f9-1f1ff","uc":"1f1f9-1f1ff","isCanonical": false},":flag_tw:":{"unicode":["1f1f9-1f1fc"],"fname":"1f1f9-1f1fc","uc":"1f1f9-1f1fc","isCanonical": true},":tw:":{"unicode":["1f1f9-1f1fc"],"fname":"1f1f9-1f1fc","uc":"1f1f9-1f1fc","isCanonical": false},":flag_tv:":{"unicode":["1f1f9-1f1fb"],"fname":"1f1f9-1f1fb","uc":"1f1f9-1f1fb","isCanonical": true},":tuvalu:":{"unicode":["1f1f9-1f1fb"],"fname":"1f1f9-1f1fb","uc":"1f1f9-1f1fb","isCanonical": false},":flag_tt:":{"unicode":["1f1f9-1f1f9"],"fname":"1f1f9-1f1f9","uc":"1f1f9-1f1f9","isCanonical": true},":tt:":{"unicode":["1f1f9-1f1f9"],"fname":"1f1f9-1f1f9","uc":"1f1f9-1f1f9","isCanonical": false},":flag_tr:":{"unicode":["1f1f9-1f1f7"],"fname":"1f1f9-1f1f7","uc":"1f1f9-1f1f7","isCanonical": true},":tr:":{"unicode":["1f1f9-1f1f7"],"fname":"1f1f9-1f1f7","uc":"1f1f9-1f1f7","isCanonical": false},":flag_to:":{"unicode":["1f1f9-1f1f4"],"fname":"1f1f9-1f1f4","uc":"1f1f9-1f1f4","isCanonical": true},":to:":{"unicode":["1f1f9-1f1f4"],"fname":"1f1f9-1f1f4","uc":"1f1f9-1f1f4","isCanonical": false},":flag_tn:":{"unicode":["1f1f9-1f1f3"],"fname":"1f1f9-1f1f3","uc":"1f1f9-1f1f3","isCanonical": true},":tn:":{"unicode":["1f1f9-1f1f3"],"fname":"1f1f9-1f1f3","uc":"1f1f9-1f1f3","isCanonical": false},":flag_tm:":{"unicode":["1f1f9-1f1f2"],"fname":"1f1f9-1f1f2","uc":"1f1f9-1f1f2","isCanonical": true},":turkmenistan:":{"unicode":["1f1f9-1f1f2"],"fname":"1f1f9-1f1f2","uc":"1f1f9-1f1f2","isCanonical": false},":flag_tl:":{"unicode":["1f1f9-1f1f1"],"fname":"1f1f9-1f1f1","uc":"1f1f9-1f1f1","isCanonical": true},":tl:":{"unicode":["1f1f9-1f1f1"],"fname":"1f1f9-1f1f1","uc":"1f1f9-1f1f1","isCanonical": false},":flag_tk:":{"unicode":["1f1f9-1f1f0"],"fname":"1f1f9-1f1f0","uc":"1f1f9-1f1f0","isCanonical": true},":tk:":{"unicode":["1f1f9-1f1f0"],"fname":"1f1f9-1f1f0","uc":"1f1f9-1f1f0","isCanonical": false},":flag_tj:":{"unicode":["1f1f9-1f1ef"],"fname":"1f1f9-1f1ef","uc":"1f1f9-1f1ef","isCanonical": true},":tj:":{"unicode":["1f1f9-1f1ef"],"fname":"1f1f9-1f1ef","uc":"1f1f9-1f1ef","isCanonical": false},":flag_th:":{"unicode":["1f1f9-1f1ed"],"fname":"1f1f9-1f1ed","uc":"1f1f9-1f1ed","isCanonical": true},":th:":{"unicode":["1f1f9-1f1ed"],"fname":"1f1f9-1f1ed","uc":"1f1f9-1f1ed","isCanonical": false},":flag_tg:":{"unicode":["1f1f9-1f1ec"],"fname":"1f1f9-1f1ec","uc":"1f1f9-1f1ec","isCanonical": true},":tg:":{"unicode":["1f1f9-1f1ec"],"fname":"1f1f9-1f1ec","uc":"1f1f9-1f1ec","isCanonical": false},":flag_tf:":{"unicode":["1f1f9-1f1eb"],"fname":"1f1f9-1f1eb","uc":"1f1f9-1f1eb","isCanonical": true},":tf:":{"unicode":["1f1f9-1f1eb"],"fname":"1f1f9-1f1eb","uc":"1f1f9-1f1eb","isCanonical": false},":flag_td:":{"unicode":["1f1f9-1f1e9"],"fname":"1f1f9-1f1e9","uc":"1f1f9-1f1e9","isCanonical": true},":td:":{"unicode":["1f1f9-1f1e9"],"fname":"1f1f9-1f1e9","uc":"1f1f9-1f1e9","isCanonical": false},":flag_tc:":{"unicode":["1f1f9-1f1e8"],"fname":"1f1f9-1f1e8","uc":"1f1f9-1f1e8","isCanonical": true},":tc:":{"unicode":["1f1f9-1f1e8"],"fname":"1f1f9-1f1e8","uc":"1f1f9-1f1e8","isCanonical": false},":flag_ta:":{"unicode":["1f1f9-1f1e6"],"fname":"1f1f9-1f1e6","uc":"1f1f9-1f1e6","isCanonical": true},":ta:":{"unicode":["1f1f9-1f1e6"],"fname":"1f1f9-1f1e6","uc":"1f1f9-1f1e6","isCanonical": false},":flag_sz:":{"unicode":["1f1f8-1f1ff"],"fname":"1f1f8-1f1ff","uc":"1f1f8-1f1ff","isCanonical": true},":sz:":{"unicode":["1f1f8-1f1ff"],"fname":"1f1f8-1f1ff","uc":"1f1f8-1f1ff","isCanonical": false},":flag_sy:":{"unicode":["1f1f8-1f1fe"],"fname":"1f1f8-1f1fe","uc":"1f1f8-1f1fe","isCanonical": true},":sy:":{"unicode":["1f1f8-1f1fe"],"fname":"1f1f8-1f1fe","uc":"1f1f8-1f1fe","isCanonical": false},":flag_sx:":{"unicode":["1f1f8-1f1fd"],"fname":"1f1f8-1f1fd","uc":"1f1f8-1f1fd","isCanonical": true},":sx:":{"unicode":["1f1f8-1f1fd"],"fname":"1f1f8-1f1fd","uc":"1f1f8-1f1fd","isCanonical": false},":flag_sv:":{"unicode":["1f1f8-1f1fb"],"fname":"1f1f8-1f1fb","uc":"1f1f8-1f1fb","isCanonical": true},":sv:":{"unicode":["1f1f8-1f1fb"],"fname":"1f1f8-1f1fb","uc":"1f1f8-1f1fb","isCanonical": false},":flag_st:":{"unicode":["1f1f8-1f1f9"],"fname":"1f1f8-1f1f9","uc":"1f1f8-1f1f9","isCanonical": true},":st:":{"unicode":["1f1f8-1f1f9"],"fname":"1f1f8-1f1f9","uc":"1f1f8-1f1f9","isCanonical": false},":flag_ss:":{"unicode":["1f1f8-1f1f8"],"fname":"1f1f8-1f1f8","uc":"1f1f8-1f1f8","isCanonical": true},":ss:":{"unicode":["1f1f8-1f1f8"],"fname":"1f1f8-1f1f8","uc":"1f1f8-1f1f8","isCanonical": false},":flag_sr:":{"unicode":["1f1f8-1f1f7"],"fname":"1f1f8-1f1f7","uc":"1f1f8-1f1f7","isCanonical": true},":sr:":{"unicode":["1f1f8-1f1f7"],"fname":"1f1f8-1f1f7","uc":"1f1f8-1f1f7","isCanonical": false},":flag_so:":{"unicode":["1f1f8-1f1f4"],"fname":"1f1f8-1f1f4","uc":"1f1f8-1f1f4","isCanonical": true},":so:":{"unicode":["1f1f8-1f1f4"],"fname":"1f1f8-1f1f4","uc":"1f1f8-1f1f4","isCanonical": false},":flag_sn:":{"unicode":["1f1f8-1f1f3"],"fname":"1f1f8-1f1f3","uc":"1f1f8-1f1f3","isCanonical": true},":sn:":{"unicode":["1f1f8-1f1f3"],"fname":"1f1f8-1f1f3","uc":"1f1f8-1f1f3","isCanonical": false},":flag_sm:":{"unicode":["1f1f8-1f1f2"],"fname":"1f1f8-1f1f2","uc":"1f1f8-1f1f2","isCanonical": true},":sm:":{"unicode":["1f1f8-1f1f2"],"fname":"1f1f8-1f1f2","uc":"1f1f8-1f1f2","isCanonical": false},":flag_sl:":{"unicode":["1f1f8-1f1f1"],"fname":"1f1f8-1f1f1","uc":"1f1f8-1f1f1","isCanonical": true},":sl:":{"unicode":["1f1f8-1f1f1"],"fname":"1f1f8-1f1f1","uc":"1f1f8-1f1f1","isCanonical": false},":flag_sk:":{"unicode":["1f1f8-1f1f0"],"fname":"1f1f8-1f1f0","uc":"1f1f8-1f1f0","isCanonical": true},":sk:":{"unicode":["1f1f8-1f1f0"],"fname":"1f1f8-1f1f0","uc":"1f1f8-1f1f0","isCanonical": false},":flag_sj:":{"unicode":["1f1f8-1f1ef"],"fname":"1f1f8-1f1ef","uc":"1f1f8-1f1ef","isCanonical": true},":sj:":{"unicode":["1f1f8-1f1ef"],"fname":"1f1f8-1f1ef","uc":"1f1f8-1f1ef","isCanonical": false},":flag_si:":{"unicode":["1f1f8-1f1ee"],"fname":"1f1f8-1f1ee","uc":"1f1f8-1f1ee","isCanonical": true},":si:":{"unicode":["1f1f8-1f1ee"],"fname":"1f1f8-1f1ee","uc":"1f1f8-1f1ee","isCanonical": false},":flag_sh:":{"unicode":["1f1f8-1f1ed"],"fname":"1f1f8-1f1ed","uc":"1f1f8-1f1ed","isCanonical": true},":sh:":{"unicode":["1f1f8-1f1ed"],"fname":"1f1f8-1f1ed","uc":"1f1f8-1f1ed","isCanonical": false},":flag_sg:":{"unicode":["1f1f8-1f1ec"],"fname":"1f1f8-1f1ec","uc":"1f1f8-1f1ec","isCanonical": true},":sg:":{"unicode":["1f1f8-1f1ec"],"fname":"1f1f8-1f1ec","uc":"1f1f8-1f1ec","isCanonical": false},":flag_se:":{"unicode":["1f1f8-1f1ea"],"fname":"1f1f8-1f1ea","uc":"1f1f8-1f1ea","isCanonical": true},":se:":{"unicode":["1f1f8-1f1ea"],"fname":"1f1f8-1f1ea","uc":"1f1f8-1f1ea","isCanonical": false},":flag_sd:":{"unicode":["1f1f8-1f1e9"],"fname":"1f1f8-1f1e9","uc":"1f1f8-1f1e9","isCanonical": true},":sd:":{"unicode":["1f1f8-1f1e9"],"fname":"1f1f8-1f1e9","uc":"1f1f8-1f1e9","isCanonical": false},":flag_sc:":{"unicode":["1f1f8-1f1e8"],"fname":"1f1f8-1f1e8","uc":"1f1f8-1f1e8","isCanonical": true},":sc:":{"unicode":["1f1f8-1f1e8"],"fname":"1f1f8-1f1e8","uc":"1f1f8-1f1e8","isCanonical": false},":flag_sb:":{"unicode":["1f1f8-1f1e7"],"fname":"1f1f8-1f1e7","uc":"1f1f8-1f1e7","isCanonical": true},":sb:":{"unicode":["1f1f8-1f1e7"],"fname":"1f1f8-1f1e7","uc":"1f1f8-1f1e7","isCanonical": false},":flag_sa:":{"unicode":["1f1f8-1f1e6"],"fname":"1f1f8-1f1e6","uc":"1f1f8-1f1e6","isCanonical": true},":saudiarabia:":{"unicode":["1f1f8-1f1e6"],"fname":"1f1f8-1f1e6","uc":"1f1f8-1f1e6","isCanonical": false},":saudi:":{"unicode":["1f1f8-1f1e6"],"fname":"1f1f8-1f1e6","uc":"1f1f8-1f1e6","isCanonical": false},":flag_rw:":{"unicode":["1f1f7-1f1fc"],"fname":"1f1f7-1f1fc","uc":"1f1f7-1f1fc","isCanonical": true},":rw:":{"unicode":["1f1f7-1f1fc"],"fname":"1f1f7-1f1fc","uc":"1f1f7-1f1fc","isCanonical": false},":flag_ru:":{"unicode":["1f1f7-1f1fa"],"fname":"1f1f7-1f1fa","uc":"1f1f7-1f1fa","isCanonical": true},":ru:":{"unicode":["1f1f7-1f1fa"],"fname":"1f1f7-1f1fa","uc":"1f1f7-1f1fa","isCanonical": false},":flag_rs:":{"unicode":["1f1f7-1f1f8"],"fname":"1f1f7-1f1f8","uc":"1f1f7-1f1f8","isCanonical": true},":rs:":{"unicode":["1f1f7-1f1f8"],"fname":"1f1f7-1f1f8","uc":"1f1f7-1f1f8","isCanonical": false},":flag_ro:":{"unicode":["1f1f7-1f1f4"],"fname":"1f1f7-1f1f4","uc":"1f1f7-1f1f4","isCanonical": true},":ro:":{"unicode":["1f1f7-1f1f4"],"fname":"1f1f7-1f1f4","uc":"1f1f7-1f1f4","isCanonical": false},":flag_re:":{"unicode":["1f1f7-1f1ea"],"fname":"1f1f7-1f1ea","uc":"1f1f7-1f1ea","isCanonical": true},":re:":{"unicode":["1f1f7-1f1ea"],"fname":"1f1f7-1f1ea","uc":"1f1f7-1f1ea","isCanonical": false},":flag_qa:":{"unicode":["1f1f6-1f1e6"],"fname":"1f1f6-1f1e6","uc":"1f1f6-1f1e6","isCanonical": true},":qa:":{"unicode":["1f1f6-1f1e6"],"fname":"1f1f6-1f1e6","uc":"1f1f6-1f1e6","isCanonical": false},":flag_py:":{"unicode":["1f1f5-1f1fe"],"fname":"1f1f5-1f1fe","uc":"1f1f5-1f1fe","isCanonical": true},":py:":{"unicode":["1f1f5-1f1fe"],"fname":"1f1f5-1f1fe","uc":"1f1f5-1f1fe","isCanonical": false},":flag_pw:":{"unicode":["1f1f5-1f1fc"],"fname":"1f1f5-1f1fc","uc":"1f1f5-1f1fc","isCanonical": true},":pw:":{"unicode":["1f1f5-1f1fc"],"fname":"1f1f5-1f1fc","uc":"1f1f5-1f1fc","isCanonical": false},":flag_pt:":{"unicode":["1f1f5-1f1f9"],"fname":"1f1f5-1f1f9","uc":"1f1f5-1f1f9","isCanonical": true},":pt:":{"unicode":["1f1f5-1f1f9"],"fname":"1f1f5-1f1f9","uc":"1f1f5-1f1f9","isCanonical": false},":flag_ps:":{"unicode":["1f1f5-1f1f8"],"fname":"1f1f5-1f1f8","uc":"1f1f5-1f1f8","isCanonical": true},":ps:":{"unicode":["1f1f5-1f1f8"],"fname":"1f1f5-1f1f8","uc":"1f1f5-1f1f8","isCanonical": false},":flag_pr:":{"unicode":["1f1f5-1f1f7"],"fname":"1f1f5-1f1f7","uc":"1f1f5-1f1f7","isCanonical": true},":pr:":{"unicode":["1f1f5-1f1f7"],"fname":"1f1f5-1f1f7","uc":"1f1f5-1f1f7","isCanonical": false},":flag_pn:":{"unicode":["1f1f5-1f1f3"],"fname":"1f1f5-1f1f3","uc":"1f1f5-1f1f3","isCanonical": true},":pn:":{"unicode":["1f1f5-1f1f3"],"fname":"1f1f5-1f1f3","uc":"1f1f5-1f1f3","isCanonical": false},":flag_pm:":{"unicode":["1f1f5-1f1f2"],"fname":"1f1f5-1f1f2","uc":"1f1f5-1f1f2","isCanonical": true},":pm:":{"unicode":["1f1f5-1f1f2"],"fname":"1f1f5-1f1f2","uc":"1f1f5-1f1f2","isCanonical": false},":flag_pl:":{"unicode":["1f1f5-1f1f1"],"fname":"1f1f5-1f1f1","uc":"1f1f5-1f1f1","isCanonical": true},":pl:":{"unicode":["1f1f5-1f1f1"],"fname":"1f1f5-1f1f1","uc":"1f1f5-1f1f1","isCanonical": false},":flag_pk:":{"unicode":["1f1f5-1f1f0"],"fname":"1f1f5-1f1f0","uc":"1f1f5-1f1f0","isCanonical": true},":pk:":{"unicode":["1f1f5-1f1f0"],"fname":"1f1f5-1f1f0","uc":"1f1f5-1f1f0","isCanonical": false},":flag_ph:":{"unicode":["1f1f5-1f1ed"],"fname":"1f1f5-1f1ed","uc":"1f1f5-1f1ed","isCanonical": true},":ph:":{"unicode":["1f1f5-1f1ed"],"fname":"1f1f5-1f1ed","uc":"1f1f5-1f1ed","isCanonical": false},":flag_pg:":{"unicode":["1f1f5-1f1ec"],"fname":"1f1f5-1f1ec","uc":"1f1f5-1f1ec","isCanonical": true},":pg:":{"unicode":["1f1f5-1f1ec"],"fname":"1f1f5-1f1ec","uc":"1f1f5-1f1ec","isCanonical": false},":flag_pf:":{"unicode":["1f1f5-1f1eb"],"fname":"1f1f5-1f1eb","uc":"1f1f5-1f1eb","isCanonical": true},":pf:":{"unicode":["1f1f5-1f1eb"],"fname":"1f1f5-1f1eb","uc":"1f1f5-1f1eb","isCanonical": false},":flag_pe:":{"unicode":["1f1f5-1f1ea"],"fname":"1f1f5-1f1ea","uc":"1f1f5-1f1ea","isCanonical": true},":pe:":{"unicode":["1f1f5-1f1ea"],"fname":"1f1f5-1f1ea","uc":"1f1f5-1f1ea","isCanonical": false},":flag_pa:":{"unicode":["1f1f5-1f1e6"],"fname":"1f1f5-1f1e6","uc":"1f1f5-1f1e6","isCanonical": true},":pa:":{"unicode":["1f1f5-1f1e6"],"fname":"1f1f5-1f1e6","uc":"1f1f5-1f1e6","isCanonical": false},":flag_om:":{"unicode":["1f1f4-1f1f2"],"fname":"1f1f4-1f1f2","uc":"1f1f4-1f1f2","isCanonical": true},":om:":{"unicode":["1f1f4-1f1f2"],"fname":"1f1f4-1f1f2","uc":"1f1f4-1f1f2","isCanonical": false},":flag_nz:":{"unicode":["1f1f3-1f1ff"],"fname":"1f1f3-1f1ff","uc":"1f1f3-1f1ff","isCanonical": true},":nz:":{"unicode":["1f1f3-1f1ff"],"fname":"1f1f3-1f1ff","uc":"1f1f3-1f1ff","isCanonical": false},":flag_nu:":{"unicode":["1f1f3-1f1fa"],"fname":"1f1f3-1f1fa","uc":"1f1f3-1f1fa","isCanonical": true},":nu:":{"unicode":["1f1f3-1f1fa"],"fname":"1f1f3-1f1fa","uc":"1f1f3-1f1fa","isCanonical": false},":flag_nr:":{"unicode":["1f1f3-1f1f7"],"fname":"1f1f3-1f1f7","uc":"1f1f3-1f1f7","isCanonical": true},":nr:":{"unicode":["1f1f3-1f1f7"],"fname":"1f1f3-1f1f7","uc":"1f1f3-1f1f7","isCanonical": false},":flag_np:":{"unicode":["1f1f3-1f1f5"],"fname":"1f1f3-1f1f5","uc":"1f1f3-1f1f5","isCanonical": true},":np:":{"unicode":["1f1f3-1f1f5"],"fname":"1f1f3-1f1f5","uc":"1f1f3-1f1f5","isCanonical": false},":flag_no:":{"unicode":["1f1f3-1f1f4"],"fname":"1f1f3-1f1f4","uc":"1f1f3-1f1f4","isCanonical": true},":no:":{"unicode":["1f1f3-1f1f4"],"fname":"1f1f3-1f1f4","uc":"1f1f3-1f1f4","isCanonical": false},":flag_nl:":{"unicode":["1f1f3-1f1f1"],"fname":"1f1f3-1f1f1","uc":"1f1f3-1f1f1","isCanonical": true},":nl:":{"unicode":["1f1f3-1f1f1"],"fname":"1f1f3-1f1f1","uc":"1f1f3-1f1f1","isCanonical": false},":flag_ni:":{"unicode":["1f1f3-1f1ee"],"fname":"1f1f3-1f1ee","uc":"1f1f3-1f1ee","isCanonical": true},":ni:":{"unicode":["1f1f3-1f1ee"],"fname":"1f1f3-1f1ee","uc":"1f1f3-1f1ee","isCanonical": false},":flag_ng:":{"unicode":["1f1f3-1f1ec"],"fname":"1f1f3-1f1ec","uc":"1f1f3-1f1ec","isCanonical": true},":nigeria:":{"unicode":["1f1f3-1f1ec"],"fname":"1f1f3-1f1ec","uc":"1f1f3-1f1ec","isCanonical": false},":flag_nf:":{"unicode":["1f1f3-1f1eb"],"fname":"1f1f3-1f1eb","uc":"1f1f3-1f1eb","isCanonical": true},":nf:":{"unicode":["1f1f3-1f1eb"],"fname":"1f1f3-1f1eb","uc":"1f1f3-1f1eb","isCanonical": false},":flag_ne:":{"unicode":["1f1f3-1f1ea"],"fname":"1f1f3-1f1ea","uc":"1f1f3-1f1ea","isCanonical": true},":ne:":{"unicode":["1f1f3-1f1ea"],"fname":"1f1f3-1f1ea","uc":"1f1f3-1f1ea","isCanonical": false},":flag_nc:":{"unicode":["1f1f3-1f1e8"],"fname":"1f1f3-1f1e8","uc":"1f1f3-1f1e8","isCanonical": true},":nc:":{"unicode":["1f1f3-1f1e8"],"fname":"1f1f3-1f1e8","uc":"1f1f3-1f1e8","isCanonical": false},":flag_na:":{"unicode":["1f1f3-1f1e6"],"fname":"1f1f3-1f1e6","uc":"1f1f3-1f1e6","isCanonical": true},":na:":{"unicode":["1f1f3-1f1e6"],"fname":"1f1f3-1f1e6","uc":"1f1f3-1f1e6","isCanonical": false},":flag_mz:":{"unicode":["1f1f2-1f1ff"],"fname":"1f1f2-1f1ff","uc":"1f1f2-1f1ff","isCanonical": true},":mz:":{"unicode":["1f1f2-1f1ff"],"fname":"1f1f2-1f1ff","uc":"1f1f2-1f1ff","isCanonical": false},":flag_my:":{"unicode":["1f1f2-1f1fe"],"fname":"1f1f2-1f1fe","uc":"1f1f2-1f1fe","isCanonical": true},":my:":{"unicode":["1f1f2-1f1fe"],"fname":"1f1f2-1f1fe","uc":"1f1f2-1f1fe","isCanonical": false},":flag_mx:":{"unicode":["1f1f2-1f1fd"],"fname":"1f1f2-1f1fd","uc":"1f1f2-1f1fd","isCanonical": true},":mx:":{"unicode":["1f1f2-1f1fd"],"fname":"1f1f2-1f1fd","uc":"1f1f2-1f1fd","isCanonical": false},":flag_mw:":{"unicode":["1f1f2-1f1fc"],"fname":"1f1f2-1f1fc","uc":"1f1f2-1f1fc","isCanonical": true},":mw:":{"unicode":["1f1f2-1f1fc"],"fname":"1f1f2-1f1fc","uc":"1f1f2-1f1fc","isCanonical": false},":flag_mv:":{"unicode":["1f1f2-1f1fb"],"fname":"1f1f2-1f1fb","uc":"1f1f2-1f1fb","isCanonical": true},":mv:":{"unicode":["1f1f2-1f1fb"],"fname":"1f1f2-1f1fb","uc":"1f1f2-1f1fb","isCanonical": false},":flag_mu:":{"unicode":["1f1f2-1f1fa"],"fname":"1f1f2-1f1fa","uc":"1f1f2-1f1fa","isCanonical": true},":mu:":{"unicode":["1f1f2-1f1fa"],"fname":"1f1f2-1f1fa","uc":"1f1f2-1f1fa","isCanonical": false},":flag_mt:":{"unicode":["1f1f2-1f1f9"],"fname":"1f1f2-1f1f9","uc":"1f1f2-1f1f9","isCanonical": true},":mt:":{"unicode":["1f1f2-1f1f9"],"fname":"1f1f2-1f1f9","uc":"1f1f2-1f1f9","isCanonical": false},":flag_ms:":{"unicode":["1f1f2-1f1f8"],"fname":"1f1f2-1f1f8","uc":"1f1f2-1f1f8","isCanonical": true},":ms:":{"unicode":["1f1f2-1f1f8"],"fname":"1f1f2-1f1f8","uc":"1f1f2-1f1f8","isCanonical": false},":flag_mr:":{"unicode":["1f1f2-1f1f7"],"fname":"1f1f2-1f1f7","uc":"1f1f2-1f1f7","isCanonical": true},":mr:":{"unicode":["1f1f2-1f1f7"],"fname":"1f1f2-1f1f7","uc":"1f1f2-1f1f7","isCanonical": false},":flag_mq:":{"unicode":["1f1f2-1f1f6"],"fname":"1f1f2-1f1f6","uc":"1f1f2-1f1f6","isCanonical": true},":mq:":{"unicode":["1f1f2-1f1f6"],"fname":"1f1f2-1f1f6","uc":"1f1f2-1f1f6","isCanonical": false},":flag_mp:":{"unicode":["1f1f2-1f1f5"],"fname":"1f1f2-1f1f5","uc":"1f1f2-1f1f5","isCanonical": true},":mp:":{"unicode":["1f1f2-1f1f5"],"fname":"1f1f2-1f1f5","uc":"1f1f2-1f1f5","isCanonical": false},":flag_mo:":{"unicode":["1f1f2-1f1f4"],"fname":"1f1f2-1f1f4","uc":"1f1f2-1f1f4","isCanonical": true},":mo:":{"unicode":["1f1f2-1f1f4"],"fname":"1f1f2-1f1f4","uc":"1f1f2-1f1f4","isCanonical": false},":flag_mn:":{"unicode":["1f1f2-1f1f3"],"fname":"1f1f2-1f1f3","uc":"1f1f2-1f1f3","isCanonical": true},":mn:":{"unicode":["1f1f2-1f1f3"],"fname":"1f1f2-1f1f3","uc":"1f1f2-1f1f3","isCanonical": false},":flag_mm:":{"unicode":["1f1f2-1f1f2"],"fname":"1f1f2-1f1f2","uc":"1f1f2-1f1f2","isCanonical": true},":mm:":{"unicode":["1f1f2-1f1f2"],"fname":"1f1f2-1f1f2","uc":"1f1f2-1f1f2","isCanonical": false},":flag_ml:":{"unicode":["1f1f2-1f1f1"],"fname":"1f1f2-1f1f1","uc":"1f1f2-1f1f1","isCanonical": true},":ml:":{"unicode":["1f1f2-1f1f1"],"fname":"1f1f2-1f1f1","uc":"1f1f2-1f1f1","isCanonical": false},":flag_mk:":{"unicode":["1f1f2-1f1f0"],"fname":"1f1f2-1f1f0","uc":"1f1f2-1f1f0","isCanonical": true},":mk:":{"unicode":["1f1f2-1f1f0"],"fname":"1f1f2-1f1f0","uc":"1f1f2-1f1f0","isCanonical": false},":flag_mh:":{"unicode":["1f1f2-1f1ed"],"fname":"1f1f2-1f1ed","uc":"1f1f2-1f1ed","isCanonical": true},":mh:":{"unicode":["1f1f2-1f1ed"],"fname":"1f1f2-1f1ed","uc":"1f1f2-1f1ed","isCanonical": false},":flag_mg:":{"unicode":["1f1f2-1f1ec"],"fname":"1f1f2-1f1ec","uc":"1f1f2-1f1ec","isCanonical": true},":mg:":{"unicode":["1f1f2-1f1ec"],"fname":"1f1f2-1f1ec","uc":"1f1f2-1f1ec","isCanonical": false},":flag_mf:":{"unicode":["1f1f2-1f1eb"],"fname":"1f1f2-1f1eb","uc":"1f1f2-1f1eb","isCanonical": true},":mf:":{"unicode":["1f1f2-1f1eb"],"fname":"1f1f2-1f1eb","uc":"1f1f2-1f1eb","isCanonical": false},":flag_me:":{"unicode":["1f1f2-1f1ea"],"fname":"1f1f2-1f1ea","uc":"1f1f2-1f1ea","isCanonical": true},":me:":{"unicode":["1f1f2-1f1ea"],"fname":"1f1f2-1f1ea","uc":"1f1f2-1f1ea","isCanonical": false},":flag_md:":{"unicode":["1f1f2-1f1e9"],"fname":"1f1f2-1f1e9","uc":"1f1f2-1f1e9","isCanonical": true},":md:":{"unicode":["1f1f2-1f1e9"],"fname":"1f1f2-1f1e9","uc":"1f1f2-1f1e9","isCanonical": false},":flag_mc:":{"unicode":["1f1f2-1f1e8"],"fname":"1f1f2-1f1e8","uc":"1f1f2-1f1e8","isCanonical": true},":mc:":{"unicode":["1f1f2-1f1e8"],"fname":"1f1f2-1f1e8","uc":"1f1f2-1f1e8","isCanonical": false},":flag_ma:":{"unicode":["1f1f2-1f1e6"],"fname":"1f1f2-1f1e6","uc":"1f1f2-1f1e6","isCanonical": true},":ma:":{"unicode":["1f1f2-1f1e6"],"fname":"1f1f2-1f1e6","uc":"1f1f2-1f1e6","isCanonical": false},":flag_ly:":{"unicode":["1f1f1-1f1fe"],"fname":"1f1f1-1f1fe","uc":"1f1f1-1f1fe","isCanonical": true},":ly:":{"unicode":["1f1f1-1f1fe"],"fname":"1f1f1-1f1fe","uc":"1f1f1-1f1fe","isCanonical": false},":flag_lv:":{"unicode":["1f1f1-1f1fb"],"fname":"1f1f1-1f1fb","uc":"1f1f1-1f1fb","isCanonical": true},":lv:":{"unicode":["1f1f1-1f1fb"],"fname":"1f1f1-1f1fb","uc":"1f1f1-1f1fb","isCanonical": false},":flag_lu:":{"unicode":["1f1f1-1f1fa"],"fname":"1f1f1-1f1fa","uc":"1f1f1-1f1fa","isCanonical": true},":lu:":{"unicode":["1f1f1-1f1fa"],"fname":"1f1f1-1f1fa","uc":"1f1f1-1f1fa","isCanonical": false},":flag_lt:":{"unicode":["1f1f1-1f1f9"],"fname":"1f1f1-1f1f9","uc":"1f1f1-1f1f9","isCanonical": true},":lt:":{"unicode":["1f1f1-1f1f9"],"fname":"1f1f1-1f1f9","uc":"1f1f1-1f1f9","isCanonical": false},":flag_ls:":{"unicode":["1f1f1-1f1f8"],"fname":"1f1f1-1f1f8","uc":"1f1f1-1f1f8","isCanonical": true},":ls:":{"unicode":["1f1f1-1f1f8"],"fname":"1f1f1-1f1f8","uc":"1f1f1-1f1f8","isCanonical": false},":flag_lr:":{"unicode":["1f1f1-1f1f7"],"fname":"1f1f1-1f1f7","uc":"1f1f1-1f1f7","isCanonical": true},":lr:":{"unicode":["1f1f1-1f1f7"],"fname":"1f1f1-1f1f7","uc":"1f1f1-1f1f7","isCanonical": false},":flag_lk:":{"unicode":["1f1f1-1f1f0"],"fname":"1f1f1-1f1f0","uc":"1f1f1-1f1f0","isCanonical": true},":lk:":{"unicode":["1f1f1-1f1f0"],"fname":"1f1f1-1f1f0","uc":"1f1f1-1f1f0","isCanonical": false},":flag_li:":{"unicode":["1f1f1-1f1ee"],"fname":"1f1f1-1f1ee","uc":"1f1f1-1f1ee","isCanonical": true},":li:":{"unicode":["1f1f1-1f1ee"],"fname":"1f1f1-1f1ee","uc":"1f1f1-1f1ee","isCanonical": false},":flag_lc:":{"unicode":["1f1f1-1f1e8"],"fname":"1f1f1-1f1e8","uc":"1f1f1-1f1e8","isCanonical": true},":lc:":{"unicode":["1f1f1-1f1e8"],"fname":"1f1f1-1f1e8","uc":"1f1f1-1f1e8","isCanonical": false},":flag_lb:":{"unicode":["1f1f1-1f1e7"],"fname":"1f1f1-1f1e7","uc":"1f1f1-1f1e7","isCanonical": true},":lb:":{"unicode":["1f1f1-1f1e7"],"fname":"1f1f1-1f1e7","uc":"1f1f1-1f1e7","isCanonical": false},":flag_la:":{"unicode":["1f1f1-1f1e6"],"fname":"1f1f1-1f1e6","uc":"1f1f1-1f1e6","isCanonical": true},":la:":{"unicode":["1f1f1-1f1e6"],"fname":"1f1f1-1f1e6","uc":"1f1f1-1f1e6","isCanonical": false},":flag_kz:":{"unicode":["1f1f0-1f1ff"],"fname":"1f1f0-1f1ff","uc":"1f1f0-1f1ff","isCanonical": true},":kz:":{"unicode":["1f1f0-1f1ff"],"fname":"1f1f0-1f1ff","uc":"1f1f0-1f1ff","isCanonical": false},":flag_ky:":{"unicode":["1f1f0-1f1fe"],"fname":"1f1f0-1f1fe","uc":"1f1f0-1f1fe","isCanonical": true},":ky:":{"unicode":["1f1f0-1f1fe"],"fname":"1f1f0-1f1fe","uc":"1f1f0-1f1fe","isCanonical": false},":flag_kw:":{"unicode":["1f1f0-1f1fc"],"fname":"1f1f0-1f1fc","uc":"1f1f0-1f1fc","isCanonical": true},":kw:":{"unicode":["1f1f0-1f1fc"],"fname":"1f1f0-1f1fc","uc":"1f1f0-1f1fc","isCanonical": false},":flag_kr:":{"unicode":["1f1f0-1f1f7"],"fname":"1f1f0-1f1f7","uc":"1f1f0-1f1f7","isCanonical": true},":kr:":{"unicode":["1f1f0-1f1f7"],"fname":"1f1f0-1f1f7","uc":"1f1f0-1f1f7","isCanonical": false},":flag_kp:":{"unicode":["1f1f0-1f1f5"],"fname":"1f1f0-1f1f5","uc":"1f1f0-1f1f5","isCanonical": true},":kp:":{"unicode":["1f1f0-1f1f5"],"fname":"1f1f0-1f1f5","uc":"1f1f0-1f1f5","isCanonical": false},":flag_kn:":{"unicode":["1f1f0-1f1f3"],"fname":"1f1f0-1f1f3","uc":"1f1f0-1f1f3","isCanonical": true},":kn:":{"unicode":["1f1f0-1f1f3"],"fname":"1f1f0-1f1f3","uc":"1f1f0-1f1f3","isCanonical": false},":flag_km:":{"unicode":["1f1f0-1f1f2"],"fname":"1f1f0-1f1f2","uc":"1f1f0-1f1f2","isCanonical": true},":km:":{"unicode":["1f1f0-1f1f2"],"fname":"1f1f0-1f1f2","uc":"1f1f0-1f1f2","isCanonical": false},":flag_ki:":{"unicode":["1f1f0-1f1ee"],"fname":"1f1f0-1f1ee","uc":"1f1f0-1f1ee","isCanonical": true},":ki:":{"unicode":["1f1f0-1f1ee"],"fname":"1f1f0-1f1ee","uc":"1f1f0-1f1ee","isCanonical": false},":flag_kh:":{"unicode":["1f1f0-1f1ed"],"fname":"1f1f0-1f1ed","uc":"1f1f0-1f1ed","isCanonical": true},":kh:":{"unicode":["1f1f0-1f1ed"],"fname":"1f1f0-1f1ed","uc":"1f1f0-1f1ed","isCanonical": false},":flag_kg:":{"unicode":["1f1f0-1f1ec"],"fname":"1f1f0-1f1ec","uc":"1f1f0-1f1ec","isCanonical": true},":kg:":{"unicode":["1f1f0-1f1ec"],"fname":"1f1f0-1f1ec","uc":"1f1f0-1f1ec","isCanonical": false},":flag_ke:":{"unicode":["1f1f0-1f1ea"],"fname":"1f1f0-1f1ea","uc":"1f1f0-1f1ea","isCanonical": true},":ke:":{"unicode":["1f1f0-1f1ea"],"fname":"1f1f0-1f1ea","uc":"1f1f0-1f1ea","isCanonical": false},":flag_jp:":{"unicode":["1f1ef-1f1f5"],"fname":"1f1ef-1f1f5","uc":"1f1ef-1f1f5","isCanonical": true},":jp:":{"unicode":["1f1ef-1f1f5"],"fname":"1f1ef-1f1f5","uc":"1f1ef-1f1f5","isCanonical": false},":flag_jo:":{"unicode":["1f1ef-1f1f4"],"fname":"1f1ef-1f1f4","uc":"1f1ef-1f1f4","isCanonical": true},":jo:":{"unicode":["1f1ef-1f1f4"],"fname":"1f1ef-1f1f4","uc":"1f1ef-1f1f4","isCanonical": false},":flag_jm:":{"unicode":["1f1ef-1f1f2"],"fname":"1f1ef-1f1f2","uc":"1f1ef-1f1f2","isCanonical": true},":jm:":{"unicode":["1f1ef-1f1f2"],"fname":"1f1ef-1f1f2","uc":"1f1ef-1f1f2","isCanonical": false},":flag_je:":{"unicode":["1f1ef-1f1ea"],"fname":"1f1ef-1f1ea","uc":"1f1ef-1f1ea","isCanonical": true},":je:":{"unicode":["1f1ef-1f1ea"],"fname":"1f1ef-1f1ea","uc":"1f1ef-1f1ea","isCanonical": false},":flag_it:":{"unicode":["1f1ee-1f1f9"],"fname":"1f1ee-1f1f9","uc":"1f1ee-1f1f9","isCanonical": true},":it:":{"unicode":["1f1ee-1f1f9"],"fname":"1f1ee-1f1f9","uc":"1f1ee-1f1f9","isCanonical": false},":flag_is:":{"unicode":["1f1ee-1f1f8"],"fname":"1f1ee-1f1f8","uc":"1f1ee-1f1f8","isCanonical": true},":is:":{"unicode":["1f1ee-1f1f8"],"fname":"1f1ee-1f1f8","uc":"1f1ee-1f1f8","isCanonical": false},":flag_ir:":{"unicode":["1f1ee-1f1f7"],"fname":"1f1ee-1f1f7","uc":"1f1ee-1f1f7","isCanonical": true},":ir:":{"unicode":["1f1ee-1f1f7"],"fname":"1f1ee-1f1f7","uc":"1f1ee-1f1f7","isCanonical": false},":flag_iq:":{"unicode":["1f1ee-1f1f6"],"fname":"1f1ee-1f1f6","uc":"1f1ee-1f1f6","isCanonical": true},":iq:":{"unicode":["1f1ee-1f1f6"],"fname":"1f1ee-1f1f6","uc":"1f1ee-1f1f6","isCanonical": false},":flag_io:":{"unicode":["1f1ee-1f1f4"],"fname":"1f1ee-1f1f4","uc":"1f1ee-1f1f4","isCanonical": true},":io:":{"unicode":["1f1ee-1f1f4"],"fname":"1f1ee-1f1f4","uc":"1f1ee-1f1f4","isCanonical": false},":flag_in:":{"unicode":["1f1ee-1f1f3"],"fname":"1f1ee-1f1f3","uc":"1f1ee-1f1f3","isCanonical": true},":in:":{"unicode":["1f1ee-1f1f3"],"fname":"1f1ee-1f1f3","uc":"1f1ee-1f1f3","isCanonical": false},":flag_im:":{"unicode":["1f1ee-1f1f2"],"fname":"1f1ee-1f1f2","uc":"1f1ee-1f1f2","isCanonical": true},":im:":{"unicode":["1f1ee-1f1f2"],"fname":"1f1ee-1f1f2","uc":"1f1ee-1f1f2","isCanonical": false},":flag_il:":{"unicode":["1f1ee-1f1f1"],"fname":"1f1ee-1f1f1","uc":"1f1ee-1f1f1","isCanonical": true},":il:":{"unicode":["1f1ee-1f1f1"],"fname":"1f1ee-1f1f1","uc":"1f1ee-1f1f1","isCanonical": false},":flag_ie:":{"unicode":["1f1ee-1f1ea"],"fname":"1f1ee-1f1ea","uc":"1f1ee-1f1ea","isCanonical": true},":ie:":{"unicode":["1f1ee-1f1ea"],"fname":"1f1ee-1f1ea","uc":"1f1ee-1f1ea","isCanonical": false},":flag_id:":{"unicode":["1f1ee-1f1e9"],"fname":"1f1ee-1f1e9","uc":"1f1ee-1f1e9","isCanonical": true},":indonesia:":{"unicode":["1f1ee-1f1e9"],"fname":"1f1ee-1f1e9","uc":"1f1ee-1f1e9","isCanonical": false},":flag_ic:":{"unicode":["1f1ee-1f1e8"],"fname":"1f1ee-1f1e8","uc":"1f1ee-1f1e8","isCanonical": true},":ic:":{"unicode":["1f1ee-1f1e8"],"fname":"1f1ee-1f1e8","uc":"1f1ee-1f1e8","isCanonical": false},":flag_hu:":{"unicode":["1f1ed-1f1fa"],"fname":"1f1ed-1f1fa","uc":"1f1ed-1f1fa","isCanonical": true},":hu:":{"unicode":["1f1ed-1f1fa"],"fname":"1f1ed-1f1fa","uc":"1f1ed-1f1fa","isCanonical": false},":flag_ht:":{"unicode":["1f1ed-1f1f9"],"fname":"1f1ed-1f1f9","uc":"1f1ed-1f1f9","isCanonical": true},":ht:":{"unicode":["1f1ed-1f1f9"],"fname":"1f1ed-1f1f9","uc":"1f1ed-1f1f9","isCanonical": false},":flag_hr:":{"unicode":["1f1ed-1f1f7"],"fname":"1f1ed-1f1f7","uc":"1f1ed-1f1f7","isCanonical": true},":hr:":{"unicode":["1f1ed-1f1f7"],"fname":"1f1ed-1f1f7","uc":"1f1ed-1f1f7","isCanonical": false},":flag_hn:":{"unicode":["1f1ed-1f1f3"],"fname":"1f1ed-1f1f3","uc":"1f1ed-1f1f3","isCanonical": true},":hn:":{"unicode":["1f1ed-1f1f3"],"fname":"1f1ed-1f1f3","uc":"1f1ed-1f1f3","isCanonical": false},":flag_hm:":{"unicode":["1f1ed-1f1f2"],"fname":"1f1ed-1f1f2","uc":"1f1ed-1f1f2","isCanonical": true},":hm:":{"unicode":["1f1ed-1f1f2"],"fname":"1f1ed-1f1f2","uc":"1f1ed-1f1f2","isCanonical": false},":flag_hk:":{"unicode":["1f1ed-1f1f0"],"fname":"1f1ed-1f1f0","uc":"1f1ed-1f1f0","isCanonical": true},":hk:":{"unicode":["1f1ed-1f1f0"],"fname":"1f1ed-1f1f0","uc":"1f1ed-1f1f0","isCanonical": false},":flag_gy:":{"unicode":["1f1ec-1f1fe"],"fname":"1f1ec-1f1fe","uc":"1f1ec-1f1fe","isCanonical": true},":gy:":{"unicode":["1f1ec-1f1fe"],"fname":"1f1ec-1f1fe","uc":"1f1ec-1f1fe","isCanonical": false},":flag_gw:":{"unicode":["1f1ec-1f1fc"],"fname":"1f1ec-1f1fc","uc":"1f1ec-1f1fc","isCanonical": true},":gw:":{"unicode":["1f1ec-1f1fc"],"fname":"1f1ec-1f1fc","uc":"1f1ec-1f1fc","isCanonical": false},":flag_gu:":{"unicode":["1f1ec-1f1fa"],"fname":"1f1ec-1f1fa","uc":"1f1ec-1f1fa","isCanonical": true},":gu:":{"unicode":["1f1ec-1f1fa"],"fname":"1f1ec-1f1fa","uc":"1f1ec-1f1fa","isCanonical": false},":flag_gt:":{"unicode":["1f1ec-1f1f9"],"fname":"1f1ec-1f1f9","uc":"1f1ec-1f1f9","isCanonical": true},":gt:":{"unicode":["1f1ec-1f1f9"],"fname":"1f1ec-1f1f9","uc":"1f1ec-1f1f9","isCanonical": false},":flag_gs:":{"unicode":["1f1ec-1f1f8"],"fname":"1f1ec-1f1f8","uc":"1f1ec-1f1f8","isCanonical": true},":gs:":{"unicode":["1f1ec-1f1f8"],"fname":"1f1ec-1f1f8","uc":"1f1ec-1f1f8","isCanonical": false},":flag_gr:":{"unicode":["1f1ec-1f1f7"],"fname":"1f1ec-1f1f7","uc":"1f1ec-1f1f7","isCanonical": true},":gr:":{"unicode":["1f1ec-1f1f7"],"fname":"1f1ec-1f1f7","uc":"1f1ec-1f1f7","isCanonical": false},":flag_gq:":{"unicode":["1f1ec-1f1f6"],"fname":"1f1ec-1f1f6","uc":"1f1ec-1f1f6","isCanonical": true},":gq:":{"unicode":["1f1ec-1f1f6"],"fname":"1f1ec-1f1f6","uc":"1f1ec-1f1f6","isCanonical": false},":flag_gp:":{"unicode":["1f1ec-1f1f5"],"fname":"1f1ec-1f1f5","uc":"1f1ec-1f1f5","isCanonical": true},":gp:":{"unicode":["1f1ec-1f1f5"],"fname":"1f1ec-1f1f5","uc":"1f1ec-1f1f5","isCanonical": false},":flag_gn:":{"unicode":["1f1ec-1f1f3"],"fname":"1f1ec-1f1f3","uc":"1f1ec-1f1f3","isCanonical": true},":gn:":{"unicode":["1f1ec-1f1f3"],"fname":"1f1ec-1f1f3","uc":"1f1ec-1f1f3","isCanonical": false},":flag_gm:":{"unicode":["1f1ec-1f1f2"],"fname":"1f1ec-1f1f2","uc":"1f1ec-1f1f2","isCanonical": true},":gm:":{"unicode":["1f1ec-1f1f2"],"fname":"1f1ec-1f1f2","uc":"1f1ec-1f1f2","isCanonical": false},":flag_gl:":{"unicode":["1f1ec-1f1f1"],"fname":"1f1ec-1f1f1","uc":"1f1ec-1f1f1","isCanonical": true},":gl:":{"unicode":["1f1ec-1f1f1"],"fname":"1f1ec-1f1f1","uc":"1f1ec-1f1f1","isCanonical": false},":flag_gi:":{"unicode":["1f1ec-1f1ee"],"fname":"1f1ec-1f1ee","uc":"1f1ec-1f1ee","isCanonical": true},":gi:":{"unicode":["1f1ec-1f1ee"],"fname":"1f1ec-1f1ee","uc":"1f1ec-1f1ee","isCanonical": false},":flag_gh:":{"unicode":["1f1ec-1f1ed"],"fname":"1f1ec-1f1ed","uc":"1f1ec-1f1ed","isCanonical": true},":gh:":{"unicode":["1f1ec-1f1ed"],"fname":"1f1ec-1f1ed","uc":"1f1ec-1f1ed","isCanonical": false},":flag_gg:":{"unicode":["1f1ec-1f1ec"],"fname":"1f1ec-1f1ec","uc":"1f1ec-1f1ec","isCanonical": true},":gg:":{"unicode":["1f1ec-1f1ec"],"fname":"1f1ec-1f1ec","uc":"1f1ec-1f1ec","isCanonical": false},":flag_gf:":{"unicode":["1f1ec-1f1eb"],"fname":"1f1ec-1f1eb","uc":"1f1ec-1f1eb","isCanonical": true},":gf:":{"unicode":["1f1ec-1f1eb"],"fname":"1f1ec-1f1eb","uc":"1f1ec-1f1eb","isCanonical": false},":flag_ge:":{"unicode":["1f1ec-1f1ea"],"fname":"1f1ec-1f1ea","uc":"1f1ec-1f1ea","isCanonical": true},":ge:":{"unicode":["1f1ec-1f1ea"],"fname":"1f1ec-1f1ea","uc":"1f1ec-1f1ea","isCanonical": false},":flag_gd:":{"unicode":["1f1ec-1f1e9"],"fname":"1f1ec-1f1e9","uc":"1f1ec-1f1e9","isCanonical": true},":gd:":{"unicode":["1f1ec-1f1e9"],"fname":"1f1ec-1f1e9","uc":"1f1ec-1f1e9","isCanonical": false},":flag_gb:":{"unicode":["1f1ec-1f1e7"],"fname":"1f1ec-1f1e7","uc":"1f1ec-1f1e7","isCanonical": true},":gb:":{"unicode":["1f1ec-1f1e7"],"fname":"1f1ec-1f1e7","uc":"1f1ec-1f1e7","isCanonical": false},":flag_ga:":{"unicode":["1f1ec-1f1e6"],"fname":"1f1ec-1f1e6","uc":"1f1ec-1f1e6","isCanonical": true},":ga:":{"unicode":["1f1ec-1f1e6"],"fname":"1f1ec-1f1e6","uc":"1f1ec-1f1e6","isCanonical": false},":flag_fr:":{"unicode":["1f1eb-1f1f7"],"fname":"1f1eb-1f1f7","uc":"1f1eb-1f1f7","isCanonical": true},":fr:":{"unicode":["1f1eb-1f1f7"],"fname":"1f1eb-1f1f7","uc":"1f1eb-1f1f7","isCanonical": false},":flag_fo:":{"unicode":["1f1eb-1f1f4"],"fname":"1f1eb-1f1f4","uc":"1f1eb-1f1f4","isCanonical": true},":fo:":{"unicode":["1f1eb-1f1f4"],"fname":"1f1eb-1f1f4","uc":"1f1eb-1f1f4","isCanonical": false},":flag_fm:":{"unicode":["1f1eb-1f1f2"],"fname":"1f1eb-1f1f2","uc":"1f1eb-1f1f2","isCanonical": true},":fm:":{"unicode":["1f1eb-1f1f2"],"fname":"1f1eb-1f1f2","uc":"1f1eb-1f1f2","isCanonical": false},":flag_fk:":{"unicode":["1f1eb-1f1f0"],"fname":"1f1eb-1f1f0","uc":"1f1eb-1f1f0","isCanonical": true},":fk:":{"unicode":["1f1eb-1f1f0"],"fname":"1f1eb-1f1f0","uc":"1f1eb-1f1f0","isCanonical": false},":flag_fj:":{"unicode":["1f1eb-1f1ef"],"fname":"1f1eb-1f1ef","uc":"1f1eb-1f1ef","isCanonical": true},":fj:":{"unicode":["1f1eb-1f1ef"],"fname":"1f1eb-1f1ef","uc":"1f1eb-1f1ef","isCanonical": false},":flag_fi:":{"unicode":["1f1eb-1f1ee"],"fname":"1f1eb-1f1ee","uc":"1f1eb-1f1ee","isCanonical": true},":fi:":{"unicode":["1f1eb-1f1ee"],"fname":"1f1eb-1f1ee","uc":"1f1eb-1f1ee","isCanonical": false},":flag_eu:":{"unicode":["1f1ea-1f1fa"],"fname":"1f1ea-1f1fa","uc":"1f1ea-1f1fa","isCanonical": true},":eu:":{"unicode":["1f1ea-1f1fa"],"fname":"1f1ea-1f1fa","uc":"1f1ea-1f1fa","isCanonical": false},":flag_et:":{"unicode":["1f1ea-1f1f9"],"fname":"1f1ea-1f1f9","uc":"1f1ea-1f1f9","isCanonical": true},":et:":{"unicode":["1f1ea-1f1f9"],"fname":"1f1ea-1f1f9","uc":"1f1ea-1f1f9","isCanonical": false},":flag_es:":{"unicode":["1f1ea-1f1f8"],"fname":"1f1ea-1f1f8","uc":"1f1ea-1f1f8","isCanonical": true},":es:":{"unicode":["1f1ea-1f1f8"],"fname":"1f1ea-1f1f8","uc":"1f1ea-1f1f8","isCanonical": false},":flag_er:":{"unicode":["1f1ea-1f1f7"],"fname":"1f1ea-1f1f7","uc":"1f1ea-1f1f7","isCanonical": true},":er:":{"unicode":["1f1ea-1f1f7"],"fname":"1f1ea-1f1f7","uc":"1f1ea-1f1f7","isCanonical": false},":flag_eh:":{"unicode":["1f1ea-1f1ed"],"fname":"1f1ea-1f1ed","uc":"1f1ea-1f1ed","isCanonical": true},":eh:":{"unicode":["1f1ea-1f1ed"],"fname":"1f1ea-1f1ed","uc":"1f1ea-1f1ed","isCanonical": false},":flag_eg:":{"unicode":["1f1ea-1f1ec"],"fname":"1f1ea-1f1ec","uc":"1f1ea-1f1ec","isCanonical": true},":eg:":{"unicode":["1f1ea-1f1ec"],"fname":"1f1ea-1f1ec","uc":"1f1ea-1f1ec","isCanonical": false},":flag_ee:":{"unicode":["1f1ea-1f1ea"],"fname":"1f1ea-1f1ea","uc":"1f1ea-1f1ea","isCanonical": true},":ee:":{"unicode":["1f1ea-1f1ea"],"fname":"1f1ea-1f1ea","uc":"1f1ea-1f1ea","isCanonical": false},":flag_ec:":{"unicode":["1f1ea-1f1e8"],"fname":"1f1ea-1f1e8","uc":"1f1ea-1f1e8","isCanonical": true},":ec:":{"unicode":["1f1ea-1f1e8"],"fname":"1f1ea-1f1e8","uc":"1f1ea-1f1e8","isCanonical": false},":flag_ea:":{"unicode":["1f1ea-1f1e6"],"fname":"1f1ea-1f1e6","uc":"1f1ea-1f1e6","isCanonical": true},":ea:":{"unicode":["1f1ea-1f1e6"],"fname":"1f1ea-1f1e6","uc":"1f1ea-1f1e6","isCanonical": false},":flag_dz:":{"unicode":["1f1e9-1f1ff"],"fname":"1f1e9-1f1ff","uc":"1f1e9-1f1ff","isCanonical": true},":dz:":{"unicode":["1f1e9-1f1ff"],"fname":"1f1e9-1f1ff","uc":"1f1e9-1f1ff","isCanonical": false},":flag_do:":{"unicode":["1f1e9-1f1f4"],"fname":"1f1e9-1f1f4","uc":"1f1e9-1f1f4","isCanonical": true},":do:":{"unicode":["1f1e9-1f1f4"],"fname":"1f1e9-1f1f4","uc":"1f1e9-1f1f4","isCanonical": false},":flag_dm:":{"unicode":["1f1e9-1f1f2"],"fname":"1f1e9-1f1f2","uc":"1f1e9-1f1f2","isCanonical": true},":dm:":{"unicode":["1f1e9-1f1f2"],"fname":"1f1e9-1f1f2","uc":"1f1e9-1f1f2","isCanonical": false},":flag_dk:":{"unicode":["1f1e9-1f1f0"],"fname":"1f1e9-1f1f0","uc":"1f1e9-1f1f0","isCanonical": true},":dk:":{"unicode":["1f1e9-1f1f0"],"fname":"1f1e9-1f1f0","uc":"1f1e9-1f1f0","isCanonical": false},":flag_dj:":{"unicode":["1f1e9-1f1ef"],"fname":"1f1e9-1f1ef","uc":"1f1e9-1f1ef","isCanonical": true},":dj:":{"unicode":["1f1e9-1f1ef"],"fname":"1f1e9-1f1ef","uc":"1f1e9-1f1ef","isCanonical": false},":flag_dg:":{"unicode":["1f1e9-1f1ec"],"fname":"1f1e9-1f1ec","uc":"1f1e9-1f1ec","isCanonical": true},":dg:":{"unicode":["1f1e9-1f1ec"],"fname":"1f1e9-1f1ec","uc":"1f1e9-1f1ec","isCanonical": false},":flag_de:":{"unicode":["1f1e9-1f1ea"],"fname":"1f1e9-1f1ea","uc":"1f1e9-1f1ea","isCanonical": true},":de:":{"unicode":["1f1e9-1f1ea"],"fname":"1f1e9-1f1ea","uc":"1f1e9-1f1ea","isCanonical": false},":flag_cz:":{"unicode":["1f1e8-1f1ff"],"fname":"1f1e8-1f1ff","uc":"1f1e8-1f1ff","isCanonical": true},":cz:":{"unicode":["1f1e8-1f1ff"],"fname":"1f1e8-1f1ff","uc":"1f1e8-1f1ff","isCanonical": false},":flag_cy:":{"unicode":["1f1e8-1f1fe"],"fname":"1f1e8-1f1fe","uc":"1f1e8-1f1fe","isCanonical": true},":cy:":{"unicode":["1f1e8-1f1fe"],"fname":"1f1e8-1f1fe","uc":"1f1e8-1f1fe","isCanonical": false},":flag_cx:":{"unicode":["1f1e8-1f1fd"],"fname":"1f1e8-1f1fd","uc":"1f1e8-1f1fd","isCanonical": true},":cx:":{"unicode":["1f1e8-1f1fd"],"fname":"1f1e8-1f1fd","uc":"1f1e8-1f1fd","isCanonical": false},":flag_cw:":{"unicode":["1f1e8-1f1fc"],"fname":"1f1e8-1f1fc","uc":"1f1e8-1f1fc","isCanonical": true},":cw:":{"unicode":["1f1e8-1f1fc"],"fname":"1f1e8-1f1fc","uc":"1f1e8-1f1fc","isCanonical": false},":flag_cv:":{"unicode":["1f1e8-1f1fb"],"fname":"1f1e8-1f1fb","uc":"1f1e8-1f1fb","isCanonical": true},":cv:":{"unicode":["1f1e8-1f1fb"],"fname":"1f1e8-1f1fb","uc":"1f1e8-1f1fb","isCanonical": false},":flag_cu:":{"unicode":["1f1e8-1f1fa"],"fname":"1f1e8-1f1fa","uc":"1f1e8-1f1fa","isCanonical": true},":cu:":{"unicode":["1f1e8-1f1fa"],"fname":"1f1e8-1f1fa","uc":"1f1e8-1f1fa","isCanonical": false},":flag_cr:":{"unicode":["1f1e8-1f1f7"],"fname":"1f1e8-1f1f7","uc":"1f1e8-1f1f7","isCanonical": true},":cr:":{"unicode":["1f1e8-1f1f7"],"fname":"1f1e8-1f1f7","uc":"1f1e8-1f1f7","isCanonical": false},":flag_cp:":{"unicode":["1f1e8-1f1f5"],"fname":"1f1e8-1f1f5","uc":"1f1e8-1f1f5","isCanonical": true},":cp:":{"unicode":["1f1e8-1f1f5"],"fname":"1f1e8-1f1f5","uc":"1f1e8-1f1f5","isCanonical": false},":flag_co:":{"unicode":["1f1e8-1f1f4"],"fname":"1f1e8-1f1f4","uc":"1f1e8-1f1f4","isCanonical": true},":co:":{"unicode":["1f1e8-1f1f4"],"fname":"1f1e8-1f1f4","uc":"1f1e8-1f1f4","isCanonical": false},":flag_cn:":{"unicode":["1f1e8-1f1f3"],"fname":"1f1e8-1f1f3","uc":"1f1e8-1f1f3","isCanonical": true},":cn:":{"unicode":["1f1e8-1f1f3"],"fname":"1f1e8-1f1f3","uc":"1f1e8-1f1f3","isCanonical": false},":flag_cm:":{"unicode":["1f1e8-1f1f2"],"fname":"1f1e8-1f1f2","uc":"1f1e8-1f1f2","isCanonical": true},":cm:":{"unicode":["1f1e8-1f1f2"],"fname":"1f1e8-1f1f2","uc":"1f1e8-1f1f2","isCanonical": false},":flag_cl:":{"unicode":["1f1e8-1f1f1"],"fname":"1f1e8-1f1f1","uc":"1f1e8-1f1f1","isCanonical": true},":chile:":{"unicode":["1f1e8-1f1f1"],"fname":"1f1e8-1f1f1","uc":"1f1e8-1f1f1","isCanonical": false},":flag_ck:":{"unicode":["1f1e8-1f1f0"],"fname":"1f1e8-1f1f0","uc":"1f1e8-1f1f0","isCanonical": true},":ck:":{"unicode":["1f1e8-1f1f0"],"fname":"1f1e8-1f1f0","uc":"1f1e8-1f1f0","isCanonical": false},":flag_ci:":{"unicode":["1f1e8-1f1ee"],"fname":"1f1e8-1f1ee","uc":"1f1e8-1f1ee","isCanonical": true},":ci:":{"unicode":["1f1e8-1f1ee"],"fname":"1f1e8-1f1ee","uc":"1f1e8-1f1ee","isCanonical": false},":flag_ch:":{"unicode":["1f1e8-1f1ed"],"fname":"1f1e8-1f1ed","uc":"1f1e8-1f1ed","isCanonical": true},":ch:":{"unicode":["1f1e8-1f1ed"],"fname":"1f1e8-1f1ed","uc":"1f1e8-1f1ed","isCanonical": false},":flag_cg:":{"unicode":["1f1e8-1f1ec"],"fname":"1f1e8-1f1ec","uc":"1f1e8-1f1ec","isCanonical": true},":cg:":{"unicode":["1f1e8-1f1ec"],"fname":"1f1e8-1f1ec","uc":"1f1e8-1f1ec","isCanonical": false},":flag_cf:":{"unicode":["1f1e8-1f1eb"],"fname":"1f1e8-1f1eb","uc":"1f1e8-1f1eb","isCanonical": true},":cf:":{"unicode":["1f1e8-1f1eb"],"fname":"1f1e8-1f1eb","uc":"1f1e8-1f1eb","isCanonical": false},":flag_cd:":{"unicode":["1f1e8-1f1e9"],"fname":"1f1e8-1f1e9","uc":"1f1e8-1f1e9","isCanonical": true},":congo:":{"unicode":["1f1e8-1f1e9"],"fname":"1f1e8-1f1e9","uc":"1f1e8-1f1e9","isCanonical": false},":flag_cc:":{"unicode":["1f1e8-1f1e8"],"fname":"1f1e8-1f1e8","uc":"1f1e8-1f1e8","isCanonical": true},":cc:":{"unicode":["1f1e8-1f1e8"],"fname":"1f1e8-1f1e8","uc":"1f1e8-1f1e8","isCanonical": false},":flag_ca:":{"unicode":["1f1e8-1f1e6"],"fname":"1f1e8-1f1e6","uc":"1f1e8-1f1e6","isCanonical": true},":ca:":{"unicode":["1f1e8-1f1e6"],"fname":"1f1e8-1f1e6","uc":"1f1e8-1f1e6","isCanonical": false},":flag_bz:":{"unicode":["1f1e7-1f1ff"],"fname":"1f1e7-1f1ff","uc":"1f1e7-1f1ff","isCanonical": true},":bz:":{"unicode":["1f1e7-1f1ff"],"fname":"1f1e7-1f1ff","uc":"1f1e7-1f1ff","isCanonical": false},":flag_by:":{"unicode":["1f1e7-1f1fe"],"fname":"1f1e7-1f1fe","uc":"1f1e7-1f1fe","isCanonical": true},":by:":{"unicode":["1f1e7-1f1fe"],"fname":"1f1e7-1f1fe","uc":"1f1e7-1f1fe","isCanonical": false},":flag_bw:":{"unicode":["1f1e7-1f1fc"],"fname":"1f1e7-1f1fc","uc":"1f1e7-1f1fc","isCanonical": true},":bw:":{"unicode":["1f1e7-1f1fc"],"fname":"1f1e7-1f1fc","uc":"1f1e7-1f1fc","isCanonical": false},":flag_bv:":{"unicode":["1f1e7-1f1fb"],"fname":"1f1e7-1f1fb","uc":"1f1e7-1f1fb","isCanonical": true},":bv:":{"unicode":["1f1e7-1f1fb"],"fname":"1f1e7-1f1fb","uc":"1f1e7-1f1fb","isCanonical": false},":flag_bt:":{"unicode":["1f1e7-1f1f9"],"fname":"1f1e7-1f1f9","uc":"1f1e7-1f1f9","isCanonical": true},":bt:":{"unicode":["1f1e7-1f1f9"],"fname":"1f1e7-1f1f9","uc":"1f1e7-1f1f9","isCanonical": false},":flag_bs:":{"unicode":["1f1e7-1f1f8"],"fname":"1f1e7-1f1f8","uc":"1f1e7-1f1f8","isCanonical": true},":bs:":{"unicode":["1f1e7-1f1f8"],"fname":"1f1e7-1f1f8","uc":"1f1e7-1f1f8","isCanonical": false},":flag_br:":{"unicode":["1f1e7-1f1f7"],"fname":"1f1e7-1f1f7","uc":"1f1e7-1f1f7","isCanonical": true},":br:":{"unicode":["1f1e7-1f1f7"],"fname":"1f1e7-1f1f7","uc":"1f1e7-1f1f7","isCanonical": false},":flag_bq:":{"unicode":["1f1e7-1f1f6"],"fname":"1f1e7-1f1f6","uc":"1f1e7-1f1f6","isCanonical": true},":bq:":{"unicode":["1f1e7-1f1f6"],"fname":"1f1e7-1f1f6","uc":"1f1e7-1f1f6","isCanonical": false},":flag_bo:":{"unicode":["1f1e7-1f1f4"],"fname":"1f1e7-1f1f4","uc":"1f1e7-1f1f4","isCanonical": true},":bo:":{"unicode":["1f1e7-1f1f4"],"fname":"1f1e7-1f1f4","uc":"1f1e7-1f1f4","isCanonical": false},":flag_bn:":{"unicode":["1f1e7-1f1f3"],"fname":"1f1e7-1f1f3","uc":"1f1e7-1f1f3","isCanonical": true},":bn:":{"unicode":["1f1e7-1f1f3"],"fname":"1f1e7-1f1f3","uc":"1f1e7-1f1f3","isCanonical": false},":flag_bm:":{"unicode":["1f1e7-1f1f2"],"fname":"1f1e7-1f1f2","uc":"1f1e7-1f1f2","isCanonical": true},":bm:":{"unicode":["1f1e7-1f1f2"],"fname":"1f1e7-1f1f2","uc":"1f1e7-1f1f2","isCanonical": false},":flag_bl:":{"unicode":["1f1e7-1f1f1"],"fname":"1f1e7-1f1f1","uc":"1f1e7-1f1f1","isCanonical": true},":bl:":{"unicode":["1f1e7-1f1f1"],"fname":"1f1e7-1f1f1","uc":"1f1e7-1f1f1","isCanonical": false},":flag_bj:":{"unicode":["1f1e7-1f1ef"],"fname":"1f1e7-1f1ef","uc":"1f1e7-1f1ef","isCanonical": true},":bj:":{"unicode":["1f1e7-1f1ef"],"fname":"1f1e7-1f1ef","uc":"1f1e7-1f1ef","isCanonical": false},":flag_bi:":{"unicode":["1f1e7-1f1ee"],"fname":"1f1e7-1f1ee","uc":"1f1e7-1f1ee","isCanonical": true},":bi:":{"unicode":["1f1e7-1f1ee"],"fname":"1f1e7-1f1ee","uc":"1f1e7-1f1ee","isCanonical": false},":flag_bh:":{"unicode":["1f1e7-1f1ed"],"fname":"1f1e7-1f1ed","uc":"1f1e7-1f1ed","isCanonical": true},":bh:":{"unicode":["1f1e7-1f1ed"],"fname":"1f1e7-1f1ed","uc":"1f1e7-1f1ed","isCanonical": false},":flag_bg:":{"unicode":["1f1e7-1f1ec"],"fname":"1f1e7-1f1ec","uc":"1f1e7-1f1ec","isCanonical": true},":bg:":{"unicode":["1f1e7-1f1ec"],"fname":"1f1e7-1f1ec","uc":"1f1e7-1f1ec","isCanonical": false},":flag_bf:":{"unicode":["1f1e7-1f1eb"],"fname":"1f1e7-1f1eb","uc":"1f1e7-1f1eb","isCanonical": true},":bf:":{"unicode":["1f1e7-1f1eb"],"fname":"1f1e7-1f1eb","uc":"1f1e7-1f1eb","isCanonical": false},":flag_be:":{"unicode":["1f1e7-1f1ea"],"fname":"1f1e7-1f1ea","uc":"1f1e7-1f1ea","isCanonical": true},":be:":{"unicode":["1f1e7-1f1ea"],"fname":"1f1e7-1f1ea","uc":"1f1e7-1f1ea","isCanonical": false},":flag_bd:":{"unicode":["1f1e7-1f1e9"],"fname":"1f1e7-1f1e9","uc":"1f1e7-1f1e9","isCanonical": true},":bd:":{"unicode":["1f1e7-1f1e9"],"fname":"1f1e7-1f1e9","uc":"1f1e7-1f1e9","isCanonical": false},":flag_bb:":{"unicode":["1f1e7-1f1e7"],"fname":"1f1e7-1f1e7","uc":"1f1e7-1f1e7","isCanonical": true},":bb:":{"unicode":["1f1e7-1f1e7"],"fname":"1f1e7-1f1e7","uc":"1f1e7-1f1e7","isCanonical": false},":flag_ba:":{"unicode":["1f1e7-1f1e6"],"fname":"1f1e7-1f1e6","uc":"1f1e7-1f1e6","isCanonical": true},":ba:":{"unicode":["1f1e7-1f1e6"],"fname":"1f1e7-1f1e6","uc":"1f1e7-1f1e6","isCanonical": false},":flag_az:":{"unicode":["1f1e6-1f1ff"],"fname":"1f1e6-1f1ff","uc":"1f1e6-1f1ff","isCanonical": true},":az:":{"unicode":["1f1e6-1f1ff"],"fname":"1f1e6-1f1ff","uc":"1f1e6-1f1ff","isCanonical": false},":flag_ax:":{"unicode":["1f1e6-1f1fd"],"fname":"1f1e6-1f1fd","uc":"1f1e6-1f1fd","isCanonical": true},":ax:":{"unicode":["1f1e6-1f1fd"],"fname":"1f1e6-1f1fd","uc":"1f1e6-1f1fd","isCanonical": false},":flag_aw:":{"unicode":["1f1e6-1f1fc"],"fname":"1f1e6-1f1fc","uc":"1f1e6-1f1fc","isCanonical": true},":aw:":{"unicode":["1f1e6-1f1fc"],"fname":"1f1e6-1f1fc","uc":"1f1e6-1f1fc","isCanonical": false},":flag_au:":{"unicode":["1f1e6-1f1fa"],"fname":"1f1e6-1f1fa","uc":"1f1e6-1f1fa","isCanonical": true},":au:":{"unicode":["1f1e6-1f1fa"],"fname":"1f1e6-1f1fa","uc":"1f1e6-1f1fa","isCanonical": false},":flag_at:":{"unicode":["1f1e6-1f1f9"],"fname":"1f1e6-1f1f9","uc":"1f1e6-1f1f9","isCanonical": true},":at:":{"unicode":["1f1e6-1f1f9"],"fname":"1f1e6-1f1f9","uc":"1f1e6-1f1f9","isCanonical": false},":flag_as:":{"unicode":["1f1e6-1f1f8"],"fname":"1f1e6-1f1f8","uc":"1f1e6-1f1f8","isCanonical": true},":as:":{"unicode":["1f1e6-1f1f8"],"fname":"1f1e6-1f1f8","uc":"1f1e6-1f1f8","isCanonical": false},":flag_ar:":{"unicode":["1f1e6-1f1f7"],"fname":"1f1e6-1f1f7","uc":"1f1e6-1f1f7","isCanonical": true},":ar:":{"unicode":["1f1e6-1f1f7"],"fname":"1f1e6-1f1f7","uc":"1f1e6-1f1f7","isCanonical": false},":flag_aq:":{"unicode":["1f1e6-1f1f6"],"fname":"1f1e6-1f1f6","uc":"1f1e6-1f1f6","isCanonical": true},":aq:":{"unicode":["1f1e6-1f1f6"],"fname":"1f1e6-1f1f6","uc":"1f1e6-1f1f6","isCanonical": false},":flag_ao:":{"unicode":["1f1e6-1f1f4"],"fname":"1f1e6-1f1f4","uc":"1f1e6-1f1f4","isCanonical": true},":ao:":{"unicode":["1f1e6-1f1f4"],"fname":"1f1e6-1f1f4","uc":"1f1e6-1f1f4","isCanonical": false},":flag_am:":{"unicode":["1f1e6-1f1f2"],"fname":"1f1e6-1f1f2","uc":"1f1e6-1f1f2","isCanonical": true},":am:":{"unicode":["1f1e6-1f1f2"],"fname":"1f1e6-1f1f2","uc":"1f1e6-1f1f2","isCanonical": false},":flag_al:":{"unicode":["1f1e6-1f1f1"],"fname":"1f1e6-1f1f1","uc":"1f1e6-1f1f1","isCanonical": true},":al:":{"unicode":["1f1e6-1f1f1"],"fname":"1f1e6-1f1f1","uc":"1f1e6-1f1f1","isCanonical": false},":flag_ai:":{"unicode":["1f1e6-1f1ee"],"fname":"1f1e6-1f1ee","uc":"1f1e6-1f1ee","isCanonical": true},":ai:":{"unicode":["1f1e6-1f1ee"],"fname":"1f1e6-1f1ee","uc":"1f1e6-1f1ee","isCanonical": false},":flag_ag:":{"unicode":["1f1e6-1f1ec"],"fname":"1f1e6-1f1ec","uc":"1f1e6-1f1ec","isCanonical": true},":ag:":{"unicode":["1f1e6-1f1ec"],"fname":"1f1e6-1f1ec","uc":"1f1e6-1f1ec","isCanonical": false},":flag_af:":{"unicode":["1f1e6-1f1eb"],"fname":"1f1e6-1f1eb","uc":"1f1e6-1f1eb","isCanonical": true},":af:":{"unicode":["1f1e6-1f1eb"],"fname":"1f1e6-1f1eb","uc":"1f1e6-1f1eb","isCanonical": false},":flag_ae:":{"unicode":["1f1e6-1f1ea"],"fname":"1f1e6-1f1ea","uc":"1f1e6-1f1ea","isCanonical": true},":ae:":{"unicode":["1f1e6-1f1ea"],"fname":"1f1e6-1f1ea","uc":"1f1e6-1f1ea","isCanonical": false},":flag_ad:":{"unicode":["1f1e6-1f1e9"],"fname":"1f1e6-1f1e9","uc":"1f1e6-1f1e9","isCanonical": true},":ad:":{"unicode":["1f1e6-1f1e9"],"fname":"1f1e6-1f1e9","uc":"1f1e6-1f1e9","isCanonical": false},":flag_ac:":{"unicode":["1f1e6-1f1e8"],"fname":"1f1e6-1f1e8","uc":"1f1e6-1f1e8","isCanonical": true},":ac:":{"unicode":["1f1e6-1f1e8"],"fname":"1f1e6-1f1e8","uc":"1f1e6-1f1e8","isCanonical": false},":mahjong:":{"unicode":["1f004-fe0f","1f004"],"fname":"1f004","uc":"1f004","isCanonical": true},":parking:":{"unicode":["1f17f-fe0f","1f17f"],"fname":"1f17f","uc":"1f17f","isCanonical": true},":sa:":{"unicode":["1f202-fe0f","1f202"],"fname":"1f202","uc":"1f202","isCanonical": true},":u7121:":{"unicode":["1f21a-fe0f","1f21a"],"fname":"1f21a","uc":"1f21a","isCanonical": true},":u6307:":{"unicode":["1f22f-fe0f","1f22f"],"fname":"1f22f","uc":"1f22f","isCanonical": true},":u6708:":{"unicode":["1f237-fe0f","1f237"],"fname":"1f237","uc":"1f237","isCanonical": true},":film_frames:":{"unicode":["1f39e-fe0f","1f39e"],"fname":"1f39e","uc":"1f39e","isCanonical": true},":tickets:":{"unicode":["1f39f-fe0f","1f39f"],"fname":"1f39f","uc":"1f39f","isCanonical": true},":admission_tickets:":{"unicode":["1f39f-fe0f","1f39f"],"fname":"1f39f","uc":"1f39f","isCanonical": false},":lifter:":{"unicode":["1f3cb-fe0f","1f3cb"],"fname":"1f3cb","uc":"1f3cb","isCanonical": true},":weight_lifter:":{"unicode":["1f3cb-fe0f","1f3cb"],"fname":"1f3cb","uc":"1f3cb","isCanonical": false},":golfer:":{"unicode":["1f3cc-fe0f","1f3cc"],"fname":"1f3cc","uc":"1f3cc","isCanonical": true},":motorcycle:":{"unicode":["1f3cd-fe0f","1f3cd"],"fname":"1f3cd","uc":"1f3cd","isCanonical": true},":racing_motorcycle:":{"unicode":["1f3cd-fe0f","1f3cd"],"fname":"1f3cd","uc":"1f3cd","isCanonical": false},":race_car:":{"unicode":["1f3ce-fe0f","1f3ce"],"fname":"1f3ce","uc":"1f3ce","isCanonical": true},":racing_car:":{"unicode":["1f3ce-fe0f","1f3ce"],"fname":"1f3ce","uc":"1f3ce","isCanonical": false},":military_medal:":{"unicode":["1f396-fe0f","1f396"],"fname":"1f396","uc":"1f396","isCanonical": true},":reminder_ribbon:":{"unicode":["1f397-fe0f","1f397"],"fname":"1f397","uc":"1f397","isCanonical": true},":hot_pepper:":{"unicode":["1f336-fe0f","1f336"],"fname":"1f336","uc":"1f336","isCanonical": true},":cloud_rain:":{"unicode":["1f327-fe0f","1f327"],"fname":"1f327","uc":"1f327","isCanonical": true},":cloud_with_rain:":{"unicode":["1f327-fe0f","1f327"],"fname":"1f327","uc":"1f327","isCanonical": false},":cloud_snow:":{"unicode":["1f328-fe0f","1f328"],"fname":"1f328","uc":"1f328","isCanonical": true},":cloud_with_snow:":{"unicode":["1f328-fe0f","1f328"],"fname":"1f328","uc":"1f328","isCanonical": false},":cloud_lightning:":{"unicode":["1f329-fe0f","1f329"],"fname":"1f329","uc":"1f329","isCanonical": true},":cloud_with_lightning:":{"unicode":["1f329-fe0f","1f329"],"fname":"1f329","uc":"1f329","isCanonical": false},":cloud_tornado:":{"unicode":["1f32a-fe0f","1f32a"],"fname":"1f32a","uc":"1f32a","isCanonical": true},":cloud_with_tornado:":{"unicode":["1f32a-fe0f","1f32a"],"fname":"1f32a","uc":"1f32a","isCanonical": false},":fog:":{"unicode":["1f32b-fe0f","1f32b"],"fname":"1f32b","uc":"1f32b","isCanonical": true},":wind_blowing_face:":{"unicode":["1f32c-fe0f","1f32c"],"fname":"1f32c","uc":"1f32c","isCanonical": true},":chipmunk:":{"unicode":["1f43f-fe0f","1f43f"],"fname":"1f43f","uc":"1f43f","isCanonical": true},":spider:":{"unicode":["1f577-fe0f","1f577"],"fname":"1f577","uc":"1f577","isCanonical": true},":spider_web:":{"unicode":["1f578-fe0f","1f578"],"fname":"1f578","uc":"1f578","isCanonical": true},":thermometer:":{"unicode":["1f321-fe0f","1f321"],"fname":"1f321","uc":"1f321","isCanonical": true},":microphone2:":{"unicode":["1f399-fe0f","1f399"],"fname":"1f399","uc":"1f399","isCanonical": true},":studio_microphone:":{"unicode":["1f399-fe0f","1f399"],"fname":"1f399","uc":"1f399","isCanonical": false},":level_slider:":{"unicode":["1f39a-fe0f","1f39a"],"fname":"1f39a","uc":"1f39a","isCanonical": true},":control_knobs:":{"unicode":["1f39b-fe0f","1f39b"],"fname":"1f39b","uc":"1f39b","isCanonical": true},":flag_white:":{"unicode":["1f3f3-fe0f","1f3f3"],"fname":"1f3f3","uc":"1f3f3","isCanonical": true},":waving_white_flag:":{"unicode":["1f3f3-fe0f","1f3f3"],"fname":"1f3f3","uc":"1f3f3","isCanonical": false},":rosette:":{"unicode":["1f3f5-fe0f","1f3f5"],"fname":"1f3f5","uc":"1f3f5","isCanonical": true},":label:":{"unicode":["1f3f7-fe0f","1f3f7"],"fname":"1f3f7","uc":"1f3f7","isCanonical": true},":projector:":{"unicode":["1f4fd-fe0f","1f4fd"],"fname":"1f4fd","uc":"1f4fd","isCanonical": true},":film_projector:":{"unicode":["1f4fd-fe0f","1f4fd"],"fname":"1f4fd","uc":"1f4fd","isCanonical": false},":om_symbol:":{"unicode":["1f549-fe0f","1f549"],"fname":"1f549","uc":"1f549","isCanonical": true},":dove:":{"unicode":["1f54a-fe0f","1f54a"],"fname":"1f54a","uc":"1f54a","isCanonical": true},":dove_of_peace:":{"unicode":["1f54a-fe0f","1f54a"],"fname":"1f54a","uc":"1f54a","isCanonical": false},":candle:":{"unicode":["1f56f-fe0f","1f56f"],"fname":"1f56f","uc":"1f56f","isCanonical": true},":clock:":{"unicode":["1f570-fe0f","1f570"],"fname":"1f570","uc":"1f570","isCanonical": true},":mantlepiece_clock:":{"unicode":["1f570-fe0f","1f570"],"fname":"1f570","uc":"1f570","isCanonical": false},":hole:":{"unicode":["1f573-fe0f","1f573"],"fname":"1f573","uc":"1f573","isCanonical": true},":dark_sunglasses:":{"unicode":["1f576-fe0f","1f576"],"fname":"1f576","uc":"1f576","isCanonical": true},":joystick:":{"unicode":["1f579-fe0f","1f579"],"fname":"1f579","uc":"1f579","isCanonical": true},":paperclips:":{"unicode":["1f587-fe0f","1f587"],"fname":"1f587","uc":"1f587","isCanonical": true},":linked_paperclips:":{"unicode":["1f587-fe0f","1f587"],"fname":"1f587","uc":"1f587","isCanonical": false},":pen_ballpoint:":{"unicode":["1f58a-fe0f","1f58a"],"fname":"1f58a","uc":"1f58a","isCanonical": true},":lower_left_ballpoint_pen:":{"unicode":["1f58a-fe0f","1f58a"],"fname":"1f58a","uc":"1f58a","isCanonical": false},":pen_fountain:":{"unicode":["1f58b-fe0f","1f58b"],"fname":"1f58b","uc":"1f58b","isCanonical": true},":lower_left_fountain_pen:":{"unicode":["1f58b-fe0f","1f58b"],"fname":"1f58b","uc":"1f58b","isCanonical": false},":paintbrush:":{"unicode":["1f58c-fe0f","1f58c"],"fname":"1f58c","uc":"1f58c","isCanonical": true},":lower_left_paintbrush:":{"unicode":["1f58c-fe0f","1f58c"],"fname":"1f58c","uc":"1f58c","isCanonical": false},":crayon:":{"unicode":["1f58d-fe0f","1f58d"],"fname":"1f58d","uc":"1f58d","isCanonical": true},":lower_left_crayon:":{"unicode":["1f58d-fe0f","1f58d"],"fname":"1f58d","uc":"1f58d","isCanonical": false},":desktop:":{"unicode":["1f5a5-fe0f","1f5a5"],"fname":"1f5a5","uc":"1f5a5","isCanonical": true},":desktop_computer:":{"unicode":["1f5a5-fe0f","1f5a5"],"fname":"1f5a5","uc":"1f5a5","isCanonical": false},":printer:":{"unicode":["1f5a8-fe0f","1f5a8"],"fname":"1f5a8","uc":"1f5a8","isCanonical": true},":trackball:":{"unicode":["1f5b2-fe0f","1f5b2"],"fname":"1f5b2","uc":"1f5b2","isCanonical": true},":frame_photo:":{"unicode":["1f5bc-fe0f","1f5bc"],"fname":"1f5bc","uc":"1f5bc","isCanonical": true},":frame_with_picture:":{"unicode":["1f5bc-fe0f","1f5bc"],"fname":"1f5bc","uc":"1f5bc","isCanonical": false},":dividers:":{"unicode":["1f5c2-fe0f","1f5c2"],"fname":"1f5c2","uc":"1f5c2","isCanonical": true},":card_index_dividers:":{"unicode":["1f5c2-fe0f","1f5c2"],"fname":"1f5c2","uc":"1f5c2","isCanonical": false},":card_box:":{"unicode":["1f5c3-fe0f","1f5c3"],"fname":"1f5c3","uc":"1f5c3","isCanonical": true},":card_file_box:":{"unicode":["1f5c3-fe0f","1f5c3"],"fname":"1f5c3","uc":"1f5c3","isCanonical": false},":file_cabinet:":{"unicode":["1f5c4-fe0f","1f5c4"],"fname":"1f5c4","uc":"1f5c4","isCanonical": true},":wastebasket:":{"unicode":["1f5d1-fe0f","1f5d1"],"fname":"1f5d1","uc":"1f5d1","isCanonical": true},":notepad_spiral:":{"unicode":["1f5d2-fe0f","1f5d2"],"fname":"1f5d2","uc":"1f5d2","isCanonical": true},":spiral_note_pad:":{"unicode":["1f5d2-fe0f","1f5d2"],"fname":"1f5d2","uc":"1f5d2","isCanonical": false},":calendar_spiral:":{"unicode":["1f5d3-fe0f","1f5d3"],"fname":"1f5d3","uc":"1f5d3","isCanonical": true},":spiral_calendar_pad:":{"unicode":["1f5d3-fe0f","1f5d3"],"fname":"1f5d3","uc":"1f5d3","isCanonical": false},":compression:":{"unicode":["1f5dc-fe0f","1f5dc"],"fname":"1f5dc","uc":"1f5dc","isCanonical": true},":key2:":{"unicode":["1f5dd-fe0f","1f5dd"],"fname":"1f5dd","uc":"1f5dd","isCanonical": true},":old_key:":{"unicode":["1f5dd-fe0f","1f5dd"],"fname":"1f5dd","uc":"1f5dd","isCanonical": false},":newspaper2:":{"unicode":["1f5de-fe0f","1f5de"],"fname":"1f5de","uc":"1f5de","isCanonical": true},":rolled_up_newspaper:":{"unicode":["1f5de-fe0f","1f5de"],"fname":"1f5de","uc":"1f5de","isCanonical": false},":dagger:":{"unicode":["1f5e1-fe0f","1f5e1"],"fname":"1f5e1","uc":"1f5e1","isCanonical": true},":dagger_knife:":{"unicode":["1f5e1-fe0f","1f5e1"],"fname":"1f5e1","uc":"1f5e1","isCanonical": false},":speaking_head:":{"unicode":["1f5e3-fe0f","1f5e3"],"fname":"1f5e3","uc":"1f5e3","isCanonical": true},":speaking_head_in_silhouette:":{"unicode":["1f5e3-fe0f","1f5e3"],"fname":"1f5e3","uc":"1f5e3","isCanonical": false},":speech_left:":{"unicode":["1f5e8-fe0f","1f5e8"],"fname":"1f5e8","uc":"1f5e8","isCanonical": true},":left_speech_bubble:":{"unicode":["1f5e8-fe0f","1f5e8"],"fname":"1f5e8","uc":"1f5e8","isCanonical": false},":anger_right:":{"unicode":["1f5ef-fe0f","1f5ef"],"fname":"1f5ef","uc":"1f5ef","isCanonical": true},":right_anger_bubble:":{"unicode":["1f5ef-fe0f","1f5ef"],"fname":"1f5ef","uc":"1f5ef","isCanonical": false},":ballot_box:":{"unicode":["1f5f3-fe0f","1f5f3"],"fname":"1f5f3","uc":"1f5f3","isCanonical": true},":ballot_box_with_ballot:":{"unicode":["1f5f3-fe0f","1f5f3"],"fname":"1f5f3","uc":"1f5f3","isCanonical": false},":map:":{"unicode":["1f5fa-fe0f","1f5fa"],"fname":"1f5fa","uc":"1f5fa","isCanonical": true},":world_map:":{"unicode":["1f5fa-fe0f","1f5fa"],"fname":"1f5fa","uc":"1f5fa","isCanonical": false},":tools:":{"unicode":["1f6e0-fe0f","1f6e0"],"fname":"1f6e0","uc":"1f6e0","isCanonical": true},":hammer_and_wrench:":{"unicode":["1f6e0-fe0f","1f6e0"],"fname":"1f6e0","uc":"1f6e0","isCanonical": false},":shield:":{"unicode":["1f6e1-fe0f","1f6e1"],"fname":"1f6e1","uc":"1f6e1","isCanonical": true},":oil:":{"unicode":["1f6e2-fe0f","1f6e2"],"fname":"1f6e2","uc":"1f6e2","isCanonical": true},":oil_drum:":{"unicode":["1f6e2-fe0f","1f6e2"],"fname":"1f6e2","uc":"1f6e2","isCanonical": false},":satellite_orbital:":{"unicode":["1f6f0-fe0f","1f6f0"],"fname":"1f6f0","uc":"1f6f0","isCanonical": true},":fork_knife_plate:":{"unicode":["1f37d-fe0f","1f37d"],"fname":"1f37d","uc":"1f37d","isCanonical": true},":fork_and_knife_with_plate:":{"unicode":["1f37d-fe0f","1f37d"],"fname":"1f37d","uc":"1f37d","isCanonical": false},":eye:":{"unicode":["1f441-fe0f","1f441"],"fname":"1f441","uc":"1f441","isCanonical": true},":levitate:":{"unicode":["1f574-fe0f","1f574"],"fname":"1f574","uc":"1f574","isCanonical": true},":man_in_business_suit_levitating:":{"unicode":["1f574-fe0f","1f574"],"fname":"1f574","uc":"1f574","isCanonical": false},":spy:":{"unicode":["1f575-fe0f","1f575"],"fname":"1f575","uc":"1f575","isCanonical": true},":sleuth_or_spy:":{"unicode":["1f575-fe0f","1f575"],"fname":"1f575","uc":"1f575","isCanonical": false},":hand_splayed:":{"unicode":["1f590-fe0f","1f590"],"fname":"1f590","uc":"1f590","isCanonical": true},":raised_hand_with_fingers_splayed:":{"unicode":["1f590-fe0f","1f590"],"fname":"1f590","uc":"1f590","isCanonical": false},":mountain_snow:":{"unicode":["1f3d4-fe0f","1f3d4"],"fname":"1f3d4","uc":"1f3d4","isCanonical": true},":snow_capped_mountain:":{"unicode":["1f3d4-fe0f","1f3d4"],"fname":"1f3d4","uc":"1f3d4","isCanonical": false},":camping:":{"unicode":["1f3d5-fe0f","1f3d5"],"fname":"1f3d5","uc":"1f3d5","isCanonical": true},":beach:":{"unicode":["1f3d6-fe0f","1f3d6"],"fname":"1f3d6","uc":"1f3d6","isCanonical": true},":beach_with_umbrella:":{"unicode":["1f3d6-fe0f","1f3d6"],"fname":"1f3d6","uc":"1f3d6","isCanonical": false},":construction_site:":{"unicode":["1f3d7-fe0f","1f3d7"],"fname":"1f3d7","uc":"1f3d7","isCanonical": true},":building_construction:":{"unicode":["1f3d7-fe0f","1f3d7"],"fname":"1f3d7","uc":"1f3d7","isCanonical": false},":homes:":{"unicode":["1f3d8-fe0f","1f3d8"],"fname":"1f3d8","uc":"1f3d8","isCanonical": true},":house_buildings:":{"unicode":["1f3d8-fe0f","1f3d8"],"fname":"1f3d8","uc":"1f3d8","isCanonical": false},":cityscape:":{"unicode":["1f3d9-fe0f","1f3d9"],"fname":"1f3d9","uc":"1f3d9","isCanonical": true},":house_abandoned:":{"unicode":["1f3da-fe0f","1f3da"],"fname":"1f3da","uc":"1f3da","isCanonical": true},":derelict_house_building:":{"unicode":["1f3da-fe0f","1f3da"],"fname":"1f3da","uc":"1f3da","isCanonical": false},":classical_building:":{"unicode":["1f3db-fe0f","1f3db"],"fname":"1f3db","uc":"1f3db","isCanonical": true},":desert:":{"unicode":["1f3dc-fe0f","1f3dc"],"fname":"1f3dc","uc":"1f3dc","isCanonical": true},":island:":{"unicode":["1f3dd-fe0f","1f3dd"],"fname":"1f3dd","uc":"1f3dd","isCanonical": true},":desert_island:":{"unicode":["1f3dd-fe0f","1f3dd"],"fname":"1f3dd","uc":"1f3dd","isCanonical": false},":park:":{"unicode":["1f3de-fe0f","1f3de"],"fname":"1f3de","uc":"1f3de","isCanonical": true},":national_park:":{"unicode":["1f3de-fe0f","1f3de"],"fname":"1f3de","uc":"1f3de","isCanonical": false},":stadium:":{"unicode":["1f3df-fe0f","1f3df"],"fname":"1f3df","uc":"1f3df","isCanonical": true},":couch:":{"unicode":["1f6cb-fe0f","1f6cb"],"fname":"1f6cb","uc":"1f6cb","isCanonical": true},":couch_and_lamp:":{"unicode":["1f6cb-fe0f","1f6cb"],"fname":"1f6cb","uc":"1f6cb","isCanonical": false},":shopping_bags:":{"unicode":["1f6cd-fe0f","1f6cd"],"fname":"1f6cd","uc":"1f6cd","isCanonical": true},":bellhop:":{"unicode":["1f6ce-fe0f","1f6ce"],"fname":"1f6ce","uc":"1f6ce","isCanonical": true},":bellhop_bell:":{"unicode":["1f6ce-fe0f","1f6ce"],"fname":"1f6ce","uc":"1f6ce","isCanonical": false},":bed:":{"unicode":["1f6cf-fe0f","1f6cf"],"fname":"1f6cf","uc":"1f6cf","isCanonical": true},":motorway:":{"unicode":["1f6e3-fe0f","1f6e3"],"fname":"1f6e3","uc":"1f6e3","isCanonical": true},":railway_track:":{"unicode":["1f6e4-fe0f","1f6e4"],"fname":"1f6e4","uc":"1f6e4","isCanonical": true},":railroad_track:":{"unicode":["1f6e4-fe0f","1f6e4"],"fname":"1f6e4","uc":"1f6e4","isCanonical": false},":motorboat:":{"unicode":["1f6e5-fe0f","1f6e5"],"fname":"1f6e5","uc":"1f6e5","isCanonical": true},":airplane_small:":{"unicode":["1f6e9-fe0f","1f6e9"],"fname":"1f6e9","uc":"1f6e9","isCanonical": true},":small_airplane:":{"unicode":["1f6e9-fe0f","1f6e9"],"fname":"1f6e9","uc":"1f6e9","isCanonical": false},":cruise_ship:":{"unicode":["1f6f3-fe0f","1f6f3"],"fname":"1f6f3","uc":"1f6f3","isCanonical": true},":passenger_ship:":{"unicode":["1f6f3-fe0f","1f6f3"],"fname":"1f6f3","uc":"1f6f3","isCanonical": false},":white_sun_small_cloud:":{"unicode":["1f324-fe0f","1f324"],"fname":"1f324","uc":"1f324","isCanonical": true},":white_sun_with_small_cloud:":{"unicode":["1f324-fe0f","1f324"],"fname":"1f324","uc":"1f324","isCanonical": false},":white_sun_cloud:":{"unicode":["1f325-fe0f","1f325"],"fname":"1f325","uc":"1f325","isCanonical": true},":white_sun_behind_cloud:":{"unicode":["1f325-fe0f","1f325"],"fname":"1f325","uc":"1f325","isCanonical": false},":white_sun_rain_cloud:":{"unicode":["1f326-fe0f","1f326"],"fname":"1f326","uc":"1f326","isCanonical": true},":white_sun_behind_cloud_with_rain:":{"unicode":["1f326-fe0f","1f326"],"fname":"1f326","uc":"1f326","isCanonical": false},":mouse_three_button:":{"unicode":["1f5b1-fe0f","1f5b1"],"fname":"1f5b1","uc":"1f5b1","isCanonical": true},":three_button_mouse:":{"unicode":["1f5b1-fe0f","1f5b1"],"fname":"1f5b1","uc":"1f5b1","isCanonical": false},":point_up_tone1:":{"unicode":["261d-1f3fb"],"fname":"261d-1f3fb","uc":"261d-1f3fb","isCanonical": true},":point_up_tone2:":{"unicode":["261d-1f3fc"],"fname":"261d-1f3fc","uc":"261d-1f3fc","isCanonical": true},":point_up_tone3:":{"unicode":["261d-1f3fd"],"fname":"261d-1f3fd","uc":"261d-1f3fd","isCanonical": true},":point_up_tone4:":{"unicode":["261d-1f3fe"],"fname":"261d-1f3fe","uc":"261d-1f3fe","isCanonical": true},":point_up_tone5:":{"unicode":["261d-1f3ff"],"fname":"261d-1f3ff","uc":"261d-1f3ff","isCanonical": true},":v_tone1:":{"unicode":["270c-1f3fb"],"fname":"270c-1f3fb","uc":"270c-1f3fb","isCanonical": true},":v_tone2:":{"unicode":["270c-1f3fc"],"fname":"270c-1f3fc","uc":"270c-1f3fc","isCanonical": true},":v_tone3:":{"unicode":["270c-1f3fd"],"fname":"270c-1f3fd","uc":"270c-1f3fd","isCanonical": true},":v_tone4:":{"unicode":["270c-1f3fe"],"fname":"270c-1f3fe","uc":"270c-1f3fe","isCanonical": true},":v_tone5:":{"unicode":["270c-1f3ff"],"fname":"270c-1f3ff","uc":"270c-1f3ff","isCanonical": true},":fist_tone1:":{"unicode":["270a-1f3fb"],"fname":"270a-1f3fb","uc":"270a-1f3fb","isCanonical": true},":fist_tone2:":{"unicode":["270a-1f3fc"],"fname":"270a-1f3fc","uc":"270a-1f3fc","isCanonical": true},":fist_tone3:":{"unicode":["270a-1f3fd"],"fname":"270a-1f3fd","uc":"270a-1f3fd","isCanonical": true},":fist_tone4:":{"unicode":["270a-1f3fe"],"fname":"270a-1f3fe","uc":"270a-1f3fe","isCanonical": true},":fist_tone5:":{"unicode":["270a-1f3ff"],"fname":"270a-1f3ff","uc":"270a-1f3ff","isCanonical": true},":raised_hand_tone1:":{"unicode":["270b-1f3fb"],"fname":"270b-1f3fb","uc":"270b-1f3fb","isCanonical": true},":raised_hand_tone2:":{"unicode":["270b-1f3fc"],"fname":"270b-1f3fc","uc":"270b-1f3fc","isCanonical": true},":raised_hand_tone3:":{"unicode":["270b-1f3fd"],"fname":"270b-1f3fd","uc":"270b-1f3fd","isCanonical": true},":raised_hand_tone4:":{"unicode":["270b-1f3fe"],"fname":"270b-1f3fe","uc":"270b-1f3fe","isCanonical": true},":raised_hand_tone5:":{"unicode":["270b-1f3ff"],"fname":"270b-1f3ff","uc":"270b-1f3ff","isCanonical": true},":writing_hand_tone1:":{"unicode":["270d-1f3fb"],"fname":"270d-1f3fb","uc":"270d-1f3fb","isCanonical": true},":writing_hand_tone2:":{"unicode":["270d-1f3fc"],"fname":"270d-1f3fc","uc":"270d-1f3fc","isCanonical": true},":writing_hand_tone3:":{"unicode":["270d-1f3fd"],"fname":"270d-1f3fd","uc":"270d-1f3fd","isCanonical": true},":writing_hand_tone4:":{"unicode":["270d-1f3fe"],"fname":"270d-1f3fe","uc":"270d-1f3fe","isCanonical": true},":writing_hand_tone5:":{"unicode":["270d-1f3ff"],"fname":"270d-1f3ff","uc":"270d-1f3ff","isCanonical": true},":basketball_player_tone1:":{"unicode":["26f9-1f3fb"],"fname":"26f9-1f3fb","uc":"26f9-1f3fb","isCanonical": true},":person_with_ball_tone1:":{"unicode":["26f9-1f3fb"],"fname":"26f9-1f3fb","uc":"26f9-1f3fb","isCanonical": false},":basketball_player_tone2:":{"unicode":["26f9-1f3fc"],"fname":"26f9-1f3fc","uc":"26f9-1f3fc","isCanonical": true},":person_with_ball_tone2:":{"unicode":["26f9-1f3fc"],"fname":"26f9-1f3fc","uc":"26f9-1f3fc","isCanonical": false},":basketball_player_tone3:":{"unicode":["26f9-1f3fd"],"fname":"26f9-1f3fd","uc":"26f9-1f3fd","isCanonical": true},":person_with_ball_tone3:":{"unicode":["26f9-1f3fd"],"fname":"26f9-1f3fd","uc":"26f9-1f3fd","isCanonical": false},":basketball_player_tone4:":{"unicode":["26f9-1f3fe"],"fname":"26f9-1f3fe","uc":"26f9-1f3fe","isCanonical": true},":person_with_ball_tone4:":{"unicode":["26f9-1f3fe"],"fname":"26f9-1f3fe","uc":"26f9-1f3fe","isCanonical": false},":basketball_player_tone5:":{"unicode":["26f9-1f3ff"],"fname":"26f9-1f3ff","uc":"26f9-1f3ff","isCanonical": true},":person_with_ball_tone5:":{"unicode":["26f9-1f3ff"],"fname":"26f9-1f3ff","uc":"26f9-1f3ff","isCanonical": false},":copyright:":{"unicode":["00a9-fe0f","00a9"],"fname":"00a9","uc":"00a9","isCanonical": true},":registered:":{"unicode":["00ae-fe0f","00ae"],"fname":"00ae","uc":"00ae","isCanonical": true},":bangbang:":{"unicode":["203c-fe0f","203c"],"fname":"203c","uc":"203c","isCanonical": true},":interrobang:":{"unicode":["2049-fe0f","2049"],"fname":"2049","uc":"2049","isCanonical": true},":tm:":{"unicode":["2122-fe0f","2122"],"fname":"2122","uc":"2122","isCanonical": true},":information_source:":{"unicode":["2139-fe0f","2139"],"fname":"2139","uc":"2139","isCanonical": true},":left_right_arrow:":{"unicode":["2194-fe0f","2194"],"fname":"2194","uc":"2194","isCanonical": true},":arrow_up_down:":{"unicode":["2195-fe0f","2195"],"fname":"2195","uc":"2195","isCanonical": true},":arrow_upper_left:":{"unicode":["2196-fe0f","2196"],"fname":"2196","uc":"2196","isCanonical": true},":arrow_upper_right:":{"unicode":["2197-fe0f","2197"],"fname":"2197","uc":"2197","isCanonical": true},":arrow_lower_right:":{"unicode":["2198-fe0f","2198"],"fname":"2198","uc":"2198","isCanonical": true},":arrow_lower_left:":{"unicode":["2199-fe0f","2199"],"fname":"2199","uc":"2199","isCanonical": true},":leftwards_arrow_with_hook:":{"unicode":["21a9-fe0f","21a9"],"fname":"21a9","uc":"21a9","isCanonical": true},":arrow_right_hook:":{"unicode":["21aa-fe0f","21aa"],"fname":"21aa","uc":"21aa","isCanonical": true},":watch:":{"unicode":["231a-fe0f","231a"],"fname":"231a","uc":"231a","isCanonical": true},":hourglass:":{"unicode":["231b-fe0f","231b"],"fname":"231b","uc":"231b","isCanonical": true},":m:":{"unicode":["24c2-fe0f","24c2"],"fname":"24c2","uc":"24c2","isCanonical": true},":black_small_square:":{"unicode":["25aa-fe0f","25aa"],"fname":"25aa","uc":"25aa","isCanonical": true},":white_small_square:":{"unicode":["25ab-fe0f","25ab"],"fname":"25ab","uc":"25ab","isCanonical": true},":arrow_forward:":{"unicode":["25b6-fe0f","25b6"],"fname":"25b6","uc":"25b6","isCanonical": true},":arrow_backward:":{"unicode":["25c0-fe0f","25c0"],"fname":"25c0","uc":"25c0","isCanonical": true},":white_medium_square:":{"unicode":["25fb-fe0f","25fb"],"fname":"25fb","uc":"25fb","isCanonical": true},":black_medium_square:":{"unicode":["25fc-fe0f","25fc"],"fname":"25fc","uc":"25fc","isCanonical": true},":white_medium_small_square:":{"unicode":["25fd-fe0f","25fd"],"fname":"25fd","uc":"25fd","isCanonical": true},":black_medium_small_square:":{"unicode":["25fe-fe0f","25fe"],"fname":"25fe","uc":"25fe","isCanonical": true},":sunny:":{"unicode":["2600-fe0f","2600"],"fname":"2600","uc":"2600","isCanonical": true},":cloud:":{"unicode":["2601-fe0f","2601"],"fname":"2601","uc":"2601","isCanonical": true},":telephone:":{"unicode":["260e-fe0f","260e"],"fname":"260e","uc":"260e","isCanonical": true},":ballot_box_with_check:":{"unicode":["2611-fe0f","2611"],"fname":"2611","uc":"2611","isCanonical": true},":umbrella:":{"unicode":["2614-fe0f","2614"],"fname":"2614","uc":"2614","isCanonical": true},":coffee:":{"unicode":["2615-fe0f","2615"],"fname":"2615","uc":"2615","isCanonical": true},":point_up:":{"unicode":["261d-fe0f","261d"],"fname":"261d","uc":"261d","isCanonical": true},":relaxed:":{"unicode":["263a-fe0f","263a"],"fname":"263a","uc":"263a","isCanonical": true},":aries:":{"unicode":["2648-fe0f","2648"],"fname":"2648","uc":"2648","isCanonical": true},":taurus:":{"unicode":["2649-fe0f","2649"],"fname":"2649","uc":"2649","isCanonical": true},":gemini:":{"unicode":["264a-fe0f","264a"],"fname":"264a","uc":"264a","isCanonical": true},":cancer:":{"unicode":["264b-fe0f","264b"],"fname":"264b","uc":"264b","isCanonical": true},":leo:":{"unicode":["264c-fe0f","264c"],"fname":"264c","uc":"264c","isCanonical": true},":virgo:":{"unicode":["264d-fe0f","264d"],"fname":"264d","uc":"264d","isCanonical": true},":libra:":{"unicode":["264e-fe0f","264e"],"fname":"264e","uc":"264e","isCanonical": true},":scorpius:":{"unicode":["264f-fe0f","264f"],"fname":"264f","uc":"264f","isCanonical": true},":sagittarius:":{"unicode":["2650-fe0f","2650"],"fname":"2650","uc":"2650","isCanonical": true},":capricorn:":{"unicode":["2651-fe0f","2651"],"fname":"2651","uc":"2651","isCanonical": true},":aquarius:":{"unicode":["2652-fe0f","2652"],"fname":"2652","uc":"2652","isCanonical": true},":pisces:":{"unicode":["2653-fe0f","2653"],"fname":"2653","uc":"2653","isCanonical": true},":spades:":{"unicode":["2660-fe0f","2660"],"fname":"2660","uc":"2660","isCanonical": true},":clubs:":{"unicode":["2663-fe0f","2663"],"fname":"2663","uc":"2663","isCanonical": true},":hearts:":{"unicode":["2665-fe0f","2665"],"fname":"2665","uc":"2665","isCanonical": true},":diamonds:":{"unicode":["2666-fe0f","2666"],"fname":"2666","uc":"2666","isCanonical": true},":hotsprings:":{"unicode":["2668-fe0f","2668"],"fname":"2668","uc":"2668","isCanonical": true},":recycle:":{"unicode":["267b-fe0f","267b"],"fname":"267b","uc":"267b","isCanonical": true},":wheelchair:":{"unicode":["267f-fe0f","267f"],"fname":"267f","uc":"267f","isCanonical": true},":anchor:":{"unicode":["2693-fe0f","2693"],"fname":"2693","uc":"2693","isCanonical": true},":warning:":{"unicode":["26a0-fe0f","26a0"],"fname":"26a0","uc":"26a0","isCanonical": true},":zap:":{"unicode":["26a1-fe0f","26a1"],"fname":"26a1","uc":"26a1","isCanonical": true},":white_circle:":{"unicode":["26aa-fe0f","26aa"],"fname":"26aa","uc":"26aa","isCanonical": true},":black_circle:":{"unicode":["26ab-fe0f","26ab"],"fname":"26ab","uc":"26ab","isCanonical": true},":soccer:":{"unicode":["26bd-fe0f","26bd"],"fname":"26bd","uc":"26bd","isCanonical": true},":baseball:":{"unicode":["26be-fe0f","26be"],"fname":"26be","uc":"26be","isCanonical": true},":snowman:":{"unicode":["26c4-fe0f","26c4"],"fname":"26c4","uc":"26c4","isCanonical": true},":partly_sunny:":{"unicode":["26c5-fe0f","26c5"],"fname":"26c5","uc":"26c5","isCanonical": true},":no_entry:":{"unicode":["26d4-fe0f","26d4"],"fname":"26d4","uc":"26d4","isCanonical": true},":church:":{"unicode":["26ea-fe0f","26ea"],"fname":"26ea","uc":"26ea","isCanonical": true},":fountain:":{"unicode":["26f2-fe0f","26f2"],"fname":"26f2","uc":"26f2","isCanonical": true},":golf:":{"unicode":["26f3-fe0f","26f3"],"fname":"26f3","uc":"26f3","isCanonical": true},":sailboat:":{"unicode":["26f5-fe0f","26f5"],"fname":"26f5","uc":"26f5","isCanonical": true},":tent:":{"unicode":["26fa-fe0f","26fa"],"fname":"26fa","uc":"26fa","isCanonical": true},":fuelpump:":{"unicode":["26fd-fe0f","26fd"],"fname":"26fd","uc":"26fd","isCanonical": true},":scissors:":{"unicode":["2702-fe0f","2702"],"fname":"2702","uc":"2702","isCanonical": true},":airplane:":{"unicode":["2708-fe0f","2708"],"fname":"2708","uc":"2708","isCanonical": true},":envelope:":{"unicode":["2709-fe0f","2709"],"fname":"2709","uc":"2709","isCanonical": true},":v:":{"unicode":["270c-fe0f","270c"],"fname":"270c","uc":"270c","isCanonical": true},":pencil2:":{"unicode":["270f-fe0f","270f"],"fname":"270f","uc":"270f","isCanonical": true},":black_nib:":{"unicode":["2712-fe0f","2712"],"fname":"2712","uc":"2712","isCanonical": true},":heavy_check_mark:":{"unicode":["2714-fe0f","2714"],"fname":"2714","uc":"2714","isCanonical": true},":heavy_multiplication_x:":{"unicode":["2716-fe0f","2716"],"fname":"2716","uc":"2716","isCanonical": true},":eight_spoked_asterisk:":{"unicode":["2733-fe0f","2733"],"fname":"2733","uc":"2733","isCanonical": true},":eight_pointed_black_star:":{"unicode":["2734-fe0f","2734"],"fname":"2734","uc":"2734","isCanonical": true},":snowflake:":{"unicode":["2744-fe0f","2744"],"fname":"2744","uc":"2744","isCanonical": true},":sparkle:":{"unicode":["2747-fe0f","2747"],"fname":"2747","uc":"2747","isCanonical": true},":exclamation:":{"unicode":["2757-fe0f","2757"],"fname":"2757","uc":"2757","isCanonical": true},":heart:":{"unicode":["2764-fe0f","2764"],"fname":"2764","uc":"2764","isCanonical": true},":arrow_right:":{"unicode":["27a1-fe0f","27a1"],"fname":"27a1","uc":"27a1","isCanonical": true},":arrow_heading_up:":{"unicode":["2934-fe0f","2934"],"fname":"2934","uc":"2934","isCanonical": true},":arrow_heading_down:":{"unicode":["2935-fe0f","2935"],"fname":"2935","uc":"2935","isCanonical": true},":arrow_left:":{"unicode":["2b05-fe0f","2b05"],"fname":"2b05","uc":"2b05","isCanonical": true},":arrow_up:":{"unicode":["2b06-fe0f","2b06"],"fname":"2b06","uc":"2b06","isCanonical": true},":arrow_down:":{"unicode":["2b07-fe0f","2b07"],"fname":"2b07","uc":"2b07","isCanonical": true},":black_large_square:":{"unicode":["2b1b-fe0f","2b1b"],"fname":"2b1b","uc":"2b1b","isCanonical": true},":white_large_square:":{"unicode":["2b1c-fe0f","2b1c"],"fname":"2b1c","uc":"2b1c","isCanonical": true},":star:":{"unicode":["2b50-fe0f","2b50"],"fname":"2b50","uc":"2b50","isCanonical": true},":o:":{"unicode":["2b55-fe0f","2b55"],"fname":"2b55","uc":"2b55","isCanonical": true},":wavy_dash:":{"unicode":["3030-fe0f","3030"],"fname":"3030","uc":"3030","isCanonical": true},":part_alternation_mark:":{"unicode":["303d-fe0f","303d"],"fname":"303d","uc":"303d","isCanonical": true},":congratulations:":{"unicode":["3297-fe0f","3297"],"fname":"3297","uc":"3297","isCanonical": true},":secret:":{"unicode":["3299-fe0f","3299"],"fname":"3299","uc":"3299","isCanonical": true},":cross:":{"unicode":["271d-fe0f","271d"],"fname":"271d","uc":"271d","isCanonical": true},":latin_cross:":{"unicode":["271d-fe0f","271d"],"fname":"271d","uc":"271d","isCanonical": false},":keyboard:":{"unicode":["2328-fe0f","2328"],"fname":"2328","uc":"2328","isCanonical": true},":writing_hand:":{"unicode":["270d-fe0f","270d"],"fname":"270d","uc":"270d","isCanonical": true},":eject:":{"unicode":["23cf-fe0f","23cf"],"fname":"23cf","uc":"23cf","isCanonical": true},":eject_symbol:":{"unicode":["23cf-fe0f","23cf"],"fname":"23cf","uc":"23cf","isCanonical": false},":track_next:":{"unicode":["23ed-fe0f","23ed"],"fname":"23ed","uc":"23ed","isCanonical": true},":next_track:":{"unicode":["23ed-fe0f","23ed"],"fname":"23ed","uc":"23ed","isCanonical": false},":track_previous:":{"unicode":["23ee-fe0f","23ee"],"fname":"23ee","uc":"23ee","isCanonical": true},":previous_track:":{"unicode":["23ee-fe0f","23ee"],"fname":"23ee","uc":"23ee","isCanonical": false},":play_pause:":{"unicode":["23ef-fe0f","23ef"],"fname":"23ef","uc":"23ef","isCanonical": true},":stopwatch:":{"unicode":["23f1-fe0f","23f1"],"fname":"23f1","uc":"23f1","isCanonical": true},":timer:":{"unicode":["23f2-fe0f","23f2"],"fname":"23f2","uc":"23f2","isCanonical": true},":timer_clock:":{"unicode":["23f2-fe0f","23f2"],"fname":"23f2","uc":"23f2","isCanonical": false},":pause_button:":{"unicode":["23f8-fe0f","23f8"],"fname":"23f8","uc":"23f8","isCanonical": true},":double_vertical_bar:":{"unicode":["23f8-fe0f","23f8"],"fname":"23f8","uc":"23f8","isCanonical": false},":stop_button:":{"unicode":["23f9-fe0f","23f9"],"fname":"23f9","uc":"23f9","isCanonical": true},":record_button:":{"unicode":["23fa-fe0f","23fa"],"fname":"23fa","uc":"23fa","isCanonical": true},":umbrella2:":{"unicode":["2602-fe0f","2602"],"fname":"2602","uc":"2602","isCanonical": true},":snowman2:":{"unicode":["2603-fe0f","2603"],"fname":"2603","uc":"2603","isCanonical": true},":comet:":{"unicode":["2604-fe0f","2604"],"fname":"2604","uc":"2604","isCanonical": true},":shamrock:":{"unicode":["2618-fe0f","2618"],"fname":"2618","uc":"2618","isCanonical": true},":skull_crossbones:":{"unicode":["2620-fe0f","2620"],"fname":"2620","uc":"2620","isCanonical": true},":skull_and_crossbones:":{"unicode":["2620-fe0f","2620"],"fname":"2620","uc":"2620","isCanonical": false},":radioactive:":{"unicode":["2622-fe0f","2622"],"fname":"2622","uc":"2622","isCanonical": true},":radioactive_sign:":{"unicode":["2622-fe0f","2622"],"fname":"2622","uc":"2622","isCanonical": false},":biohazard:":{"unicode":["2623-fe0f","2623"],"fname":"2623","uc":"2623","isCanonical": true},":biohazard_sign:":{"unicode":["2623-fe0f","2623"],"fname":"2623","uc":"2623","isCanonical": false},":orthodox_cross:":{"unicode":["2626-fe0f","2626"],"fname":"2626","uc":"2626","isCanonical": true},":star_and_crescent:":{"unicode":["262a-fe0f","262a"],"fname":"262a","uc":"262a","isCanonical": true},":peace:":{"unicode":["262e-fe0f","262e"],"fname":"262e","uc":"262e","isCanonical": true},":peace_symbol:":{"unicode":["262e-fe0f","262e"],"fname":"262e","uc":"262e","isCanonical": false},":yin_yang:":{"unicode":["262f-fe0f","262f"],"fname":"262f","uc":"262f","isCanonical": true},":wheel_of_dharma:":{"unicode":["2638-fe0f","2638"],"fname":"2638","uc":"2638","isCanonical": true},":frowning2:":{"unicode":["2639-fe0f","2639"],"fname":"2639","uc":"2639","isCanonical": true},":white_frowning_face:":{"unicode":["2639-fe0f","2639"],"fname":"2639","uc":"2639","isCanonical": false},":hammer_pick:":{"unicode":["2692-fe0f","2692"],"fname":"2692","uc":"2692","isCanonical": true},":hammer_and_pick:":{"unicode":["2692-fe0f","2692"],"fname":"2692","uc":"2692","isCanonical": false},":crossed_swords:":{"unicode":["2694-fe0f","2694"],"fname":"2694","uc":"2694","isCanonical": true},":scales:":{"unicode":["2696-fe0f","2696"],"fname":"2696","uc":"2696","isCanonical": true},":alembic:":{"unicode":["2697-fe0f","2697"],"fname":"2697","uc":"2697","isCanonical": true},":gear:":{"unicode":["2699-fe0f","2699"],"fname":"2699","uc":"2699","isCanonical": true},":atom:":{"unicode":["269b-fe0f","269b"],"fname":"269b","uc":"269b","isCanonical": true},":atom_symbol:":{"unicode":["269b-fe0f","269b"],"fname":"269b","uc":"269b","isCanonical": false},":fleur-de-lis:":{"unicode":["269c-fe0f","269c"],"fname":"269c","uc":"269c","isCanonical": true},":coffin:":{"unicode":["26b0-fe0f","26b0"],"fname":"26b0","uc":"26b0","isCanonical": true},":urn:":{"unicode":["26b1-fe0f","26b1"],"fname":"26b1","uc":"26b1","isCanonical": true},":funeral_urn:":{"unicode":["26b1-fe0f","26b1"],"fname":"26b1","uc":"26b1","isCanonical": false},":thunder_cloud_rain:":{"unicode":["26c8-fe0f","26c8"],"fname":"26c8","uc":"26c8","isCanonical": true},":thunder_cloud_and_rain:":{"unicode":["26c8-fe0f","26c8"],"fname":"26c8","uc":"26c8","isCanonical": false},":pick:":{"unicode":["26cf-fe0f","26cf"],"fname":"26cf","uc":"26cf","isCanonical": true},":helmet_with_cross:":{"unicode":["26d1-fe0f","26d1"],"fname":"26d1","uc":"26d1","isCanonical": true},":helmet_with_white_cross:":{"unicode":["26d1-fe0f","26d1"],"fname":"26d1","uc":"26d1","isCanonical": false},":chains:":{"unicode":["26d3-fe0f","26d3"],"fname":"26d3","uc":"26d3","isCanonical": true},":shinto_shrine:":{"unicode":["26e9-fe0f","26e9"],"fname":"26e9","uc":"26e9","isCanonical": true},":mountain:":{"unicode":["26f0-fe0f","26f0"],"fname":"26f0","uc":"26f0","isCanonical": true},":beach_umbrella:":{"unicode":["26f1-fe0f","26f1"],"fname":"26f1","uc":"26f1","isCanonical": true},":umbrella_on_ground:":{"unicode":["26f1-fe0f","26f1"],"fname":"26f1","uc":"26f1","isCanonical": false},":ferry:":{"unicode":["26f4-fe0f","26f4"],"fname":"26f4","uc":"26f4","isCanonical": true},":skier:":{"unicode":["26f7-fe0f","26f7"],"fname":"26f7","uc":"26f7","isCanonical": true},":ice_skate:":{"unicode":["26f8-fe0f","26f8"],"fname":"26f8","uc":"26f8","isCanonical": true},":basketball_player:":{"unicode":["26f9-fe0f","26f9"],"fname":"26f9","uc":"26f9","isCanonical": true},":person_with_ball:":{"unicode":["26f9-fe0f","26f9"],"fname":"26f9","uc":"26f9","isCanonical": false},":star_of_david:":{"unicode":["2721-fe0f","2721"],"fname":"2721","uc":"2721","isCanonical": true},":heart_exclamation:":{"unicode":["2763-fe0f","2763"],"fname":"2763","uc":"2763","isCanonical": true},":heavy_heart_exclamation_mark_ornament:":{"unicode":["2763-fe0f","2763"],"fname":"2763","uc":"2763","isCanonical": false},":third_place:":{"unicode":["1f949"],"fname":"1f949","uc":"1f949","isCanonical": true},":third_place_medal:":{"unicode":["1f949"],"fname":"1f949","uc":"1f949","isCanonical": false},":second_place:":{"unicode":["1f948"],"fname":"1f948","uc":"1f948","isCanonical": true},":second_place_medal:":{"unicode":["1f948"],"fname":"1f948","uc":"1f948","isCanonical": false},":first_place:":{"unicode":["1f947"],"fname":"1f947","uc":"1f947","isCanonical": true},":first_place_medal:":{"unicode":["1f947"],"fname":"1f947","uc":"1f947","isCanonical": false},":fencer:":{"unicode":["1f93a"],"fname":"1f93a","uc":"1f93a","isCanonical": true},":fencing:":{"unicode":["1f93a"],"fname":"1f93a","uc":"1f93a","isCanonical": false},":goal:":{"unicode":["1f945"],"fname":"1f945","uc":"1f945","isCanonical": true},":goal_net:":{"unicode":["1f945"],"fname":"1f945","uc":"1f945","isCanonical": false},":handball:":{"unicode":["1f93e"],"fname":"1f93e","uc":"1f93e","isCanonical": true},":regional_indicator_z:":{"unicode":["1f1ff"],"fname":"1f1ff","uc":"1f1ff","isCanonical": true},":water_polo:":{"unicode":["1f93d"],"fname":"1f93d","uc":"1f93d","isCanonical": true},":martial_arts_uniform:":{"unicode":["1f94b"],"fname":"1f94b","uc":"1f94b","isCanonical": true},":karate_uniform:":{"unicode":["1f94b"],"fname":"1f94b","uc":"1f94b","isCanonical": false},":boxing_glove:":{"unicode":["1f94a"],"fname":"1f94a","uc":"1f94a","isCanonical": true},":boxing_gloves:":{"unicode":["1f94a"],"fname":"1f94a","uc":"1f94a","isCanonical": false},":wrestlers:":{"unicode":["1f93c"],"fname":"1f93c","uc":"1f93c","isCanonical": true},":wrestling:":{"unicode":["1f93c"],"fname":"1f93c","uc":"1f93c","isCanonical": false},":juggling:":{"unicode":["1f939"],"fname":"1f939","uc":"1f939","isCanonical": true},":juggler:":{"unicode":["1f939"],"fname":"1f939","uc":"1f939","isCanonical": false},":cartwheel:":{"unicode":["1f938"],"fname":"1f938","uc":"1f938","isCanonical": true},":person_doing_cartwheel:":{"unicode":["1f938"],"fname":"1f938","uc":"1f938","isCanonical": false},":canoe:":{"unicode":["1f6f6"],"fname":"1f6f6","uc":"1f6f6","isCanonical": true},":kayak:":{"unicode":["1f6f6"],"fname":"1f6f6","uc":"1f6f6","isCanonical": false},":motor_scooter:":{"unicode":["1f6f5"],"fname":"1f6f5","uc":"1f6f5","isCanonical": true},":motorbike:":{"unicode":["1f6f5"],"fname":"1f6f5","uc":"1f6f5","isCanonical": false},":scooter:":{"unicode":["1f6f4"],"fname":"1f6f4","uc":"1f6f4","isCanonical": true},":shopping_cart:":{"unicode":["1f6d2"],"fname":"1f6d2","uc":"1f6d2","isCanonical": true},":shopping_trolley:":{"unicode":["1f6d2"],"fname":"1f6d2","uc":"1f6d2","isCanonical": false},":black_joker:":{"unicode":["1f0cf"],"fname":"1f0cf","uc":"1f0cf","isCanonical": true},":a:":{"unicode":["1f170"],"fname":"1f170","uc":"1f170","isCanonical": true},":b:":{"unicode":["1f171"],"fname":"1f171","uc":"1f171","isCanonical": true},":o2:":{"unicode":["1f17e"],"fname":"1f17e","uc":"1f17e","isCanonical": true},":octagonal_sign:":{"unicode":["1f6d1"],"fname":"1f6d1","uc":"1f6d1","isCanonical": true},":stop_sign:":{"unicode":["1f6d1"],"fname":"1f6d1","uc":"1f6d1","isCanonical": false},":ab:":{"unicode":["1f18e"],"fname":"1f18e","uc":"1f18e","isCanonical": true},":cl:":{"unicode":["1f191"],"fname":"1f191","uc":"1f191","isCanonical": true},":regional_indicator_y:":{"unicode":["1f1fe"],"fname":"1f1fe","uc":"1f1fe","isCanonical": true},":cool:":{"unicode":["1f192"],"fname":"1f192","uc":"1f192","isCanonical": true},":free:":{"unicode":["1f193"],"fname":"1f193","uc":"1f193","isCanonical": true},":id:":{"unicode":["1f194"],"fname":"1f194","uc":"1f194","isCanonical": true},":new:":{"unicode":["1f195"],"fname":"1f195","uc":"1f195","isCanonical": true},":ng:":{"unicode":["1f196"],"fname":"1f196","uc":"1f196","isCanonical": true},":ok:":{"unicode":["1f197"],"fname":"1f197","uc":"1f197","isCanonical": true},":sos:":{"unicode":["1f198"],"fname":"1f198","uc":"1f198","isCanonical": true},":spoon:":{"unicode":["1f944"],"fname":"1f944","uc":"1f944","isCanonical": true},":up:":{"unicode":["1f199"],"fname":"1f199","uc":"1f199","isCanonical": true},":vs:":{"unicode":["1f19a"],"fname":"1f19a","uc":"1f19a","isCanonical": true},":champagne_glass:":{"unicode":["1f942"],"fname":"1f942","uc":"1f942","isCanonical": true},":clinking_glass:":{"unicode":["1f942"],"fname":"1f942","uc":"1f942","isCanonical": false},":tumbler_glass:":{"unicode":["1f943"],"fname":"1f943","uc":"1f943","isCanonical": true},":whisky:":{"unicode":["1f943"],"fname":"1f943","uc":"1f943","isCanonical": false},":koko:":{"unicode":["1f201"],"fname":"1f201","uc":"1f201","isCanonical": true},":stuffed_flatbread:":{"unicode":["1f959"],"fname":"1f959","uc":"1f959","isCanonical": true},":stuffed_pita:":{"unicode":["1f959"],"fname":"1f959","uc":"1f959","isCanonical": false},":u7981:":{"unicode":["1f232"],"fname":"1f232","uc":"1f232","isCanonical": true},":u7a7a:":{"unicode":["1f233"],"fname":"1f233","uc":"1f233","isCanonical": true},":u5408:":{"unicode":["1f234"],"fname":"1f234","uc":"1f234","isCanonical": true},":u6e80:":{"unicode":["1f235"],"fname":"1f235","uc":"1f235","isCanonical": true},":u6709:":{"unicode":["1f236"],"fname":"1f236","uc":"1f236","isCanonical": true},":shallow_pan_of_food:":{"unicode":["1f958"],"fname":"1f958","uc":"1f958","isCanonical": true},":paella:":{"unicode":["1f958"],"fname":"1f958","uc":"1f958","isCanonical": false},":u7533:":{"unicode":["1f238"],"fname":"1f238","uc":"1f238","isCanonical": true},":u5272:":{"unicode":["1f239"],"fname":"1f239","uc":"1f239","isCanonical": true},":salad:":{"unicode":["1f957"],"fname":"1f957","uc":"1f957","isCanonical": true},":green_salad:":{"unicode":["1f957"],"fname":"1f957","uc":"1f957","isCanonical": false},":u55b6:":{"unicode":["1f23a"],"fname":"1f23a","uc":"1f23a","isCanonical": true},":ideograph_advantage:":{"unicode":["1f250"],"fname":"1f250","uc":"1f250","isCanonical": true},":accept:":{"unicode":["1f251"],"fname":"1f251","uc":"1f251","isCanonical": true},":cyclone:":{"unicode":["1f300"],"fname":"1f300","uc":"1f300","isCanonical": true},":french_bread:":{"unicode":["1f956"],"fname":"1f956","uc":"1f956","isCanonical": true},":baguette_bread:":{"unicode":["1f956"],"fname":"1f956","uc":"1f956","isCanonical": false},":foggy:":{"unicode":["1f301"],"fname":"1f301","uc":"1f301","isCanonical": true},":closed_umbrella:":{"unicode":["1f302"],"fname":"1f302","uc":"1f302","isCanonical": true},":night_with_stars:":{"unicode":["1f303"],"fname":"1f303","uc":"1f303","isCanonical": true},":sunrise_over_mountains:":{"unicode":["1f304"],"fname":"1f304","uc":"1f304","isCanonical": true},":sunrise:":{"unicode":["1f305"],"fname":"1f305","uc":"1f305","isCanonical": true},":city_dusk:":{"unicode":["1f306"],"fname":"1f306","uc":"1f306","isCanonical": true},":carrot:":{"unicode":["1f955"],"fname":"1f955","uc":"1f955","isCanonical": true},":city_sunset:":{"unicode":["1f307"],"fname":"1f307","uc":"1f307","isCanonical": true},":city_sunrise:":{"unicode":["1f307"],"fname":"1f307","uc":"1f307","isCanonical": false},":rainbow:":{"unicode":["1f308"],"fname":"1f308","uc":"1f308","isCanonical": true},":potato:":{"unicode":["1f954"],"fname":"1f954","uc":"1f954","isCanonical": true},":bridge_at_night:":{"unicode":["1f309"],"fname":"1f309","uc":"1f309","isCanonical": true},":ocean:":{"unicode":["1f30a"],"fname":"1f30a","uc":"1f30a","isCanonical": true},":volcano:":{"unicode":["1f30b"],"fname":"1f30b","uc":"1f30b","isCanonical": true},":milky_way:":{"unicode":["1f30c"],"fname":"1f30c","uc":"1f30c","isCanonical": true},":earth_asia:":{"unicode":["1f30f"],"fname":"1f30f","uc":"1f30f","isCanonical": true},":new_moon:":{"unicode":["1f311"],"fname":"1f311","uc":"1f311","isCanonical": true},":bacon:":{"unicode":["1f953"],"fname":"1f953","uc":"1f953","isCanonical": true},":first_quarter_moon:":{"unicode":["1f313"],"fname":"1f313","uc":"1f313","isCanonical": true},":waxing_gibbous_moon:":{"unicode":["1f314"],"fname":"1f314","uc":"1f314","isCanonical": true},":full_moon:":{"unicode":["1f315"],"fname":"1f315","uc":"1f315","isCanonical": true},":crescent_moon:":{"unicode":["1f319"],"fname":"1f319","uc":"1f319","isCanonical": true},":first_quarter_moon_with_face:":{"unicode":["1f31b"],"fname":"1f31b","uc":"1f31b","isCanonical": true},":star2:":{"unicode":["1f31f"],"fname":"1f31f","uc":"1f31f","isCanonical": true},":cucumber:":{"unicode":["1f952"],"fname":"1f952","uc":"1f952","isCanonical": true},":stars:":{"unicode":["1f320"],"fname":"1f320","uc":"1f320","isCanonical": true},":chestnut:":{"unicode":["1f330"],"fname":"1f330","uc":"1f330","isCanonical": true},":avocado:":{"unicode":["1f951"],"fname":"1f951","uc":"1f951","isCanonical": true},":seedling:":{"unicode":["1f331"],"fname":"1f331","uc":"1f331","isCanonical": true},":palm_tree:":{"unicode":["1f334"],"fname":"1f334","uc":"1f334","isCanonical": true},":cactus:":{"unicode":["1f335"],"fname":"1f335","uc":"1f335","isCanonical": true},":tulip:":{"unicode":["1f337"],"fname":"1f337","uc":"1f337","isCanonical": true},":cherry_blossom:":{"unicode":["1f338"],"fname":"1f338","uc":"1f338","isCanonical": true},":rose:":{"unicode":["1f339"],"fname":"1f339","uc":"1f339","isCanonical": true},":hibiscus:":{"unicode":["1f33a"],"fname":"1f33a","uc":"1f33a","isCanonical": true},":sunflower:":{"unicode":["1f33b"],"fname":"1f33b","uc":"1f33b","isCanonical": true},":blossom:":{"unicode":["1f33c"],"fname":"1f33c","uc":"1f33c","isCanonical": true},":corn:":{"unicode":["1f33d"],"fname":"1f33d","uc":"1f33d","isCanonical": true},":croissant:":{"unicode":["1f950"],"fname":"1f950","uc":"1f950","isCanonical": true},":ear_of_rice:":{"unicode":["1f33e"],"fname":"1f33e","uc":"1f33e","isCanonical": true},":herb:":{"unicode":["1f33f"],"fname":"1f33f","uc":"1f33f","isCanonical": true},":four_leaf_clover:":{"unicode":["1f340"],"fname":"1f340","uc":"1f340","isCanonical": true},":maple_leaf:":{"unicode":["1f341"],"fname":"1f341","uc":"1f341","isCanonical": true},":fallen_leaf:":{"unicode":["1f342"],"fname":"1f342","uc":"1f342","isCanonical": true},":leaves:":{"unicode":["1f343"],"fname":"1f343","uc":"1f343","isCanonical": true},":mushroom:":{"unicode":["1f344"],"fname":"1f344","uc":"1f344","isCanonical": true},":tomato:":{"unicode":["1f345"],"fname":"1f345","uc":"1f345","isCanonical": true},":eggplant:":{"unicode":["1f346"],"fname":"1f346","uc":"1f346","isCanonical": true},":grapes:":{"unicode":["1f347"],"fname":"1f347","uc":"1f347","isCanonical": true},":melon:":{"unicode":["1f348"],"fname":"1f348","uc":"1f348","isCanonical": true},":watermelon:":{"unicode":["1f349"],"fname":"1f349","uc":"1f349","isCanonical": true},":tangerine:":{"unicode":["1f34a"],"fname":"1f34a","uc":"1f34a","isCanonical": true},":wilted_rose:":{"unicode":["1f940"],"fname":"1f940","uc":"1f940","isCanonical": true},":wilted_flower:":{"unicode":["1f940"],"fname":"1f940","uc":"1f940","isCanonical": false},":banana:":{"unicode":["1f34c"],"fname":"1f34c","uc":"1f34c","isCanonical": true},":pineapple:":{"unicode":["1f34d"],"fname":"1f34d","uc":"1f34d","isCanonical": true},":apple:":{"unicode":["1f34e"],"fname":"1f34e","uc":"1f34e","isCanonical": true},":green_apple:":{"unicode":["1f34f"],"fname":"1f34f","uc":"1f34f","isCanonical": true},":peach:":{"unicode":["1f351"],"fname":"1f351","uc":"1f351","isCanonical": true},":cherries:":{"unicode":["1f352"],"fname":"1f352","uc":"1f352","isCanonical": true},":strawberry:":{"unicode":["1f353"],"fname":"1f353","uc":"1f353","isCanonical": true},":rhino:":{"unicode":["1f98f"],"fname":"1f98f","uc":"1f98f","isCanonical": true},":rhinoceros:":{"unicode":["1f98f"],"fname":"1f98f","uc":"1f98f","isCanonical": false},":hamburger:":{"unicode":["1f354"],"fname":"1f354","uc":"1f354","isCanonical": true},":pizza:":{"unicode":["1f355"],"fname":"1f355","uc":"1f355","isCanonical": true},":meat_on_bone:":{"unicode":["1f356"],"fname":"1f356","uc":"1f356","isCanonical": true},":lizard:":{"unicode":["1f98e"],"fname":"1f98e","uc":"1f98e","isCanonical": true},":poultry_leg:":{"unicode":["1f357"],"fname":"1f357","uc":"1f357","isCanonical": true},":rice_cracker:":{"unicode":["1f358"],"fname":"1f358","uc":"1f358","isCanonical": true},":rice_ball:":{"unicode":["1f359"],"fname":"1f359","uc":"1f359","isCanonical": true},":gorilla:":{"unicode":["1f98d"],"fname":"1f98d","uc":"1f98d","isCanonical": true},":rice:":{"unicode":["1f35a"],"fname":"1f35a","uc":"1f35a","isCanonical": true},":curry:":{"unicode":["1f35b"],"fname":"1f35b","uc":"1f35b","isCanonical": true},":deer:":{"unicode":["1f98c"],"fname":"1f98c","uc":"1f98c","isCanonical": true},":ramen:":{"unicode":["1f35c"],"fname":"1f35c","uc":"1f35c","isCanonical": true},":spaghetti:":{"unicode":["1f35d"],"fname":"1f35d","uc":"1f35d","isCanonical": true},":bread:":{"unicode":["1f35e"],"fname":"1f35e","uc":"1f35e","isCanonical": true},":fries:":{"unicode":["1f35f"],"fname":"1f35f","uc":"1f35f","isCanonical": true},":butterfly:":{"unicode":["1f98b"],"fname":"1f98b","uc":"1f98b","isCanonical": true},":sweet_potato:":{"unicode":["1f360"],"fname":"1f360","uc":"1f360","isCanonical": true},":dango:":{"unicode":["1f361"],"fname":"1f361","uc":"1f361","isCanonical": true},":fox:":{"unicode":["1f98a"],"fname":"1f98a","uc":"1f98a","isCanonical": true},":fox_face:":{"unicode":["1f98a"],"fname":"1f98a","uc":"1f98a","isCanonical": false},":oden:":{"unicode":["1f362"],"fname":"1f362","uc":"1f362","isCanonical": true},":sushi:":{"unicode":["1f363"],"fname":"1f363","uc":"1f363","isCanonical": true},":owl:":{"unicode":["1f989"],"fname":"1f989","uc":"1f989","isCanonical": true},":fried_shrimp:":{"unicode":["1f364"],"fname":"1f364","uc":"1f364","isCanonical": true},":fish_cake:":{"unicode":["1f365"],"fname":"1f365","uc":"1f365","isCanonical": true},":shark:":{"unicode":["1f988"],"fname":"1f988","uc":"1f988","isCanonical": true},":icecream:":{"unicode":["1f366"],"fname":"1f366","uc":"1f366","isCanonical": true},":bat:":{"unicode":["1f987"],"fname":"1f987","uc":"1f987","isCanonical": true},":shaved_ice:":{"unicode":["1f367"],"fname":"1f367","uc":"1f367","isCanonical": true},":regional_indicator_x:":{"unicode":["1f1fd"],"fname":"1f1fd","uc":"1f1fd","isCanonical": true},":ice_cream:":{"unicode":["1f368"],"fname":"1f368","uc":"1f368","isCanonical": true},":duck:":{"unicode":["1f986"],"fname":"1f986","uc":"1f986","isCanonical": true},":doughnut:":{"unicode":["1f369"],"fname":"1f369","uc":"1f369","isCanonical": true},":eagle:":{"unicode":["1f985"],"fname":"1f985","uc":"1f985","isCanonical": true},":cookie:":{"unicode":["1f36a"],"fname":"1f36a","uc":"1f36a","isCanonical": true},":black_heart:":{"unicode":["1f5a4"],"fname":"1f5a4","uc":"1f5a4","isCanonical": true},":chocolate_bar:":{"unicode":["1f36b"],"fname":"1f36b","uc":"1f36b","isCanonical": true},":candy:":{"unicode":["1f36c"],"fname":"1f36c","uc":"1f36c","isCanonical": true},":lollipop:":{"unicode":["1f36d"],"fname":"1f36d","uc":"1f36d","isCanonical": true},":custard:":{"unicode":["1f36e"],"fname":"1f36e","uc":"1f36e","isCanonical": true},":pudding:":{"unicode":["1f36e"],"fname":"1f36e","uc":"1f36e","isCanonical": false},":flan:":{"unicode":["1f36e"],"fname":"1f36e","uc":"1f36e","isCanonical": false},":honey_pot:":{"unicode":["1f36f"],"fname":"1f36f","uc":"1f36f","isCanonical": true},":fingers_crossed:":{"unicode":["1f91e"],"fname":"1f91e","uc":"1f91e","isCanonical": true},":hand_with_index_and_middle_finger_crossed:":{"unicode":["1f91e"],"fname":"1f91e","uc":"1f91e","isCanonical": false},":cake:":{"unicode":["1f370"],"fname":"1f370","uc":"1f370","isCanonical": true},":bento:":{"unicode":["1f371"],"fname":"1f371","uc":"1f371","isCanonical": true},":stew:":{"unicode":["1f372"],"fname":"1f372","uc":"1f372","isCanonical": true},":handshake:":{"unicode":["1f91d"],"fname":"1f91d","uc":"1f91d","isCanonical": true},":shaking_hands:":{"unicode":["1f91d"],"fname":"1f91d","uc":"1f91d","isCanonical": false},":cooking:":{"unicode":["1f373"],"fname":"1f373","uc":"1f373","isCanonical": true},":fork_and_knife:":{"unicode":["1f374"],"fname":"1f374","uc":"1f374","isCanonical": true},":tea:":{"unicode":["1f375"],"fname":"1f375","uc":"1f375","isCanonical": true},":sake:":{"unicode":["1f376"],"fname":"1f376","uc":"1f376","isCanonical": true},":wine_glass:":{"unicode":["1f377"],"fname":"1f377","uc":"1f377","isCanonical": true},":cocktail:":{"unicode":["1f378"],"fname":"1f378","uc":"1f378","isCanonical": true},":tropical_drink:":{"unicode":["1f379"],"fname":"1f379","uc":"1f379","isCanonical": true},":beer:":{"unicode":["1f37a"],"fname":"1f37a","uc":"1f37a","isCanonical": true},":beers:":{"unicode":["1f37b"],"fname":"1f37b","uc":"1f37b","isCanonical": true},":ribbon:":{"unicode":["1f380"],"fname":"1f380","uc":"1f380","isCanonical": true},":gift:":{"unicode":["1f381"],"fname":"1f381","uc":"1f381","isCanonical": true},":birthday:":{"unicode":["1f382"],"fname":"1f382","uc":"1f382","isCanonical": true},":jack_o_lantern:":{"unicode":["1f383"],"fname":"1f383","uc":"1f383","isCanonical": true},":left_facing_fist:":{"unicode":["1f91b"],"fname":"1f91b","uc":"1f91b","isCanonical": true},":left_fist:":{"unicode":["1f91b"],"fname":"1f91b","uc":"1f91b","isCanonical": false},":right_facing_fist:":{"unicode":["1f91c"],"fname":"1f91c","uc":"1f91c","isCanonical": true},":right_fist:":{"unicode":["1f91c"],"fname":"1f91c","uc":"1f91c","isCanonical": false},":christmas_tree:":{"unicode":["1f384"],"fname":"1f384","uc":"1f384","isCanonical": true},":santa:":{"unicode":["1f385"],"fname":"1f385","uc":"1f385","isCanonical": true},":fireworks:":{"unicode":["1f386"],"fname":"1f386","uc":"1f386","isCanonical": true},":raised_back_of_hand:":{"unicode":["1f91a"],"fname":"1f91a","uc":"1f91a","isCanonical": true},":back_of_hand:":{"unicode":["1f91a"],"fname":"1f91a","uc":"1f91a","isCanonical": false},":sparkler:":{"unicode":["1f387"],"fname":"1f387","uc":"1f387","isCanonical": true},":balloon:":{"unicode":["1f388"],"fname":"1f388","uc":"1f388","isCanonical": true},":tada:":{"unicode":["1f389"],"fname":"1f389","uc":"1f389","isCanonical": true},":confetti_ball:":{"unicode":["1f38a"],"fname":"1f38a","uc":"1f38a","isCanonical": true},":tanabata_tree:":{"unicode":["1f38b"],"fname":"1f38b","uc":"1f38b","isCanonical": true},":crossed_flags:":{"unicode":["1f38c"],"fname":"1f38c","uc":"1f38c","isCanonical": true},":call_me:":{"unicode":["1f919"],"fname":"1f919","uc":"1f919","isCanonical": true},":call_me_hand:":{"unicode":["1f919"],"fname":"1f919","uc":"1f919","isCanonical": false},":bamboo:":{"unicode":["1f38d"],"fname":"1f38d","uc":"1f38d","isCanonical": true},":man_dancing:":{"unicode":["1f57a"],"fname":"1f57a","uc":"1f57a","isCanonical": true},":male_dancer:":{"unicode":["1f57a"],"fname":"1f57a","uc":"1f57a","isCanonical": false},":dolls:":{"unicode":["1f38e"],"fname":"1f38e","uc":"1f38e","isCanonical": true},":selfie:":{"unicode":["1f933"],"fname":"1f933","uc":"1f933","isCanonical": true},":flags:":{"unicode":["1f38f"],"fname":"1f38f","uc":"1f38f","isCanonical": true},":pregnant_woman:":{"unicode":["1f930"],"fname":"1f930","uc":"1f930","isCanonical": true},":expecting_woman:":{"unicode":["1f930"],"fname":"1f930","uc":"1f930","isCanonical": false},":wind_chime:":{"unicode":["1f390"],"fname":"1f390","uc":"1f390","isCanonical": true},":face_palm:":{"unicode":["1f926"],"fname":"1f926","uc":"1f926","isCanonical": true},":facepalm:":{"unicode":["1f926"],"fname":"1f926","uc":"1f926","isCanonical": false},":shrug:":{"unicode":["1f937"],"fname":"1f937","uc":"1f937","isCanonical": true},":rice_scene:":{"unicode":["1f391"],"fname":"1f391","uc":"1f391","isCanonical": true},":school_satchel:":{"unicode":["1f392"],"fname":"1f392","uc":"1f392","isCanonical": true},":mortar_board:":{"unicode":["1f393"],"fname":"1f393","uc":"1f393","isCanonical": true},":carousel_horse:":{"unicode":["1f3a0"],"fname":"1f3a0","uc":"1f3a0","isCanonical": true},":ferris_wheel:":{"unicode":["1f3a1"],"fname":"1f3a1","uc":"1f3a1","isCanonical": true},":roller_coaster:":{"unicode":["1f3a2"],"fname":"1f3a2","uc":"1f3a2","isCanonical": true},":fishing_pole_and_fish:":{"unicode":["1f3a3"],"fname":"1f3a3","uc":"1f3a3","isCanonical": true},":microphone:":{"unicode":["1f3a4"],"fname":"1f3a4","uc":"1f3a4","isCanonical": true},":movie_camera:":{"unicode":["1f3a5"],"fname":"1f3a5","uc":"1f3a5","isCanonical": true},":cinema:":{"unicode":["1f3a6"],"fname":"1f3a6","uc":"1f3a6","isCanonical": true},":headphones:":{"unicode":["1f3a7"],"fname":"1f3a7","uc":"1f3a7","isCanonical": true},":mrs_claus:":{"unicode":["1f936"],"fname":"1f936","uc":"1f936","isCanonical": true},":mother_christmas:":{"unicode":["1f936"],"fname":"1f936","uc":"1f936","isCanonical": false},":art:":{"unicode":["1f3a8"],"fname":"1f3a8","uc":"1f3a8","isCanonical": true},":man_in_tuxedo:":{"unicode":["1f935"],"fname":"1f935","uc":"1f935","isCanonical": true},":tophat:":{"unicode":["1f3a9"],"fname":"1f3a9","uc":"1f3a9","isCanonical": true},":circus_tent:":{"unicode":["1f3aa"],"fname":"1f3aa","uc":"1f3aa","isCanonical": true},":prince:":{"unicode":["1f934"],"fname":"1f934","uc":"1f934","isCanonical": true},":ticket:":{"unicode":["1f3ab"],"fname":"1f3ab","uc":"1f3ab","isCanonical": true},":clapper:":{"unicode":["1f3ac"],"fname":"1f3ac","uc":"1f3ac","isCanonical": true},":performing_arts:":{"unicode":["1f3ad"],"fname":"1f3ad","uc":"1f3ad","isCanonical": true},":sneezing_face:":{"unicode":["1f927"],"fname":"1f927","uc":"1f927","isCanonical": true},":sneeze:":{"unicode":["1f927"],"fname":"1f927","uc":"1f927","isCanonical": false},":video_game:":{"unicode":["1f3ae"],"fname":"1f3ae","uc":"1f3ae","isCanonical": true},":dart:":{"unicode":["1f3af"],"fname":"1f3af","uc":"1f3af","isCanonical": true},":slot_machine:":{"unicode":["1f3b0"],"fname":"1f3b0","uc":"1f3b0","isCanonical": true},":8ball:":{"unicode":["1f3b1"],"fname":"1f3b1","uc":"1f3b1","isCanonical": true},":game_die:":{"unicode":["1f3b2"],"fname":"1f3b2","uc":"1f3b2","isCanonical": true},":bowling:":{"unicode":["1f3b3"],"fname":"1f3b3","uc":"1f3b3","isCanonical": true},":flower_playing_cards:":{"unicode":["1f3b4"],"fname":"1f3b4","uc":"1f3b4","isCanonical": true},":lying_face:":{"unicode":["1f925"],"fname":"1f925","uc":"1f925","isCanonical": true},":liar:":{"unicode":["1f925"],"fname":"1f925","uc":"1f925","isCanonical": false},":musical_note:":{"unicode":["1f3b5"],"fname":"1f3b5","uc":"1f3b5","isCanonical": true},":notes:":{"unicode":["1f3b6"],"fname":"1f3b6","uc":"1f3b6","isCanonical": true},":saxophone:":{"unicode":["1f3b7"],"fname":"1f3b7","uc":"1f3b7","isCanonical": true},":drooling_face:":{"unicode":["1f924"],"fname":"1f924","uc":"1f924","isCanonical": true},":drool:":{"unicode":["1f924"],"fname":"1f924","uc":"1f924","isCanonical": false},":guitar:":{"unicode":["1f3b8"],"fname":"1f3b8","uc":"1f3b8","isCanonical": true},":musical_keyboard:":{"unicode":["1f3b9"],"fname":"1f3b9","uc":"1f3b9","isCanonical": true},":trumpet:":{"unicode":["1f3ba"],"fname":"1f3ba","uc":"1f3ba","isCanonical": true},":rofl:":{"unicode":["1f923"],"fname":"1f923","uc":"1f923","isCanonical": true},":rolling_on_the_floor_laughing:":{"unicode":["1f923"],"fname":"1f923","uc":"1f923","isCanonical": false},":violin:":{"unicode":["1f3bb"],"fname":"1f3bb","uc":"1f3bb","isCanonical": true},":musical_score:":{"unicode":["1f3bc"],"fname":"1f3bc","uc":"1f3bc","isCanonical": true},":running_shirt_with_sash:":{"unicode":["1f3bd"],"fname":"1f3bd","uc":"1f3bd","isCanonical": true},":nauseated_face:":{"unicode":["1f922"],"fname":"1f922","uc":"1f922","isCanonical": true},":sick:":{"unicode":["1f922"],"fname":"1f922","uc":"1f922","isCanonical": false},":tennis:":{"unicode":["1f3be"],"fname":"1f3be","uc":"1f3be","isCanonical": true},":ski:":{"unicode":["1f3bf"],"fname":"1f3bf","uc":"1f3bf","isCanonical": true},":basketball:":{"unicode":["1f3c0"],"fname":"1f3c0","uc":"1f3c0","isCanonical": true},":checkered_flag:":{"unicode":["1f3c1"],"fname":"1f3c1","uc":"1f3c1","isCanonical": true},":clown:":{"unicode":["1f921"],"fname":"1f921","uc":"1f921","isCanonical": true},":clown_face:":{"unicode":["1f921"],"fname":"1f921","uc":"1f921","isCanonical": false},":snowboarder:":{"unicode":["1f3c2"],"fname":"1f3c2","uc":"1f3c2","isCanonical": true},":runner:":{"unicode":["1f3c3"],"fname":"1f3c3","uc":"1f3c3","isCanonical": true},":surfer:":{"unicode":["1f3c4"],"fname":"1f3c4","uc":"1f3c4","isCanonical": true},":trophy:":{"unicode":["1f3c6"],"fname":"1f3c6","uc":"1f3c6","isCanonical": true},":football:":{"unicode":["1f3c8"],"fname":"1f3c8","uc":"1f3c8","isCanonical": true},":swimmer:":{"unicode":["1f3ca"],"fname":"1f3ca","uc":"1f3ca","isCanonical": true},":house:":{"unicode":["1f3e0"],"fname":"1f3e0","uc":"1f3e0","isCanonical": true},":house_with_garden:":{"unicode":["1f3e1"],"fname":"1f3e1","uc":"1f3e1","isCanonical": true},":office:":{"unicode":["1f3e2"],"fname":"1f3e2","uc":"1f3e2","isCanonical": true},":post_office:":{"unicode":["1f3e3"],"fname":"1f3e3","uc":"1f3e3","isCanonical": true},":hospital:":{"unicode":["1f3e5"],"fname":"1f3e5","uc":"1f3e5","isCanonical": true},":bank:":{"unicode":["1f3e6"],"fname":"1f3e6","uc":"1f3e6","isCanonical": true},":atm:":{"unicode":["1f3e7"],"fname":"1f3e7","uc":"1f3e7","isCanonical": true},":hotel:":{"unicode":["1f3e8"],"fname":"1f3e8","uc":"1f3e8","isCanonical": true},":love_hotel:":{"unicode":["1f3e9"],"fname":"1f3e9","uc":"1f3e9","isCanonical": true},":convenience_store:":{"unicode":["1f3ea"],"fname":"1f3ea","uc":"1f3ea","isCanonical": true},":school:":{"unicode":["1f3eb"],"fname":"1f3eb","uc":"1f3eb","isCanonical": true},":department_store:":{"unicode":["1f3ec"],"fname":"1f3ec","uc":"1f3ec","isCanonical": true},":cowboy:":{"unicode":["1f920"],"fname":"1f920","uc":"1f920","isCanonical": true},":face_with_cowboy_hat:":{"unicode":["1f920"],"fname":"1f920","uc":"1f920","isCanonical": false},":factory:":{"unicode":["1f3ed"],"fname":"1f3ed","uc":"1f3ed","isCanonical": true},":izakaya_lantern:":{"unicode":["1f3ee"],"fname":"1f3ee","uc":"1f3ee","isCanonical": true},":japanese_castle:":{"unicode":["1f3ef"],"fname":"1f3ef","uc":"1f3ef","isCanonical": true},":european_castle:":{"unicode":["1f3f0"],"fname":"1f3f0","uc":"1f3f0","isCanonical": true},":snail:":{"unicode":["1f40c"],"fname":"1f40c","uc":"1f40c","isCanonical": true},":snake:":{"unicode":["1f40d"],"fname":"1f40d","uc":"1f40d","isCanonical": true},":racehorse:":{"unicode":["1f40e"],"fname":"1f40e","uc":"1f40e","isCanonical": true},":sheep:":{"unicode":["1f411"],"fname":"1f411","uc":"1f411","isCanonical": true},":monkey:":{"unicode":["1f412"],"fname":"1f412","uc":"1f412","isCanonical": true},":chicken:":{"unicode":["1f414"],"fname":"1f414","uc":"1f414","isCanonical": true},":boar:":{"unicode":["1f417"],"fname":"1f417","uc":"1f417","isCanonical": true},":elephant:":{"unicode":["1f418"],"fname":"1f418","uc":"1f418","isCanonical": true},":octopus:":{"unicode":["1f419"],"fname":"1f419","uc":"1f419","isCanonical": true},":shell:":{"unicode":["1f41a"],"fname":"1f41a","uc":"1f41a","isCanonical": true},":bug:":{"unicode":["1f41b"],"fname":"1f41b","uc":"1f41b","isCanonical": true},":ant:":{"unicode":["1f41c"],"fname":"1f41c","uc":"1f41c","isCanonical": true},":bee:":{"unicode":["1f41d"],"fname":"1f41d","uc":"1f41d","isCanonical": true},":beetle:":{"unicode":["1f41e"],"fname":"1f41e","uc":"1f41e","isCanonical": true},":fish:":{"unicode":["1f41f"],"fname":"1f41f","uc":"1f41f","isCanonical": true},":tropical_fish:":{"unicode":["1f420"],"fname":"1f420","uc":"1f420","isCanonical": true},":blowfish:":{"unicode":["1f421"],"fname":"1f421","uc":"1f421","isCanonical": true},":turtle:":{"unicode":["1f422"],"fname":"1f422","uc":"1f422","isCanonical": true},":hatching_chick:":{"unicode":["1f423"],"fname":"1f423","uc":"1f423","isCanonical": true},":baby_chick:":{"unicode":["1f424"],"fname":"1f424","uc":"1f424","isCanonical": true},":hatched_chick:":{"unicode":["1f425"],"fname":"1f425","uc":"1f425","isCanonical": true},":bird:":{"unicode":["1f426"],"fname":"1f426","uc":"1f426","isCanonical": true},":penguin:":{"unicode":["1f427"],"fname":"1f427","uc":"1f427","isCanonical": true},":koala:":{"unicode":["1f428"],"fname":"1f428","uc":"1f428","isCanonical": true},":poodle:":{"unicode":["1f429"],"fname":"1f429","uc":"1f429","isCanonical": true},":camel:":{"unicode":["1f42b"],"fname":"1f42b","uc":"1f42b","isCanonical": true},":dolphin:":{"unicode":["1f42c"],"fname":"1f42c","uc":"1f42c","isCanonical": true},":mouse:":{"unicode":["1f42d"],"fname":"1f42d","uc":"1f42d","isCanonical": true},":cow:":{"unicode":["1f42e"],"fname":"1f42e","uc":"1f42e","isCanonical": true},":tiger:":{"unicode":["1f42f"],"fname":"1f42f","uc":"1f42f","isCanonical": true},":rabbit:":{"unicode":["1f430"],"fname":"1f430","uc":"1f430","isCanonical": true},":cat:":{"unicode":["1f431"],"fname":"1f431","uc":"1f431","isCanonical": true},":dragon_face:":{"unicode":["1f432"],"fname":"1f432","uc":"1f432","isCanonical": true},":whale:":{"unicode":["1f433"],"fname":"1f433","uc":"1f433","isCanonical": true},":horse:":{"unicode":["1f434"],"fname":"1f434","uc":"1f434","isCanonical": true},":monkey_face:":{"unicode":["1f435"],"fname":"1f435","uc":"1f435","isCanonical": true},":dog:":{"unicode":["1f436"],"fname":"1f436","uc":"1f436","isCanonical": true},":pig:":{"unicode":["1f437"],"fname":"1f437","uc":"1f437","isCanonical": true},":frog:":{"unicode":["1f438"],"fname":"1f438","uc":"1f438","isCanonical": true},":hamster:":{"unicode":["1f439"],"fname":"1f439","uc":"1f439","isCanonical": true},":wolf:":{"unicode":["1f43a"],"fname":"1f43a","uc":"1f43a","isCanonical": true},":bear:":{"unicode":["1f43b"],"fname":"1f43b","uc":"1f43b","isCanonical": true},":panda_face:":{"unicode":["1f43c"],"fname":"1f43c","uc":"1f43c","isCanonical": true},":pig_nose:":{"unicode":["1f43d"],"fname":"1f43d","uc":"1f43d","isCanonical": true},":feet:":{"unicode":["1f43e"],"fname":"1f43e","uc":"1f43e","isCanonical": true},":paw_prints:":{"unicode":["1f43e"],"fname":"1f43e","uc":"1f43e","isCanonical": false},":eyes:":{"unicode":["1f440"],"fname":"1f440","uc":"1f440","isCanonical": true},":ear:":{"unicode":["1f442"],"fname":"1f442","uc":"1f442","isCanonical": true},":nose:":{"unicode":["1f443"],"fname":"1f443","uc":"1f443","isCanonical": true},":lips:":{"unicode":["1f444"],"fname":"1f444","uc":"1f444","isCanonical": true},":tongue:":{"unicode":["1f445"],"fname":"1f445","uc":"1f445","isCanonical": true},":point_up_2:":{"unicode":["1f446"],"fname":"1f446","uc":"1f446","isCanonical": true},":point_down:":{"unicode":["1f447"],"fname":"1f447","uc":"1f447","isCanonical": true},":point_left:":{"unicode":["1f448"],"fname":"1f448","uc":"1f448","isCanonical": true},":point_right:":{"unicode":["1f449"],"fname":"1f449","uc":"1f449","isCanonical": true},":punch:":{"unicode":["1f44a"],"fname":"1f44a","uc":"1f44a","isCanonical": true},":wave:":{"unicode":["1f44b"],"fname":"1f44b","uc":"1f44b","isCanonical": true},":ok_hand:":{"unicode":["1f44c"],"fname":"1f44c","uc":"1f44c","isCanonical": true},":thumbsup:":{"unicode":["1f44d"],"fname":"1f44d","uc":"1f44d","isCanonical": true},":+1:":{"unicode":["1f44d"],"fname":"1f44d","uc":"1f44d","isCanonical": false},":thumbup:":{"unicode":["1f44d"],"fname":"1f44d","uc":"1f44d","isCanonical": false},":thumbsdown:":{"unicode":["1f44e"],"fname":"1f44e","uc":"1f44e","isCanonical": true},":-1:":{"unicode":["1f44e"],"fname":"1f44e","uc":"1f44e","isCanonical": false},":thumbdown:":{"unicode":["1f44e"],"fname":"1f44e","uc":"1f44e","isCanonical": false},":clap:":{"unicode":["1f44f"],"fname":"1f44f","uc":"1f44f","isCanonical": true},":open_hands:":{"unicode":["1f450"],"fname":"1f450","uc":"1f450","isCanonical": true},":crown:":{"unicode":["1f451"],"fname":"1f451","uc":"1f451","isCanonical": true},":womans_hat:":{"unicode":["1f452"],"fname":"1f452","uc":"1f452","isCanonical": true},":eyeglasses:":{"unicode":["1f453"],"fname":"1f453","uc":"1f453","isCanonical": true},":necktie:":{"unicode":["1f454"],"fname":"1f454","uc":"1f454","isCanonical": true},":shirt:":{"unicode":["1f455"],"fname":"1f455","uc":"1f455","isCanonical": true},":jeans:":{"unicode":["1f456"],"fname":"1f456","uc":"1f456","isCanonical": true},":dress:":{"unicode":["1f457"],"fname":"1f457","uc":"1f457","isCanonical": true},":kimono:":{"unicode":["1f458"],"fname":"1f458","uc":"1f458","isCanonical": true},":bikini:":{"unicode":["1f459"],"fname":"1f459","uc":"1f459","isCanonical": true},":womans_clothes:":{"unicode":["1f45a"],"fname":"1f45a","uc":"1f45a","isCanonical": true},":purse:":{"unicode":["1f45b"],"fname":"1f45b","uc":"1f45b","isCanonical": true},":handbag:":{"unicode":["1f45c"],"fname":"1f45c","uc":"1f45c","isCanonical": true},":pouch:":{"unicode":["1f45d"],"fname":"1f45d","uc":"1f45d","isCanonical": true},":mans_shoe:":{"unicode":["1f45e"],"fname":"1f45e","uc":"1f45e","isCanonical": true},":athletic_shoe:":{"unicode":["1f45f"],"fname":"1f45f","uc":"1f45f","isCanonical": true},":high_heel:":{"unicode":["1f460"],"fname":"1f460","uc":"1f460","isCanonical": true},":sandal:":{"unicode":["1f461"],"fname":"1f461","uc":"1f461","isCanonical": true},":boot:":{"unicode":["1f462"],"fname":"1f462","uc":"1f462","isCanonical": true},":footprints:":{"unicode":["1f463"],"fname":"1f463","uc":"1f463","isCanonical": true},":bust_in_silhouette:":{"unicode":["1f464"],"fname":"1f464","uc":"1f464","isCanonical": true},":boy:":{"unicode":["1f466"],"fname":"1f466","uc":"1f466","isCanonical": true},":girl:":{"unicode":["1f467"],"fname":"1f467","uc":"1f467","isCanonical": true},":man:":{"unicode":["1f468"],"fname":"1f468","uc":"1f468","isCanonical": true},":woman:":{"unicode":["1f469"],"fname":"1f469","uc":"1f469","isCanonical": true},":family:":{"unicode":["1f46a"],"fname":"1f46a","uc":"1f46a","isCanonical": true},":couple:":{"unicode":["1f46b"],"fname":"1f46b","uc":"1f46b","isCanonical": true},":cop:":{"unicode":["1f46e"],"fname":"1f46e","uc":"1f46e","isCanonical": true},":dancers:":{"unicode":["1f46f"],"fname":"1f46f","uc":"1f46f","isCanonical": true},":bride_with_veil:":{"unicode":["1f470"],"fname":"1f470","uc":"1f470","isCanonical": true},":person_with_blond_hair:":{"unicode":["1f471"],"fname":"1f471","uc":"1f471","isCanonical": true},":man_with_gua_pi_mao:":{"unicode":["1f472"],"fname":"1f472","uc":"1f472","isCanonical": true},":man_with_turban:":{"unicode":["1f473"],"fname":"1f473","uc":"1f473","isCanonical": true},":older_man:":{"unicode":["1f474"],"fname":"1f474","uc":"1f474","isCanonical": true},":older_woman:":{"unicode":["1f475"],"fname":"1f475","uc":"1f475","isCanonical": true},":grandma:":{"unicode":["1f475"],"fname":"1f475","uc":"1f475","isCanonical": false},":baby:":{"unicode":["1f476"],"fname":"1f476","uc":"1f476","isCanonical": true},":construction_worker:":{"unicode":["1f477"],"fname":"1f477","uc":"1f477","isCanonical": true},":princess:":{"unicode":["1f478"],"fname":"1f478","uc":"1f478","isCanonical": true},":japanese_ogre:":{"unicode":["1f479"],"fname":"1f479","uc":"1f479","isCanonical": true},":japanese_goblin:":{"unicode":["1f47a"],"fname":"1f47a","uc":"1f47a","isCanonical": true},":ghost:":{"unicode":["1f47b"],"fname":"1f47b","uc":"1f47b","isCanonical": true},":angel:":{"unicode":["1f47c"],"fname":"1f47c","uc":"1f47c","isCanonical": true},":alien:":{"unicode":["1f47d"],"fname":"1f47d","uc":"1f47d","isCanonical": true},":space_invader:":{"unicode":["1f47e"],"fname":"1f47e","uc":"1f47e","isCanonical": true},":imp:":{"unicode":["1f47f"],"fname":"1f47f","uc":"1f47f","isCanonical": true},":skull:":{"unicode":["1f480"],"fname":"1f480","uc":"1f480","isCanonical": true},":skeleton:":{"unicode":["1f480"],"fname":"1f480","uc":"1f480","isCanonical": false},":card_index:":{"unicode":["1f4c7"],"fname":"1f4c7","uc":"1f4c7","isCanonical": true},":information_desk_person:":{"unicode":["1f481"],"fname":"1f481","uc":"1f481","isCanonical": true},":guardsman:":{"unicode":["1f482"],"fname":"1f482","uc":"1f482","isCanonical": true},":dancer:":{"unicode":["1f483"],"fname":"1f483","uc":"1f483","isCanonical": true},":lipstick:":{"unicode":["1f484"],"fname":"1f484","uc":"1f484","isCanonical": true},":nail_care:":{"unicode":["1f485"],"fname":"1f485","uc":"1f485","isCanonical": true},":ledger:":{"unicode":["1f4d2"],"fname":"1f4d2","uc":"1f4d2","isCanonical": true},":massage:":{"unicode":["1f486"],"fname":"1f486","uc":"1f486","isCanonical": true},":notebook:":{"unicode":["1f4d3"],"fname":"1f4d3","uc":"1f4d3","isCanonical": true},":haircut:":{"unicode":["1f487"],"fname":"1f487","uc":"1f487","isCanonical": true},":notebook_with_decorative_cover:":{"unicode":["1f4d4"],"fname":"1f4d4","uc":"1f4d4","isCanonical": true},":barber:":{"unicode":["1f488"],"fname":"1f488","uc":"1f488","isCanonical": true},":closed_book:":{"unicode":["1f4d5"],"fname":"1f4d5","uc":"1f4d5","isCanonical": true},":syringe:":{"unicode":["1f489"],"fname":"1f489","uc":"1f489","isCanonical": true},":book:":{"unicode":["1f4d6"],"fname":"1f4d6","uc":"1f4d6","isCanonical": true},":pill:":{"unicode":["1f48a"],"fname":"1f48a","uc":"1f48a","isCanonical": true},":green_book:":{"unicode":["1f4d7"],"fname":"1f4d7","uc":"1f4d7","isCanonical": true},":kiss:":{"unicode":["1f48b"],"fname":"1f48b","uc":"1f48b","isCanonical": true},":blue_book:":{"unicode":["1f4d8"],"fname":"1f4d8","uc":"1f4d8","isCanonical": true},":love_letter:":{"unicode":["1f48c"],"fname":"1f48c","uc":"1f48c","isCanonical": true},":orange_book:":{"unicode":["1f4d9"],"fname":"1f4d9","uc":"1f4d9","isCanonical": true},":ring:":{"unicode":["1f48d"],"fname":"1f48d","uc":"1f48d","isCanonical": true},":books:":{"unicode":["1f4da"],"fname":"1f4da","uc":"1f4da","isCanonical": true},":gem:":{"unicode":["1f48e"],"fname":"1f48e","uc":"1f48e","isCanonical": true},":name_badge:":{"unicode":["1f4db"],"fname":"1f4db","uc":"1f4db","isCanonical": true},":couplekiss:":{"unicode":["1f48f"],"fname":"1f48f","uc":"1f48f","isCanonical": true},":scroll:":{"unicode":["1f4dc"],"fname":"1f4dc","uc":"1f4dc","isCanonical": true},":bouquet:":{"unicode":["1f490"],"fname":"1f490","uc":"1f490","isCanonical": true},":pencil:":{"unicode":["1f4dd"],"fname":"1f4dd","uc":"1f4dd","isCanonical": true},":couple_with_heart:":{"unicode":["1f491"],"fname":"1f491","uc":"1f491","isCanonical": true},":telephone_receiver:":{"unicode":["1f4de"],"fname":"1f4de","uc":"1f4de","isCanonical": true},":wedding:":{"unicode":["1f492"],"fname":"1f492","uc":"1f492","isCanonical": true},":pager:":{"unicode":["1f4df"],"fname":"1f4df","uc":"1f4df","isCanonical": true},":fax:":{"unicode":["1f4e0"],"fname":"1f4e0","uc":"1f4e0","isCanonical": true},":heartbeat:":{"unicode":["1f493"],"fname":"1f493","uc":"1f493","isCanonical": true},":satellite:":{"unicode":["1f4e1"],"fname":"1f4e1","uc":"1f4e1","isCanonical": true},":loudspeaker:":{"unicode":["1f4e2"],"fname":"1f4e2","uc":"1f4e2","isCanonical": true},":broken_heart:":{"unicode":["1f494"],"fname":"1f494","uc":"1f494","isCanonical": true},":mega:":{"unicode":["1f4e3"],"fname":"1f4e3","uc":"1f4e3","isCanonical": true},":outbox_tray:":{"unicode":["1f4e4"],"fname":"1f4e4","uc":"1f4e4","isCanonical": true},":two_hearts:":{"unicode":["1f495"],"fname":"1f495","uc":"1f495","isCanonical": true},":inbox_tray:":{"unicode":["1f4e5"],"fname":"1f4e5","uc":"1f4e5","isCanonical": true},":package:":{"unicode":["1f4e6"],"fname":"1f4e6","uc":"1f4e6","isCanonical": true},":sparkling_heart:":{"unicode":["1f496"],"fname":"1f496","uc":"1f496","isCanonical": true},":e-mail:":{"unicode":["1f4e7"],"fname":"1f4e7","uc":"1f4e7","isCanonical": true},":email:":{"unicode":["1f4e7"],"fname":"1f4e7","uc":"1f4e7","isCanonical": false},":incoming_envelope:":{"unicode":["1f4e8"],"fname":"1f4e8","uc":"1f4e8","isCanonical": true},":heartpulse:":{"unicode":["1f497"],"fname":"1f497","uc":"1f497","isCanonical": true},":envelope_with_arrow:":{"unicode":["1f4e9"],"fname":"1f4e9","uc":"1f4e9","isCanonical": true},":mailbox_closed:":{"unicode":["1f4ea"],"fname":"1f4ea","uc":"1f4ea","isCanonical": true},":cupid:":{"unicode":["1f498"],"fname":"1f498","uc":"1f498","isCanonical": true},":mailbox:":{"unicode":["1f4eb"],"fname":"1f4eb","uc":"1f4eb","isCanonical": true},":postbox:":{"unicode":["1f4ee"],"fname":"1f4ee","uc":"1f4ee","isCanonical": true},":blue_heart:":{"unicode":["1f499"],"fname":"1f499","uc":"1f499","isCanonical": true},":newspaper:":{"unicode":["1f4f0"],"fname":"1f4f0","uc":"1f4f0","isCanonical": true},":iphone:":{"unicode":["1f4f1"],"fname":"1f4f1","uc":"1f4f1","isCanonical": true},":green_heart:":{"unicode":["1f49a"],"fname":"1f49a","uc":"1f49a","isCanonical": true},":calling:":{"unicode":["1f4f2"],"fname":"1f4f2","uc":"1f4f2","isCanonical": true},":vibration_mode:":{"unicode":["1f4f3"],"fname":"1f4f3","uc":"1f4f3","isCanonical": true},":yellow_heart:":{"unicode":["1f49b"],"fname":"1f49b","uc":"1f49b","isCanonical": true},":mobile_phone_off:":{"unicode":["1f4f4"],"fname":"1f4f4","uc":"1f4f4","isCanonical": true},":signal_strength:":{"unicode":["1f4f6"],"fname":"1f4f6","uc":"1f4f6","isCanonical": true},":purple_heart:":{"unicode":["1f49c"],"fname":"1f49c","uc":"1f49c","isCanonical": true},":camera:":{"unicode":["1f4f7"],"fname":"1f4f7","uc":"1f4f7","isCanonical": true},":video_camera:":{"unicode":["1f4f9"],"fname":"1f4f9","uc":"1f4f9","isCanonical": true},":gift_heart:":{"unicode":["1f49d"],"fname":"1f49d","uc":"1f49d","isCanonical": true},":tv:":{"unicode":["1f4fa"],"fname":"1f4fa","uc":"1f4fa","isCanonical": true},":radio:":{"unicode":["1f4fb"],"fname":"1f4fb","uc":"1f4fb","isCanonical": true},":revolving_hearts:":{"unicode":["1f49e"],"fname":"1f49e","uc":"1f49e","isCanonical": true},":vhs:":{"unicode":["1f4fc"],"fname":"1f4fc","uc":"1f4fc","isCanonical": true},":arrows_clockwise:":{"unicode":["1f503"],"fname":"1f503","uc":"1f503","isCanonical": true},":heart_decoration:":{"unicode":["1f49f"],"fname":"1f49f","uc":"1f49f","isCanonical": true},":loud_sound:":{"unicode":["1f50a"],"fname":"1f50a","uc":"1f50a","isCanonical": true},":battery:":{"unicode":["1f50b"],"fname":"1f50b","uc":"1f50b","isCanonical": true},":diamond_shape_with_a_dot_inside:":{"unicode":["1f4a0"],"fname":"1f4a0","uc":"1f4a0","isCanonical": true},":electric_plug:":{"unicode":["1f50c"],"fname":"1f50c","uc":"1f50c","isCanonical": true},":mag:":{"unicode":["1f50d"],"fname":"1f50d","uc":"1f50d","isCanonical": true},":bulb:":{"unicode":["1f4a1"],"fname":"1f4a1","uc":"1f4a1","isCanonical": true},":mag_right:":{"unicode":["1f50e"],"fname":"1f50e","uc":"1f50e","isCanonical": true},":lock_with_ink_pen:":{"unicode":["1f50f"],"fname":"1f50f","uc":"1f50f","isCanonical": true},":anger:":{"unicode":["1f4a2"],"fname":"1f4a2","uc":"1f4a2","isCanonical": true},":closed_lock_with_key:":{"unicode":["1f510"],"fname":"1f510","uc":"1f510","isCanonical": true},":key:":{"unicode":["1f511"],"fname":"1f511","uc":"1f511","isCanonical": true},":bomb:":{"unicode":["1f4a3"],"fname":"1f4a3","uc":"1f4a3","isCanonical": true},":lock:":{"unicode":["1f512"],"fname":"1f512","uc":"1f512","isCanonical": true},":unlock:":{"unicode":["1f513"],"fname":"1f513","uc":"1f513","isCanonical": true},":zzz:":{"unicode":["1f4a4"],"fname":"1f4a4","uc":"1f4a4","isCanonical": true},":bell:":{"unicode":["1f514"],"fname":"1f514","uc":"1f514","isCanonical": true},":bookmark:":{"unicode":["1f516"],"fname":"1f516","uc":"1f516","isCanonical": true},":boom:":{"unicode":["1f4a5"],"fname":"1f4a5","uc":"1f4a5","isCanonical": true},":link:":{"unicode":["1f517"],"fname":"1f517","uc":"1f517","isCanonical": true},":radio_button:":{"unicode":["1f518"],"fname":"1f518","uc":"1f518","isCanonical": true},":sweat_drops:":{"unicode":["1f4a6"],"fname":"1f4a6","uc":"1f4a6","isCanonical": true},":back:":{"unicode":["1f519"],"fname":"1f519","uc":"1f519","isCanonical": true},":end:":{"unicode":["1f51a"],"fname":"1f51a","uc":"1f51a","isCanonical": true},":droplet:":{"unicode":["1f4a7"],"fname":"1f4a7","uc":"1f4a7","isCanonical": true},":on:":{"unicode":["1f51b"],"fname":"1f51b","uc":"1f51b","isCanonical": true},":soon:":{"unicode":["1f51c"],"fname":"1f51c","uc":"1f51c","isCanonical": true},":dash:":{"unicode":["1f4a8"],"fname":"1f4a8","uc":"1f4a8","isCanonical": true},":top:":{"unicode":["1f51d"],"fname":"1f51d","uc":"1f51d","isCanonical": true},":underage:":{"unicode":["1f51e"],"fname":"1f51e","uc":"1f51e","isCanonical": true},":poop:":{"unicode":["1f4a9"],"fname":"1f4a9","uc":"1f4a9","isCanonical": true},":shit:":{"unicode":["1f4a9"],"fname":"1f4a9","uc":"1f4a9","isCanonical": false},":hankey:":{"unicode":["1f4a9"],"fname":"1f4a9","uc":"1f4a9","isCanonical": false},":poo:":{"unicode":["1f4a9"],"fname":"1f4a9","uc":"1f4a9","isCanonical": false},":keycap_ten:":{"unicode":["1f51f"],"fname":"1f51f","uc":"1f51f","isCanonical": true},":muscle:":{"unicode":["1f4aa"],"fname":"1f4aa","uc":"1f4aa","isCanonical": true},":capital_abcd:":{"unicode":["1f520"],"fname":"1f520","uc":"1f520","isCanonical": true},":abcd:":{"unicode":["1f521"],"fname":"1f521","uc":"1f521","isCanonical": true},":dizzy:":{"unicode":["1f4ab"],"fname":"1f4ab","uc":"1f4ab","isCanonical": true},":1234:":{"unicode":["1f522"],"fname":"1f522","uc":"1f522","isCanonical": true},":symbols:":{"unicode":["1f523"],"fname":"1f523","uc":"1f523","isCanonical": true},":speech_balloon:":{"unicode":["1f4ac"],"fname":"1f4ac","uc":"1f4ac","isCanonical": true},":abc:":{"unicode":["1f524"],"fname":"1f524","uc":"1f524","isCanonical": true},":fire:":{"unicode":["1f525"],"fname":"1f525","uc":"1f525","isCanonical": true},":flame:":{"unicode":["1f525"],"fname":"1f525","uc":"1f525","isCanonical": false},":white_flower:":{"unicode":["1f4ae"],"fname":"1f4ae","uc":"1f4ae","isCanonical": true},":flashlight:":{"unicode":["1f526"],"fname":"1f526","uc":"1f526","isCanonical": true},":wrench:":{"unicode":["1f527"],"fname":"1f527","uc":"1f527","isCanonical": true},":100:":{"unicode":["1f4af"],"fname":"1f4af","uc":"1f4af","isCanonical": true},":hammer:":{"unicode":["1f528"],"fname":"1f528","uc":"1f528","isCanonical": true},":nut_and_bolt:":{"unicode":["1f529"],"fname":"1f529","uc":"1f529","isCanonical": true},":moneybag:":{"unicode":["1f4b0"],"fname":"1f4b0","uc":"1f4b0","isCanonical": true},":knife:":{"unicode":["1f52a"],"fname":"1f52a","uc":"1f52a","isCanonical": true},":gun:":{"unicode":["1f52b"],"fname":"1f52b","uc":"1f52b","isCanonical": true},":currency_exchange:":{"unicode":["1f4b1"],"fname":"1f4b1","uc":"1f4b1","isCanonical": true},":crystal_ball:":{"unicode":["1f52e"],"fname":"1f52e","uc":"1f52e","isCanonical": true},":heavy_dollar_sign:":{"unicode":["1f4b2"],"fname":"1f4b2","uc":"1f4b2","isCanonical": true},":six_pointed_star:":{"unicode":["1f52f"],"fname":"1f52f","uc":"1f52f","isCanonical": true},":credit_card:":{"unicode":["1f4b3"],"fname":"1f4b3","uc":"1f4b3","isCanonical": true},":beginner:":{"unicode":["1f530"],"fname":"1f530","uc":"1f530","isCanonical": true},":trident:":{"unicode":["1f531"],"fname":"1f531","uc":"1f531","isCanonical": true},":yen:":{"unicode":["1f4b4"],"fname":"1f4b4","uc":"1f4b4","isCanonical": true},":black_square_button:":{"unicode":["1f532"],"fname":"1f532","uc":"1f532","isCanonical": true},":white_square_button:":{"unicode":["1f533"],"fname":"1f533","uc":"1f533","isCanonical": true},":dollar:":{"unicode":["1f4b5"],"fname":"1f4b5","uc":"1f4b5","isCanonical": true},":red_circle:":{"unicode":["1f534"],"fname":"1f534","uc":"1f534","isCanonical": true},":blue_circle:":{"unicode":["1f535"],"fname":"1f535","uc":"1f535","isCanonical": true},":money_with_wings:":{"unicode":["1f4b8"],"fname":"1f4b8","uc":"1f4b8","isCanonical": true},":large_orange_diamond:":{"unicode":["1f536"],"fname":"1f536","uc":"1f536","isCanonical": true},":large_blue_diamond:":{"unicode":["1f537"],"fname":"1f537","uc":"1f537","isCanonical": true},":chart:":{"unicode":["1f4b9"],"fname":"1f4b9","uc":"1f4b9","isCanonical": true},":small_orange_diamond:":{"unicode":["1f538"],"fname":"1f538","uc":"1f538","isCanonical": true},":small_blue_diamond:":{"unicode":["1f539"],"fname":"1f539","uc":"1f539","isCanonical": true},":seat:":{"unicode":["1f4ba"],"fname":"1f4ba","uc":"1f4ba","isCanonical": true},":small_red_triangle:":{"unicode":["1f53a"],"fname":"1f53a","uc":"1f53a","isCanonical": true},":small_red_triangle_down:":{"unicode":["1f53b"],"fname":"1f53b","uc":"1f53b","isCanonical": true},":computer:":{"unicode":["1f4bb"],"fname":"1f4bb","uc":"1f4bb","isCanonical": true},":arrow_up_small:":{"unicode":["1f53c"],"fname":"1f53c","uc":"1f53c","isCanonical": true},":briefcase:":{"unicode":["1f4bc"],"fname":"1f4bc","uc":"1f4bc","isCanonical": true},":arrow_down_small:":{"unicode":["1f53d"],"fname":"1f53d","uc":"1f53d","isCanonical": true},":clock1:":{"unicode":["1f550"],"fname":"1f550","uc":"1f550","isCanonical": true},":minidisc:":{"unicode":["1f4bd"],"fname":"1f4bd","uc":"1f4bd","isCanonical": true},":clock2:":{"unicode":["1f551"],"fname":"1f551","uc":"1f551","isCanonical": true},":floppy_disk:":{"unicode":["1f4be"],"fname":"1f4be","uc":"1f4be","isCanonical": true},":clock3:":{"unicode":["1f552"],"fname":"1f552","uc":"1f552","isCanonical": true},":cd:":{"unicode":["1f4bf"],"fname":"1f4bf","uc":"1f4bf","isCanonical": true},":clock4:":{"unicode":["1f553"],"fname":"1f553","uc":"1f553","isCanonical": true},":dvd:":{"unicode":["1f4c0"],"fname":"1f4c0","uc":"1f4c0","isCanonical": true},":clock5:":{"unicode":["1f554"],"fname":"1f554","uc":"1f554","isCanonical": true},":clock6:":{"unicode":["1f555"],"fname":"1f555","uc":"1f555","isCanonical": true},":file_folder:":{"unicode":["1f4c1"],"fname":"1f4c1","uc":"1f4c1","isCanonical": true},":clock7:":{"unicode":["1f556"],"fname":"1f556","uc":"1f556","isCanonical": true},":clock8:":{"unicode":["1f557"],"fname":"1f557","uc":"1f557","isCanonical": true},":open_file_folder:":{"unicode":["1f4c2"],"fname":"1f4c2","uc":"1f4c2","isCanonical": true},":clock9:":{"unicode":["1f558"],"fname":"1f558","uc":"1f558","isCanonical": true},":clock10:":{"unicode":["1f559"],"fname":"1f559","uc":"1f559","isCanonical": true},":page_with_curl:":{"unicode":["1f4c3"],"fname":"1f4c3","uc":"1f4c3","isCanonical": true},":clock11:":{"unicode":["1f55a"],"fname":"1f55a","uc":"1f55a","isCanonical": true},":clock12:":{"unicode":["1f55b"],"fname":"1f55b","uc":"1f55b","isCanonical": true},":page_facing_up:":{"unicode":["1f4c4"],"fname":"1f4c4","uc":"1f4c4","isCanonical": true},":mount_fuji:":{"unicode":["1f5fb"],"fname":"1f5fb","uc":"1f5fb","isCanonical": true},":tokyo_tower:":{"unicode":["1f5fc"],"fname":"1f5fc","uc":"1f5fc","isCanonical": true},":date:":{"unicode":["1f4c5"],"fname":"1f4c5","uc":"1f4c5","isCanonical": true},":statue_of_liberty:":{"unicode":["1f5fd"],"fname":"1f5fd","uc":"1f5fd","isCanonical": true},":japan:":{"unicode":["1f5fe"],"fname":"1f5fe","uc":"1f5fe","isCanonical": true},":calendar:":{"unicode":["1f4c6"],"fname":"1f4c6","uc":"1f4c6","isCanonical": true},":moyai:":{"unicode":["1f5ff"],"fname":"1f5ff","uc":"1f5ff","isCanonical": true},":grin:":{"unicode":["1f601"],"fname":"1f601","uc":"1f601","isCanonical": true},":joy:":{"unicode":["1f602"],"fname":"1f602","uc":"1f602","isCanonical": true},":smiley:":{"unicode":["1f603"],"fname":"1f603","uc":"1f603","isCanonical": true},":chart_with_upwards_trend:":{"unicode":["1f4c8"],"fname":"1f4c8","uc":"1f4c8","isCanonical": true},":smile:":{"unicode":["1f604"],"fname":"1f604","uc":"1f604","isCanonical": true},":sweat_smile:":{"unicode":["1f605"],"fname":"1f605","uc":"1f605","isCanonical": true},":chart_with_downwards_trend:":{"unicode":["1f4c9"],"fname":"1f4c9","uc":"1f4c9","isCanonical": true},":laughing:":{"unicode":["1f606"],"fname":"1f606","uc":"1f606","isCanonical": true},":satisfied:":{"unicode":["1f606"],"fname":"1f606","uc":"1f606","isCanonical": false},":wink:":{"unicode":["1f609"],"fname":"1f609","uc":"1f609","isCanonical": true},":bar_chart:":{"unicode":["1f4ca"],"fname":"1f4ca","uc":"1f4ca","isCanonical": true},":blush:":{"unicode":["1f60a"],"fname":"1f60a","uc":"1f60a","isCanonical": true},":yum:":{"unicode":["1f60b"],"fname":"1f60b","uc":"1f60b","isCanonical": true},":clipboard:":{"unicode":["1f4cb"],"fname":"1f4cb","uc":"1f4cb","isCanonical": true},":relieved:":{"unicode":["1f60c"],"fname":"1f60c","uc":"1f60c","isCanonical": true},":heart_eyes:":{"unicode":["1f60d"],"fname":"1f60d","uc":"1f60d","isCanonical": true},":pushpin:":{"unicode":["1f4cc"],"fname":"1f4cc","uc":"1f4cc","isCanonical": true},":smirk:":{"unicode":["1f60f"],"fname":"1f60f","uc":"1f60f","isCanonical": true},":unamused:":{"unicode":["1f612"],"fname":"1f612","uc":"1f612","isCanonical": true},":round_pushpin:":{"unicode":["1f4cd"],"fname":"1f4cd","uc":"1f4cd","isCanonical": true},":sweat:":{"unicode":["1f613"],"fname":"1f613","uc":"1f613","isCanonical": true},":pensive:":{"unicode":["1f614"],"fname":"1f614","uc":"1f614","isCanonical": true},":paperclip:":{"unicode":["1f4ce"],"fname":"1f4ce","uc":"1f4ce","isCanonical": true},":confounded:":{"unicode":["1f616"],"fname":"1f616","uc":"1f616","isCanonical": true},":kissing_heart:":{"unicode":["1f618"],"fname":"1f618","uc":"1f618","isCanonical": true},":straight_ruler:":{"unicode":["1f4cf"],"fname":"1f4cf","uc":"1f4cf","isCanonical": true},":kissing_closed_eyes:":{"unicode":["1f61a"],"fname":"1f61a","uc":"1f61a","isCanonical": true},":stuck_out_tongue_winking_eye:":{"unicode":["1f61c"],"fname":"1f61c","uc":"1f61c","isCanonical": true},":triangular_ruler:":{"unicode":["1f4d0"],"fname":"1f4d0","uc":"1f4d0","isCanonical": true},":stuck_out_tongue_closed_eyes:":{"unicode":["1f61d"],"fname":"1f61d","uc":"1f61d","isCanonical": true},":disappointed:":{"unicode":["1f61e"],"fname":"1f61e","uc":"1f61e","isCanonical": true},":bookmark_tabs:":{"unicode":["1f4d1"],"fname":"1f4d1","uc":"1f4d1","isCanonical": true},":angry:":{"unicode":["1f620"],"fname":"1f620","uc":"1f620","isCanonical": true},":rage:":{"unicode":["1f621"],"fname":"1f621","uc":"1f621","isCanonical": true},":cry:":{"unicode":["1f622"],"fname":"1f622","uc":"1f622","isCanonical": true},":persevere:":{"unicode":["1f623"],"fname":"1f623","uc":"1f623","isCanonical": true},":triumph:":{"unicode":["1f624"],"fname":"1f624","uc":"1f624","isCanonical": true},":disappointed_relieved:":{"unicode":["1f625"],"fname":"1f625","uc":"1f625","isCanonical": true},":fearful:":{"unicode":["1f628"],"fname":"1f628","uc":"1f628","isCanonical": true},":weary:":{"unicode":["1f629"],"fname":"1f629","uc":"1f629","isCanonical": true},":sleepy:":{"unicode":["1f62a"],"fname":"1f62a","uc":"1f62a","isCanonical": true},":tired_face:":{"unicode":["1f62b"],"fname":"1f62b","uc":"1f62b","isCanonical": true},":sob:":{"unicode":["1f62d"],"fname":"1f62d","uc":"1f62d","isCanonical": true},":cold_sweat:":{"unicode":["1f630"],"fname":"1f630","uc":"1f630","isCanonical": true},":scream:":{"unicode":["1f631"],"fname":"1f631","uc":"1f631","isCanonical": true},":astonished:":{"unicode":["1f632"],"fname":"1f632","uc":"1f632","isCanonical": true},":flushed:":{"unicode":["1f633"],"fname":"1f633","uc":"1f633","isCanonical": true},":dizzy_face:":{"unicode":["1f635"],"fname":"1f635","uc":"1f635","isCanonical": true},":mask:":{"unicode":["1f637"],"fname":"1f637","uc":"1f637","isCanonical": true},":smile_cat:":{"unicode":["1f638"],"fname":"1f638","uc":"1f638","isCanonical": true},":joy_cat:":{"unicode":["1f639"],"fname":"1f639","uc":"1f639","isCanonical": true},":smiley_cat:":{"unicode":["1f63a"],"fname":"1f63a","uc":"1f63a","isCanonical": true},":heart_eyes_cat:":{"unicode":["1f63b"],"fname":"1f63b","uc":"1f63b","isCanonical": true},":smirk_cat:":{"unicode":["1f63c"],"fname":"1f63c","uc":"1f63c","isCanonical": true},":kissing_cat:":{"unicode":["1f63d"],"fname":"1f63d","uc":"1f63d","isCanonical": true},":pouting_cat:":{"unicode":["1f63e"],"fname":"1f63e","uc":"1f63e","isCanonical": true},":crying_cat_face:":{"unicode":["1f63f"],"fname":"1f63f","uc":"1f63f","isCanonical": true},":scream_cat:":{"unicode":["1f640"],"fname":"1f640","uc":"1f640","isCanonical": true},":no_good:":{"unicode":["1f645"],"fname":"1f645","uc":"1f645","isCanonical": true},":ok_woman:":{"unicode":["1f646"],"fname":"1f646","uc":"1f646","isCanonical": true},":bow:":{"unicode":["1f647"],"fname":"1f647","uc":"1f647","isCanonical": true},":see_no_evil:":{"unicode":["1f648"],"fname":"1f648","uc":"1f648","isCanonical": true},":hear_no_evil:":{"unicode":["1f649"],"fname":"1f649","uc":"1f649","isCanonical": true},":speak_no_evil:":{"unicode":["1f64a"],"fname":"1f64a","uc":"1f64a","isCanonical": true},":raising_hand:":{"unicode":["1f64b"],"fname":"1f64b","uc":"1f64b","isCanonical": true},":raised_hands:":{"unicode":["1f64c"],"fname":"1f64c","uc":"1f64c","isCanonical": true},":person_frowning:":{"unicode":["1f64d"],"fname":"1f64d","uc":"1f64d","isCanonical": true},":person_with_pouting_face:":{"unicode":["1f64e"],"fname":"1f64e","uc":"1f64e","isCanonical": true},":pray:":{"unicode":["1f64f"],"fname":"1f64f","uc":"1f64f","isCanonical": true},":rocket:":{"unicode":["1f680"],"fname":"1f680","uc":"1f680","isCanonical": true},":railway_car:":{"unicode":["1f683"],"fname":"1f683","uc":"1f683","isCanonical": true},":bullettrain_side:":{"unicode":["1f684"],"fname":"1f684","uc":"1f684","isCanonical": true},":bullettrain_front:":{"unicode":["1f685"],"fname":"1f685","uc":"1f685","isCanonical": true},":metro:":{"unicode":["1f687"],"fname":"1f687","uc":"1f687","isCanonical": true},":station:":{"unicode":["1f689"],"fname":"1f689","uc":"1f689","isCanonical": true},":bus:":{"unicode":["1f68c"],"fname":"1f68c","uc":"1f68c","isCanonical": true},":busstop:":{"unicode":["1f68f"],"fname":"1f68f","uc":"1f68f","isCanonical": true},":ambulance:":{"unicode":["1f691"],"fname":"1f691","uc":"1f691","isCanonical": true},":fire_engine:":{"unicode":["1f692"],"fname":"1f692","uc":"1f692","isCanonical": true},":police_car:":{"unicode":["1f693"],"fname":"1f693","uc":"1f693","isCanonical": true},":taxi:":{"unicode":["1f695"],"fname":"1f695","uc":"1f695","isCanonical": true},":red_car:":{"unicode":["1f697"],"fname":"1f697","uc":"1f697","isCanonical": true},":blue_car:":{"unicode":["1f699"],"fname":"1f699","uc":"1f699","isCanonical": true},":truck:":{"unicode":["1f69a"],"fname":"1f69a","uc":"1f69a","isCanonical": true},":ship:":{"unicode":["1f6a2"],"fname":"1f6a2","uc":"1f6a2","isCanonical": true},":speedboat:":{"unicode":["1f6a4"],"fname":"1f6a4","uc":"1f6a4","isCanonical": true},":traffic_light:":{"unicode":["1f6a5"],"fname":"1f6a5","uc":"1f6a5","isCanonical": true},":construction:":{"unicode":["1f6a7"],"fname":"1f6a7","uc":"1f6a7","isCanonical": true},":rotating_light:":{"unicode":["1f6a8"],"fname":"1f6a8","uc":"1f6a8","isCanonical": true},":triangular_flag_on_post:":{"unicode":["1f6a9"],"fname":"1f6a9","uc":"1f6a9","isCanonical": true},":door:":{"unicode":["1f6aa"],"fname":"1f6aa","uc":"1f6aa","isCanonical": true},":no_entry_sign:":{"unicode":["1f6ab"],"fname":"1f6ab","uc":"1f6ab","isCanonical": true},":smoking:":{"unicode":["1f6ac"],"fname":"1f6ac","uc":"1f6ac","isCanonical": true},":no_smoking:":{"unicode":["1f6ad"],"fname":"1f6ad","uc":"1f6ad","isCanonical": true},":bike:":{"unicode":["1f6b2"],"fname":"1f6b2","uc":"1f6b2","isCanonical": true},":walking:":{"unicode":["1f6b6"],"fname":"1f6b6","uc":"1f6b6","isCanonical": true},":mens:":{"unicode":["1f6b9"],"fname":"1f6b9","uc":"1f6b9","isCanonical": true},":womens:":{"unicode":["1f6ba"],"fname":"1f6ba","uc":"1f6ba","isCanonical": true},":restroom:":{"unicode":["1f6bb"],"fname":"1f6bb","uc":"1f6bb","isCanonical": true},":baby_symbol:":{"unicode":["1f6bc"],"fname":"1f6bc","uc":"1f6bc","isCanonical": true},":toilet:":{"unicode":["1f6bd"],"fname":"1f6bd","uc":"1f6bd","isCanonical": true},":wc:":{"unicode":["1f6be"],"fname":"1f6be","uc":"1f6be","isCanonical": true},":bath:":{"unicode":["1f6c0"],"fname":"1f6c0","uc":"1f6c0","isCanonical": true},":metal:":{"unicode":["1f918"],"fname":"1f918","uc":"1f918","isCanonical": true},":sign_of_the_horns:":{"unicode":["1f918"],"fname":"1f918","uc":"1f918","isCanonical": false},":grinning:":{"unicode":["1f600"],"fname":"1f600","uc":"1f600","isCanonical": true},":innocent:":{"unicode":["1f607"],"fname":"1f607","uc":"1f607","isCanonical": true},":smiling_imp:":{"unicode":["1f608"],"fname":"1f608","uc":"1f608","isCanonical": true},":sunglasses:":{"unicode":["1f60e"],"fname":"1f60e","uc":"1f60e","isCanonical": true},":neutral_face:":{"unicode":["1f610"],"fname":"1f610","uc":"1f610","isCanonical": true},":expressionless:":{"unicode":["1f611"],"fname":"1f611","uc":"1f611","isCanonical": true},":confused:":{"unicode":["1f615"],"fname":"1f615","uc":"1f615","isCanonical": true},":kissing:":{"unicode":["1f617"],"fname":"1f617","uc":"1f617","isCanonical": true},":kissing_smiling_eyes:":{"unicode":["1f619"],"fname":"1f619","uc":"1f619","isCanonical": true},":stuck_out_tongue:":{"unicode":["1f61b"],"fname":"1f61b","uc":"1f61b","isCanonical": true},":worried:":{"unicode":["1f61f"],"fname":"1f61f","uc":"1f61f","isCanonical": true},":frowning:":{"unicode":["1f626"],"fname":"1f626","uc":"1f626","isCanonical": true},":anguished:":{"unicode":["1f627"],"fname":"1f627","uc":"1f627","isCanonical": true},":grimacing:":{"unicode":["1f62c"],"fname":"1f62c","uc":"1f62c","isCanonical": true},":open_mouth:":{"unicode":["1f62e"],"fname":"1f62e","uc":"1f62e","isCanonical": true},":hushed:":{"unicode":["1f62f"],"fname":"1f62f","uc":"1f62f","isCanonical": true},":sleeping:":{"unicode":["1f634"],"fname":"1f634","uc":"1f634","isCanonical": true},":no_mouth:":{"unicode":["1f636"],"fname":"1f636","uc":"1f636","isCanonical": true},":helicopter:":{"unicode":["1f681"],"fname":"1f681","uc":"1f681","isCanonical": true},":steam_locomotive:":{"unicode":["1f682"],"fname":"1f682","uc":"1f682","isCanonical": true},":train2:":{"unicode":["1f686"],"fname":"1f686","uc":"1f686","isCanonical": true},":light_rail:":{"unicode":["1f688"],"fname":"1f688","uc":"1f688","isCanonical": true},":tram:":{"unicode":["1f68a"],"fname":"1f68a","uc":"1f68a","isCanonical": true},":oncoming_bus:":{"unicode":["1f68d"],"fname":"1f68d","uc":"1f68d","isCanonical": true},":trolleybus:":{"unicode":["1f68e"],"fname":"1f68e","uc":"1f68e","isCanonical": true},":minibus:":{"unicode":["1f690"],"fname":"1f690","uc":"1f690","isCanonical": true},":oncoming_police_car:":{"unicode":["1f694"],"fname":"1f694","uc":"1f694","isCanonical": true},":oncoming_taxi:":{"unicode":["1f696"],"fname":"1f696","uc":"1f696","isCanonical": true},":oncoming_automobile:":{"unicode":["1f698"],"fname":"1f698","uc":"1f698","isCanonical": true},":articulated_lorry:":{"unicode":["1f69b"],"fname":"1f69b","uc":"1f69b","isCanonical": true},":tractor:":{"unicode":["1f69c"],"fname":"1f69c","uc":"1f69c","isCanonical": true},":monorail:":{"unicode":["1f69d"],"fname":"1f69d","uc":"1f69d","isCanonical": true},":mountain_railway:":{"unicode":["1f69e"],"fname":"1f69e","uc":"1f69e","isCanonical": true},":suspension_railway:":{"unicode":["1f69f"],"fname":"1f69f","uc":"1f69f","isCanonical": true},":mountain_cableway:":{"unicode":["1f6a0"],"fname":"1f6a0","uc":"1f6a0","isCanonical": true},":aerial_tramway:":{"unicode":["1f6a1"],"fname":"1f6a1","uc":"1f6a1","isCanonical": true},":rowboat:":{"unicode":["1f6a3"],"fname":"1f6a3","uc":"1f6a3","isCanonical": true},":vertical_traffic_light:":{"unicode":["1f6a6"],"fname":"1f6a6","uc":"1f6a6","isCanonical": true},":put_litter_in_its_place:":{"unicode":["1f6ae"],"fname":"1f6ae","uc":"1f6ae","isCanonical": true},":do_not_litter:":{"unicode":["1f6af"],"fname":"1f6af","uc":"1f6af","isCanonical": true},":potable_water:":{"unicode":["1f6b0"],"fname":"1f6b0","uc":"1f6b0","isCanonical": true},":non-potable_water:":{"unicode":["1f6b1"],"fname":"1f6b1","uc":"1f6b1","isCanonical": true},":no_bicycles:":{"unicode":["1f6b3"],"fname":"1f6b3","uc":"1f6b3","isCanonical": true},":bicyclist:":{"unicode":["1f6b4"],"fname":"1f6b4","uc":"1f6b4","isCanonical": true},":mountain_bicyclist:":{"unicode":["1f6b5"],"fname":"1f6b5","uc":"1f6b5","isCanonical": true},":no_pedestrians:":{"unicode":["1f6b7"],"fname":"1f6b7","uc":"1f6b7","isCanonical": true},":children_crossing:":{"unicode":["1f6b8"],"fname":"1f6b8","uc":"1f6b8","isCanonical": true},":shower:":{"unicode":["1f6bf"],"fname":"1f6bf","uc":"1f6bf","isCanonical": true},":bathtub:":{"unicode":["1f6c1"],"fname":"1f6c1","uc":"1f6c1","isCanonical": true},":passport_control:":{"unicode":["1f6c2"],"fname":"1f6c2","uc":"1f6c2","isCanonical": true},":customs:":{"unicode":["1f6c3"],"fname":"1f6c3","uc":"1f6c3","isCanonical": true},":baggage_claim:":{"unicode":["1f6c4"],"fname":"1f6c4","uc":"1f6c4","isCanonical": true},":left_luggage:":{"unicode":["1f6c5"],"fname":"1f6c5","uc":"1f6c5","isCanonical": true},":earth_africa:":{"unicode":["1f30d"],"fname":"1f30d","uc":"1f30d","isCanonical": true},":earth_americas:":{"unicode":["1f30e"],"fname":"1f30e","uc":"1f30e","isCanonical": true},":globe_with_meridians:":{"unicode":["1f310"],"fname":"1f310","uc":"1f310","isCanonical": true},":waxing_crescent_moon:":{"unicode":["1f312"],"fname":"1f312","uc":"1f312","isCanonical": true},":waning_gibbous_moon:":{"unicode":["1f316"],"fname":"1f316","uc":"1f316","isCanonical": true},":last_quarter_moon:":{"unicode":["1f317"],"fname":"1f317","uc":"1f317","isCanonical": true},":waning_crescent_moon:":{"unicode":["1f318"],"fname":"1f318","uc":"1f318","isCanonical": true},":new_moon_with_face:":{"unicode":["1f31a"],"fname":"1f31a","uc":"1f31a","isCanonical": true},":last_quarter_moon_with_face:":{"unicode":["1f31c"],"fname":"1f31c","uc":"1f31c","isCanonical": true},":full_moon_with_face:":{"unicode":["1f31d"],"fname":"1f31d","uc":"1f31d","isCanonical": true},":sun_with_face:":{"unicode":["1f31e"],"fname":"1f31e","uc":"1f31e","isCanonical": true},":evergreen_tree:":{"unicode":["1f332"],"fname":"1f332","uc":"1f332","isCanonical": true},":deciduous_tree:":{"unicode":["1f333"],"fname":"1f333","uc":"1f333","isCanonical": true},":lemon:":{"unicode":["1f34b"],"fname":"1f34b","uc":"1f34b","isCanonical": true},":pear:":{"unicode":["1f350"],"fname":"1f350","uc":"1f350","isCanonical": true},":baby_bottle:":{"unicode":["1f37c"],"fname":"1f37c","uc":"1f37c","isCanonical": true},":horse_racing:":{"unicode":["1f3c7"],"fname":"1f3c7","uc":"1f3c7","isCanonical": true},":rugby_football:":{"unicode":["1f3c9"],"fname":"1f3c9","uc":"1f3c9","isCanonical": true},":european_post_office:":{"unicode":["1f3e4"],"fname":"1f3e4","uc":"1f3e4","isCanonical": true},":rat:":{"unicode":["1f400"],"fname":"1f400","uc":"1f400","isCanonical": true},":mouse2:":{"unicode":["1f401"],"fname":"1f401","uc":"1f401","isCanonical": true},":ox:":{"unicode":["1f402"],"fname":"1f402","uc":"1f402","isCanonical": true},":water_buffalo:":{"unicode":["1f403"],"fname":"1f403","uc":"1f403","isCanonical": true},":cow2:":{"unicode":["1f404"],"fname":"1f404","uc":"1f404","isCanonical": true},":tiger2:":{"unicode":["1f405"],"fname":"1f405","uc":"1f405","isCanonical": true},":leopard:":{"unicode":["1f406"],"fname":"1f406","uc":"1f406","isCanonical": true},":rabbit2:":{"unicode":["1f407"],"fname":"1f407","uc":"1f407","isCanonical": true},":cat2:":{"unicode":["1f408"],"fname":"1f408","uc":"1f408","isCanonical": true},":dragon:":{"unicode":["1f409"],"fname":"1f409","uc":"1f409","isCanonical": true},":crocodile:":{"unicode":["1f40a"],"fname":"1f40a","uc":"1f40a","isCanonical": true},":whale2:":{"unicode":["1f40b"],"fname":"1f40b","uc":"1f40b","isCanonical": true},":ram:":{"unicode":["1f40f"],"fname":"1f40f","uc":"1f40f","isCanonical": true},":goat:":{"unicode":["1f410"],"fname":"1f410","uc":"1f410","isCanonical": true},":rooster:":{"unicode":["1f413"],"fname":"1f413","uc":"1f413","isCanonical": true},":dog2:":{"unicode":["1f415"],"fname":"1f415","uc":"1f415","isCanonical": true},":pig2:":{"unicode":["1f416"],"fname":"1f416","uc":"1f416","isCanonical": true},":dromedary_camel:":{"unicode":["1f42a"],"fname":"1f42a","uc":"1f42a","isCanonical": true},":busts_in_silhouette:":{"unicode":["1f465"],"fname":"1f465","uc":"1f465","isCanonical": true},":two_men_holding_hands:":{"unicode":["1f46c"],"fname":"1f46c","uc":"1f46c","isCanonical": true},":two_women_holding_hands:":{"unicode":["1f46d"],"fname":"1f46d","uc":"1f46d","isCanonical": true},":thought_balloon:":{"unicode":["1f4ad"],"fname":"1f4ad","uc":"1f4ad","isCanonical": true},":euro:":{"unicode":["1f4b6"],"fname":"1f4b6","uc":"1f4b6","isCanonical": true},":pound:":{"unicode":["1f4b7"],"fname":"1f4b7","uc":"1f4b7","isCanonical": true},":mailbox_with_mail:":{"unicode":["1f4ec"],"fname":"1f4ec","uc":"1f4ec","isCanonical": true},":mailbox_with_no_mail:":{"unicode":["1f4ed"],"fname":"1f4ed","uc":"1f4ed","isCanonical": true},":postal_horn:":{"unicode":["1f4ef"],"fname":"1f4ef","uc":"1f4ef","isCanonical": true},":no_mobile_phones:":{"unicode":["1f4f5"],"fname":"1f4f5","uc":"1f4f5","isCanonical": true},":twisted_rightwards_arrows:":{"unicode":["1f500"],"fname":"1f500","uc":"1f500","isCanonical": true},":repeat:":{"unicode":["1f501"],"fname":"1f501","uc":"1f501","isCanonical": true},":repeat_one:":{"unicode":["1f502"],"fname":"1f502","uc":"1f502","isCanonical": true},":arrows_counterclockwise:":{"unicode":["1f504"],"fname":"1f504","uc":"1f504","isCanonical": true},":low_brightness:":{"unicode":["1f505"],"fname":"1f505","uc":"1f505","isCanonical": true},":high_brightness:":{"unicode":["1f506"],"fname":"1f506","uc":"1f506","isCanonical": true},":mute:":{"unicode":["1f507"],"fname":"1f507","uc":"1f507","isCanonical": true},":sound:":{"unicode":["1f509"],"fname":"1f509","uc":"1f509","isCanonical": true},":no_bell:":{"unicode":["1f515"],"fname":"1f515","uc":"1f515","isCanonical": true},":microscope:":{"unicode":["1f52c"],"fname":"1f52c","uc":"1f52c","isCanonical": true},":telescope:":{"unicode":["1f52d"],"fname":"1f52d","uc":"1f52d","isCanonical": true},":clock130:":{"unicode":["1f55c"],"fname":"1f55c","uc":"1f55c","isCanonical": true},":clock230:":{"unicode":["1f55d"],"fname":"1f55d","uc":"1f55d","isCanonical": true},":clock330:":{"unicode":["1f55e"],"fname":"1f55e","uc":"1f55e","isCanonical": true},":clock430:":{"unicode":["1f55f"],"fname":"1f55f","uc":"1f55f","isCanonical": true},":clock530:":{"unicode":["1f560"],"fname":"1f560","uc":"1f560","isCanonical": true},":clock630:":{"unicode":["1f561"],"fname":"1f561","uc":"1f561","isCanonical": true},":clock730:":{"unicode":["1f562"],"fname":"1f562","uc":"1f562","isCanonical": true},":clock830:":{"unicode":["1f563"],"fname":"1f563","uc":"1f563","isCanonical": true},":clock930:":{"unicode":["1f564"],"fname":"1f564","uc":"1f564","isCanonical": true},":clock1030:":{"unicode":["1f565"],"fname":"1f565","uc":"1f565","isCanonical": true},":clock1130:":{"unicode":["1f566"],"fname":"1f566","uc":"1f566","isCanonical": true},":clock1230:":{"unicode":["1f567"],"fname":"1f567","uc":"1f567","isCanonical": true},":speaker:":{"unicode":["1f508"],"fname":"1f508","uc":"1f508","isCanonical": true},":train:":{"unicode":["1f68b"],"fname":"1f68b","uc":"1f68b","isCanonical": true},":medal:":{"unicode":["1f3c5"],"fname":"1f3c5","uc":"1f3c5","isCanonical": true},":sports_medal:":{"unicode":["1f3c5"],"fname":"1f3c5","uc":"1f3c5","isCanonical": false},":flag_black:":{"unicode":["1f3f4"],"fname":"1f3f4","uc":"1f3f4","isCanonical": true},":waving_black_flag:":{"unicode":["1f3f4"],"fname":"1f3f4","uc":"1f3f4","isCanonical": false},":camera_with_flash:":{"unicode":["1f4f8"],"fname":"1f4f8","uc":"1f4f8","isCanonical": true},":sleeping_accommodation:":{"unicode":["1f6cc"],"fname":"1f6cc","uc":"1f6cc","isCanonical": true},":middle_finger:":{"unicode":["1f595"],"fname":"1f595","uc":"1f595","isCanonical": true},":reversed_hand_with_middle_finger_extended:":{"unicode":["1f595"],"fname":"1f595","uc":"1f595","isCanonical": false},":vulcan:":{"unicode":["1f596"],"fname":"1f596","uc":"1f596","isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers:":{"unicode":["1f596"],"fname":"1f596","uc":"1f596","isCanonical": false},":slight_frown:":{"unicode":["1f641"],"fname":"1f641","uc":"1f641","isCanonical": true},":slightly_frowning_face:":{"unicode":["1f641"],"fname":"1f641","uc":"1f641","isCanonical": false},":slight_smile:":{"unicode":["1f642"],"fname":"1f642","uc":"1f642","isCanonical": true},":slightly_smiling_face:":{"unicode":["1f642"],"fname":"1f642","uc":"1f642","isCanonical": false},":airplane_departure:":{"unicode":["1f6eb"],"fname":"1f6eb","uc":"1f6eb","isCanonical": true},":airplane_arriving:":{"unicode":["1f6ec"],"fname":"1f6ec","uc":"1f6ec","isCanonical": true},":tone1:":{"unicode":["1f3fb"],"fname":"1f3fb","uc":"1f3fb","isCanonical": true},":tone2:":{"unicode":["1f3fc"],"fname":"1f3fc","uc":"1f3fc","isCanonical": true},":tone3:":{"unicode":["1f3fd"],"fname":"1f3fd","uc":"1f3fd","isCanonical": true},":tone4:":{"unicode":["1f3fe"],"fname":"1f3fe","uc":"1f3fe","isCanonical": true},":tone5:":{"unicode":["1f3ff"],"fname":"1f3ff","uc":"1f3ff","isCanonical": true},":upside_down:":{"unicode":["1f643"],"fname":"1f643","uc":"1f643","isCanonical": true},":upside_down_face:":{"unicode":["1f643"],"fname":"1f643","uc":"1f643","isCanonical": false},":money_mouth:":{"unicode":["1f911"],"fname":"1f911","uc":"1f911","isCanonical": true},":money_mouth_face:":{"unicode":["1f911"],"fname":"1f911","uc":"1f911","isCanonical": false},":nerd:":{"unicode":["1f913"],"fname":"1f913","uc":"1f913","isCanonical": true},":nerd_face:":{"unicode":["1f913"],"fname":"1f913","uc":"1f913","isCanonical": false},":hugging:":{"unicode":["1f917"],"fname":"1f917","uc":"1f917","isCanonical": true},":hugging_face:":{"unicode":["1f917"],"fname":"1f917","uc":"1f917","isCanonical": false},":rolling_eyes:":{"unicode":["1f644"],"fname":"1f644","uc":"1f644","isCanonical": true},":face_with_rolling_eyes:":{"unicode":["1f644"],"fname":"1f644","uc":"1f644","isCanonical": false},":thinking:":{"unicode":["1f914"],"fname":"1f914","uc":"1f914","isCanonical": true},":thinking_face:":{"unicode":["1f914"],"fname":"1f914","uc":"1f914","isCanonical": false},":zipper_mouth:":{"unicode":["1f910"],"fname":"1f910","uc":"1f910","isCanonical": true},":zipper_mouth_face:":{"unicode":["1f910"],"fname":"1f910","uc":"1f910","isCanonical": false},":thermometer_face:":{"unicode":["1f912"],"fname":"1f912","uc":"1f912","isCanonical": true},":face_with_thermometer:":{"unicode":["1f912"],"fname":"1f912","uc":"1f912","isCanonical": false},":head_bandage:":{"unicode":["1f915"],"fname":"1f915","uc":"1f915","isCanonical": true},":face_with_head_bandage:":{"unicode":["1f915"],"fname":"1f915","uc":"1f915","isCanonical": false},":robot:":{"unicode":["1f916"],"fname":"1f916","uc":"1f916","isCanonical": true},":robot_face:":{"unicode":["1f916"],"fname":"1f916","uc":"1f916","isCanonical": false},":lion_face:":{"unicode":["1f981"],"fname":"1f981","uc":"1f981","isCanonical": true},":lion:":{"unicode":["1f981"],"fname":"1f981","uc":"1f981","isCanonical": false},":unicorn:":{"unicode":["1f984"],"fname":"1f984","uc":"1f984","isCanonical": true},":unicorn_face:":{"unicode":["1f984"],"fname":"1f984","uc":"1f984","isCanonical": false},":scorpion:":{"unicode":["1f982"],"fname":"1f982","uc":"1f982","isCanonical": true},":crab:":{"unicode":["1f980"],"fname":"1f980","uc":"1f980","isCanonical": true},":turkey:":{"unicode":["1f983"],"fname":"1f983","uc":"1f983","isCanonical": true},":cheese:":{"unicode":["1f9c0"],"fname":"1f9c0","uc":"1f9c0","isCanonical": true},":cheese_wedge:":{"unicode":["1f9c0"],"fname":"1f9c0","uc":"1f9c0","isCanonical": false},":hotdog:":{"unicode":["1f32d"],"fname":"1f32d","uc":"1f32d","isCanonical": true},":hot_dog:":{"unicode":["1f32d"],"fname":"1f32d","uc":"1f32d","isCanonical": false},":taco:":{"unicode":["1f32e"],"fname":"1f32e","uc":"1f32e","isCanonical": true},":burrito:":{"unicode":["1f32f"],"fname":"1f32f","uc":"1f32f","isCanonical": true},":popcorn:":{"unicode":["1f37f"],"fname":"1f37f","uc":"1f37f","isCanonical": true},":champagne:":{"unicode":["1f37e"],"fname":"1f37e","uc":"1f37e","isCanonical": true},":bottle_with_popping_cork:":{"unicode":["1f37e"],"fname":"1f37e","uc":"1f37e","isCanonical": false},":bow_and_arrow:":{"unicode":["1f3f9"],"fname":"1f3f9","uc":"1f3f9","isCanonical": true},":archery:":{"unicode":["1f3f9"],"fname":"1f3f9","uc":"1f3f9","isCanonical": false},":amphora:":{"unicode":["1f3fa"],"fname":"1f3fa","uc":"1f3fa","isCanonical": true},":place_of_worship:":{"unicode":["1f6d0"],"fname":"1f6d0","uc":"1f6d0","isCanonical": true},":worship_symbol:":{"unicode":["1f6d0"],"fname":"1f6d0","uc":"1f6d0","isCanonical": false},":kaaba:":{"unicode":["1f54b"],"fname":"1f54b","uc":"1f54b","isCanonical": true},":mosque:":{"unicode":["1f54c"],"fname":"1f54c","uc":"1f54c","isCanonical": true},":synagogue:":{"unicode":["1f54d"],"fname":"1f54d","uc":"1f54d","isCanonical": true},":menorah:":{"unicode":["1f54e"],"fname":"1f54e","uc":"1f54e","isCanonical": true},":prayer_beads:":{"unicode":["1f4ff"],"fname":"1f4ff","uc":"1f4ff","isCanonical": true},":cricket:":{"unicode":["1f3cf"],"fname":"1f3cf","uc":"1f3cf","isCanonical": true},":cricket_bat_ball:":{"unicode":["1f3cf"],"fname":"1f3cf","uc":"1f3cf","isCanonical": false},":volleyball:":{"unicode":["1f3d0"],"fname":"1f3d0","uc":"1f3d0","isCanonical": true},":field_hockey:":{"unicode":["1f3d1"],"fname":"1f3d1","uc":"1f3d1","isCanonical": true},":hockey:":{"unicode":["1f3d2"],"fname":"1f3d2","uc":"1f3d2","isCanonical": true},":ping_pong:":{"unicode":["1f3d3"],"fname":"1f3d3","uc":"1f3d3","isCanonical": true},":table_tennis:":{"unicode":["1f3d3"],"fname":"1f3d3","uc":"1f3d3","isCanonical": false},":badminton:":{"unicode":["1f3f8"],"fname":"1f3f8","uc":"1f3f8","isCanonical": true},":drum:":{"unicode":["1f941"],"fname":"1f941","uc":"1f941","isCanonical": true},":drum_with_drumsticks:":{"unicode":["1f941"],"fname":"1f941","uc":"1f941","isCanonical": false},":shrimp:":{"unicode":["1f990"],"fname":"1f990","uc":"1f990","isCanonical": true},":squid:":{"unicode":["1f991"],"fname":"1f991","uc":"1f991","isCanonical": true},":egg:":{"unicode":["1f95a"],"fname":"1f95a","uc":"1f95a","isCanonical": true},":milk:":{"unicode":["1f95b"],"fname":"1f95b","uc":"1f95b","isCanonical": true},":glass_of_milk:":{"unicode":["1f95b"],"fname":"1f95b","uc":"1f95b","isCanonical": false},":peanuts:":{"unicode":["1f95c"],"fname":"1f95c","uc":"1f95c","isCanonical": true},":shelled_peanut:":{"unicode":["1f95c"],"fname":"1f95c","uc":"1f95c","isCanonical": false},":kiwi:":{"unicode":["1f95d"],"fname":"1f95d","uc":"1f95d","isCanonical": true},":kiwifruit:":{"unicode":["1f95d"],"fname":"1f95d","uc":"1f95d","isCanonical": false},":pancakes:":{"unicode":["1f95e"],"fname":"1f95e","uc":"1f95e","isCanonical": true},":regional_indicator_w:":{"unicode":["1f1fc"],"fname":"1f1fc","uc":"1f1fc","isCanonical": true},":regional_indicator_v:":{"unicode":["1f1fb"],"fname":"1f1fb","uc":"1f1fb","isCanonical": true},":regional_indicator_u:":{"unicode":["1f1fa"],"fname":"1f1fa","uc":"1f1fa","isCanonical": true},":regional_indicator_t:":{"unicode":["1f1f9"],"fname":"1f1f9","uc":"1f1f9","isCanonical": true},":regional_indicator_s:":{"unicode":["1f1f8"],"fname":"1f1f8","uc":"1f1f8","isCanonical": true},":regional_indicator_r:":{"unicode":["1f1f7"],"fname":"1f1f7","uc":"1f1f7","isCanonical": true},":regional_indicator_q:":{"unicode":["1f1f6"],"fname":"1f1f6","uc":"1f1f6","isCanonical": true},":regional_indicator_p:":{"unicode":["1f1f5"],"fname":"1f1f5","uc":"1f1f5","isCanonical": true},":regional_indicator_o:":{"unicode":["1f1f4"],"fname":"1f1f4","uc":"1f1f4","isCanonical": true},":regional_indicator_n:":{"unicode":["1f1f3"],"fname":"1f1f3","uc":"1f1f3","isCanonical": true},":regional_indicator_m:":{"unicode":["1f1f2"],"fname":"1f1f2","uc":"1f1f2","isCanonical": true},":regional_indicator_l:":{"unicode":["1f1f1"],"fname":"1f1f1","uc":"1f1f1","isCanonical": true},":regional_indicator_k:":{"unicode":["1f1f0"],"fname":"1f1f0","uc":"1f1f0","isCanonical": true},":regional_indicator_j:":{"unicode":["1f1ef"],"fname":"1f1ef","uc":"1f1ef","isCanonical": true},":regional_indicator_i:":{"unicode":["1f1ee"],"fname":"1f1ee","uc":"1f1ee","isCanonical": true},":regional_indicator_h:":{"unicode":["1f1ed"],"fname":"1f1ed","uc":"1f1ed","isCanonical": true},":regional_indicator_g:":{"unicode":["1f1ec"],"fname":"1f1ec","uc":"1f1ec","isCanonical": true},":regional_indicator_f:":{"unicode":["1f1eb"],"fname":"1f1eb","uc":"1f1eb","isCanonical": true},":regional_indicator_e:":{"unicode":["1f1ea"],"fname":"1f1ea","uc":"1f1ea","isCanonical": true},":regional_indicator_d:":{"unicode":["1f1e9"],"fname":"1f1e9","uc":"1f1e9","isCanonical": true},":regional_indicator_c:":{"unicode":["1f1e8"],"fname":"1f1e8","uc":"1f1e8","isCanonical": true},":regional_indicator_b:":{"unicode":["1f1e7"],"fname":"1f1e7","uc":"1f1e7","isCanonical": true},":regional_indicator_a:":{"unicode":["1f1e6"],"fname":"1f1e6","uc":"1f1e6","isCanonical": true},":fast_forward:":{"unicode":["23e9"],"fname":"23e9","uc":"23e9","isCanonical": true},":rewind:":{"unicode":["23ea"],"fname":"23ea","uc":"23ea","isCanonical": true},":arrow_double_up:":{"unicode":["23eb"],"fname":"23eb","uc":"23eb","isCanonical": true},":arrow_double_down:":{"unicode":["23ec"],"fname":"23ec","uc":"23ec","isCanonical": true},":alarm_clock:":{"unicode":["23f0"],"fname":"23f0","uc":"23f0","isCanonical": true},":hourglass_flowing_sand:":{"unicode":["23f3"],"fname":"23f3","uc":"23f3","isCanonical": true},":ophiuchus:":{"unicode":["26ce"],"fname":"26ce","uc":"26ce","isCanonical": true},":white_check_mark:":{"unicode":["2705"],"fname":"2705","uc":"2705","isCanonical": true},":fist:":{"unicode":["270a"],"fname":"270a","uc":"270a","isCanonical": true},":raised_hand:":{"unicode":["270b"],"fname":"270b","uc":"270b","isCanonical": true},":sparkles:":{"unicode":["2728"],"fname":"2728","uc":"2728","isCanonical": true},":x:":{"unicode":["274c"],"fname":"274c","uc":"274c","isCanonical": true},":negative_squared_cross_mark:":{"unicode":["274e"],"fname":"274e","uc":"274e","isCanonical": true},":question:":{"unicode":["2753"],"fname":"2753","uc":"2753","isCanonical": true},":grey_question:":{"unicode":["2754"],"fname":"2754","uc":"2754","isCanonical": true},":grey_exclamation:":{"unicode":["2755"],"fname":"2755","uc":"2755","isCanonical": true},":heavy_plus_sign:":{"unicode":["2795"],"fname":"2795","uc":"2795","isCanonical": true},":heavy_minus_sign:":{"unicode":["2796"],"fname":"2796","uc":"2796","isCanonical": true},":heavy_division_sign:":{"unicode":["2797"],"fname":"2797","uc":"2797","isCanonical": true},":curly_loop:":{"unicode":["27b0"],"fname":"27b0","uc":"27b0","isCanonical": true},":loop:":{"unicode":["27bf"],"fname":"27bf","uc":"27bf","isCanonical": true}};
    // ns.shortnames = Object.keys(ns.emojioneList).map(function(emoji) {
    //     return emoji.replace(/[+]/g, "\\$&");
    // }).join('|');
    var tmpShortNames = [],
        emoji;
    for (emoji in ns.emojioneList) {
        if (!ns.emojioneList.hasOwnProperty(emoji)) continue;
        tmpShortNames.push(emoji.replace(/[+]/g, "\\$&"));
    }
    ns.shortnames = tmpShortNames.join('|');
    ns.asciiList = {
        '<3':'2764',
        '</3':'1f494',
        ':\')':'1f602',
        ':\'-)':'1f602',
        ':D':'1f603',
        ':-D':'1f603',
        '=D':'1f603',
        ':)':'1f642',
        ':-)':'1f642',
        '=]':'1f642',
        '=)':'1f642',
        ':]':'1f642',
        '\':)':'1f605',
        '\':-)':'1f605',
        '\'=)':'1f605',
        '\':D':'1f605',
        '\':-D':'1f605',
        '\'=D':'1f605',
        '>:)':'1f606',
        '>;)':'1f606',
        '>:-)':'1f606',
        '>=)':'1f606',
        ';)':'1f609',
        ';-)':'1f609',
        '*-)':'1f609',
        '*)':'1f609',
        ';-]':'1f609',
        ';]':'1f609',
        ';D':'1f609',
        ';^)':'1f609',
        '\':(':'1f613',
        '\':-(':'1f613',
        '\'=(':'1f613',
        ':*':'1f618',
        ':-*':'1f618',
        '=*':'1f618',
        ':^*':'1f618',
        '>:P':'1f61c',
        'X-P':'1f61c',
        'x-p':'1f61c',
        '>:[':'1f61e',
        ':-(':'1f61e',
        ':(':'1f61e',
        ':-[':'1f61e',
        ':[':'1f61e',
        '=(':'1f61e',
        '>:(':'1f620',
        '>:-(':'1f620',
        ':@':'1f620',
        ':\'(':'1f622',
        ':\'-(':'1f622',
        ';(':'1f622',
        ';-(':'1f622',
        '>.<':'1f623',
        'D:':'1f628',
        ':$':'1f633',
        '=$':'1f633',
        '#-)':'1f635',
        '#)':'1f635',
        '%-)':'1f635',
        '%)':'1f635',
        'X)':'1f635',
        'X-)':'1f635',
        '*\\0/*':'1f646',
        '\\0/':'1f646',
        '*\\O/*':'1f646',
        '\\O/':'1f646',
        'O:-)':'1f607',
        '0:-3':'1f607',
        '0:3':'1f607',
        '0:-)':'1f607',
        '0:)':'1f607',
        '0;^)':'1f607',
        'O:)':'1f607',
        'O;-)':'1f607',
        'O=)':'1f607',
        '0;-)':'1f607',
        'O:-3':'1f607',
        'O:3':'1f607',
        'B-)':'1f60e',
        'B)':'1f60e',
        '8)':'1f60e',
        '8-)':'1f60e',
        'B-D':'1f60e',
        '8-D':'1f60e',
        '-_-':'1f611',
        '-__-':'1f611',
        '-___-':'1f611',
        '>:\\':'1f615',
        '>:/':'1f615',
        ':-/':'1f615',
        ':-.':'1f615',
        ':/':'1f615',
        ':\\':'1f615',
        '=/':'1f615',
        '=\\':'1f615',
        ':L':'1f615',
        '=L':'1f615',
        ':P':'1f61b',
        ':-P':'1f61b',
        '=P':'1f61b',
        ':-p':'1f61b',
        ':p':'1f61b',
        '=p':'1f61b',
        ':-Þ':'1f61b',
        ':Þ':'1f61b',
        ':þ':'1f61b',
        ':-þ':'1f61b',
        ':-b':'1f61b',
        ':b':'1f61b',
        'd:':'1f61b',
        ':-O':'1f62e',
        ':O':'1f62e',
        ':-o':'1f62e',
        ':o':'1f62e',
        'O_O':'1f62e',
        '>:O':'1f62e',
        ':-X':'1f636',
        ':X':'1f636',
        ':-#':'1f636',
        ':#':'1f636',
        '=X':'1f636',
        '=x':'1f636',
        ':x':'1f636',
        ':-x':'1f636',
        '=#':'1f636'
    };
    ns.asciiRegexp = '(\\<3|&lt;3|\\<\\/3|&lt;\\/3|\\:\'\\)|\\:\'\\-\\)|\\:D|\\:\\-D|\\=D|\\:\\)|\\:\\-\\)|\\=\\]|\\=\\)|\\:\\]|\'\\:\\)|\'\\:\\-\\)|\'\\=\\)|\'\\:D|\'\\:\\-D|\'\\=D|\\>\\:\\)|&gt;\\:\\)|\\>;\\)|&gt;;\\)|\\>\\:\\-\\)|&gt;\\:\\-\\)|\\>\\=\\)|&gt;\\=\\)|;\\)|;\\-\\)|\\*\\-\\)|\\*\\)|;\\-\\]|;\\]|;D|;\\^\\)|\'\\:\\(|\'\\:\\-\\(|\'\\=\\(|\\:\\*|\\:\\-\\*|\\=\\*|\\:\\^\\*|\\>\\:P|&gt;\\:P|X\\-P|x\\-p|\\>\\:\\[|&gt;\\:\\[|\\:\\-\\(|\\:\\(|\\:\\-\\[|\\:\\[|\\=\\(|\\>\\:\\(|&gt;\\:\\(|\\>\\:\\-\\(|&gt;\\:\\-\\(|\\:@|\\:\'\\(|\\:\'\\-\\(|;\\(|;\\-\\(|\\>\\.\\<|&gt;\\.&lt;|D\\:|\\:\\$|\\=\\$|#\\-\\)|#\\)|%\\-\\)|%\\)|X\\)|X\\-\\)|\\*\\\\0\\/\\*|\\\\0\\/|\\*\\\\O\\/\\*|\\\\O\\/|O\\:\\-\\)|0\\:\\-3|0\\:3|0\\:\\-\\)|0\\:\\)|0;\\^\\)|O\\:\\-\\)|O\\:\\)|O;\\-\\)|O\\=\\)|0;\\-\\)|O\\:\\-3|O\\:3|B\\-\\)|B\\)|8\\)|8\\-\\)|B\\-D|8\\-D|\\-_\\-|\\-__\\-|\\-___\\-|\\>\\:\\\\|&gt;\\:\\\\|\\>\\:\\/|&gt;\\:\\/|\\:\\-\\/|\\:\\-\\.|\\:\\/|\\:\\\\|\\=\\/|\\=\\\\|\\:L|\\=L|\\:P|\\:\\-P|\\=P|\\:\\-p|\\:p|\\=p|\\:\\-Þ|\\:\\-&THORN;|\\:Þ|\\:&THORN;|\\:þ|\\:&thorn;|\\:\\-þ|\\:\\-&thorn;|\\:\\-b|\\:b|d\\:|\\:\\-O|\\:O|\\:\\-o|\\:o|O_O|\\>\\:O|&gt;\\:O|\\:\\-X|\\:X|\\:\\-#|\\:#|\\=X|\\=x|\\:x|\\:\\-x|\\=#)';
    // javascript escapes here must be ordered from largest length to shortest
    ns.unicodeRegexp = '(\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66\\u200D\\uD83D\\uDC66|\\uD83D\\uDC69\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC8B\\u200D\\uD83D\\uDC69|\\uD83D\\uDC68\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC8B\\u200D\\uD83D\\uDC68|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC66|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC67|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC67|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC66\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC67|\\uD83D\\uDC69\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC69|\\uD83D\\uDC68\\uD83D\\uDC69\\uD83D\\uDC67\\uD83D\\uDC66|\\uD83D\\uDC68\\uD83D\\uDC69\\uD83D\\uDC66\\uD83D\\uDC66|\\uD83D\\uDC69\\uD83D\\uDC69\\uD83D\\uDC66\\uD83D\\uDC66|\\uD83D\\uDC68\\uD83D\\uDC68\\uD83D\\uDC67\\uD83D\\uDC67|\\uD83D\\uDC69\\uD83D\\uDC69\\uD83D\\uDC67\\uD83D\\uDC66|\\uD83D\\uDC68\\uD83D\\uDC68\\uD83D\\uDC67\\uD83D\\uDC66|\\uD83D\\uDC69\\uD83D\\uDC69\\uD83D\\uDC67\\uD83D\\uDC67|\\uD83D\\uDC68\\uD83D\\uDC69\\uD83D\\uDC67\\uD83D\\uDC67|\\uD83D\\uDC68\\uD83D\\uDC68\\uD83D\\uDC66\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC68|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC66|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC67|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67|\\uD83D\\uDC69\\u2764\\uD83D\\uDC8B\\uD83D\\uDC69|\\uD83D\\uDC68\\u2764\\uD83D\\uDC8B\\uD83D\\uDC68|\\uD83D\\uDC68\\uD83D\\uDC68\\uD83D\\uDC67|\\uD83D\\uDC68\\uD83D\\uDC68\\uD83D\\uDC66|\\uD83D\\uDC69\\uD83D\\uDC69\\uD83D\\uDC66|\\uD83D\\uDC69\\uD83D\\uDC69\\uD83D\\uDC67|\\uD83C\\uDFF3\\uFE0F\\u200D\\uD83C\\uDF08|\\uD83D\\uDC68\\uD83D\\uDC69\\uD83D\\uDC67|\\uD83D\\uDC68\\u2764\\uD83D\\uDC68|\\uD83D\\uDC41\\u200D\\uD83D\\uDDE8|\\uD83D\\uDC69\\u2764\\uD83D\\uDC69|\\uD83D\\uDC41\\uD83D\\uDDE8|\\uD83C\\uDDE6\\uD83C\\uDDE8|\\uD83C\\uDDE6\\uD83C\\uDDE9|\\uD83C\\uDDE6\\uD83C\\uDDEA|\\uD83C\\uDDE6\\uD83C\\uDDEB|\\uD83C\\uDDE6\\uD83C\\uDDEC|\\uD83C\\uDDE6\\uD83C\\uDDEE|\\uD83C\\uDDE6\\uD83C\\uDDF1|\\uD83C\\uDDE6\\uD83C\\uDDF2|\\uD83C\\uDDE6\\uD83C\\uDDF4|\\uD83C\\uDDE6\\uD83C\\uDDF6|\\uD83C\\uDDE6\\uD83C\\uDDF7|\\uD83C\\uDDE6\\uD83C\\uDDF8|\\uD83E\\uDD3E\\uD83C\\uDFFF|\\uD83E\\uDD3E\\uD83C\\uDFFE|\\uD83E\\uDD3E\\uD83C\\uDFFD|\\uD83E\\uDD3E\\uD83C\\uDFFC|\\uD83E\\uDD3E\\uD83C\\uDFFB|\\uD83E\\uDD3D\\uD83C\\uDFFF|\\uD83E\\uDD3D\\uD83C\\uDFFE|\\uD83E\\uDD3D\\uD83C\\uDFFD|\\uD83E\\uDD3D\\uD83C\\uDFFC|\\uD83E\\uDD3D\\uD83C\\uDFFB|\\uD83E\\uDD3C\\uD83C\\uDFFF|\\uD83E\\uDD3C\\uD83C\\uDFFE|\\uD83E\\uDD3C\\uD83C\\uDFFD|\\uD83E\\uDD3C\\uD83C\\uDFFC|\\uD83E\\uDD3C\\uD83C\\uDFFB|\\uD83E\\uDD39\\uD83C\\uDFFF|\\uD83E\\uDD39\\uD83C\\uDFFE|\\uD83E\\uDD39\\uD83C\\uDFFD|\\uD83E\\uDD39\\uD83C\\uDFFC|\\uD83E\\uDD39\\uD83C\\uDFFB|\\uD83E\\uDD38\\uD83C\\uDFFF|\\uD83E\\uDD38\\uD83C\\uDFFE|\\uD83E\\uDD38\\uD83C\\uDFFD|\\uD83E\\uDD38\\uD83C\\uDFFC|\\uD83E\\uDD38\\uD83C\\uDFFB|\\uD83E\\uDD37\\uD83C\\uDFFF|\\uD83E\\uDD37\\uD83C\\uDFFE|\\uD83E\\uDD37\\uD83C\\uDFFD|\\uD83E\\uDD37\\uD83C\\uDFFC|\\uD83E\\uDD37\\uD83C\\uDFFB|\\uD83E\\uDD36\\uD83C\\uDFFF|\\uD83E\\uDD36\\uD83C\\uDFFE|\\uD83E\\uDD36\\uD83C\\uDFFD|\\uD83E\\uDD36\\uD83C\\uDFFC|\\uD83E\\uDD36\\uD83C\\uDFFB|\\uD83E\\uDD35\\uD83C\\uDFFF|\\uD83E\\uDD35\\uD83C\\uDFFE|\\uD83E\\uDD35\\uD83C\\uDFFD|\\uD83E\\uDD35\\uD83C\\uDFFC|\\uD83E\\uDD35\\uD83C\\uDFFB|\\uD83E\\uDD34\\uD83C\\uDFFF|\\uD83E\\uDD34\\uD83C\\uDFFE|\\uD83E\\uDD34\\uD83C\\uDFFD|\\uD83E\\uDD34\\uD83C\\uDFFC|\\uD83E\\uDD34\\uD83C\\uDFFB|\\uD83E\\uDD33\\uD83C\\uDFFF|\\uD83E\\uDD33\\uD83C\\uDFFE|\\uD83E\\uDD33\\uD83C\\uDFFD|\\uD83E\\uDD33\\uD83C\\uDFFC|\\uD83E\\uDD33\\uD83C\\uDFFB|\\uD83E\\uDD30\\uD83C\\uDFFF|\\uD83E\\uDD30\\uD83C\\uDFFE|\\uD83E\\uDD30\\uD83C\\uDFFD|\\uD83E\\uDD30\\uD83C\\uDFFC|\\uD83E\\uDD30\\uD83C\\uDFFB|\\uD83E\\uDD26\\uD83C\\uDFFF|\\uD83E\\uDD26\\uD83C\\uDFFE|\\uD83E\\uDD26\\uD83C\\uDFFD|\\uD83E\\uDD26\\uD83C\\uDFFC|\\uD83E\\uDD26\\uD83C\\uDFFB|\\uD83E\\uDD1E\\uD83C\\uDFFF|\\uD83E\\uDD1E\\uD83C\\uDFFE|\\uD83E\\uDD1E\\uD83C\\uDFFD|\\uD83E\\uDD1E\\uD83C\\uDFFC|\\uD83E\\uDD1E\\uD83C\\uDFFB|\\uD83E\\uDD1D\\uD83C\\uDFFF|\\uD83E\\uDD1D\\uD83C\\uDFFE|\\uD83E\\uDD1D\\uD83C\\uDFFD|\\uD83E\\uDD1D\\uD83C\\uDFFC|\\uD83E\\uDD1D\\uD83C\\uDFFB|\\uD83E\\uDD1C\\uD83C\\uDFFF|\\uD83E\\uDD1C\\uD83C\\uDFFE|\\uD83E\\uDD1C\\uD83C\\uDFFD|\\uD83E\\uDD1C\\uD83C\\uDFFC|\\uD83E\\uDD1C\\uD83C\\uDFFB|\\uD83E\\uDD1B\\uD83C\\uDFFF|\\uD83E\\uDD1B\\uD83C\\uDFFE|\\uD83E\\uDD1B\\uD83C\\uDFFD|\\uD83E\\uDD1B\\uD83C\\uDFFC|\\uD83E\\uDD1B\\uD83C\\uDFFB|\\uD83E\\uDD1A\\uD83C\\uDFFF|\\uD83E\\uDD1A\\uD83C\\uDFFE|\\uD83E\\uDD1A\\uD83C\\uDFFD|\\uD83E\\uDD1A\\uD83C\\uDFFC|\\uD83E\\uDD1A\\uD83C\\uDFFB|\\uD83E\\uDD19\\uD83C\\uDFFF|\\uD83E\\uDD19\\uD83C\\uDFFE|\\uD83E\\uDD19\\uD83C\\uDFFD|\\uD83E\\uDD19\\uD83C\\uDFFC|\\uD83E\\uDD19\\uD83C\\uDFFB|\\uD83E\\uDD18\\uD83C\\uDFFF|\\uD83E\\uDD18\\uD83C\\uDFFE|\\uD83E\\uDD18\\uD83C\\uDFFD|\\uD83E\\uDD18\\uD83C\\uDFFC|\\uD83E\\uDD18\\uD83C\\uDFFB|\\uD83D\\uDEC0\\uD83C\\uDFFF|\\uD83D\\uDEC0\\uD83C\\uDFFE|\\uD83D\\uDEC0\\uD83C\\uDFFD|\\uD83D\\uDEC0\\uD83C\\uDFFC|\\uD83D\\uDEC0\\uD83C\\uDFFB|\\uD83D\\uDEB6\\uD83C\\uDFFF|\\uD83D\\uDEB6\\uD83C\\uDFFE|\\uD83D\\uDEB6\\uD83C\\uDFFD|\\uD83D\\uDEB6\\uD83C\\uDFFC|\\uD83D\\uDEB6\\uD83C\\uDFFB|\\uD83D\\uDEB5\\uD83C\\uDFFF|\\uD83D\\uDEB5\\uD83C\\uDFFE|\\uD83D\\uDEB5\\uD83C\\uDFFD|\\uD83D\\uDEB5\\uD83C\\uDFFC|\\uD83D\\uDEB5\\uD83C\\uDFFB|\\uD83D\\uDEB4\\uD83C\\uDFFF|\\uD83D\\uDEB4\\uD83C\\uDFFE|\\uD83D\\uDEB4\\uD83C\\uDFFD|\\uD83D\\uDEB4\\uD83C\\uDFFC|\\uD83D\\uDEB4\\uD83C\\uDFFB|\\uD83D\\uDEA3\\uD83C\\uDFFF|\\uD83D\\uDEA3\\uD83C\\uDFFE|\\uD83D\\uDEA3\\uD83C\\uDFFD|\\uD83D\\uDEA3\\uD83C\\uDFFC|\\uD83D\\uDEA3\\uD83C\\uDFFB|\\uD83D\\uDE4F\\uD83C\\uDFFF|\\uD83D\\uDE4F\\uD83C\\uDFFE|\\uD83D\\uDE4F\\uD83C\\uDFFD|\\uD83D\\uDE4F\\uD83C\\uDFFC|\\uD83D\\uDE4F\\uD83C\\uDFFB|\\uD83D\\uDE4E\\uD83C\\uDFFF|\\uD83D\\uDE4E\\uD83C\\uDFFE|\\uD83D\\uDE4E\\uD83C\\uDFFD|\\uD83D\\uDE4E\\uD83C\\uDFFC|\\uD83D\\uDE4E\\uD83C\\uDFFB|\\uD83D\\uDE4D\\uD83C\\uDFFF|\\uD83D\\uDE4D\\uD83C\\uDFFE|\\uD83D\\uDE4D\\uD83C\\uDFFD|\\uD83D\\uDE4D\\uD83C\\uDFFC|\\uD83D\\uDE4D\\uD83C\\uDFFB|\\uD83D\\uDE4C\\uD83C\\uDFFF|\\uD83D\\uDE4C\\uD83C\\uDFFE|\\uD83D\\uDE4C\\uD83C\\uDFFD|\\uD83D\\uDE4C\\uD83C\\uDFFC|\\uD83D\\uDE4C\\uD83C\\uDFFB|\\uD83D\\uDE4B\\uD83C\\uDFFF|\\uD83D\\uDE4B\\uD83C\\uDFFE|\\uD83D\\uDE4B\\uD83C\\uDFFD|\\uD83D\\uDE4B\\uD83C\\uDFFC|\\uD83D\\uDE4B\\uD83C\\uDFFB|\\uD83D\\uDE47\\uD83C\\uDFFF|\\uD83D\\uDE47\\uD83C\\uDFFE|\\uD83D\\uDE47\\uD83C\\uDFFD|\\uD83D\\uDE47\\uD83C\\uDFFC|\\uD83D\\uDE47\\uD83C\\uDFFB|\\uD83D\\uDE46\\uD83C\\uDFFF|\\uD83D\\uDE46\\uD83C\\uDFFE|\\uD83D\\uDE46\\uD83C\\uDFFD|\\uD83D\\uDE46\\uD83C\\uDFFC|\\uD83D\\uDE46\\uD83C\\uDFFB|\\uD83D\\uDE45\\uD83C\\uDFFF|\\uD83D\\uDE45\\uD83C\\uDFFE|\\uD83D\\uDE45\\uD83C\\uDFFD|\\uD83D\\uDE45\\uD83C\\uDFFC|\\uD83D\\uDE45\\uD83C\\uDFFB|\\uD83D\\uDD96\\uD83C\\uDFFF|\\uD83D\\uDD96\\uD83C\\uDFFE|\\uD83D\\uDD96\\uD83C\\uDFFD|\\uD83D\\uDD96\\uD83C\\uDFFC|\\uD83D\\uDD96\\uD83C\\uDFFB|\\uD83D\\uDD95\\uD83C\\uDFFF|\\uD83D\\uDD95\\uD83C\\uDFFE|\\uD83D\\uDD95\\uD83C\\uDFFD|\\uD83D\\uDD95\\uD83C\\uDFFC|\\uD83D\\uDD95\\uD83C\\uDFFB|\\uD83D\\uDD90\\uD83C\\uDFFF|\\uD83D\\uDD90\\uD83C\\uDFFE|\\uD83D\\uDD90\\uD83C\\uDFFD|\\uD83D\\uDD90\\uD83C\\uDFFC|\\uD83D\\uDD90\\uD83C\\uDFFB|\\uD83D\\uDD7A\\uD83C\\uDFFF|\\uD83D\\uDD7A\\uD83C\\uDFFE|\\uD83D\\uDD7A\\uD83C\\uDFFD|\\uD83D\\uDD7A\\uD83C\\uDFFC|\\uD83D\\uDD7A\\uD83C\\uDFFB|\\uD83D\\uDD75\\uD83C\\uDFFF|\\uD83D\\uDD75\\uD83C\\uDFFE|\\uD83D\\uDD75\\uD83C\\uDFFD|\\uD83D\\uDD75\\uD83C\\uDFFC|\\uD83D\\uDD75\\uD83C\\uDFFB|\\uD83D\\uDCAA\\uD83C\\uDFFF|\\uD83D\\uDCAA\\uD83C\\uDFFE|\\uD83D\\uDCAA\\uD83C\\uDFFD|\\uD83D\\uDCAA\\uD83C\\uDFFC|\\uD83D\\uDCAA\\uD83C\\uDFFB|\\uD83D\\uDC87\\uD83C\\uDFFF|\\uD83D\\uDC87\\uD83C\\uDFFE|\\uD83D\\uDC87\\uD83C\\uDFFD|\\uD83D\\uDC87\\uD83C\\uDFFC|\\uD83D\\uDC87\\uD83C\\uDFFB|\\uD83D\\uDC86\\uD83C\\uDFFF|\\uD83D\\uDC86\\uD83C\\uDFFE|\\uD83D\\uDC86\\uD83C\\uDFFD|\\uD83D\\uDC86\\uD83C\\uDFFC|\\uD83D\\uDC86\\uD83C\\uDFFB|\\uD83D\\uDC85\\uD83C\\uDFFF|\\uD83D\\uDC85\\uD83C\\uDFFE|\\uD83D\\uDC85\\uD83C\\uDFFD|\\uD83D\\uDC85\\uD83C\\uDFFC|\\uD83D\\uDC85\\uD83C\\uDFFB|\\uD83D\\uDC83\\uD83C\\uDFFF|\\uD83D\\uDC83\\uD83C\\uDFFE|\\uD83D\\uDC83\\uD83C\\uDFFD|\\uD83D\\uDC83\\uD83C\\uDFFC|\\uD83D\\uDC83\\uD83C\\uDFFB|\\uD83D\\uDC82\\uD83C\\uDFFF|\\uD83D\\uDC82\\uD83C\\uDFFE|\\uD83D\\uDC82\\uD83C\\uDFFD|\\uD83D\\uDC82\\uD83C\\uDFFC|\\uD83D\\uDC82\\uD83C\\uDFFB|\\uD83D\\uDC81\\uD83C\\uDFFF|\\uD83D\\uDC81\\uD83C\\uDFFE|\\uD83D\\uDC81\\uD83C\\uDFFD|\\uD83D\\uDC81\\uD83C\\uDFFC|\\uD83D\\uDC81\\uD83C\\uDFFB|\\uD83D\\uDC7C\\uD83C\\uDFFF|\\uD83D\\uDC7C\\uD83C\\uDFFE|\\uD83D\\uDC7C\\uD83C\\uDFFD|\\uD83D\\uDC7C\\uD83C\\uDFFC|\\uD83D\\uDC7C\\uD83C\\uDFFB|\\uD83D\\uDC78\\uD83C\\uDFFF|\\uD83D\\uDC78\\uD83C\\uDFFE|\\uD83D\\uDC78\\uD83C\\uDFFD|\\uD83D\\uDC78\\uD83C\\uDFFC|\\uD83D\\uDC78\\uD83C\\uDFFB|\\uD83D\\uDC77\\uD83C\\uDFFF|\\uD83D\\uDC77\\uD83C\\uDFFE|\\uD83D\\uDC77\\uD83C\\uDFFD|\\uD83D\\uDC77\\uD83C\\uDFFC|\\uD83D\\uDC77\\uD83C\\uDFFB|\\uD83D\\uDC76\\uD83C\\uDFFF|\\uD83D\\uDC76\\uD83C\\uDFFE|\\uD83D\\uDC76\\uD83C\\uDFFD|\\uD83D\\uDC76\\uD83C\\uDFFC|\\uD83D\\uDC76\\uD83C\\uDFFB|\\uD83D\\uDC75\\uD83C\\uDFFF|\\uD83D\\uDC75\\uD83C\\uDFFE|\\uD83D\\uDC75\\uD83C\\uDFFD|\\uD83D\\uDC75\\uD83C\\uDFFC|\\uD83D\\uDC75\\uD83C\\uDFFB|\\uD83D\\uDC74\\uD83C\\uDFFF|\\uD83D\\uDC74\\uD83C\\uDFFE|\\uD83D\\uDC74\\uD83C\\uDFFD|\\uD83D\\uDC74\\uD83C\\uDFFC|\\uD83D\\uDC74\\uD83C\\uDFFB|\\uD83D\\uDC73\\uD83C\\uDFFF|\\uD83D\\uDC73\\uD83C\\uDFFE|\\uD83D\\uDC73\\uD83C\\uDFFD|\\uD83D\\uDC73\\uD83C\\uDFFC|\\uD83D\\uDC73\\uD83C\\uDFFB|\\uD83D\\uDC72\\uD83C\\uDFFF|\\uD83D\\uDC72\\uD83C\\uDFFE|\\uD83D\\uDC72\\uD83C\\uDFFD|\\uD83D\\uDC72\\uD83C\\uDFFC|\\uD83D\\uDC72\\uD83C\\uDFFB|\\uD83D\\uDC71\\uD83C\\uDFFF|\\uD83D\\uDC71\\uD83C\\uDFFE|\\uD83D\\uDC71\\uD83C\\uDFFD|\\uD83D\\uDC71\\uD83C\\uDFFC|\\uD83D\\uDC71\\uD83C\\uDFFB|\\uD83D\\uDC70\\uD83C\\uDFFF|\\uD83D\\uDC70\\uD83C\\uDFFE|\\uD83D\\uDC70\\uD83C\\uDFFD|\\uD83D\\uDC70\\uD83C\\uDFFC|\\uD83D\\uDC70\\uD83C\\uDFFB|\\uD83D\\uDC6E\\uD83C\\uDFFF|\\uD83D\\uDC6E\\uD83C\\uDFFE|\\uD83D\\uDC6E\\uD83C\\uDFFD|\\uD83D\\uDC6E\\uD83C\\uDFFC|\\uD83D\\uDC6E\\uD83C\\uDFFB|\\uD83D\\uDC69\\uD83C\\uDFFF|\\uD83D\\uDC69\\uD83C\\uDFFE|\\uD83D\\uDC69\\uD83C\\uDFFD|\\uD83D\\uDC69\\uD83C\\uDFFC|\\uD83D\\uDC69\\uD83C\\uDFFB|\\uD83D\\uDC68\\uD83C\\uDFFF|\\uD83D\\uDC68\\uD83C\\uDFFE|\\uD83D\\uDC68\\uD83C\\uDFFD|\\uD83D\\uDC68\\uD83C\\uDFFC|\\uD83D\\uDC68\\uD83C\\uDFFB|\\uD83D\\uDC67\\uD83C\\uDFFF|\\uD83D\\uDC67\\uD83C\\uDFFE|\\uD83D\\uDC67\\uD83C\\uDFFD|\\uD83D\\uDC67\\uD83C\\uDFFC|\\uD83D\\uDC67\\uD83C\\uDFFB|\\uD83D\\uDC66\\uD83C\\uDFFF|\\uD83D\\uDC66\\uD83C\\uDFFE|\\uD83D\\uDC66\\uD83C\\uDFFD|\\uD83D\\uDC66\\uD83C\\uDFFC|\\uD83D\\uDC66\\uD83C\\uDFFB|\\uD83D\\uDC50\\uD83C\\uDFFF|\\uD83D\\uDC50\\uD83C\\uDFFE|\\uD83D\\uDC50\\uD83C\\uDFFD|\\uD83D\\uDC50\\uD83C\\uDFFC|\\uD83D\\uDC50\\uD83C\\uDFFB|\\uD83D\\uDC4F\\uD83C\\uDFFF|\\uD83D\\uDC4F\\uD83C\\uDFFE|\\uD83D\\uDC4F\\uD83C\\uDFFD|\\uD83D\\uDC4F\\uD83C\\uDFFC|\\uD83D\\uDC4F\\uD83C\\uDFFB|\\uD83D\\uDC4E\\uD83C\\uDFFF|\\uD83D\\uDC4E\\uD83C\\uDFFE|\\uD83D\\uDC4E\\uD83C\\uDFFD|\\uD83D\\uDC4E\\uD83C\\uDFFC|\\uD83D\\uDC4E\\uD83C\\uDFFB|\\uD83D\\uDC4D\\uD83C\\uDFFF|\\uD83D\\uDC4D\\uD83C\\uDFFE|\\uD83D\\uDC4D\\uD83C\\uDFFD|\\uD83D\\uDC4D\\uD83C\\uDFFC|\\uD83D\\uDC4D\\uD83C\\uDFFB|\\uD83D\\uDC4C\\uD83C\\uDFFF|\\uD83D\\uDC4C\\uD83C\\uDFFE|\\uD83D\\uDC4C\\uD83C\\uDFFD|\\uD83D\\uDC4C\\uD83C\\uDFFC|\\uD83D\\uDC4C\\uD83C\\uDFFB|\\uD83D\\uDC4B\\uD83C\\uDFFF|\\uD83D\\uDC4B\\uD83C\\uDFFE|\\uD83D\\uDC4B\\uD83C\\uDFFD|\\uD83D\\uDC4B\\uD83C\\uDFFC|\\uD83D\\uDC4B\\uD83C\\uDFFB|\\uD83D\\uDC4A\\uD83C\\uDFFF|\\uD83D\\uDC4A\\uD83C\\uDFFE|\\uD83D\\uDC4A\\uD83C\\uDFFD|\\uD83D\\uDC4A\\uD83C\\uDFFC|\\uD83D\\uDC4A\\uD83C\\uDFFB|\\uD83D\\uDC49\\uD83C\\uDFFF|\\uD83D\\uDC49\\uD83C\\uDFFE|\\uD83D\\uDC49\\uD83C\\uDFFD|\\uD83D\\uDC49\\uD83C\\uDFFC|\\uD83D\\uDC49\\uD83C\\uDFFB|\\uD83D\\uDC48\\uD83C\\uDFFF|\\uD83D\\uDC48\\uD83C\\uDFFE|\\uD83D\\uDC48\\uD83C\\uDFFD|\\uD83D\\uDC48\\uD83C\\uDFFC|\\uD83D\\uDC48\\uD83C\\uDFFB|\\uD83D\\uDC47\\uD83C\\uDFFF|\\uD83D\\uDC47\\uD83C\\uDFFE|\\uD83D\\uDC47\\uD83C\\uDFFD|\\uD83D\\uDC47\\uD83C\\uDFFC|\\uD83D\\uDC47\\uD83C\\uDFFB|\\uD83D\\uDC46\\uD83C\\uDFFF|\\uD83D\\uDC46\\uD83C\\uDFFE|\\uD83D\\uDC46\\uD83C\\uDFFD|\\uD83D\\uDC46\\uD83C\\uDFFC|\\uD83D\\uDC46\\uD83C\\uDFFB|\\uD83D\\uDC43\\uD83C\\uDFFF|\\uD83D\\uDC43\\uD83C\\uDFFE|\\uD83D\\uDC43\\uD83C\\uDFFD|\\uD83D\\uDC43\\uD83C\\uDFFC|\\uD83D\\uDC43\\uD83C\\uDFFB|\\uD83D\\uDC42\\uD83C\\uDFFF|\\uD83D\\uDC42\\uD83C\\uDFFE|\\uD83D\\uDC42\\uD83C\\uDFFD|\\uD83D\\uDC42\\uD83C\\uDFFC|\\uD83D\\uDC42\\uD83C\\uDFFB|\\uD83C\\uDFCB\\uD83C\\uDFFF|\\uD83C\\uDFCB\\uD83C\\uDFFE|\\uD83C\\uDFF3\\uD83C\\uDF08|\\uD83C\\uDFCB\\uD83C\\uDFFC|\\uD83C\\uDFCB\\uD83C\\uDFFB|\\uD83C\\uDFCA\\uD83C\\uDFFF|\\uD83C\\uDFCA\\uD83C\\uDFFE|\\uD83C\\uDFCA\\uD83C\\uDFFD|\\uD83C\\uDFCA\\uD83C\\uDFFC|\\uD83C\\uDFCA\\uD83C\\uDFFB|\\uD83C\\uDFC7\\uD83C\\uDFFF|\\uD83C\\uDFC7\\uD83C\\uDFFE|\\uD83C\\uDFC7\\uD83C\\uDFFD|\\uD83C\\uDFC7\\uD83C\\uDFFC|\\uD83C\\uDFC7\\uD83C\\uDFFB|\\uD83C\\uDFC4\\uD83C\\uDFFF|\\uD83C\\uDFCB\\uD83C\\uDFFD|\\uD83C\\uDFC4\\uD83C\\uDFFD|\\uD83C\\uDFC4\\uD83C\\uDFFC|\\uD83C\\uDFC4\\uD83C\\uDFFB|\\uD83C\\uDFC3\\uD83C\\uDFFF|\\uD83C\\uDFC3\\uD83C\\uDFFE|\\uD83C\\uDFC3\\uD83C\\uDFFD|\\uD83C\\uDFC3\\uD83C\\uDFFC|\\uD83C\\uDFC3\\uD83C\\uDFFB|\\uD83C\\uDF85\\uD83C\\uDFFF|\\uD83C\\uDF85\\uD83C\\uDFFE|\\uD83C\\uDF85\\uD83C\\uDFFD|\\uD83C\\uDF85\\uD83C\\uDFFC|\\uD83C\\uDF85\\uD83C\\uDFFB|\\uD83C\\uDDFF\\uD83C\\uDDFC|\\uD83C\\uDDFF\\uD83C\\uDDF2|\\uD83C\\uDDFF\\uD83C\\uDDE6|\\uD83C\\uDDFE\\uD83C\\uDDF9|\\uD83C\\uDDFE\\uD83C\\uDDEA|\\uD83C\\uDDFD\\uD83C\\uDDF0|\\uD83C\\uDDFC\\uD83C\\uDDF8|\\uD83C\\uDDFC\\uD83C\\uDDEB|\\uD83C\\uDDFB\\uD83C\\uDDFA|\\uD83C\\uDDFB\\uD83C\\uDDF3|\\uD83C\\uDDFB\\uD83C\\uDDEE|\\uD83C\\uDDFB\\uD83C\\uDDEC|\\uD83C\\uDDFB\\uD83C\\uDDEA|\\uD83C\\uDDFB\\uD83C\\uDDE8|\\uD83C\\uDDFB\\uD83C\\uDDE6|\\uD83C\\uDDFA\\uD83C\\uDDFF|\\uD83C\\uDDFA\\uD83C\\uDDFE|\\uD83C\\uDDFA\\uD83C\\uDDF8|\\uD83C\\uDDFA\\uD83C\\uDDF2|\\uD83C\\uDDFA\\uD83C\\uDDEC|\\uD83C\\uDDFA\\uD83C\\uDDE6|\\uD83C\\uDDF9\\uD83C\\uDDFF|\\uD83C\\uDDF9\\uD83C\\uDDFC|\\uD83C\\uDDF9\\uD83C\\uDDFB|\\uD83C\\uDDF9\\uD83C\\uDDF9|\\uD83C\\uDDF9\\uD83C\\uDDF7|\\uD83C\\uDDF9\\uD83C\\uDDF4|\\uD83C\\uDDF9\\uD83C\\uDDF3|\\uD83C\\uDDF9\\uD83C\\uDDF2|\\uD83C\\uDDF9\\uD83C\\uDDF1|\\uD83C\\uDDF9\\uD83C\\uDDF0|\\uD83C\\uDDF9\\uD83C\\uDDEF|\\uD83C\\uDDF9\\uD83C\\uDDED|\\uD83C\\uDDF9\\uD83C\\uDDEC|\\uD83C\\uDDF9\\uD83C\\uDDEB|\\uD83C\\uDDF9\\uD83C\\uDDE9|\\uD83C\\uDDF9\\uD83C\\uDDE8|\\uD83C\\uDDF9\\uD83C\\uDDE6|\\uD83C\\uDDF8\\uD83C\\uDDFF|\\uD83C\\uDDF8\\uD83C\\uDDFE|\\uD83C\\uDDF8\\uD83C\\uDDFD|\\uD83C\\uDDF8\\uD83C\\uDDFB|\\uD83C\\uDDF8\\uD83C\\uDDF9|\\uD83C\\uDDF8\\uD83C\\uDDF8|\\uD83C\\uDDF8\\uD83C\\uDDF7|\\uD83C\\uDDF8\\uD83C\\uDDF4|\\uD83C\\uDDF8\\uD83C\\uDDF3|\\uD83C\\uDDF8\\uD83C\\uDDF2|\\uD83C\\uDDF8\\uD83C\\uDDF1|\\uD83C\\uDDF8\\uD83C\\uDDF0|\\uD83C\\uDDF8\\uD83C\\uDDEF|\\uD83C\\uDDF8\\uD83C\\uDDEE|\\uD83C\\uDDF8\\uD83C\\uDDED|\\uD83C\\uDDF8\\uD83C\\uDDEC|\\uD83C\\uDDF8\\uD83C\\uDDEA|\\uD83C\\uDDF8\\uD83C\\uDDE9|\\uD83C\\uDDF8\\uD83C\\uDDE8|\\uD83C\\uDDF8\\uD83C\\uDDE7|\\uD83C\\uDDF8\\uD83C\\uDDE6|\\uD83C\\uDDF7\\uD83C\\uDDFC|\\uD83C\\uDDF7\\uD83C\\uDDFA|\\uD83C\\uDDF7\\uD83C\\uDDF8|\\uD83C\\uDDF7\\uD83C\\uDDF4|\\uD83C\\uDDF7\\uD83C\\uDDEA|\\uD83C\\uDDF6\\uD83C\\uDDE6|\\uD83C\\uDDF5\\uD83C\\uDDFE|\\uD83C\\uDDF5\\uD83C\\uDDFC|\\uD83C\\uDDF5\\uD83C\\uDDF9|\\uD83C\\uDDF5\\uD83C\\uDDF8|\\uD83C\\uDDF5\\uD83C\\uDDF7|\\uD83C\\uDDF5\\uD83C\\uDDF3|\\uD83C\\uDDF5\\uD83C\\uDDF2|\\uD83C\\uDDF5\\uD83C\\uDDF1|\\uD83C\\uDDF5\\uD83C\\uDDF0|\\uD83C\\uDDF5\\uD83C\\uDDED|\\uD83C\\uDDF5\\uD83C\\uDDEC|\\uD83C\\uDDF5\\uD83C\\uDDEB|\\uD83C\\uDDF5\\uD83C\\uDDEA|\\uD83C\\uDDF5\\uD83C\\uDDE6|\\uD83C\\uDDF4\\uD83C\\uDDF2|\\uD83C\\uDDF3\\uD83C\\uDDFF|\\uD83C\\uDDF3\\uD83C\\uDDFA|\\uD83C\\uDDF3\\uD83C\\uDDF7|\\uD83C\\uDDF3\\uD83C\\uDDF5|\\uD83C\\uDDF3\\uD83C\\uDDF4|\\uD83C\\uDDF3\\uD83C\\uDDF1|\\uD83C\\uDDF3\\uD83C\\uDDEE|\\uD83C\\uDDF3\\uD83C\\uDDEC|\\uD83C\\uDDF3\\uD83C\\uDDEB|\\uD83C\\uDDF3\\uD83C\\uDDEA|\\uD83C\\uDDF3\\uD83C\\uDDE8|\\uD83C\\uDDF3\\uD83C\\uDDE6|\\uD83C\\uDDF2\\uD83C\\uDDFF|\\uD83C\\uDDF2\\uD83C\\uDDFE|\\uD83C\\uDDF2\\uD83C\\uDDFD|\\uD83C\\uDDF2\\uD83C\\uDDFC|\\uD83C\\uDDF2\\uD83C\\uDDFB|\\uD83C\\uDDF2\\uD83C\\uDDFA|\\uD83C\\uDDF2\\uD83C\\uDDF9|\\uD83C\\uDDF2\\uD83C\\uDDF8|\\uD83C\\uDDF2\\uD83C\\uDDF7|\\uD83C\\uDDF2\\uD83C\\uDDF6|\\uD83C\\uDDF2\\uD83C\\uDDF5|\\uD83C\\uDDF2\\uD83C\\uDDF4|\\uD83C\\uDDF2\\uD83C\\uDDF3|\\uD83C\\uDDF2\\uD83C\\uDDF2|\\uD83C\\uDDF2\\uD83C\\uDDF1|\\uD83C\\uDDF2\\uD83C\\uDDF0|\\uD83C\\uDDF2\\uD83C\\uDDED|\\uD83C\\uDDF2\\uD83C\\uDDEC|\\uD83C\\uDDF2\\uD83C\\uDDEB|\\uD83C\\uDDF2\\uD83C\\uDDEA|\\uD83C\\uDDF2\\uD83C\\uDDE9|\\uD83C\\uDDF2\\uD83C\\uDDE8|\\uD83C\\uDDF2\\uD83C\\uDDE6|\\uD83C\\uDDF1\\uD83C\\uDDFE|\\uD83C\\uDDF1\\uD83C\\uDDFB|\\uD83C\\uDDF1\\uD83C\\uDDFA|\\uD83C\\uDDF1\\uD83C\\uDDF9|\\uD83C\\uDDF1\\uD83C\\uDDF8|\\uD83C\\uDDF1\\uD83C\\uDDF7|\\uD83C\\uDDF1\\uD83C\\uDDF0|\\uD83C\\uDDF1\\uD83C\\uDDEE|\\uD83C\\uDDF1\\uD83C\\uDDE8|\\uD83C\\uDDF1\\uD83C\\uDDE7|\\uD83C\\uDDF1\\uD83C\\uDDE6|\\uD83C\\uDDF0\\uD83C\\uDDFF|\\uD83C\\uDDF0\\uD83C\\uDDFE|\\uD83C\\uDDF0\\uD83C\\uDDFC|\\uD83C\\uDDF0\\uD83C\\uDDF7|\\uD83C\\uDDF0\\uD83C\\uDDF5|\\uD83C\\uDDF0\\uD83C\\uDDF3|\\uD83C\\uDDF0\\uD83C\\uDDF2|\\uD83C\\uDDF0\\uD83C\\uDDEE|\\uD83C\\uDDF0\\uD83C\\uDDED|\\uD83C\\uDDF0\\uD83C\\uDDEC|\\uD83C\\uDDF0\\uD83C\\uDDEA|\\uD83C\\uDDEF\\uD83C\\uDDF5|\\uD83C\\uDDEF\\uD83C\\uDDF4|\\uD83C\\uDDEF\\uD83C\\uDDF2|\\uD83C\\uDDEF\\uD83C\\uDDEA|\\uD83C\\uDDEE\\uD83C\\uDDF9|\\uD83C\\uDDEE\\uD83C\\uDDF8|\\uD83C\\uDDEE\\uD83C\\uDDF7|\\uD83C\\uDDEE\\uD83C\\uDDF6|\\uD83C\\uDDEE\\uD83C\\uDDF4|\\uD83C\\uDDEE\\uD83C\\uDDF3|\\uD83C\\uDDEE\\uD83C\\uDDF2|\\uD83C\\uDDEE\\uD83C\\uDDF1|\\uD83C\\uDDEE\\uD83C\\uDDEA|\\uD83C\\uDDEE\\uD83C\\uDDE9|\\uD83C\\uDDEE\\uD83C\\uDDE8|\\uD83C\\uDDED\\uD83C\\uDDFA|\\uD83C\\uDDED\\uD83C\\uDDF9|\\uD83C\\uDDED\\uD83C\\uDDF7|\\uD83C\\uDDED\\uD83C\\uDDF3|\\uD83C\\uDDED\\uD83C\\uDDF2|\\uD83C\\uDDED\\uD83C\\uDDF0|\\uD83C\\uDDEC\\uD83C\\uDDFE|\\uD83C\\uDDEC\\uD83C\\uDDFC|\\uD83C\\uDDEC\\uD83C\\uDDFA|\\uD83C\\uDDEC\\uD83C\\uDDF9|\\uD83C\\uDDEC\\uD83C\\uDDF8|\\uD83C\\uDDEC\\uD83C\\uDDF7|\\uD83C\\uDDEC\\uD83C\\uDDF6|\\uD83C\\uDDEC\\uD83C\\uDDF5|\\uD83C\\uDDEC\\uD83C\\uDDF3|\\uD83C\\uDDEC\\uD83C\\uDDF2|\\uD83C\\uDDEC\\uD83C\\uDDF1|\\uD83C\\uDDEC\\uD83C\\uDDEE|\\uD83C\\uDDEC\\uD83C\\uDDED|\\uD83C\\uDDEC\\uD83C\\uDDEC|\\uD83C\\uDDEC\\uD83C\\uDDEB|\\uD83C\\uDDEC\\uD83C\\uDDEA|\\uD83C\\uDDEC\\uD83C\\uDDE9|\\uD83C\\uDDEC\\uD83C\\uDDE7|\\uD83C\\uDDEC\\uD83C\\uDDE6|\\uD83C\\uDDEB\\uD83C\\uDDF7|\\uD83C\\uDDEB\\uD83C\\uDDF4|\\uD83C\\uDDEB\\uD83C\\uDDF2|\\uD83C\\uDDEB\\uD83C\\uDDF0|\\uD83C\\uDDEB\\uD83C\\uDDEF|\\uD83C\\uDDEB\\uD83C\\uDDEE|\\uD83C\\uDDEA\\uD83C\\uDDFA|\\uD83C\\uDDEA\\uD83C\\uDDF9|\\uD83C\\uDDEA\\uD83C\\uDDF8|\\uD83C\\uDDEA\\uD83C\\uDDF7|\\uD83C\\uDDEA\\uD83C\\uDDED|\\uD83C\\uDDEA\\uD83C\\uDDEC|\\uD83C\\uDDEA\\uD83C\\uDDEA|\\uD83C\\uDDEA\\uD83C\\uDDE8|\\uD83C\\uDDEA\\uD83C\\uDDE6|\\uD83C\\uDDE9\\uD83C\\uDDFF|\\uD83C\\uDDE9\\uD83C\\uDDF4|\\uD83C\\uDDE9\\uD83C\\uDDF2|\\uD83C\\uDDE9\\uD83C\\uDDF0|\\uD83C\\uDDE9\\uD83C\\uDDEF|\\uD83C\\uDDE9\\uD83C\\uDDEC|\\uD83C\\uDDE9\\uD83C\\uDDEA|\\uD83C\\uDDE8\\uD83C\\uDDFF|\\uD83C\\uDDE8\\uD83C\\uDDFE|\\uD83C\\uDDE8\\uD83C\\uDDFD|\\uD83C\\uDDE8\\uD83C\\uDDFC|\\uD83C\\uDDE8\\uD83C\\uDDFB|\\uD83C\\uDDE8\\uD83C\\uDDFA|\\uD83C\\uDDE8\\uD83C\\uDDF7|\\uD83C\\uDDE8\\uD83C\\uDDF5|\\uD83C\\uDDE8\\uD83C\\uDDF4|\\uD83C\\uDDE8\\uD83C\\uDDF3|\\uD83C\\uDDE8\\uD83C\\uDDF2|\\uD83C\\uDDE8\\uD83C\\uDDF1|\\uD83C\\uDDE8\\uD83C\\uDDF0|\\uD83C\\uDDE8\\uD83C\\uDDEE|\\uD83C\\uDDE8\\uD83C\\uDDED|\\uD83C\\uDDE8\\uD83C\\uDDEC|\\uD83C\\uDDE8\\uD83C\\uDDEB|\\uD83C\\uDDE8\\uD83C\\uDDE9|\\uD83C\\uDDE8\\uD83C\\uDDE8|\\uD83C\\uDDE8\\uD83C\\uDDE6|\\uD83C\\uDDE7\\uD83C\\uDDFF|\\uD83C\\uDDE7\\uD83C\\uDDFE|\\uD83C\\uDDE7\\uD83C\\uDDFC|\\uD83C\\uDDE7\\uD83C\\uDDFB|\\uD83C\\uDDE7\\uD83C\\uDDF9|\\uD83C\\uDDE7\\uD83C\\uDDF8|\\uD83C\\uDDE7\\uD83C\\uDDF7|\\uD83C\\uDDE7\\uD83C\\uDDF6|\\uD83C\\uDDE7\\uD83C\\uDDF4|\\uD83C\\uDDE7\\uD83C\\uDDF3|\\uD83C\\uDDE7\\uD83C\\uDDF2|\\uD83C\\uDDE7\\uD83C\\uDDF1|\\uD83C\\uDDE7\\uD83C\\uDDEF|\\uD83C\\uDDE7\\uD83C\\uDDEE|\\uD83C\\uDDE7\\uD83C\\uDDED|\\uD83C\\uDDE7\\uD83C\\uDDEC|\\uD83C\\uDDE7\\uD83C\\uDDEB|\\uD83C\\uDDE7\\uD83C\\uDDEA|\\uD83C\\uDDE7\\uD83C\\uDDE9|\\uD83C\\uDDE7\\uD83C\\uDDE7|\\uD83C\\uDDE7\\uD83C\\uDDE6|\\uD83C\\uDDE6\\uD83C\\uDDFF|\\uD83C\\uDDE6\\uD83C\\uDDFD|\\uD83C\\uDDE6\\uD83C\\uDDFC|\\uD83C\\uDDE6\\uD83C\\uDDFA|\\uD83C\\uDDE6\\uD83C\\uDDF9|\\uD83C\\uDFC4\\uD83C\\uDFFE|\\uD83D\\uDDE3\\uFE0F|\\u26F9\\uD83C\\uDFFF|\\u26F9\\uD83C\\uDFFE|\\u26F9\\uD83C\\uDFFD|\\u26F9\\uD83C\\uDFFC|\\u26F9\\uD83C\\uDFFB|\\u270D\\uD83C\\uDFFF|\\u270D\\uD83C\\uDFFE|\\u270D\\uD83C\\uDFFD|\\u270D\\uD83C\\uDFFC|\\u270D\\uD83C\\uDFFB|\\uD83C\\uDC04\\uFE0F|\\uD83C\\uDD7F\\uFE0F|\\uD83C\\uDE02\\uFE0F|\\uD83C\\uDE1A\\uFE0F|\\uD83C\\uDE2F\\uFE0F|\\uD83C\\uDE37\\uFE0F|\\uD83C\\uDF9E\\uFE0F|\\uD83C\\uDF9F\\uFE0F|\\uD83C\\uDFCB\\uFE0F|\\uD83C\\uDFCC\\uFE0F|\\uD83C\\uDFCD\\uFE0F|\\uD83C\\uDFCE\\uFE0F|\\uD83C\\uDF96\\uFE0F|\\uD83C\\uDF97\\uFE0F|\\uD83C\\uDF36\\uFE0F|\\uD83C\\uDF27\\uFE0F|\\uD83C\\uDF28\\uFE0F|\\uD83C\\uDF29\\uFE0F|\\uD83C\\uDF2A\\uFE0F|\\uD83C\\uDF2B\\uFE0F|\\uD83C\\uDF2C\\uFE0F|\\uD83D\\uDC3F\\uFE0F|\\uD83D\\uDD77\\uFE0F|\\uD83D\\uDD78\\uFE0F|\\uD83C\\uDF21\\uFE0F|\\uD83C\\uDF99\\uFE0F|\\uD83C\\uDF9A\\uFE0F|\\uD83C\\uDF9B\\uFE0F|\\uD83C\\uDFF3\\uFE0F|\\uD83C\\uDFF5\\uFE0F|\\uD83C\\uDFF7\\uFE0F|\\uD83D\\uDCFD\\uFE0F|\\uD83D\\uDD49\\uFE0F|\\uD83D\\uDD4A\\uFE0F|\\uD83D\\uDD6F\\uFE0F|\\uD83D\\uDD70\\uFE0F|\\uD83D\\uDD73\\uFE0F|\\uD83D\\uDD76\\uFE0F|\\uD83D\\uDD79\\uFE0F|\\uD83D\\uDD87\\uFE0F|\\uD83D\\uDD8A\\uFE0F|\\uD83D\\uDD8B\\uFE0F|\\uD83D\\uDD8C\\uFE0F|\\uD83D\\uDD8D\\uFE0F|\\uD83D\\uDDA5\\uFE0F|\\uD83D\\uDDA8\\uFE0F|\\uD83D\\uDDB2\\uFE0F|\\uD83D\\uDDBC\\uFE0F|\\uD83D\\uDDC2\\uFE0F|\\uD83D\\uDDC3\\uFE0F|\\uD83D\\uDDC4\\uFE0F|\\uD83D\\uDDD1\\uFE0F|\\uD83D\\uDDD2\\uFE0F|\\uD83D\\uDDD3\\uFE0F|\\uD83D\\uDDDC\\uFE0F|\\uD83D\\uDDDD\\uFE0F|\\uD83D\\uDDDE\\uFE0F|\\uD83D\\uDDE1\\uFE0F|\\u270B\\uD83C\\uDFFF|\\uD83D\\uDDE8\\uFE0F|\\uD83D\\uDDEF\\uFE0F|\\uD83D\\uDDF3\\uFE0F|\\uD83D\\uDDFA\\uFE0F|\\uD83D\\uDEE0\\uFE0F|\\uD83D\\uDEE1\\uFE0F|\\uD83D\\uDEE2\\uFE0F|\\uD83D\\uDEF0\\uFE0F|\\uD83C\\uDF7D\\uFE0F|\\uD83D\\uDC41\\uFE0F|\\uD83D\\uDD74\\uFE0F|\\uD83D\\uDD75\\uFE0F|\\uD83D\\uDD90\\uFE0F|\\uD83C\\uDFD4\\uFE0F|\\uD83C\\uDFD5\\uFE0F|\\uD83C\\uDFD6\\uFE0F|\\uD83C\\uDFD7\\uFE0F|\\uD83C\\uDFD8\\uFE0F|\\uD83C\\uDFD9\\uFE0F|\\uD83C\\uDFDA\\uFE0F|\\uD83C\\uDFDB\\uFE0F|\\uD83C\\uDFDC\\uFE0F|\\uD83C\\uDFDD\\uFE0F|\\uD83C\\uDFDE\\uFE0F|\\uD83C\\uDFDF\\uFE0F|\\uD83D\\uDECB\\uFE0F|\\uD83D\\uDECD\\uFE0F|\\uD83D\\uDECE\\uFE0F|\\uD83D\\uDECF\\uFE0F|\\uD83D\\uDEE3\\uFE0F|\\uD83D\\uDEE4\\uFE0F|\\uD83D\\uDEE5\\uFE0F|\\uD83D\\uDEE9\\uFE0F|\\uD83D\\uDEF3\\uFE0F|\\uD83C\\uDF24\\uFE0F|\\uD83C\\uDF25\\uFE0F|\\uD83C\\uDF26\\uFE0F|\\uD83D\\uDDB1\\uFE0F|\\u261D\\uD83C\\uDFFB|\\u261D\\uD83C\\uDFFC|\\u261D\\uD83C\\uDFFD|\\u261D\\uD83C\\uDFFE|\\u261D\\uD83C\\uDFFF|\\u270C\\uD83C\\uDFFB|\\u270C\\uD83C\\uDFFC|\\u270C\\uD83C\\uDFFD|\\u270C\\uD83C\\uDFFE|\\u270C\\uD83C\\uDFFF|\\u270A\\uD83C\\uDFFB|\\u270A\\uD83C\\uDFFC|\\u270A\\uD83C\\uDFFD|\\u270A\\uD83C\\uDFFE|\\u270A\\uD83C\\uDFFF|\\u270B\\uD83C\\uDFFB|\\u270B\\uD83C\\uDFFC|\\u270B\\uD83C\\uDFFD|\\u270B\\uD83C\\uDFFE|\\4\\uFE0F\\u20E3|\\9\\uFE0F\\u20E3|\\0\\uFE0F\\u20E3|\\1\\uFE0F\\u20E3|\\2\\uFE0F\\u20E3|\\3\\uFE0F\\u20E3|\\#\\uFE0F\\u20E3|\\5\\uFE0F\\u20E3|\\6\\uFE0F\\u20E3|\\7\\uFE0F\\u20E3|\\8\\uFE0F\\u20E3|\\*\\uFE0F\\u20E3|\\uD83D\\uDDE1|\\uD83D\\uDD77|\\uD83D\\uDDE3|\\uD83D\\uDEE4|\\uD83D\\uDDE8|\\uD83D\\uDD78|\\uD83D\\uDDEF|\\uD83C\\uDE37|\\uD83D\\uDDF3|\\uD83C\\uDF21|\\uD83D\\uDDFA|\\uD83D\\uDDB1|\\uD83D\\uDEE0|\\uD83C\\uDF99|\\uD83D\\uDEE1|\\uD83C\\uDF9E|\\uD83D\\uDEE2|\\uD83C\\uDF9A|\\uD83D\\uDEF0|\\uD83D\\uDEE3|\\uD83C\\uDF7D|\\uD83C\\uDF9B|\\uD83D\\uDC41|\\uD83C\\uDF9F|\\uD83D\\uDD74|\\uD83C\\uDFF3|\\uD83D\\uDD75|\\uD83D\\uDEF3|\\uD83D\\uDD90|\\uD83C\\uDFF5|\\uD83C\\uDFD4|\\uD83C\\uDFCB|\\uD83C\\uDFD5|\\uD83C\\uDFF7|\\uD83C\\uDFD6|\\uD83D\\uDECF|\\uD83C\\uDFD7|\\uD83D\\uDCFD|\\uD83C\\uDFD8|\\uD83C\\uDFCC|\\uD83C\\uDFD9|\\uD83D\\uDD49|\\uD83C\\uDFDA|\\uD83C\\uDF25|\\uD83C\\uDFDB|\\uD83D\\uDD4A|\\uD83C\\uDFDC|\\uD83C\\uDFCD|\\uD83C\\uDFDD|\\uD83D\\uDD6F|\\uD83C\\uDFDE|\\uD83D\\uDECE|\\uD83C\\uDFDF|\\uD83D\\uDD70|\\uD83D\\uDECB|\\uD83C\\uDFCE|\\uD83D\\uDECD|\\uD83D\\uDD73|\\uD83D\\uDECE|\\uD83D\\uDEE9|\\uD83D\\uDECF|\\uD83D\\uDD76|\\uD83D\\uDEE3|\\uD83C\\uDF96|\\uD83D\\uDEE4|\\uD83D\\uDD79|\\uD83D\\uDEE5|\\uD83D\\uDECD|\\uD83D\\uDEE9|\\uD83D\\uDD87|\\uD83D\\uDEF3|\\uD83C\\uDF97|\\uD83C\\uDF24|\\uD83D\\uDD8A|\\uD83C\\uDF25|\\uD83C\\uDC04|\\uD83C\\uDF26|\\uD83D\\uDD8B|\\uD83D\\uDDB1|\\uD83C\\uDF36|\\uD83D\\uDD8C|\\uD83C\\uDF26|\\uD83D\\uDD8D|\\uD83C\\uDF27|\\uD83D\\uDDA5|\\uD83C\\uDD7F|\\uD83D\\uDDA8|\\uD83C\\uDF28|\\uD83D\\uDDB2|\\uD83D\\uDECB|\\uD83D\\uDDBC|\\uD83C\\uDF29|\\uD83D\\uDDC2|\\uD83C\\uDE02|\\uD83D\\uDDC3|\\uD83C\\uDF2A|\\uD83D\\uDDC4|\\uD83D\\uDEE5|\\uD83D\\uDDD1|\\uD83C\\uDF2B|\\uD83D\\uDDD2|\\uD83C\\uDE1A|\\uD83D\\uDDD3|\\uD83C\\uDF2C|\\uD83D\\uDDDC|\\uD83C\\uDF24|\\uD83D\\uDDDD|\\uD83D\\uDC3F|\\uD83D\\uDDDE|\\u00A9\\uFE0F|\\uD83C\\uDFDF|\\u00AE\\uFE0F|\\uD83C\\uDFDE|\\u203C\\uFE0F|\\uD83C\\uDFDD|\\u2049\\uFE0F|\\uD83C\\uDFDC|\\u2122\\uFE0F|\\uD83C\\uDFDB|\\u2139\\uFE0F|\\uD83C\\uDFDA|\\u2194\\uFE0F|\\uD83C\\uDFD9|\\u2195\\uFE0F|\\uD83C\\uDFD8|\\u2196\\uFE0F|\\uD83C\\uDFD7|\\u2197\\uFE0F|\\uD83C\\uDFD6|\\u2198\\uFE0F|\\uD83C\\uDFD5|\\u2199\\uFE0F|\\uD83C\\uDFD4|\\u21A9\\uFE0F|\\uD83D\\uDD90|\\u21AA\\uFE0F|\\uD83D\\uDD75|\\u231A\\uFE0F|\\uD83D\\uDD74|\\u231B\\uFE0F|\\uD83D\\uDC41|\\u24C2\\uFE0F|\\uD83C\\uDF7D|\\u25AA\\uFE0F|\\uD83D\\uDEF0|\\u25AB\\uFE0F|\\uD83D\\uDEE2|\\u25B6\\uFE0F|\\uD83D\\uDEE1|\\u25C0\\uFE0F|\\uD83D\\uDEE0|\\u25FB\\uFE0F|\\uD83D\\uDDFA|\\u25FC\\uFE0F|\\uD83D\\uDDF3|\\u25FD\\uFE0F|\\uD83D\\uDDEF|\\u25FE\\uFE0F|\\uD83D\\uDDE8|\\u2600\\uFE0F|\\uD83D\\uDDE3|\\u2601\\uFE0F|\\uD83D\\uDDE1|\\u260E\\uFE0F|\\uD83D\\uDDDE|\\u2611\\uFE0F|\\uD83D\\uDDDD|\\u2614\\uFE0F|\\uD83D\\uDDDC|\\u2615\\uFE0F|\\uD83D\\uDDD3|\\u261D\\uFE0F|\\uD83D\\uDDD2|\\u263A\\uFE0F|\\uD83D\\uDDD1|\\u2648\\uFE0F|\\uD83D\\uDDC4|\\u2649\\uFE0F|\\uD83D\\uDDC3|\\u264A\\uFE0F|\\uD83D\\uDDC2|\\u264B\\uFE0F|\\uD83D\\uDDBC|\\u264C\\uFE0F|\\uD83D\\uDDB2|\\u264D\\uFE0F|\\uD83D\\uDDA8|\\u264E\\uFE0F|\\uD83D\\uDDA5|\\u264F\\uFE0F|\\uD83D\\uDD8D|\\u2650\\uFE0F|\\uD83D\\uDD8C|\\u2651\\uFE0F|\\uD83D\\uDD8B|\\u2652\\uFE0F|\\uD83D\\uDD8A|\\u2653\\uFE0F|\\uD83D\\uDD87|\\u2660\\uFE0F|\\uD83D\\uDD79|\\u2663\\uFE0F|\\uD83D\\uDD76|\\u2665\\uFE0F|\\uD83D\\uDD73|\\u2666\\uFE0F|\\uD83D\\uDD70|\\u2668\\uFE0F|\\uD83D\\uDD6F|\\u267B\\uFE0F|\\uD83D\\uDD4A|\\u267F\\uFE0F|\\uD83D\\uDD49|\\u2693\\uFE0F|\\uD83D\\uDCFD|\\u26A0\\uFE0F|\\uD83C\\uDFF7|\\u26A1\\uFE0F|\\uD83C\\uDFF5|\\u26AA\\uFE0F|\\uD83C\\uDFF3|\\u26AB\\uFE0F|\\uD83C\\uDF9B|\\u26BD\\uFE0F|\\uD83C\\uDF9A|\\u26BE\\uFE0F|\\uD83C\\uDF99|\\u26C4\\uFE0F|\\uD83C\\uDF21|\\u26C5\\uFE0F|\\uD83D\\uDD78|\\u26D4\\uFE0F|\\uD83D\\uDD77|\\u26EA\\uFE0F|\\uD83D\\uDC3F|\\uD83C\\uDE2F|\\uD83C\\uDF2C|\\u26F3\\uFE0F|\\uD83C\\uDF2B|\\u26F5\\uFE0F|\\uD83C\\uDF2A|\\u26FA\\uFE0F|\\uD83C\\uDF29|\\u26FD\\uFE0F|\\uD83C\\uDF28|\\u2702\\uFE0F|\\uD83C\\uDF27|\\u2708\\uFE0F|\\uD83C\\uDF36|\\u2709\\uFE0F|\\uD83C\\uDF97|\\u270C\\uFE0F|\\uD83C\\uDF96|\\u270F\\uFE0F|\\uD83C\\uDFCE|\\u2712\\uFE0F|\\uD83C\\uDFCD|\\u2714\\uFE0F|\\uD83C\\uDFCC|\\u2716\\uFE0F|\\uD83C\\uDFCB|\\u2733\\uFE0F|\\uD83C\\uDF9F|\\u2734\\uFE0F|\\uD83C\\uDF9E|\\u2744\\uFE0F|\\uD83C\\uDE37|\\u2747\\uFE0F|\\uD83C\\uDE2F|\\u2757\\uFE0F|\\uD83C\\uDE1A|\\u2764\\uFE0F|\\uD83C\\uDE02|\\u27A1\\uFE0F|\\uD83C\\uDD7F|\\u2934\\uFE0F|\\uD83C\\uDC04|\\u2935\\uFE0F|\\uD83C\\uDDE6|\\u2B05\\uFE0F|\\uD83C\\uDDE7|\\u2B06\\uFE0F|\\uD83C\\uDDE8|\\u2B07\\uFE0F|\\uD83C\\uDDE9|\\u2B1B\\uFE0F|\\uD83C\\uDDEA|\\u2B1C\\uFE0F|\\uD83C\\uDDEB|\\u2B50\\uFE0F|\\uD83C\\uDDEC|\\u2B55\\uFE0F|\\uD83C\\uDDED|\\u3030\\uFE0F|\\uD83C\\uDDEE|\\u303D\\uFE0F|\\uD83C\\uDDEF|\\u3297\\uFE0F|\\uD83C\\uDDF0|\\u3299\\uFE0F|\\uD83C\\uDDF1|\\u271D\\uFE0F|\\uD83C\\uDDF2|\\u2328\\uFE0F|\\uD83C\\uDDF3|\\u270D\\uFE0F|\\uD83C\\uDDF4|\\u23CF\\uFE0F|\\uD83C\\uDDF5|\\u23ED\\uFE0F|\\uD83C\\uDDF6|\\u23EE\\uFE0F|\\uD83C\\uDDF7|\\u23EF\\uFE0F|\\uD83C\\uDDF8|\\u23F1\\uFE0F|\\uD83C\\uDDF9|\\u23F2\\uFE0F|\\uD83C\\uDDFA|\\u23F8\\uFE0F|\\uD83C\\uDDFB|\\u23F9\\uFE0F|\\uD83C\\uDDFC|\\u23FA\\uFE0F|\\uD83E\\uDD5E|\\u2602\\uFE0F|\\uD83E\\uDD5D|\\u2603\\uFE0F|\\uD83E\\uDD5C|\\u2604\\uFE0F|\\uD83E\\uDD5B|\\u2618\\uFE0F|\\uD83E\\uDD5A|\\u2620\\uFE0F|\\uD83E\\uDD91|\\u2622\\uFE0F|\\uD83E\\uDD90|\\u2623\\uFE0F|\\uD83E\\uDD41|\\u2626\\uFE0F|\\uD83C\\uDFF8|\\u262A\\uFE0F|\\uD83C\\uDFD3|\\u262E\\uFE0F|\\uD83C\\uDFD2|\\u262F\\uFE0F|\\uD83C\\uDFD1|\\u2638\\uFE0F|\\uD83C\\uDFD0|\\u2639\\uFE0F|\\uD83C\\uDFCF|\\u2692\\uFE0F|\\uD83D\\uDCFF|\\u2694\\uFE0F|\\uD83D\\uDD4E|\\u2696\\uFE0F|\\uD83D\\uDD4D|\\u2697\\uFE0F|\\uD83D\\uDD4C|\\u2699\\uFE0F|\\uD83D\\uDD4B|\\u269B\\uFE0F|\\uD83D\\uDED0|\\u269C\\uFE0F|\\uD83C\\uDFFA|\\u26B0\\uFE0F|\\uD83C\\uDFF9|\\u26B1\\uFE0F|\\uD83C\\uDF7E|\\u26C8\\uFE0F|\\uD83C\\uDF7F|\\u26CF\\uFE0F|\\uD83C\\uDF2F|\\u26D1\\uFE0F|\\uD83C\\uDF2E|\\u26D3\\uFE0F|\\uD83C\\uDF2D|\\u26E9\\uFE0F|\\uD83E\\uDDC0|\\u26F0\\uFE0F|\\uD83E\\uDD83|\\u26F1\\uFE0F|\\uD83E\\uDD80|\\u26F4\\uFE0F|\\uD83E\\uDD82|\\u26F7\\uFE0F|\\uD83E\\uDD84|\\u26F8\\uFE0F|\\uD83E\\uDD81|\\u26F9\\uFE0F|\\uD83E\\uDD16|\\u2721\\uFE0F|\\uD83E\\uDD15|\\u2763\\uFE0F|\\uD83E\\uDD12|\\uD83E\\uDD49|\\uD83E\\uDD48|\\uD83E\\uDD47|\\uD83E\\uDD3A|\\uD83E\\uDD45|\\uD83E\\uDD3E|\\uD83C\\uDDFF|\\uD83E\\uDD3D|\\uD83E\\uDD4B|\\uD83E\\uDD4A|\\uD83E\\uDD3C|\\uD83E\\uDD39|\\uD83E\\uDD38|\\uD83D\\uDEF6|\\uD83D\\uDEF5|\\uD83D\\uDEF4|\\uD83D\\uDED2|\\uD83C\\uDCCF|\\uD83C\\uDD70|\\uD83C\\uDD71|\\uD83C\\uDD7E|\\uD83D\\uDED1|\\uD83C\\uDD8E|\\uD83C\\uDD91|\\uD83C\\uDDFE|\\uD83C\\uDD92|\\uD83C\\uDD93|\\uD83C\\uDD94|\\uD83C\\uDD95|\\uD83C\\uDD96|\\uD83C\\uDD97|\\uD83C\\uDD98|\\uD83E\\uDD44|\\uD83C\\uDD99|\\uD83C\\uDD9A|\\uD83E\\uDD42|\\uD83E\\uDD43|\\uD83C\\uDE01|\\uD83E\\uDD59|\\uD83C\\uDE32|\\uD83C\\uDE33|\\uD83C\\uDE34|\\uD83C\\uDE35|\\uD83C\\uDE36|\\uD83E\\uDD58|\\uD83C\\uDE38|\\uD83C\\uDE39|\\uD83E\\uDD57|\\uD83C\\uDE3A|\\uD83C\\uDE50|\\uD83C\\uDE51|\\uD83C\\uDF00|\\uD83E\\uDD56|\\uD83C\\uDF01|\\uD83C\\uDF02|\\uD83C\\uDF03|\\uD83C\\uDF04|\\uD83C\\uDF05|\\uD83C\\uDF06|\\uD83E\\uDD55|\\uD83C\\uDF07|\\uD83C\\uDF08|\\uD83E\\uDD54|\\uD83C\\uDF09|\\uD83C\\uDF0A|\\uD83C\\uDF0B|\\uD83C\\uDF0C|\\uD83C\\uDF0F|\\uD83C\\uDF11|\\uD83E\\uDD53|\\uD83C\\uDF13|\\uD83C\\uDF14|\\uD83C\\uDF15|\\uD83C\\uDF19|\\uD83C\\uDF1B|\\uD83C\\uDF1F|\\uD83E\\uDD52|\\uD83C\\uDF20|\\uD83C\\uDF30|\\uD83E\\uDD51|\\uD83C\\uDF31|\\uD83C\\uDF34|\\uD83C\\uDF35|\\uD83C\\uDF37|\\uD83C\\uDF38|\\uD83C\\uDF39|\\uD83C\\uDF3A|\\uD83C\\uDF3B|\\uD83C\\uDF3C|\\uD83C\\uDF3D|\\uD83E\\uDD50|\\uD83C\\uDF3E|\\uD83C\\uDF3F|\\uD83C\\uDF40|\\uD83C\\uDF41|\\uD83C\\uDF42|\\uD83C\\uDF43|\\uD83C\\uDF44|\\uD83C\\uDF45|\\uD83C\\uDF46|\\uD83C\\uDF47|\\uD83C\\uDF48|\\uD83C\\uDF49|\\uD83C\\uDF4A|\\uD83E\\uDD40|\\uD83C\\uDF4C|\\uD83C\\uDF4D|\\uD83C\\uDF4E|\\uD83C\\uDF4F|\\uD83C\\uDF51|\\uD83C\\uDF52|\\uD83C\\uDF53|\\uD83E\\uDD8F|\\uD83C\\uDF54|\\uD83C\\uDF55|\\uD83C\\uDF56|\\uD83E\\uDD8E|\\uD83C\\uDF57|\\uD83C\\uDF58|\\uD83C\\uDF59|\\uD83E\\uDD8D|\\uD83C\\uDF5A|\\uD83C\\uDF5B|\\uD83E\\uDD8C|\\uD83C\\uDF5C|\\uD83C\\uDF5D|\\uD83C\\uDF5E|\\uD83C\\uDF5F|\\uD83E\\uDD8B|\\uD83C\\uDF60|\\uD83C\\uDF61|\\uD83E\\uDD8A|\\uD83C\\uDF62|\\uD83C\\uDF63|\\uD83E\\uDD89|\\uD83C\\uDF64|\\uD83C\\uDF65|\\uD83E\\uDD88|\\uD83C\\uDF66|\\uD83E\\uDD87|\\uD83C\\uDF67|\\uD83C\\uDDFD|\\uD83C\\uDF68|\\uD83E\\uDD86|\\uD83C\\uDF69|\\uD83E\\uDD85|\\uD83C\\uDF6A|\\uD83D\\uDDA4|\\uD83C\\uDF6B|\\uD83C\\uDF6C|\\uD83C\\uDF6D|\\uD83C\\uDF6E|\\uD83C\\uDF6F|\\uD83E\\uDD1E|\\uD83C\\uDF70|\\uD83C\\uDF71|\\uD83C\\uDF72|\\uD83E\\uDD1D|\\uD83C\\uDF73|\\uD83C\\uDF74|\\uD83C\\uDF75|\\uD83C\\uDF76|\\uD83C\\uDF77|\\uD83C\\uDF78|\\uD83C\\uDF79|\\uD83C\\uDF7A|\\uD83C\\uDF7B|\\uD83C\\uDF80|\\uD83C\\uDF81|\\uD83C\\uDF82|\\uD83C\\uDF83|\\uD83E\\uDD1B|\\uD83E\\uDD1C|\\uD83C\\uDF84|\\uD83C\\uDF85|\\uD83C\\uDF86|\\uD83E\\uDD1A|\\uD83C\\uDF87|\\uD83C\\uDF88|\\uD83C\\uDF89|\\uD83C\\uDF8A|\\uD83C\\uDF8B|\\uD83C\\uDF8C|\\uD83E\\uDD19|\\uD83C\\uDF8D|\\uD83D\\uDD7A|\\uD83C\\uDF8E|\\uD83E\\uDD33|\\uD83C\\uDF8F|\\uD83E\\uDD30|\\uD83C\\uDF90|\\uD83E\\uDD26|\\uD83E\\uDD37|\\uD83C\\uDF91|\\uD83C\\uDF92|\\uD83C\\uDF93|\\uD83C\\uDFA0|\\uD83C\\uDFA1|\\uD83C\\uDFA2|\\uD83C\\uDFA3|\\uD83C\\uDFA4|\\uD83C\\uDFA5|\\uD83C\\uDFA6|\\uD83C\\uDFA7|\\uD83E\\uDD36|\\uD83C\\uDFA8|\\uD83E\\uDD35|\\uD83C\\uDFA9|\\uD83C\\uDFAA|\\uD83E\\uDD34|\\uD83C\\uDFAB|\\uD83C\\uDFAC|\\uD83C\\uDFAD|\\uD83E\\uDD27|\\uD83C\\uDFAE|\\uD83C\\uDFAF|\\uD83C\\uDFB0|\\uD83C\\uDFB1|\\uD83C\\uDFB2|\\uD83C\\uDFB3|\\uD83C\\uDFB4|\\uD83E\\uDD25|\\uD83C\\uDFB5|\\uD83C\\uDFB6|\\uD83C\\uDFB7|\\uD83E\\uDD24|\\uD83C\\uDFB8|\\uD83C\\uDFB9|\\uD83C\\uDFBA|\\uD83E\\uDD23|\\uD83C\\uDFBB|\\uD83C\\uDFBC|\\uD83C\\uDFBD|\\uD83E\\uDD22|\\uD83C\\uDFBE|\\uD83C\\uDFBF|\\uD83C\\uDFC0|\\uD83C\\uDFC1|\\uD83E\\uDD21|\\uD83C\\uDFC2|\\uD83C\\uDFC3|\\uD83C\\uDFC4|\\uD83C\\uDFC6|\\uD83C\\uDFC8|\\uD83C\\uDFCA|\\uD83C\\uDFE0|\\uD83C\\uDFE1|\\uD83C\\uDFE2|\\uD83C\\uDFE3|\\uD83C\\uDFE5|\\uD83C\\uDFE6|\\uD83C\\uDFE7|\\uD83C\\uDFE8|\\uD83C\\uDFE9|\\uD83C\\uDFEA|\\uD83C\\uDFEB|\\uD83C\\uDFEC|\\uD83E\\uDD20|\\uD83C\\uDFED|\\uD83C\\uDFEE|\\uD83C\\uDFEF|\\uD83C\\uDFF0|\\uD83D\\uDC0C|\\uD83D\\uDC0D|\\uD83D\\uDC0E|\\uD83D\\uDC11|\\uD83D\\uDC12|\\uD83D\\uDC14|\\uD83D\\uDC17|\\uD83D\\uDC18|\\uD83D\\uDC19|\\uD83D\\uDC1A|\\uD83D\\uDC1B|\\uD83D\\uDC1C|\\uD83D\\uDC1D|\\uD83D\\uDC1E|\\uD83D\\uDC1F|\\uD83D\\uDC20|\\uD83D\\uDC21|\\uD83D\\uDC22|\\uD83D\\uDC23|\\uD83D\\uDC24|\\uD83D\\uDC25|\\uD83D\\uDC26|\\uD83D\\uDC27|\\uD83D\\uDC28|\\uD83D\\uDC29|\\uD83D\\uDC2B|\\uD83D\\uDC2C|\\uD83D\\uDC2D|\\uD83D\\uDC2E|\\uD83D\\uDC2F|\\uD83D\\uDC30|\\uD83D\\uDC31|\\uD83D\\uDC32|\\uD83D\\uDC33|\\uD83D\\uDC34|\\uD83D\\uDC35|\\uD83D\\uDC36|\\uD83D\\uDC37|\\uD83D\\uDC38|\\uD83D\\uDC39|\\uD83D\\uDC3A|\\uD83D\\uDC3B|\\uD83D\\uDC3C|\\uD83D\\uDC3D|\\uD83D\\uDC3E|\\uD83D\\uDC40|\\uD83D\\uDC42|\\uD83D\\uDC43|\\uD83D\\uDC44|\\uD83D\\uDC45|\\uD83D\\uDC46|\\uD83D\\uDC47|\\uD83D\\uDC48|\\uD83D\\uDC49|\\uD83D\\uDC4A|\\uD83D\\uDC4B|\\uD83D\\uDC4C|\\uD83D\\uDC4D|\\uD83D\\uDC4E|\\uD83D\\uDC4F|\\uD83D\\uDC50|\\uD83D\\uDC51|\\uD83D\\uDC52|\\uD83D\\uDC53|\\uD83D\\uDC54|\\uD83D\\uDC55|\\uD83D\\uDC56|\\uD83D\\uDC57|\\uD83D\\uDC58|\\uD83D\\uDC59|\\uD83D\\uDC5A|\\uD83D\\uDC5B|\\uD83D\\uDC5C|\\uD83D\\uDC5D|\\uD83D\\uDC5E|\\uD83D\\uDC5F|\\uD83D\\uDC60|\\uD83D\\uDC61|\\uD83D\\uDC62|\\uD83D\\uDC63|\\uD83D\\uDC64|\\uD83D\\uDC66|\\uD83D\\uDC67|\\uD83D\\uDC68|\\uD83D\\uDC69|\\uD83D\\uDC6A|\\uD83D\\uDC6B|\\uD83D\\uDC6E|\\uD83D\\uDC6F|\\uD83D\\uDC70|\\uD83D\\uDC71|\\uD83D\\uDC72|\\uD83D\\uDC73|\\uD83D\\uDC74|\\uD83D\\uDC75|\\uD83D\\uDC76|\\uD83D\\uDC77|\\uD83D\\uDC78|\\uD83D\\uDC79|\\uD83D\\uDC7A|\\uD83D\\uDC7B|\\uD83D\\uDC7C|\\uD83D\\uDC7D|\\uD83D\\uDC7E|\\uD83D\\uDC7F|\\uD83D\\uDC80|\\uD83D\\uDCC7|\\uD83D\\uDC81|\\uD83D\\uDC82|\\uD83D\\uDC83|\\uD83D\\uDC84|\\uD83D\\uDC85|\\uD83D\\uDCD2|\\uD83D\\uDC86|\\uD83D\\uDCD3|\\uD83D\\uDC87|\\uD83D\\uDCD4|\\uD83D\\uDC88|\\uD83D\\uDCD5|\\uD83D\\uDC89|\\uD83D\\uDCD6|\\uD83D\\uDC8A|\\uD83D\\uDCD7|\\uD83D\\uDC8B|\\uD83D\\uDCD8|\\uD83D\\uDC8C|\\uD83D\\uDCD9|\\uD83D\\uDC8D|\\uD83D\\uDCDA|\\uD83D\\uDC8E|\\uD83D\\uDCDB|\\uD83D\\uDC8F|\\uD83D\\uDCDC|\\uD83D\\uDC90|\\uD83D\\uDCDD|\\uD83D\\uDC91|\\uD83D\\uDCDE|\\uD83D\\uDC92|\\uD83D\\uDCDF|\\uD83D\\uDCE0|\\uD83D\\uDC93|\\uD83D\\uDCE1|\\uD83D\\uDCE2|\\uD83D\\uDC94|\\uD83D\\uDCE3|\\uD83D\\uDCE4|\\uD83D\\uDC95|\\uD83D\\uDCE5|\\uD83D\\uDCE6|\\uD83D\\uDC96|\\uD83D\\uDCE7|\\uD83D\\uDCE8|\\uD83D\\uDC97|\\uD83D\\uDCE9|\\uD83D\\uDCEA|\\uD83D\\uDC98|\\uD83D\\uDCEB|\\uD83D\\uDCEE|\\uD83D\\uDC99|\\uD83D\\uDCF0|\\uD83D\\uDCF1|\\uD83D\\uDC9A|\\uD83D\\uDCF2|\\uD83D\\uDCF3|\\uD83D\\uDC9B|\\uD83D\\uDCF4|\\uD83D\\uDCF6|\\uD83D\\uDC9C|\\uD83D\\uDCF7|\\uD83D\\uDCF9|\\uD83D\\uDC9D|\\uD83D\\uDCFA|\\uD83D\\uDCFB|\\uD83D\\uDC9E|\\uD83D\\uDCFC|\\uD83D\\uDD03|\\uD83D\\uDC9F|\\uD83D\\uDD0A|\\uD83D\\uDD0B|\\uD83D\\uDCA0|\\uD83D\\uDD0C|\\uD83D\\uDD0D|\\uD83D\\uDCA1|\\uD83D\\uDD0E|\\uD83D\\uDD0F|\\uD83D\\uDCA2|\\uD83D\\uDD10|\\uD83D\\uDD11|\\uD83D\\uDCA3|\\uD83D\\uDD12|\\uD83D\\uDD13|\\uD83D\\uDCA4|\\uD83D\\uDD14|\\uD83D\\uDD16|\\uD83D\\uDCA5|\\uD83D\\uDD17|\\uD83D\\uDD18|\\uD83D\\uDCA6|\\uD83D\\uDD19|\\uD83D\\uDD1A|\\uD83D\\uDCA7|\\uD83D\\uDD1B|\\uD83D\\uDD1C|\\uD83D\\uDCA8|\\uD83D\\uDD1D|\\uD83D\\uDD1E|\\uD83D\\uDCA9|\\uD83D\\uDD1F|\\uD83D\\uDCAA|\\uD83D\\uDD20|\\uD83D\\uDD21|\\uD83D\\uDCAB|\\uD83D\\uDD22|\\uD83D\\uDD23|\\uD83D\\uDCAC|\\uD83D\\uDD24|\\uD83D\\uDD25|\\uD83D\\uDCAE|\\uD83D\\uDD26|\\uD83D\\uDD27|\\uD83D\\uDCAF|\\uD83D\\uDD28|\\uD83D\\uDD29|\\uD83D\\uDCB0|\\uD83D\\uDD2A|\\uD83D\\uDD2B|\\uD83D\\uDCB1|\\uD83D\\uDD2E|\\uD83D\\uDCB2|\\uD83D\\uDD2F|\\uD83D\\uDCB3|\\uD83D\\uDD30|\\uD83D\\uDD31|\\uD83D\\uDCB4|\\uD83D\\uDD32|\\uD83D\\uDD33|\\uD83D\\uDCB5|\\uD83D\\uDD34|\\uD83D\\uDD35|\\uD83D\\uDCB8|\\uD83D\\uDD36|\\uD83D\\uDD37|\\uD83D\\uDCB9|\\uD83D\\uDD38|\\uD83D\\uDD39|\\uD83D\\uDCBA|\\uD83D\\uDD3A|\\uD83D\\uDD3B|\\uD83D\\uDCBB|\\uD83D\\uDD3C|\\uD83D\\uDCBC|\\uD83D\\uDD3D|\\uD83D\\uDD50|\\uD83D\\uDCBD|\\uD83D\\uDD51|\\uD83D\\uDCBE|\\uD83D\\uDD52|\\uD83D\\uDCBF|\\uD83D\\uDD53|\\uD83D\\uDCC0|\\uD83D\\uDD54|\\uD83D\\uDD55|\\uD83D\\uDCC1|\\uD83D\\uDD56|\\uD83D\\uDD57|\\uD83D\\uDCC2|\\uD83D\\uDD58|\\uD83D\\uDD59|\\uD83D\\uDCC3|\\uD83D\\uDD5A|\\uD83D\\uDD5B|\\uD83D\\uDCC4|\\uD83D\\uDDFB|\\uD83D\\uDDFC|\\uD83D\\uDCC5|\\uD83D\\uDDFD|\\uD83D\\uDDFE|\\uD83D\\uDCC6|\\uD83D\\uDDFF|\\uD83D\\uDE01|\\uD83D\\uDE02|\\uD83D\\uDE03|\\uD83D\\uDCC8|\\uD83D\\uDE04|\\uD83D\\uDE05|\\uD83D\\uDCC9|\\uD83D\\uDE06|\\uD83D\\uDE09|\\uD83D\\uDCCA|\\uD83D\\uDE0A|\\uD83D\\uDE0B|\\uD83D\\uDCCB|\\uD83D\\uDE0C|\\uD83D\\uDE0D|\\uD83D\\uDCCC|\\uD83D\\uDE0F|\\uD83D\\uDE12|\\uD83D\\uDCCD|\\uD83D\\uDE13|\\uD83D\\uDE14|\\uD83D\\uDCCE|\\uD83D\\uDE16|\\uD83D\\uDE18|\\uD83D\\uDCCF|\\uD83D\\uDE1A|\\uD83D\\uDE1C|\\uD83D\\uDCD0|\\uD83D\\uDE1D|\\uD83D\\uDE1E|\\uD83D\\uDCD1|\\uD83D\\uDE20|\\uD83D\\uDE21|\\uD83D\\uDE22|\\uD83D\\uDE23|\\uD83D\\uDE24|\\uD83D\\uDE25|\\uD83D\\uDE28|\\uD83D\\uDE29|\\uD83D\\uDE2A|\\uD83D\\uDE2B|\\uD83D\\uDE2D|\\uD83D\\uDE30|\\uD83D\\uDE31|\\uD83D\\uDE32|\\uD83D\\uDE33|\\uD83D\\uDE35|\\uD83D\\uDE37|\\uD83D\\uDE38|\\uD83D\\uDE39|\\uD83D\\uDE3A|\\uD83D\\uDE3B|\\uD83D\\uDE3C|\\uD83D\\uDE3D|\\uD83D\\uDE3E|\\uD83D\\uDE3F|\\uD83D\\uDE40|\\uD83D\\uDE45|\\uD83D\\uDE46|\\uD83D\\uDE47|\\uD83D\\uDE48|\\uD83D\\uDE49|\\uD83D\\uDE4A|\\uD83D\\uDE4B|\\uD83D\\uDE4C|\\uD83D\\uDE4D|\\uD83D\\uDE4E|\\uD83D\\uDE4F|\\uD83D\\uDE80|\\uD83D\\uDE83|\\uD83D\\uDE84|\\uD83D\\uDE85|\\uD83D\\uDE87|\\uD83D\\uDE89|\\uD83D\\uDE8C|\\uD83D\\uDE8F|\\uD83D\\uDE91|\\uD83D\\uDE92|\\uD83D\\uDE93|\\uD83D\\uDE95|\\uD83D\\uDE97|\\uD83D\\uDE99|\\uD83D\\uDE9A|\\uD83D\\uDEA2|\\uD83D\\uDEA4|\\uD83D\\uDEA5|\\uD83D\\uDEA7|\\uD83D\\uDEA8|\\uD83D\\uDEA9|\\uD83D\\uDEAA|\\uD83D\\uDEAB|\\uD83D\\uDEAC|\\uD83D\\uDEAD|\\uD83D\\uDEB2|\\uD83D\\uDEB6|\\uD83D\\uDEB9|\\uD83D\\uDEBA|\\uD83D\\uDEBB|\\uD83D\\uDEBC|\\uD83D\\uDEBD|\\uD83D\\uDEBE|\\uD83D\\uDEC0|\\uD83E\\uDD18|\\uD83D\\uDE00|\\uD83D\\uDE07|\\uD83D\\uDE08|\\uD83D\\uDE0E|\\uD83D\\uDE10|\\uD83D\\uDE11|\\uD83D\\uDE15|\\uD83D\\uDE17|\\uD83D\\uDE19|\\uD83D\\uDE1B|\\uD83D\\uDE1F|\\uD83D\\uDE26|\\uD83D\\uDE27|\\uD83D\\uDE2C|\\uD83D\\uDE2E|\\uD83D\\uDE2F|\\uD83D\\uDE34|\\uD83D\\uDE36|\\uD83D\\uDE81|\\uD83D\\uDE82|\\uD83D\\uDE86|\\uD83D\\uDE88|\\uD83D\\uDE8A|\\uD83D\\uDE8D|\\uD83D\\uDE8E|\\uD83D\\uDE90|\\uD83D\\uDE94|\\uD83D\\uDE96|\\uD83D\\uDE98|\\uD83D\\uDE9B|\\uD83D\\uDE9C|\\uD83D\\uDE9D|\\uD83D\\uDE9E|\\uD83D\\uDE9F|\\uD83D\\uDEA0|\\uD83D\\uDEA1|\\uD83D\\uDEA3|\\uD83D\\uDEA6|\\uD83D\\uDEAE|\\uD83D\\uDEAF|\\uD83D\\uDEB0|\\uD83D\\uDEB1|\\uD83D\\uDEB3|\\uD83D\\uDEB4|\\uD83D\\uDEB5|\\uD83D\\uDEB7|\\uD83D\\uDEB8|\\uD83D\\uDEBF|\\uD83D\\uDEC1|\\uD83D\\uDEC2|\\uD83D\\uDEC3|\\uD83D\\uDEC4|\\uD83D\\uDEC5|\\uD83C\\uDF0D|\\uD83C\\uDF0E|\\uD83C\\uDF10|\\uD83C\\uDF12|\\uD83C\\uDF16|\\uD83C\\uDF17|\\uD83C\\uDF18|\\uD83C\\uDF1A|\\uD83C\\uDF1C|\\uD83C\\uDF1D|\\uD83C\\uDF1E|\\uD83C\\uDF32|\\uD83C\\uDF33|\\uD83C\\uDF4B|\\uD83C\\uDF50|\\uD83C\\uDF7C|\\uD83C\\uDFC7|\\uD83C\\uDFC9|\\uD83C\\uDFE4|\\uD83D\\uDC00|\\uD83D\\uDC01|\\uD83D\\uDC02|\\uD83D\\uDC03|\\uD83D\\uDC04|\\uD83D\\uDC05|\\uD83D\\uDC06|\\uD83D\\uDC07|\\uD83D\\uDC08|\\uD83D\\uDC09|\\uD83D\\uDC0A|\\uD83D\\uDC0B|\\uD83D\\uDC0F|\\uD83D\\uDC10|\\uD83D\\uDC13|\\uD83D\\uDC15|\\uD83D\\uDC16|\\uD83D\\uDC2A|\\uD83D\\uDC65|\\uD83D\\uDC6C|\\uD83D\\uDC6D|\\uD83D\\uDCAD|\\uD83D\\uDCB6|\\uD83D\\uDCB7|\\uD83D\\uDCEC|\\uD83D\\uDCED|\\uD83D\\uDCEF|\\uD83D\\uDCF5|\\uD83D\\uDD00|\\uD83D\\uDD01|\\uD83D\\uDD02|\\uD83D\\uDD04|\\uD83D\\uDD05|\\uD83D\\uDD06|\\uD83D\\uDD07|\\uD83D\\uDD09|\\uD83D\\uDD15|\\uD83D\\uDD2C|\\uD83D\\uDD2D|\\uD83D\\uDD5C|\\uD83D\\uDD5D|\\uD83D\\uDD5E|\\uD83D\\uDD5F|\\uD83D\\uDD60|\\uD83D\\uDD61|\\uD83D\\uDD62|\\uD83D\\uDD63|\\uD83D\\uDD64|\\uD83D\\uDD65|\\uD83D\\uDD66|\\uD83D\\uDD67|\\uD83D\\uDD08|\\uD83D\\uDE8B|\\uD83C\\uDFC5|\\uD83C\\uDFF4|\\uD83D\\uDCF8|\\uD83D\\uDECC|\\uD83D\\uDD95|\\uD83D\\uDD96|\\uD83D\\uDE41|\\uD83D\\uDE42|\\uD83D\\uDEEB|\\uD83D\\uDEEC|\\uD83C\\uDFFB|\\uD83C\\uDFFC|\\uD83C\\uDFFD|\\uD83C\\uDFFE|\\uD83C\\uDFFF|\\uD83D\\uDE43|\\uD83E\\uDD11|\\uD83E\\uDD13|\\uD83E\\uDD17|\\uD83D\\uDE44|\\uD83E\\uDD14|\\uD83E\\uDD10|\\u26F2\\uFE0F|\\#\\u20E3|\\9\\u20E3|\\8\\u20E3|\\7\\u20E3|\\6\\u20E3|\\*\\u20E3|\\4\\u20E3|\\3\\u20E3|\\2\\u20E3|\\1\\u20E3|\\0\\u20E3|\\5\\u20E3|\\u26B1|\\u26B0|\\u269C|\\u269B|\\u2699|\\u2697|\\u2696|\\u2694|\\u2692|\\u2639|\\u2638|\\u262F|\\u262E|\\u262A|\\u2626|\\u2623|\\u2622|\\u2620|\\u2618|\\u2604|\\u2603|\\u2602|\\u23FA|\\u23F9|\\u23F8|\\u23F2|\\u23F1|\\u23EF|\\u23EE|\\u23ED|\\u23CF|\\u270D|\\u2328|\\u271D|\\u3299|\\u3297|\\u303D|\\u3030|\\u2B55|\\u2B50|\\u2B1C|\\u2B1B|\\u2B07|\\u2B06|\\u2B05|\\u2935|\\u23E9|\\u23EA|\\u23EB|\\u23EC|\\u23F0|\\u23F3|\\u26CE|\\u2705|\\u270A|\\u270B|\\u2728|\\u274C|\\u274E|\\u2753|\\u2754|\\u2755|\\u2795|\\u2796|\\u2797|\\u27B0|\\u27BF|\\u00A9|\\u00AE|\\u203C|\\u2049|\\u2122|\\u2139|\\u2194|\\u2195|\\u2196|\\u2197|\\u2198|\\u2199|\\u21A9|\\u21AA|\\u231A|\\u231B|\\u24C2|\\u25AA|\\u25AB|\\u25B6|\\u25C0|\\u25FB|\\u25FC|\\u25FD|\\u25FE|\\u2600|\\u2601|\\u260E|\\u2611|\\u2614|\\u2615|\\u261D|\\u263A|\\u2648|\\u2649|\\u264A|\\u264B|\\u264C|\\u264D|\\u264E|\\u264F|\\u2650|\\u2651|\\u2652|\\u2653|\\u2660|\\u2663|\\u2665|\\u2666|\\u2668|\\u267B|\\u267F|\\u2693|\\u26A0|\\u26A1|\\u26AA|\\u26AB|\\u26BD|\\u26BE|\\u26C4|\\u26C5|\\u26D4|\\u26EA|\\u26F2|\\u26F3|\\u26F5|\\u26FA|\\u26FD|\\u2702|\\u2708|\\u2709|\\u270C|\\u270F|\\u2712|\\u2714|\\u2716|\\u2733|\\u2734|\\u2744|\\u2747|\\u2721|\\u2764|\\u27A1|\\u2934|\\u2935|\\u2B05|\\u2B06|\\u2B07|\\u2B1B|\\u2B1C|\\u2B50|\\u2B55|\\u3030|\\u303D|\\u3297|\\u3299|\\u2934|\\u27A1|\\u2764|\\u2757|\\u2747|\\u2744|\\u2734|\\u2733|\\u2716|\\u2714|\\u2712|\\u270F|\\u270C|\\u2709|\\u2708|\\u2702|\\u26FD|\\u26FA|\\u26F5|\\u26F3|\\u26F2|\\u26EA|\\u26D4|\\u26C5|\\u26C4|\\u26BE|\\u26BD|\\u26AB|\\u26AA|\\u26A1|\\u26A0|\\u2693|\\u271D|\\u267F|\\u267B|\\u2668|\\u2666|\\u2665|\\u2663|\\u2660|\\u2653|\\u2652|\\u2651|\\u2650|\\u264F|\\u264E|\\u264D|\\u2328|\\u264C|\\u264B|\\u264A|\\u2649|\\u2648|\\u263A|\\u261D|\\u2615|\\u2614|\\u2611|\\u260E|\\u2601|\\u2600|\\u25FE|\\u25FD|\\u25FC|\\u25FB|\\u25C0|\\u25B6|\\u25AB|\\u25AA|\\u24C2|\\u231B|\\u231A|\\u21AA|\\u270D|\\u21A9|\\u2199|\\u2198|\\u2197|\\u2196|\\u2195|\\u2194|\\u2139|\\u2122|\\u2049|\\u203C|\\u00AE|\\u00A9|\\u2763|\\u26F9|\\u26F8|\\u26F7|\\u26F4|\\u26F1|\\u26F0|\\u26E9|\\u26D3|\\u23CF|\\u23ED|\\u23EE|\\u23EF|\\u23F1|\\u23F2|\\u23F8|\\u23F9|\\u23FA|\\u2602|\\u2603|\\u2604|\\u2618|\\u2620|\\u2622|\\u2623|\\u2626|\\u262A|\\u262E|\\u262F|\\u2638|\\u2639|\\u2692|\\u2694|\\u2696|\\u2697|\\u2699|\\u269B|\\u269C|\\u26B0|\\u26B1|\\u26C8|\\u26CF|\\u26D1|\\u26D3|\\u26E9|\\u26F0|\\u26F1|\\u26F4|\\u26F7|\\u26F8|\\u26F9|\\u2721|\\u2763|\\u26D1|\\u26CF|\\u26C8|\\u2757)';
    ns.jsEscapeMap = {"\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69":"1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","\uD83D\uDC69\u2764\uD83D\uDC8B\uD83D\uDC69":"1f469-2764-1f48b-1f469","\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC68":"1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","\uD83D\uDC68\u2764\uD83D\uDC8B\uD83D\uDC68":"1f468-2764-1f48b-1f468","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66\u200D\uD83D\uDC66":"1f468-200d-1f468-200d-1f466-200d-1f466","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC66\uD83D\uDC66":"1f468-1f468-1f466-1f466","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66":"1f468-200d-1f468-200d-1f467-200d-1f466","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC67\uD83D\uDC66":"1f468-1f468-1f467-1f466","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC67":"1f468-200d-1f468-200d-1f467-200d-1f467","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC67\uD83D\uDC67":"1f468-1f468-1f467-1f467","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66":"1f468-200d-1f469-200d-1f466-200d-1f466","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC66\uD83D\uDC66":"1f468-1f469-1f466-1f466","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66":"1f468-200d-1f469-200d-1f467-200d-1f466","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC67\uD83D\uDC66":"1f468-1f469-1f467-1f466","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67":"1f468-200d-1f469-200d-1f467-200d-1f467","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC67\uD83D\uDC67":"1f468-1f469-1f467-1f467","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66":"1f469-200d-1f469-200d-1f466-200d-1f466","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66\uD83D\uDC66":"1f469-1f469-1f466-1f466","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66":"1f469-200d-1f469-200d-1f467-200d-1f466","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC67\uD83D\uDC66":"1f469-1f469-1f467-1f466","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC67":"1f469-200d-1f469-200d-1f467-200d-1f467","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC67\uD83D\uDC67":"1f469-1f469-1f467-1f467","\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC69":"1f469-200d-2764-fe0f-200d-1f469","\uD83D\uDC69\u2764\uD83D\uDC69":"1f469-2764-1f469","\uD83D\uDC68\u200D\u2764\uFE0F\u200D\uD83D\uDC68":"1f468-200d-2764-fe0f-200d-1f468","\uD83D\uDC68\u2764\uD83D\uDC68":"1f468-2764-1f468","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC66":"1f468-200d-1f468-200d-1f466","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC66":"1f468-1f468-1f466","\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67":"1f468-200d-1f468-200d-1f467","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC67":"1f468-1f468-1f467","\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67":"1f468-200d-1f469-200d-1f467","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC67":"1f468-1f469-1f467","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC66":"1f469-200d-1f469-200d-1f466","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66":"1f469-1f469-1f466","\uD83D\uDC69\u200D\uD83D\uDC69\u200D\uD83D\uDC67":"1f469-200d-1f469-200d-1f467","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC67":"1f469-1f469-1f467","\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08":"1f3f3-fe0f-200d-1f308","\uD83C\uDFF3\uD83C\uDF08":"1f3f3-1f308","\uD83D\uDC41\u200D\uD83D\uDDE8":"1f441-200d-1f5e8","\uD83D\uDC41\uD83D\uDDE8":"1f441-1f5e8","#\uFE0F\u20E3":"0023-fe0f-20e3","#\u20E3":"0023-20e3","0\uFE0F\u20E3":"0030-fe0f-20e3","0\u20E3":"0030-20e3","1\uFE0F\u20E3":"0031-fe0f-20e3","1\u20E3":"0031-20e3","2\uFE0F\u20E3":"0032-fe0f-20e3","2\u20E3":"0032-20e3","3\uFE0F\u20E3":"0033-fe0f-20e3","3\u20E3":"0033-20e3","4\uFE0F\u20E3":"0034-fe0f-20e3","4\u20E3":"0034-20e3","5\uFE0F\u20E3":"0035-fe0f-20e3","5\u20E3":"0035-20e3","6\uFE0F\u20E3":"0036-fe0f-20e3","6\u20E3":"0036-20e3","7\uFE0F\u20E3":"0037-fe0f-20e3","7\u20E3":"0037-20e3","8\uFE0F\u20E3":"0038-fe0f-20e3","8\u20E3":"0038-20e3","9\uFE0F\u20E3":"0039-fe0f-20e3","9\u20E3":"0039-20e3","*\uFE0F\u20E3":"002a-fe0f-20e3","*\u20E3":"002a-20e3","\uD83E\uDD3E\uD83C\uDFFF":"1f93e-1f3ff","\uD83E\uDD3E\uD83C\uDFFE":"1f93e-1f3fe","\uD83E\uDD3E\uD83C\uDFFD":"1f93e-1f3fd","\uD83E\uDD3E\uD83C\uDFFC":"1f93e-1f3fc","\uD83E\uDD3E\uD83C\uDFFB":"1f93e-1f3fb","\uD83E\uDD3D\uD83C\uDFFF":"1f93d-1f3ff","\uD83E\uDD3D\uD83C\uDFFE":"1f93d-1f3fe","\uD83E\uDD3D\uD83C\uDFFD":"1f93d-1f3fd","\uD83E\uDD3D\uD83C\uDFFC":"1f93d-1f3fc","\uD83E\uDD3D\uD83C\uDFFB":"1f93d-1f3fb","\uD83E\uDD3C\uD83C\uDFFF":"1f93c-1f3ff","\uD83E\uDD3C\uD83C\uDFFE":"1f93c-1f3fe","\uD83E\uDD3C\uD83C\uDFFD":"1f93c-1f3fd","\uD83E\uDD3C\uD83C\uDFFC":"1f93c-1f3fc","\uD83E\uDD3C\uD83C\uDFFB":"1f93c-1f3fb","\uD83E\uDD39\uD83C\uDFFF":"1f939-1f3ff","\uD83E\uDD39\uD83C\uDFFE":"1f939-1f3fe","\uD83E\uDD39\uD83C\uDFFD":"1f939-1f3fd","\uD83E\uDD39\uD83C\uDFFC":"1f939-1f3fc","\uD83E\uDD39\uD83C\uDFFB":"1f939-1f3fb","\uD83E\uDD38\uD83C\uDFFF":"1f938-1f3ff","\uD83E\uDD38\uD83C\uDFFE":"1f938-1f3fe","\uD83E\uDD38\uD83C\uDFFD":"1f938-1f3fd","\uD83E\uDD38\uD83C\uDFFC":"1f938-1f3fc","\uD83E\uDD38\uD83C\uDFFB":"1f938-1f3fb","\uD83E\uDD37\uD83C\uDFFF":"1f937-1f3ff","\uD83E\uDD37\uD83C\uDFFE":"1f937-1f3fe","\uD83E\uDD37\uD83C\uDFFD":"1f937-1f3fd","\uD83E\uDD37\uD83C\uDFFC":"1f937-1f3fc","\uD83E\uDD37\uD83C\uDFFB":"1f937-1f3fb","\uD83E\uDD36\uD83C\uDFFF":"1f936-1f3ff","\uD83E\uDD36\uD83C\uDFFE":"1f936-1f3fe","\uD83E\uDD36\uD83C\uDFFD":"1f936-1f3fd","\uD83E\uDD36\uD83C\uDFFC":"1f936-1f3fc","\uD83E\uDD36\uD83C\uDFFB":"1f936-1f3fb","\uD83E\uDD35\uD83C\uDFFF":"1f935-1f3ff","\uD83E\uDD35\uD83C\uDFFE":"1f935-1f3fe","\uD83E\uDD35\uD83C\uDFFD":"1f935-1f3fd","\uD83E\uDD35\uD83C\uDFFC":"1f935-1f3fc","\uD83E\uDD35\uD83C\uDFFB":"1f935-1f3fb","\uD83E\uDD34\uD83C\uDFFF":"1f934-1f3ff","\uD83E\uDD34\uD83C\uDFFE":"1f934-1f3fe","\uD83E\uDD34\uD83C\uDFFD":"1f934-1f3fd","\uD83E\uDD34\uD83C\uDFFC":"1f934-1f3fc","\uD83E\uDD34\uD83C\uDFFB":"1f934-1f3fb","\uD83E\uDD33\uD83C\uDFFF":"1f933-1f3ff","\uD83E\uDD33\uD83C\uDFFE":"1f933-1f3fe","\uD83E\uDD33\uD83C\uDFFD":"1f933-1f3fd","\uD83E\uDD33\uD83C\uDFFC":"1f933-1f3fc","\uD83E\uDD33\uD83C\uDFFB":"1f933-1f3fb","\uD83E\uDD30\uD83C\uDFFF":"1f930-1f3ff","\uD83E\uDD30\uD83C\uDFFE":"1f930-1f3fe","\uD83E\uDD30\uD83C\uDFFD":"1f930-1f3fd","\uD83E\uDD30\uD83C\uDFFC":"1f930-1f3fc","\uD83E\uDD30\uD83C\uDFFB":"1f930-1f3fb","\uD83E\uDD26\uD83C\uDFFF":"1f926-1f3ff","\uD83E\uDD26\uD83C\uDFFE":"1f926-1f3fe","\uD83E\uDD26\uD83C\uDFFD":"1f926-1f3fd","\uD83E\uDD26\uD83C\uDFFC":"1f926-1f3fc","\uD83E\uDD26\uD83C\uDFFB":"1f926-1f3fb","\uD83E\uDD1E\uD83C\uDFFF":"1f91e-1f3ff","\uD83E\uDD1E\uD83C\uDFFE":"1f91e-1f3fe","\uD83E\uDD1E\uD83C\uDFFD":"1f91e-1f3fd","\uD83E\uDD1E\uD83C\uDFFC":"1f91e-1f3fc","\uD83E\uDD1E\uD83C\uDFFB":"1f91e-1f3fb","\uD83E\uDD1D\uD83C\uDFFF":"1f91d-1f3ff","\uD83E\uDD1D\uD83C\uDFFE":"1f91d-1f3fe","\uD83E\uDD1D\uD83C\uDFFD":"1f91d-1f3fd","\uD83E\uDD1D\uD83C\uDFFC":"1f91d-1f3fc","\uD83E\uDD1D\uD83C\uDFFB":"1f91d-1f3fb","\uD83E\uDD1C\uD83C\uDFFF":"1f91c-1f3ff","\uD83E\uDD1C\uD83C\uDFFE":"1f91c-1f3fe","\uD83E\uDD1C\uD83C\uDFFD":"1f91c-1f3fd","\uD83E\uDD1C\uD83C\uDFFC":"1f91c-1f3fc","\uD83E\uDD1C\uD83C\uDFFB":"1f91c-1f3fb","\uD83E\uDD1B\uD83C\uDFFF":"1f91b-1f3ff","\uD83E\uDD1B\uD83C\uDFFE":"1f91b-1f3fe","\uD83E\uDD1B\uD83C\uDFFD":"1f91b-1f3fd","\uD83E\uDD1B\uD83C\uDFFC":"1f91b-1f3fc","\uD83E\uDD1B\uD83C\uDFFB":"1f91b-1f3fb","\uD83E\uDD1A\uD83C\uDFFF":"1f91a-1f3ff","\uD83E\uDD1A\uD83C\uDFFE":"1f91a-1f3fe","\uD83E\uDD1A\uD83C\uDFFD":"1f91a-1f3fd","\uD83E\uDD1A\uD83C\uDFFC":"1f91a-1f3fc","\uD83E\uDD1A\uD83C\uDFFB":"1f91a-1f3fb","\uD83E\uDD19\uD83C\uDFFF":"1f919-1f3ff","\uD83E\uDD19\uD83C\uDFFE":"1f919-1f3fe","\uD83E\uDD19\uD83C\uDFFD":"1f919-1f3fd","\uD83E\uDD19\uD83C\uDFFC":"1f919-1f3fc","\uD83E\uDD19\uD83C\uDFFB":"1f919-1f3fb","\uD83E\uDD18\uD83C\uDFFF":"1f918-1f3ff","\uD83E\uDD18\uD83C\uDFFE":"1f918-1f3fe","\uD83E\uDD18\uD83C\uDFFD":"1f918-1f3fd","\uD83E\uDD18\uD83C\uDFFC":"1f918-1f3fc","\uD83E\uDD18\uD83C\uDFFB":"1f918-1f3fb","\uD83D\uDEC0\uD83C\uDFFF":"1f6c0-1f3ff","\uD83D\uDEC0\uD83C\uDFFE":"1f6c0-1f3fe","\uD83D\uDEC0\uD83C\uDFFD":"1f6c0-1f3fd","\uD83D\uDEC0\uD83C\uDFFC":"1f6c0-1f3fc","\uD83D\uDEC0\uD83C\uDFFB":"1f6c0-1f3fb","\uD83D\uDEB6\uD83C\uDFFF":"1f6b6-1f3ff","\uD83D\uDEB6\uD83C\uDFFE":"1f6b6-1f3fe","\uD83D\uDEB6\uD83C\uDFFD":"1f6b6-1f3fd","\uD83D\uDEB6\uD83C\uDFFC":"1f6b6-1f3fc","\uD83D\uDEB6\uD83C\uDFFB":"1f6b6-1f3fb","\uD83D\uDEB5\uD83C\uDFFF":"1f6b5-1f3ff","\uD83D\uDEB5\uD83C\uDFFE":"1f6b5-1f3fe","\uD83D\uDEB5\uD83C\uDFFD":"1f6b5-1f3fd","\uD83D\uDEB5\uD83C\uDFFC":"1f6b5-1f3fc","\uD83D\uDEB5\uD83C\uDFFB":"1f6b5-1f3fb","\uD83D\uDEB4\uD83C\uDFFF":"1f6b4-1f3ff","\uD83D\uDEB4\uD83C\uDFFE":"1f6b4-1f3fe","\uD83D\uDEB4\uD83C\uDFFD":"1f6b4-1f3fd","\uD83D\uDEB4\uD83C\uDFFC":"1f6b4-1f3fc","\uD83D\uDEB4\uD83C\uDFFB":"1f6b4-1f3fb","\uD83D\uDEA3\uD83C\uDFFF":"1f6a3-1f3ff","\uD83D\uDEA3\uD83C\uDFFE":"1f6a3-1f3fe","\uD83D\uDEA3\uD83C\uDFFD":"1f6a3-1f3fd","\uD83D\uDEA3\uD83C\uDFFC":"1f6a3-1f3fc","\uD83D\uDEA3\uD83C\uDFFB":"1f6a3-1f3fb","\uD83D\uDE4F\uD83C\uDFFF":"1f64f-1f3ff","\uD83D\uDE4F\uD83C\uDFFE":"1f64f-1f3fe","\uD83D\uDE4F\uD83C\uDFFD":"1f64f-1f3fd","\uD83D\uDE4F\uD83C\uDFFC":"1f64f-1f3fc","\uD83D\uDE4F\uD83C\uDFFB":"1f64f-1f3fb","\uD83D\uDE4E\uD83C\uDFFF":"1f64e-1f3ff","\uD83D\uDE4E\uD83C\uDFFE":"1f64e-1f3fe","\uD83D\uDE4E\uD83C\uDFFD":"1f64e-1f3fd","\uD83D\uDE4E\uD83C\uDFFC":"1f64e-1f3fc","\uD83D\uDE4E\uD83C\uDFFB":"1f64e-1f3fb","\uD83D\uDE4D\uD83C\uDFFF":"1f64d-1f3ff","\uD83D\uDE4D\uD83C\uDFFE":"1f64d-1f3fe","\uD83D\uDE4D\uD83C\uDFFD":"1f64d-1f3fd","\uD83D\uDE4D\uD83C\uDFFC":"1f64d-1f3fc","\uD83D\uDE4D\uD83C\uDFFB":"1f64d-1f3fb","\uD83D\uDE4C\uD83C\uDFFF":"1f64c-1f3ff","\uD83D\uDE4C\uD83C\uDFFE":"1f64c-1f3fe","\uD83D\uDE4C\uD83C\uDFFD":"1f64c-1f3fd","\uD83D\uDE4C\uD83C\uDFFC":"1f64c-1f3fc","\uD83D\uDE4C\uD83C\uDFFB":"1f64c-1f3fb","\uD83D\uDE4B\uD83C\uDFFF":"1f64b-1f3ff","\uD83D\uDE4B\uD83C\uDFFE":"1f64b-1f3fe","\uD83D\uDE4B\uD83C\uDFFD":"1f64b-1f3fd","\uD83D\uDE4B\uD83C\uDFFC":"1f64b-1f3fc","\uD83D\uDE4B\uD83C\uDFFB":"1f64b-1f3fb","\uD83D\uDE47\uD83C\uDFFF":"1f647-1f3ff","\uD83D\uDE47\uD83C\uDFFE":"1f647-1f3fe","\uD83D\uDE47\uD83C\uDFFD":"1f647-1f3fd","\uD83D\uDE47\uD83C\uDFFC":"1f647-1f3fc","\uD83D\uDE47\uD83C\uDFFB":"1f647-1f3fb","\uD83D\uDE46\uD83C\uDFFF":"1f646-1f3ff","\uD83D\uDE46\uD83C\uDFFE":"1f646-1f3fe","\uD83D\uDE46\uD83C\uDFFD":"1f646-1f3fd","\uD83D\uDE46\uD83C\uDFFC":"1f646-1f3fc","\uD83D\uDE46\uD83C\uDFFB":"1f646-1f3fb","\uD83D\uDE45\uD83C\uDFFF":"1f645-1f3ff","\uD83D\uDE45\uD83C\uDFFE":"1f645-1f3fe","\uD83D\uDE45\uD83C\uDFFD":"1f645-1f3fd","\uD83D\uDE45\uD83C\uDFFC":"1f645-1f3fc","\uD83D\uDE45\uD83C\uDFFB":"1f645-1f3fb","\uD83D\uDD96\uD83C\uDFFF":"1f596-1f3ff","\uD83D\uDD96\uD83C\uDFFE":"1f596-1f3fe","\uD83D\uDD96\uD83C\uDFFD":"1f596-1f3fd","\uD83D\uDD96\uD83C\uDFFC":"1f596-1f3fc","\uD83D\uDD96\uD83C\uDFFB":"1f596-1f3fb","\uD83D\uDD95\uD83C\uDFFF":"1f595-1f3ff","\uD83D\uDD95\uD83C\uDFFE":"1f595-1f3fe","\uD83D\uDD95\uD83C\uDFFD":"1f595-1f3fd","\uD83D\uDD95\uD83C\uDFFC":"1f595-1f3fc","\uD83D\uDD95\uD83C\uDFFB":"1f595-1f3fb","\uD83D\uDD90\uD83C\uDFFF":"1f590-1f3ff","\uD83D\uDD90\uD83C\uDFFE":"1f590-1f3fe","\uD83D\uDD90\uD83C\uDFFD":"1f590-1f3fd","\uD83D\uDD90\uD83C\uDFFC":"1f590-1f3fc","\uD83D\uDD90\uD83C\uDFFB":"1f590-1f3fb","\uD83D\uDD7A\uD83C\uDFFF":"1f57a-1f3ff","\uD83D\uDD7A\uD83C\uDFFE":"1f57a-1f3fe","\uD83D\uDD7A\uD83C\uDFFD":"1f57a-1f3fd","\uD83D\uDD7A\uD83C\uDFFC":"1f57a-1f3fc","\uD83D\uDD7A\uD83C\uDFFB":"1f57a-1f3fb","\uD83D\uDD75\uD83C\uDFFF":"1f575-1f3ff","\uD83D\uDD75\uD83C\uDFFE":"1f575-1f3fe","\uD83D\uDD75\uD83C\uDFFD":"1f575-1f3fd","\uD83D\uDD75\uD83C\uDFFC":"1f575-1f3fc","\uD83D\uDD75\uD83C\uDFFB":"1f575-1f3fb","\uD83D\uDCAA\uD83C\uDFFF":"1f4aa-1f3ff","\uD83D\uDCAA\uD83C\uDFFE":"1f4aa-1f3fe","\uD83D\uDCAA\uD83C\uDFFD":"1f4aa-1f3fd","\uD83D\uDCAA\uD83C\uDFFC":"1f4aa-1f3fc","\uD83D\uDCAA\uD83C\uDFFB":"1f4aa-1f3fb","\uD83D\uDC87\uD83C\uDFFF":"1f487-1f3ff","\uD83D\uDC87\uD83C\uDFFE":"1f487-1f3fe","\uD83D\uDC87\uD83C\uDFFD":"1f487-1f3fd","\uD83D\uDC87\uD83C\uDFFC":"1f487-1f3fc","\uD83D\uDC87\uD83C\uDFFB":"1f487-1f3fb","\uD83D\uDC86\uD83C\uDFFF":"1f486-1f3ff","\uD83D\uDC86\uD83C\uDFFE":"1f486-1f3fe","\uD83D\uDC86\uD83C\uDFFD":"1f486-1f3fd","\uD83D\uDC86\uD83C\uDFFC":"1f486-1f3fc","\uD83D\uDC86\uD83C\uDFFB":"1f486-1f3fb","\uD83D\uDC85\uD83C\uDFFF":"1f485-1f3ff","\uD83D\uDC85\uD83C\uDFFE":"1f485-1f3fe","\uD83D\uDC85\uD83C\uDFFD":"1f485-1f3fd","\uD83D\uDC85\uD83C\uDFFC":"1f485-1f3fc","\uD83D\uDC85\uD83C\uDFFB":"1f485-1f3fb","\uD83D\uDC83\uD83C\uDFFF":"1f483-1f3ff","\uD83D\uDC83\uD83C\uDFFE":"1f483-1f3fe","\uD83D\uDC83\uD83C\uDFFD":"1f483-1f3fd","\uD83D\uDC83\uD83C\uDFFC":"1f483-1f3fc","\uD83D\uDC83\uD83C\uDFFB":"1f483-1f3fb","\uD83D\uDC82\uD83C\uDFFF":"1f482-1f3ff","\uD83D\uDC82\uD83C\uDFFE":"1f482-1f3fe","\uD83D\uDC82\uD83C\uDFFD":"1f482-1f3fd","\uD83D\uDC82\uD83C\uDFFC":"1f482-1f3fc","\uD83D\uDC82\uD83C\uDFFB":"1f482-1f3fb","\uD83D\uDC81\uD83C\uDFFF":"1f481-1f3ff","\uD83D\uDC81\uD83C\uDFFE":"1f481-1f3fe","\uD83D\uDC81\uD83C\uDFFD":"1f481-1f3fd","\uD83D\uDC81\uD83C\uDFFC":"1f481-1f3fc","\uD83D\uDC81\uD83C\uDFFB":"1f481-1f3fb","\uD83D\uDC7C\uD83C\uDFFF":"1f47c-1f3ff","\uD83D\uDC7C\uD83C\uDFFE":"1f47c-1f3fe","\uD83D\uDC7C\uD83C\uDFFD":"1f47c-1f3fd","\uD83D\uDC7C\uD83C\uDFFC":"1f47c-1f3fc","\uD83D\uDC7C\uD83C\uDFFB":"1f47c-1f3fb","\uD83D\uDC78\uD83C\uDFFF":"1f478-1f3ff","\uD83D\uDC78\uD83C\uDFFE":"1f478-1f3fe","\uD83D\uDC78\uD83C\uDFFD":"1f478-1f3fd","\uD83D\uDC78\uD83C\uDFFC":"1f478-1f3fc","\uD83D\uDC78\uD83C\uDFFB":"1f478-1f3fb","\uD83D\uDC77\uD83C\uDFFF":"1f477-1f3ff","\uD83D\uDC77\uD83C\uDFFE":"1f477-1f3fe","\uD83D\uDC77\uD83C\uDFFD":"1f477-1f3fd","\uD83D\uDC77\uD83C\uDFFC":"1f477-1f3fc","\uD83D\uDC77\uD83C\uDFFB":"1f477-1f3fb","\uD83D\uDC76\uD83C\uDFFF":"1f476-1f3ff","\uD83D\uDC76\uD83C\uDFFE":"1f476-1f3fe","\uD83D\uDC76\uD83C\uDFFD":"1f476-1f3fd","\uD83D\uDC76\uD83C\uDFFC":"1f476-1f3fc","\uD83D\uDC76\uD83C\uDFFB":"1f476-1f3fb","\uD83D\uDC75\uD83C\uDFFF":"1f475-1f3ff","\uD83D\uDC75\uD83C\uDFFE":"1f475-1f3fe","\uD83D\uDC75\uD83C\uDFFD":"1f475-1f3fd","\uD83D\uDC75\uD83C\uDFFC":"1f475-1f3fc","\uD83D\uDC75\uD83C\uDFFB":"1f475-1f3fb","\uD83D\uDC74\uD83C\uDFFF":"1f474-1f3ff","\uD83D\uDC74\uD83C\uDFFE":"1f474-1f3fe","\uD83D\uDC74\uD83C\uDFFD":"1f474-1f3fd","\uD83D\uDC74\uD83C\uDFFC":"1f474-1f3fc","\uD83D\uDC74\uD83C\uDFFB":"1f474-1f3fb","\uD83D\uDC73\uD83C\uDFFF":"1f473-1f3ff","\uD83D\uDC73\uD83C\uDFFE":"1f473-1f3fe","\uD83D\uDC73\uD83C\uDFFD":"1f473-1f3fd","\uD83D\uDC73\uD83C\uDFFC":"1f473-1f3fc","\uD83D\uDC73\uD83C\uDFFB":"1f473-1f3fb","\uD83D\uDC72\uD83C\uDFFF":"1f472-1f3ff","\uD83D\uDC72\uD83C\uDFFE":"1f472-1f3fe","\uD83D\uDC72\uD83C\uDFFD":"1f472-1f3fd","\uD83D\uDC72\uD83C\uDFFC":"1f472-1f3fc","\uD83D\uDC72\uD83C\uDFFB":"1f472-1f3fb","\uD83D\uDC71\uD83C\uDFFF":"1f471-1f3ff","\uD83D\uDC71\uD83C\uDFFE":"1f471-1f3fe","\uD83D\uDC71\uD83C\uDFFD":"1f471-1f3fd","\uD83D\uDC71\uD83C\uDFFC":"1f471-1f3fc","\uD83D\uDC71\uD83C\uDFFB":"1f471-1f3fb","\uD83D\uDC70\uD83C\uDFFF":"1f470-1f3ff","\uD83D\uDC70\uD83C\uDFFE":"1f470-1f3fe","\uD83D\uDC70\uD83C\uDFFD":"1f470-1f3fd","\uD83D\uDC70\uD83C\uDFFC":"1f470-1f3fc","\uD83D\uDC70\uD83C\uDFFB":"1f470-1f3fb","\uD83D\uDC6E\uD83C\uDFFF":"1f46e-1f3ff","\uD83D\uDC6E\uD83C\uDFFE":"1f46e-1f3fe","\uD83D\uDC6E\uD83C\uDFFD":"1f46e-1f3fd","\uD83D\uDC6E\uD83C\uDFFC":"1f46e-1f3fc","\uD83D\uDC6E\uD83C\uDFFB":"1f46e-1f3fb","\uD83D\uDC69\uD83C\uDFFF":"1f469-1f3ff","\uD83D\uDC69\uD83C\uDFFE":"1f469-1f3fe","\uD83D\uDC69\uD83C\uDFFD":"1f469-1f3fd","\uD83D\uDC69\uD83C\uDFFC":"1f469-1f3fc","\uD83D\uDC69\uD83C\uDFFB":"1f469-1f3fb","\uD83D\uDC68\uD83C\uDFFF":"1f468-1f3ff","\uD83D\uDC68\uD83C\uDFFE":"1f468-1f3fe","\uD83D\uDC68\uD83C\uDFFD":"1f468-1f3fd","\uD83D\uDC68\uD83C\uDFFC":"1f468-1f3fc","\uD83D\uDC68\uD83C\uDFFB":"1f468-1f3fb","\uD83D\uDC67\uD83C\uDFFF":"1f467-1f3ff","\uD83D\uDC67\uD83C\uDFFE":"1f467-1f3fe","\uD83D\uDC67\uD83C\uDFFD":"1f467-1f3fd","\uD83D\uDC67\uD83C\uDFFC":"1f467-1f3fc","\uD83D\uDC67\uD83C\uDFFB":"1f467-1f3fb","\uD83D\uDC66\uD83C\uDFFF":"1f466-1f3ff","\uD83D\uDC66\uD83C\uDFFE":"1f466-1f3fe","\uD83D\uDC66\uD83C\uDFFD":"1f466-1f3fd","\uD83D\uDC66\uD83C\uDFFC":"1f466-1f3fc","\uD83D\uDC66\uD83C\uDFFB":"1f466-1f3fb","\uD83D\uDC50\uD83C\uDFFF":"1f450-1f3ff","\uD83D\uDC50\uD83C\uDFFE":"1f450-1f3fe","\uD83D\uDC50\uD83C\uDFFD":"1f450-1f3fd","\uD83D\uDC50\uD83C\uDFFC":"1f450-1f3fc","\uD83D\uDC50\uD83C\uDFFB":"1f450-1f3fb","\uD83D\uDC4F\uD83C\uDFFF":"1f44f-1f3ff","\uD83D\uDC4F\uD83C\uDFFE":"1f44f-1f3fe","\uD83D\uDC4F\uD83C\uDFFD":"1f44f-1f3fd","\uD83D\uDC4F\uD83C\uDFFC":"1f44f-1f3fc","\uD83D\uDC4F\uD83C\uDFFB":"1f44f-1f3fb","\uD83D\uDC4E\uD83C\uDFFF":"1f44e-1f3ff","\uD83D\uDC4E\uD83C\uDFFE":"1f44e-1f3fe","\uD83D\uDC4E\uD83C\uDFFD":"1f44e-1f3fd","\uD83D\uDC4E\uD83C\uDFFC":"1f44e-1f3fc","\uD83D\uDC4E\uD83C\uDFFB":"1f44e-1f3fb","\uD83D\uDC4D\uD83C\uDFFF":"1f44d-1f3ff","\uD83D\uDC4D\uD83C\uDFFE":"1f44d-1f3fe","\uD83D\uDC4D\uD83C\uDFFD":"1f44d-1f3fd","\uD83D\uDC4D\uD83C\uDFFC":"1f44d-1f3fc","\uD83D\uDC4D\uD83C\uDFFB":"1f44d-1f3fb","\uD83D\uDC4C\uD83C\uDFFF":"1f44c-1f3ff","\uD83D\uDC4C\uD83C\uDFFE":"1f44c-1f3fe","\uD83D\uDC4C\uD83C\uDFFD":"1f44c-1f3fd","\uD83D\uDC4C\uD83C\uDFFC":"1f44c-1f3fc","\uD83D\uDC4C\uD83C\uDFFB":"1f44c-1f3fb","\uD83D\uDC4B\uD83C\uDFFF":"1f44b-1f3ff","\uD83D\uDC4B\uD83C\uDFFE":"1f44b-1f3fe","\uD83D\uDC4B\uD83C\uDFFD":"1f44b-1f3fd","\uD83D\uDC4B\uD83C\uDFFC":"1f44b-1f3fc","\uD83D\uDC4B\uD83C\uDFFB":"1f44b-1f3fb","\uD83D\uDC4A\uD83C\uDFFF":"1f44a-1f3ff","\uD83D\uDC4A\uD83C\uDFFE":"1f44a-1f3fe","\uD83D\uDC4A\uD83C\uDFFD":"1f44a-1f3fd","\uD83D\uDC4A\uD83C\uDFFC":"1f44a-1f3fc","\uD83D\uDC4A\uD83C\uDFFB":"1f44a-1f3fb","\uD83D\uDC49\uD83C\uDFFF":"1f449-1f3ff","\uD83D\uDC49\uD83C\uDFFE":"1f449-1f3fe","\uD83D\uDC49\uD83C\uDFFD":"1f449-1f3fd","\uD83D\uDC49\uD83C\uDFFC":"1f449-1f3fc","\uD83D\uDC49\uD83C\uDFFB":"1f449-1f3fb","\uD83D\uDC48\uD83C\uDFFF":"1f448-1f3ff","\uD83D\uDC48\uD83C\uDFFE":"1f448-1f3fe","\uD83D\uDC48\uD83C\uDFFD":"1f448-1f3fd","\uD83D\uDC48\uD83C\uDFFC":"1f448-1f3fc","\uD83D\uDC48\uD83C\uDFFB":"1f448-1f3fb","\uD83D\uDC47\uD83C\uDFFF":"1f447-1f3ff","\uD83D\uDC47\uD83C\uDFFE":"1f447-1f3fe","\uD83D\uDC47\uD83C\uDFFD":"1f447-1f3fd","\uD83D\uDC47\uD83C\uDFFC":"1f447-1f3fc","\uD83D\uDC47\uD83C\uDFFB":"1f447-1f3fb","\uD83D\uDC46\uD83C\uDFFF":"1f446-1f3ff","\uD83D\uDC46\uD83C\uDFFE":"1f446-1f3fe","\uD83D\uDC46\uD83C\uDFFD":"1f446-1f3fd","\uD83D\uDC46\uD83C\uDFFC":"1f446-1f3fc","\uD83D\uDC46\uD83C\uDFFB":"1f446-1f3fb","\uD83D\uDC43\uD83C\uDFFF":"1f443-1f3ff","\uD83D\uDC43\uD83C\uDFFE":"1f443-1f3fe","\uD83D\uDC43\uD83C\uDFFD":"1f443-1f3fd","\uD83D\uDC43\uD83C\uDFFC":"1f443-1f3fc","\uD83D\uDC43\uD83C\uDFFB":"1f443-1f3fb","\uD83D\uDC42\uD83C\uDFFF":"1f442-1f3ff","\uD83D\uDC42\uD83C\uDFFE":"1f442-1f3fe","\uD83D\uDC42\uD83C\uDFFD":"1f442-1f3fd","\uD83D\uDC42\uD83C\uDFFC":"1f442-1f3fc","\uD83D\uDC42\uD83C\uDFFB":"1f442-1f3fb","\uD83C\uDFCB\uD83C\uDFFF":"1f3cb-1f3ff","\uD83C\uDFCB\uD83C\uDFFE":"1f3cb-1f3fe","\uD83C\uDFCB\uD83C\uDFFD":"1f3cb-1f3fd","\uD83C\uDFCB\uD83C\uDFFC":"1f3cb-1f3fc","\uD83C\uDFCB\uD83C\uDFFB":"1f3cb-1f3fb","\uD83C\uDFCA\uD83C\uDFFF":"1f3ca-1f3ff","\uD83C\uDFCA\uD83C\uDFFE":"1f3ca-1f3fe","\uD83C\uDFCA\uD83C\uDFFD":"1f3ca-1f3fd","\uD83C\uDFCA\uD83C\uDFFC":"1f3ca-1f3fc","\uD83C\uDFCA\uD83C\uDFFB":"1f3ca-1f3fb","\uD83C\uDFC7\uD83C\uDFFF":"1f3c7-1f3ff","\uD83C\uDFC7\uD83C\uDFFE":"1f3c7-1f3fe","\uD83C\uDFC7\uD83C\uDFFD":"1f3c7-1f3fd","\uD83C\uDFC7\uD83C\uDFFC":"1f3c7-1f3fc","\uD83C\uDFC7\uD83C\uDFFB":"1f3c7-1f3fb","\uD83C\uDFC4\uD83C\uDFFF":"1f3c4-1f3ff","\uD83C\uDFC4\uD83C\uDFFE":"1f3c4-1f3fe","\uD83C\uDFC4\uD83C\uDFFD":"1f3c4-1f3fd","\uD83C\uDFC4\uD83C\uDFFC":"1f3c4-1f3fc","\uD83C\uDFC4\uD83C\uDFFB":"1f3c4-1f3fb","\uD83C\uDFC3\uD83C\uDFFF":"1f3c3-1f3ff","\uD83C\uDFC3\uD83C\uDFFE":"1f3c3-1f3fe","\uD83C\uDFC3\uD83C\uDFFD":"1f3c3-1f3fd","\uD83C\uDFC3\uD83C\uDFFC":"1f3c3-1f3fc","\uD83C\uDFC3\uD83C\uDFFB":"1f3c3-1f3fb","\uD83C\uDF85\uD83C\uDFFF":"1f385-1f3ff","\uD83C\uDF85\uD83C\uDFFE":"1f385-1f3fe","\uD83C\uDF85\uD83C\uDFFD":"1f385-1f3fd","\uD83C\uDF85\uD83C\uDFFC":"1f385-1f3fc","\uD83C\uDF85\uD83C\uDFFB":"1f385-1f3fb","\uD83C\uDDFF\uD83C\uDDFC":"1f1ff-1f1fc","\uD83C\uDDFF\uD83C\uDDF2":"1f1ff-1f1f2","\uD83C\uDDFF\uD83C\uDDE6":"1f1ff-1f1e6","\uD83C\uDDFE\uD83C\uDDF9":"1f1fe-1f1f9","\uD83C\uDDFE\uD83C\uDDEA":"1f1fe-1f1ea","\uD83C\uDDFD\uD83C\uDDF0":"1f1fd-1f1f0","\uD83C\uDDFC\uD83C\uDDF8":"1f1fc-1f1f8","\uD83C\uDDFC\uD83C\uDDEB":"1f1fc-1f1eb","\uD83C\uDDFB\uD83C\uDDFA":"1f1fb-1f1fa","\uD83C\uDDFB\uD83C\uDDF3":"1f1fb-1f1f3","\uD83C\uDDFB\uD83C\uDDEE":"1f1fb-1f1ee","\uD83C\uDDFB\uD83C\uDDEC":"1f1fb-1f1ec","\uD83C\uDDFB\uD83C\uDDEA":"1f1fb-1f1ea","\uD83C\uDDFB\uD83C\uDDE8":"1f1fb-1f1e8","\uD83C\uDDFB\uD83C\uDDE6":"1f1fb-1f1e6","\uD83C\uDDFA\uD83C\uDDFF":"1f1fa-1f1ff","\uD83C\uDDFA\uD83C\uDDFE":"1f1fa-1f1fe","\uD83C\uDDFA\uD83C\uDDF8":"1f1fa-1f1f8","\uD83C\uDDFA\uD83C\uDDF2":"1f1fa-1f1f2","\uD83C\uDDFA\uD83C\uDDEC":"1f1fa-1f1ec","\uD83C\uDDFA\uD83C\uDDE6":"1f1fa-1f1e6","\uD83C\uDDF9\uD83C\uDDFF":"1f1f9-1f1ff","\uD83C\uDDF9\uD83C\uDDFC":"1f1f9-1f1fc","\uD83C\uDDF9\uD83C\uDDFB":"1f1f9-1f1fb","\uD83C\uDDF9\uD83C\uDDF9":"1f1f9-1f1f9","\uD83C\uDDF9\uD83C\uDDF7":"1f1f9-1f1f7","\uD83C\uDDF9\uD83C\uDDF4":"1f1f9-1f1f4","\uD83C\uDDF9\uD83C\uDDF3":"1f1f9-1f1f3","\uD83C\uDDF9\uD83C\uDDF2":"1f1f9-1f1f2","\uD83C\uDDF9\uD83C\uDDF1":"1f1f9-1f1f1","\uD83C\uDDF9\uD83C\uDDF0":"1f1f9-1f1f0","\uD83C\uDDF9\uD83C\uDDEF":"1f1f9-1f1ef","\uD83C\uDDF9\uD83C\uDDED":"1f1f9-1f1ed","\uD83C\uDDF9\uD83C\uDDEC":"1f1f9-1f1ec","\uD83C\uDDF9\uD83C\uDDEB":"1f1f9-1f1eb","\uD83C\uDDF9\uD83C\uDDE9":"1f1f9-1f1e9","\uD83C\uDDF9\uD83C\uDDE8":"1f1f9-1f1e8","\uD83C\uDDF9\uD83C\uDDE6":"1f1f9-1f1e6","\uD83C\uDDF8\uD83C\uDDFF":"1f1f8-1f1ff","\uD83C\uDDF8\uD83C\uDDFE":"1f1f8-1f1fe","\uD83C\uDDF8\uD83C\uDDFD":"1f1f8-1f1fd","\uD83C\uDDF8\uD83C\uDDFB":"1f1f8-1f1fb","\uD83C\uDDF8\uD83C\uDDF9":"1f1f8-1f1f9","\uD83C\uDDF8\uD83C\uDDF8":"1f1f8-1f1f8","\uD83C\uDDF8\uD83C\uDDF7":"1f1f8-1f1f7","\uD83C\uDDF8\uD83C\uDDF4":"1f1f8-1f1f4","\uD83C\uDDF8\uD83C\uDDF3":"1f1f8-1f1f3","\uD83C\uDDF8\uD83C\uDDF2":"1f1f8-1f1f2","\uD83C\uDDF8\uD83C\uDDF1":"1f1f8-1f1f1","\uD83C\uDDF8\uD83C\uDDF0":"1f1f8-1f1f0","\uD83C\uDDF8\uD83C\uDDEF":"1f1f8-1f1ef","\uD83C\uDDF8\uD83C\uDDEE":"1f1f8-1f1ee","\uD83C\uDDF8\uD83C\uDDED":"1f1f8-1f1ed","\uD83C\uDDF8\uD83C\uDDEC":"1f1f8-1f1ec","\uD83C\uDDF8\uD83C\uDDEA":"1f1f8-1f1ea","\uD83C\uDDF8\uD83C\uDDE9":"1f1f8-1f1e9","\uD83C\uDDF8\uD83C\uDDE8":"1f1f8-1f1e8","\uD83C\uDDF8\uD83C\uDDE7":"1f1f8-1f1e7","\uD83C\uDDF8\uD83C\uDDE6":"1f1f8-1f1e6","\uD83C\uDDF7\uD83C\uDDFC":"1f1f7-1f1fc","\uD83C\uDDF7\uD83C\uDDFA":"1f1f7-1f1fa","\uD83C\uDDF7\uD83C\uDDF8":"1f1f7-1f1f8","\uD83C\uDDF7\uD83C\uDDF4":"1f1f7-1f1f4","\uD83C\uDDF7\uD83C\uDDEA":"1f1f7-1f1ea","\uD83C\uDDF6\uD83C\uDDE6":"1f1f6-1f1e6","\uD83C\uDDF5\uD83C\uDDFE":"1f1f5-1f1fe","\uD83C\uDDF5\uD83C\uDDFC":"1f1f5-1f1fc","\uD83C\uDDF5\uD83C\uDDF9":"1f1f5-1f1f9","\uD83C\uDDF5\uD83C\uDDF8":"1f1f5-1f1f8","\uD83C\uDDF5\uD83C\uDDF7":"1f1f5-1f1f7","\uD83C\uDDF5\uD83C\uDDF3":"1f1f5-1f1f3","\uD83C\uDDF5\uD83C\uDDF2":"1f1f5-1f1f2","\uD83C\uDDF5\uD83C\uDDF1":"1f1f5-1f1f1","\uD83C\uDDF5\uD83C\uDDF0":"1f1f5-1f1f0","\uD83C\uDDF5\uD83C\uDDED":"1f1f5-1f1ed","\uD83C\uDDF5\uD83C\uDDEC":"1f1f5-1f1ec","\uD83C\uDDF5\uD83C\uDDEB":"1f1f5-1f1eb","\uD83C\uDDF5\uD83C\uDDEA":"1f1f5-1f1ea","\uD83C\uDDF5\uD83C\uDDE6":"1f1f5-1f1e6","\uD83C\uDDF4\uD83C\uDDF2":"1f1f4-1f1f2","\uD83C\uDDF3\uD83C\uDDFF":"1f1f3-1f1ff","\uD83C\uDDF3\uD83C\uDDFA":"1f1f3-1f1fa","\uD83C\uDDF3\uD83C\uDDF7":"1f1f3-1f1f7","\uD83C\uDDF3\uD83C\uDDF5":"1f1f3-1f1f5","\uD83C\uDDF3\uD83C\uDDF4":"1f1f3-1f1f4","\uD83C\uDDF3\uD83C\uDDF1":"1f1f3-1f1f1","\uD83C\uDDF3\uD83C\uDDEE":"1f1f3-1f1ee","\uD83C\uDDF3\uD83C\uDDEC":"1f1f3-1f1ec","\uD83C\uDDF3\uD83C\uDDEB":"1f1f3-1f1eb","\uD83C\uDDF3\uD83C\uDDEA":"1f1f3-1f1ea","\uD83C\uDDF3\uD83C\uDDE8":"1f1f3-1f1e8","\uD83C\uDDF3\uD83C\uDDE6":"1f1f3-1f1e6","\uD83C\uDDF2\uD83C\uDDFF":"1f1f2-1f1ff","\uD83C\uDDF2\uD83C\uDDFE":"1f1f2-1f1fe","\uD83C\uDDF2\uD83C\uDDFD":"1f1f2-1f1fd","\uD83C\uDDF2\uD83C\uDDFC":"1f1f2-1f1fc","\uD83C\uDDF2\uD83C\uDDFB":"1f1f2-1f1fb","\uD83C\uDDF2\uD83C\uDDFA":"1f1f2-1f1fa","\uD83C\uDDF2\uD83C\uDDF9":"1f1f2-1f1f9","\uD83C\uDDF2\uD83C\uDDF8":"1f1f2-1f1f8","\uD83C\uDDF2\uD83C\uDDF7":"1f1f2-1f1f7","\uD83C\uDDF2\uD83C\uDDF6":"1f1f2-1f1f6","\uD83C\uDDF2\uD83C\uDDF5":"1f1f2-1f1f5","\uD83C\uDDF2\uD83C\uDDF4":"1f1f2-1f1f4","\uD83C\uDDF2\uD83C\uDDF3":"1f1f2-1f1f3","\uD83C\uDDF2\uD83C\uDDF2":"1f1f2-1f1f2","\uD83C\uDDF2\uD83C\uDDF1":"1f1f2-1f1f1","\uD83C\uDDF2\uD83C\uDDF0":"1f1f2-1f1f0","\uD83C\uDDF2\uD83C\uDDED":"1f1f2-1f1ed","\uD83C\uDDF2\uD83C\uDDEC":"1f1f2-1f1ec","\uD83C\uDDF2\uD83C\uDDEB":"1f1f2-1f1eb","\uD83C\uDDF2\uD83C\uDDEA":"1f1f2-1f1ea","\uD83C\uDDF2\uD83C\uDDE9":"1f1f2-1f1e9","\uD83C\uDDF2\uD83C\uDDE8":"1f1f2-1f1e8","\uD83C\uDDF2\uD83C\uDDE6":"1f1f2-1f1e6","\uD83C\uDDF1\uD83C\uDDFE":"1f1f1-1f1fe","\uD83C\uDDF1\uD83C\uDDFB":"1f1f1-1f1fb","\uD83C\uDDF1\uD83C\uDDFA":"1f1f1-1f1fa","\uD83C\uDDF1\uD83C\uDDF9":"1f1f1-1f1f9","\uD83C\uDDF1\uD83C\uDDF8":"1f1f1-1f1f8","\uD83C\uDDF1\uD83C\uDDF7":"1f1f1-1f1f7","\uD83C\uDDF1\uD83C\uDDF0":"1f1f1-1f1f0","\uD83C\uDDF1\uD83C\uDDEE":"1f1f1-1f1ee","\uD83C\uDDF1\uD83C\uDDE8":"1f1f1-1f1e8","\uD83C\uDDF1\uD83C\uDDE7":"1f1f1-1f1e7","\uD83C\uDDF1\uD83C\uDDE6":"1f1f1-1f1e6","\uD83C\uDDF0\uD83C\uDDFF":"1f1f0-1f1ff","\uD83C\uDDF0\uD83C\uDDFE":"1f1f0-1f1fe","\uD83C\uDDF0\uD83C\uDDFC":"1f1f0-1f1fc","\uD83C\uDDF0\uD83C\uDDF7":"1f1f0-1f1f7","\uD83C\uDDF0\uD83C\uDDF5":"1f1f0-1f1f5","\uD83C\uDDF0\uD83C\uDDF3":"1f1f0-1f1f3","\uD83C\uDDF0\uD83C\uDDF2":"1f1f0-1f1f2","\uD83C\uDDF0\uD83C\uDDEE":"1f1f0-1f1ee","\uD83C\uDDF0\uD83C\uDDED":"1f1f0-1f1ed","\uD83C\uDDF0\uD83C\uDDEC":"1f1f0-1f1ec","\uD83C\uDDF0\uD83C\uDDEA":"1f1f0-1f1ea","\uD83C\uDDEF\uD83C\uDDF5":"1f1ef-1f1f5","\uD83C\uDDEF\uD83C\uDDF4":"1f1ef-1f1f4","\uD83C\uDDEF\uD83C\uDDF2":"1f1ef-1f1f2","\uD83C\uDDEF\uD83C\uDDEA":"1f1ef-1f1ea","\uD83C\uDDEE\uD83C\uDDF9":"1f1ee-1f1f9","\uD83C\uDDEE\uD83C\uDDF8":"1f1ee-1f1f8","\uD83C\uDDEE\uD83C\uDDF7":"1f1ee-1f1f7","\uD83C\uDDEE\uD83C\uDDF6":"1f1ee-1f1f6","\uD83C\uDDEE\uD83C\uDDF4":"1f1ee-1f1f4","\uD83C\uDDEE\uD83C\uDDF3":"1f1ee-1f1f3","\uD83C\uDDEE\uD83C\uDDF2":"1f1ee-1f1f2","\uD83C\uDDEE\uD83C\uDDF1":"1f1ee-1f1f1","\uD83C\uDDEE\uD83C\uDDEA":"1f1ee-1f1ea","\uD83C\uDDEE\uD83C\uDDE9":"1f1ee-1f1e9","\uD83C\uDDEE\uD83C\uDDE8":"1f1ee-1f1e8","\uD83C\uDDED\uD83C\uDDFA":"1f1ed-1f1fa","\uD83C\uDDED\uD83C\uDDF9":"1f1ed-1f1f9","\uD83C\uDDED\uD83C\uDDF7":"1f1ed-1f1f7","\uD83C\uDDED\uD83C\uDDF3":"1f1ed-1f1f3","\uD83C\uDDED\uD83C\uDDF2":"1f1ed-1f1f2","\uD83C\uDDED\uD83C\uDDF0":"1f1ed-1f1f0","\uD83C\uDDEC\uD83C\uDDFE":"1f1ec-1f1fe","\uD83C\uDDEC\uD83C\uDDFC":"1f1ec-1f1fc","\uD83C\uDDEC\uD83C\uDDFA":"1f1ec-1f1fa","\uD83C\uDDEC\uD83C\uDDF9":"1f1ec-1f1f9","\uD83C\uDDEC\uD83C\uDDF8":"1f1ec-1f1f8","\uD83C\uDDEC\uD83C\uDDF7":"1f1ec-1f1f7","\uD83C\uDDEC\uD83C\uDDF6":"1f1ec-1f1f6","\uD83C\uDDEC\uD83C\uDDF5":"1f1ec-1f1f5","\uD83C\uDDEC\uD83C\uDDF3":"1f1ec-1f1f3","\uD83C\uDDEC\uD83C\uDDF2":"1f1ec-1f1f2","\uD83C\uDDEC\uD83C\uDDF1":"1f1ec-1f1f1","\uD83C\uDDEC\uD83C\uDDEE":"1f1ec-1f1ee","\uD83C\uDDEC\uD83C\uDDED":"1f1ec-1f1ed","\uD83C\uDDEC\uD83C\uDDEC":"1f1ec-1f1ec","\uD83C\uDDEC\uD83C\uDDEB":"1f1ec-1f1eb","\uD83C\uDDEC\uD83C\uDDEA":"1f1ec-1f1ea","\uD83C\uDDEC\uD83C\uDDE9":"1f1ec-1f1e9","\uD83C\uDDEC\uD83C\uDDE7":"1f1ec-1f1e7","\uD83C\uDDEC\uD83C\uDDE6":"1f1ec-1f1e6","\uD83C\uDDEB\uD83C\uDDF7":"1f1eb-1f1f7","\uD83C\uDDEB\uD83C\uDDF4":"1f1eb-1f1f4","\uD83C\uDDEB\uD83C\uDDF2":"1f1eb-1f1f2","\uD83C\uDDEB\uD83C\uDDF0":"1f1eb-1f1f0","\uD83C\uDDEB\uD83C\uDDEF":"1f1eb-1f1ef","\uD83C\uDDEB\uD83C\uDDEE":"1f1eb-1f1ee","\uD83C\uDDEA\uD83C\uDDFA":"1f1ea-1f1fa","\uD83C\uDDEA\uD83C\uDDF9":"1f1ea-1f1f9","\uD83C\uDDEA\uD83C\uDDF8":"1f1ea-1f1f8","\uD83C\uDDEA\uD83C\uDDF7":"1f1ea-1f1f7","\uD83C\uDDEA\uD83C\uDDED":"1f1ea-1f1ed","\uD83C\uDDEA\uD83C\uDDEC":"1f1ea-1f1ec","\uD83C\uDDEA\uD83C\uDDEA":"1f1ea-1f1ea","\uD83C\uDDEA\uD83C\uDDE8":"1f1ea-1f1e8","\uD83C\uDDEA\uD83C\uDDE6":"1f1ea-1f1e6","\uD83C\uDDE9\uD83C\uDDFF":"1f1e9-1f1ff","\uD83C\uDDE9\uD83C\uDDF4":"1f1e9-1f1f4","\uD83C\uDDE9\uD83C\uDDF2":"1f1e9-1f1f2","\uD83C\uDDE9\uD83C\uDDF0":"1f1e9-1f1f0","\uD83C\uDDE9\uD83C\uDDEF":"1f1e9-1f1ef","\uD83C\uDDE9\uD83C\uDDEC":"1f1e9-1f1ec","\uD83C\uDDE9\uD83C\uDDEA":"1f1e9-1f1ea","\uD83C\uDDE8\uD83C\uDDFF":"1f1e8-1f1ff","\uD83C\uDDE8\uD83C\uDDFE":"1f1e8-1f1fe","\uD83C\uDDE8\uD83C\uDDFD":"1f1e8-1f1fd","\uD83C\uDDE8\uD83C\uDDFC":"1f1e8-1f1fc","\uD83C\uDDE8\uD83C\uDDFB":"1f1e8-1f1fb","\uD83C\uDDE8\uD83C\uDDFA":"1f1e8-1f1fa","\uD83C\uDDE8\uD83C\uDDF7":"1f1e8-1f1f7","\uD83C\uDDE8\uD83C\uDDF5":"1f1e8-1f1f5","\uD83C\uDDE8\uD83C\uDDF4":"1f1e8-1f1f4","\uD83C\uDDE8\uD83C\uDDF3":"1f1e8-1f1f3","\uD83C\uDDE8\uD83C\uDDF2":"1f1e8-1f1f2","\uD83C\uDDE8\uD83C\uDDF1":"1f1e8-1f1f1","\uD83C\uDDE8\uD83C\uDDF0":"1f1e8-1f1f0","\uD83C\uDDE8\uD83C\uDDEE":"1f1e8-1f1ee","\uD83C\uDDE8\uD83C\uDDED":"1f1e8-1f1ed","\uD83C\uDDE8\uD83C\uDDEC":"1f1e8-1f1ec","\uD83C\uDDE8\uD83C\uDDEB":"1f1e8-1f1eb","\uD83C\uDDE8\uD83C\uDDE9":"1f1e8-1f1e9","\uD83C\uDDE8\uD83C\uDDE8":"1f1e8-1f1e8","\uD83C\uDDE8\uD83C\uDDE6":"1f1e8-1f1e6","\uD83C\uDDE7\uD83C\uDDFF":"1f1e7-1f1ff","\uD83C\uDDE7\uD83C\uDDFE":"1f1e7-1f1fe","\uD83C\uDDE7\uD83C\uDDFC":"1f1e7-1f1fc","\uD83C\uDDE7\uD83C\uDDFB":"1f1e7-1f1fb","\uD83C\uDDE7\uD83C\uDDF9":"1f1e7-1f1f9","\uD83C\uDDE7\uD83C\uDDF8":"1f1e7-1f1f8","\uD83C\uDDE7\uD83C\uDDF7":"1f1e7-1f1f7","\uD83C\uDDE7\uD83C\uDDF6":"1f1e7-1f1f6","\uD83C\uDDE7\uD83C\uDDF4":"1f1e7-1f1f4","\uD83C\uDDE7\uD83C\uDDF3":"1f1e7-1f1f3","\uD83C\uDDE7\uD83C\uDDF2":"1f1e7-1f1f2","\uD83C\uDDE7\uD83C\uDDF1":"1f1e7-1f1f1","\uD83C\uDDE7\uD83C\uDDEF":"1f1e7-1f1ef","\uD83C\uDDE7\uD83C\uDDEE":"1f1e7-1f1ee","\uD83C\uDDE7\uD83C\uDDED":"1f1e7-1f1ed","\uD83C\uDDE7\uD83C\uDDEC":"1f1e7-1f1ec","\uD83C\uDDE7\uD83C\uDDEB":"1f1e7-1f1eb","\uD83C\uDDE7\uD83C\uDDEA":"1f1e7-1f1ea","\uD83C\uDDE7\uD83C\uDDE9":"1f1e7-1f1e9","\uD83C\uDDE7\uD83C\uDDE7":"1f1e7-1f1e7","\uD83C\uDDE7\uD83C\uDDE6":"1f1e7-1f1e6","\uD83C\uDDE6\uD83C\uDDFF":"1f1e6-1f1ff","\uD83C\uDDE6\uD83C\uDDFD":"1f1e6-1f1fd","\uD83C\uDDE6\uD83C\uDDFC":"1f1e6-1f1fc","\uD83C\uDDE6\uD83C\uDDFA":"1f1e6-1f1fa","\uD83C\uDDE6\uD83C\uDDF9":"1f1e6-1f1f9","\uD83C\uDDE6\uD83C\uDDF8":"1f1e6-1f1f8","\uD83C\uDDE6\uD83C\uDDF7":"1f1e6-1f1f7","\uD83C\uDDE6\uD83C\uDDF6":"1f1e6-1f1f6","\uD83C\uDDE6\uD83C\uDDF4":"1f1e6-1f1f4","\uD83C\uDDE6\uD83C\uDDF2":"1f1e6-1f1f2","\uD83C\uDDE6\uD83C\uDDF1":"1f1e6-1f1f1","\uD83C\uDDE6\uD83C\uDDEE":"1f1e6-1f1ee","\uD83C\uDDE6\uD83C\uDDEC":"1f1e6-1f1ec","\uD83C\uDDE6\uD83C\uDDEB":"1f1e6-1f1eb","\uD83C\uDDE6\uD83C\uDDEA":"1f1e6-1f1ea","\uD83C\uDDE6\uD83C\uDDE9":"1f1e6-1f1e9","\uD83C\uDDE6\uD83C\uDDE8":"1f1e6-1f1e8","\uD83C\uDC04\uFE0F":"1f004-fe0f","\uD83C\uDC04":"1f004","\uD83C\uDD7F\uFE0F":"1f17f-fe0f","\uD83C\uDD7F":"1f17f","\uD83C\uDE02\uFE0F":"1f202-fe0f","\uD83C\uDE02":"1f202","\uD83C\uDE1A\uFE0F":"1f21a-fe0f","\uD83C\uDE1A":"1f21a","\uD83C\uDE2F\uFE0F":"1f22f-fe0f","\uD83C\uDE2F":"1f22f","\uD83C\uDE37\uFE0F":"1f237-fe0f","\uD83C\uDE37":"1f237","\uD83C\uDF9E\uFE0F":"1f39e-fe0f","\uD83C\uDF9E":"1f39e","\uD83C\uDF9F\uFE0F":"1f39f-fe0f","\uD83C\uDF9F":"1f39f","\uD83C\uDFCB\uFE0F":"1f3cb-fe0f","\uD83C\uDFCB":"1f3cb","\uD83C\uDFCC\uFE0F":"1f3cc-fe0f","\uD83C\uDFCC":"1f3cc","\uD83C\uDFCD\uFE0F":"1f3cd-fe0f","\uD83C\uDFCD":"1f3cd","\uD83C\uDFCE\uFE0F":"1f3ce-fe0f","\uD83C\uDFCE":"1f3ce","\uD83C\uDF96\uFE0F":"1f396-fe0f","\uD83C\uDF96":"1f396","\uD83C\uDF97\uFE0F":"1f397-fe0f","\uD83C\uDF97":"1f397","\uD83C\uDF36\uFE0F":"1f336-fe0f","\uD83C\uDF36":"1f336","\uD83C\uDF27\uFE0F":"1f327-fe0f","\uD83C\uDF27":"1f327","\uD83C\uDF28\uFE0F":"1f328-fe0f","\uD83C\uDF28":"1f328","\uD83C\uDF29\uFE0F":"1f329-fe0f","\uD83C\uDF29":"1f329","\uD83C\uDF2A\uFE0F":"1f32a-fe0f","\uD83C\uDF2A":"1f32a","\uD83C\uDF2B\uFE0F":"1f32b-fe0f","\uD83C\uDF2B":"1f32b","\uD83C\uDF2C\uFE0F":"1f32c-fe0f","\uD83C\uDF2C":"1f32c","\uD83D\uDC3F\uFE0F":"1f43f-fe0f","\uD83D\uDC3F":"1f43f","\uD83D\uDD77\uFE0F":"1f577-fe0f","\uD83D\uDD77":"1f577","\uD83D\uDD78\uFE0F":"1f578-fe0f","\uD83D\uDD78":"1f578","\uD83C\uDF21\uFE0F":"1f321-fe0f","\uD83C\uDF21":"1f321","\uD83C\uDF99\uFE0F":"1f399-fe0f","\uD83C\uDF99":"1f399","\uD83C\uDF9A\uFE0F":"1f39a-fe0f","\uD83C\uDF9A":"1f39a","\uD83C\uDF9B\uFE0F":"1f39b-fe0f","\uD83C\uDF9B":"1f39b","\uD83C\uDFF3\uFE0F":"1f3f3-fe0f","\uD83C\uDFF3":"1f3f3","\uD83C\uDFF5\uFE0F":"1f3f5-fe0f","\uD83C\uDFF5":"1f3f5","\uD83C\uDFF7\uFE0F":"1f3f7-fe0f","\uD83C\uDFF7":"1f3f7","\uD83D\uDCFD\uFE0F":"1f4fd-fe0f","\uD83D\uDCFD":"1f4fd","\uD83D\uDD49\uFE0F":"1f549-fe0f","\uD83D\uDD49":"1f549","\uD83D\uDD4A\uFE0F":"1f54a-fe0f","\uD83D\uDD4A":"1f54a","\uD83D\uDD6F\uFE0F":"1f56f-fe0f","\uD83D\uDD6F":"1f56f","\uD83D\uDD70\uFE0F":"1f570-fe0f","\uD83D\uDD70":"1f570","\uD83D\uDD73\uFE0F":"1f573-fe0f","\uD83D\uDD73":"1f573","\uD83D\uDD76\uFE0F":"1f576-fe0f","\uD83D\uDD76":"1f576","\uD83D\uDD79\uFE0F":"1f579-fe0f","\uD83D\uDD79":"1f579","\uD83D\uDD87\uFE0F":"1f587-fe0f","\uD83D\uDD87":"1f587","\uD83D\uDD8A\uFE0F":"1f58a-fe0f","\uD83D\uDD8A":"1f58a","\uD83D\uDD8B\uFE0F":"1f58b-fe0f","\uD83D\uDD8B":"1f58b","\uD83D\uDD8C\uFE0F":"1f58c-fe0f","\uD83D\uDD8C":"1f58c","\uD83D\uDD8D\uFE0F":"1f58d-fe0f","\uD83D\uDD8D":"1f58d","\uD83D\uDDA5\uFE0F":"1f5a5-fe0f","\uD83D\uDDA5":"1f5a5","\uD83D\uDDA8\uFE0F":"1f5a8-fe0f","\uD83D\uDDA8":"1f5a8","\uD83D\uDDB2\uFE0F":"1f5b2-fe0f","\uD83D\uDDB2":"1f5b2","\uD83D\uDDBC\uFE0F":"1f5bc-fe0f","\uD83D\uDDBC":"1f5bc","\uD83D\uDDC2\uFE0F":"1f5c2-fe0f","\uD83D\uDDC2":"1f5c2","\uD83D\uDDC3\uFE0F":"1f5c3-fe0f","\uD83D\uDDC3":"1f5c3","\uD83D\uDDC4\uFE0F":"1f5c4-fe0f","\uD83D\uDDC4":"1f5c4","\uD83D\uDDD1\uFE0F":"1f5d1-fe0f","\uD83D\uDDD1":"1f5d1","\uD83D\uDDD2\uFE0F":"1f5d2-fe0f","\uD83D\uDDD2":"1f5d2","\uD83D\uDDD3\uFE0F":"1f5d3-fe0f","\uD83D\uDDD3":"1f5d3","\uD83D\uDDDC\uFE0F":"1f5dc-fe0f","\uD83D\uDDDC":"1f5dc","\uD83D\uDDDD\uFE0F":"1f5dd-fe0f","\uD83D\uDDDD":"1f5dd","\uD83D\uDDDE\uFE0F":"1f5de-fe0f","\uD83D\uDDDE":"1f5de","\uD83D\uDDE1\uFE0F":"1f5e1-fe0f","\uD83D\uDDE1":"1f5e1","\uD83D\uDDE3\uFE0F":"1f5e3-fe0f","\uD83D\uDDE3":"1f5e3","\uD83D\uDDE8\uFE0F":"1f5e8-fe0f","\uD83D\uDDE8":"1f5e8","\uD83D\uDDEF\uFE0F":"1f5ef-fe0f","\uD83D\uDDEF":"1f5ef","\uD83D\uDDF3\uFE0F":"1f5f3-fe0f","\uD83D\uDDF3":"1f5f3","\uD83D\uDDFA\uFE0F":"1f5fa-fe0f","\uD83D\uDDFA":"1f5fa","\uD83D\uDEE0\uFE0F":"1f6e0-fe0f","\uD83D\uDEE0":"1f6e0","\uD83D\uDEE1\uFE0F":"1f6e1-fe0f","\uD83D\uDEE1":"1f6e1","\uD83D\uDEE2\uFE0F":"1f6e2-fe0f","\uD83D\uDEE2":"1f6e2","\uD83D\uDEF0\uFE0F":"1f6f0-fe0f","\uD83D\uDEF0":"1f6f0","\uD83C\uDF7D\uFE0F":"1f37d-fe0f","\uD83C\uDF7D":"1f37d","\uD83D\uDC41\uFE0F":"1f441-fe0f","\uD83D\uDC41":"1f441","\uD83D\uDD74\uFE0F":"1f574-fe0f","\uD83D\uDD74":"1f574","\uD83D\uDD75\uFE0F":"1f575-fe0f","\uD83D\uDD75":"1f575","\uD83D\uDD90\uFE0F":"1f590-fe0f","\uD83D\uDD90":"1f590","\uD83C\uDFD4\uFE0F":"1f3d4-fe0f","\uD83C\uDFD4":"1f3d4","\uD83C\uDFD5\uFE0F":"1f3d5-fe0f","\uD83C\uDFD5":"1f3d5","\uD83C\uDFD6\uFE0F":"1f3d6-fe0f","\uD83C\uDFD6":"1f3d6","\uD83C\uDFD7\uFE0F":"1f3d7-fe0f","\uD83C\uDFD7":"1f3d7","\uD83C\uDFD8\uFE0F":"1f3d8-fe0f","\uD83C\uDFD8":"1f3d8","\uD83C\uDFD9\uFE0F":"1f3d9-fe0f","\uD83C\uDFD9":"1f3d9","\uD83C\uDFDA\uFE0F":"1f3da-fe0f","\uD83C\uDFDA":"1f3da","\uD83C\uDFDB\uFE0F":"1f3db-fe0f","\uD83C\uDFDB":"1f3db","\uD83C\uDFDC\uFE0F":"1f3dc-fe0f","\uD83C\uDFDC":"1f3dc","\uD83C\uDFDD\uFE0F":"1f3dd-fe0f","\uD83C\uDFDD":"1f3dd","\uD83C\uDFDE\uFE0F":"1f3de-fe0f","\uD83C\uDFDE":"1f3de","\uD83C\uDFDF\uFE0F":"1f3df-fe0f","\uD83C\uDFDF":"1f3df","\uD83D\uDECB\uFE0F":"1f6cb-fe0f","\uD83D\uDECB":"1f6cb","\uD83D\uDECD\uFE0F":"1f6cd-fe0f","\uD83D\uDECD":"1f6cd","\uD83D\uDECE\uFE0F":"1f6ce-fe0f","\uD83D\uDECE":"1f6ce","\uD83D\uDECF\uFE0F":"1f6cf-fe0f","\uD83D\uDECF":"1f6cf","\uD83D\uDEE3\uFE0F":"1f6e3-fe0f","\uD83D\uDEE3":"1f6e3","\uD83D\uDEE4\uFE0F":"1f6e4-fe0f","\uD83D\uDEE4":"1f6e4","\uD83D\uDEE5\uFE0F":"1f6e5-fe0f","\uD83D\uDEE5":"1f6e5","\uD83D\uDEE9\uFE0F":"1f6e9-fe0f","\uD83D\uDEE9":"1f6e9","\uD83D\uDEF3\uFE0F":"1f6f3-fe0f","\uD83D\uDEF3":"1f6f3","\uD83C\uDF24\uFE0F":"1f324-fe0f","\uD83C\uDF24":"1f324","\uD83C\uDF25\uFE0F":"1f325-fe0f","\uD83C\uDF25":"1f325","\uD83C\uDF26\uFE0F":"1f326-fe0f","\uD83C\uDF26":"1f326","\uD83D\uDDB1\uFE0F":"1f5b1-fe0f","\uD83D\uDDB1":"1f5b1","\u261D\uD83C\uDFFB":"261d-1f3fb","\u261D\uD83C\uDFFC":"261d-1f3fc","\u261D\uD83C\uDFFD":"261d-1f3fd","\u261D\uD83C\uDFFE":"261d-1f3fe","\u261D\uD83C\uDFFF":"261d-1f3ff","\u270C\uD83C\uDFFB":"270c-1f3fb","\u270C\uD83C\uDFFC":"270c-1f3fc","\u270C\uD83C\uDFFD":"270c-1f3fd","\u270C\uD83C\uDFFE":"270c-1f3fe","\u270C\uD83C\uDFFF":"270c-1f3ff","\u270A\uD83C\uDFFB":"270a-1f3fb","\u270A\uD83C\uDFFC":"270a-1f3fc","\u270A\uD83C\uDFFD":"270a-1f3fd","\u270A\uD83C\uDFFE":"270a-1f3fe","\u270A\uD83C\uDFFF":"270a-1f3ff","\u270B\uD83C\uDFFB":"270b-1f3fb","\u270B\uD83C\uDFFC":"270b-1f3fc","\u270B\uD83C\uDFFD":"270b-1f3fd","\u270B\uD83C\uDFFE":"270b-1f3fe","\u270B\uD83C\uDFFF":"270b-1f3ff","\u270D\uD83C\uDFFB":"270d-1f3fb","\u270D\uD83C\uDFFC":"270d-1f3fc","\u270D\uD83C\uDFFD":"270d-1f3fd","\u270D\uD83C\uDFFE":"270d-1f3fe","\u270D\uD83C\uDFFF":"270d-1f3ff","\u26F9\uD83C\uDFFB":"26f9-1f3fb","\u26F9\uD83C\uDFFC":"26f9-1f3fc","\u26F9\uD83C\uDFFD":"26f9-1f3fd","\u26F9\uD83C\uDFFE":"26f9-1f3fe","\u26F9\uD83C\uDFFF":"26f9-1f3ff","\u00A9\uFE0F":"00a9-fe0f","\u00A9":"00a9","\u00AE\uFE0F":"00ae-fe0f","\u00AE":"00ae","\u203C\uFE0F":"203c-fe0f","\u203C":"203c","\u2049\uFE0F":"2049-fe0f","\u2049":"2049","\u2122\uFE0F":"2122-fe0f","\u2122":"2122","\u2139\uFE0F":"2139-fe0f","\u2139":"2139","\u2194\uFE0F":"2194-fe0f","\u2194":"2194","\u2195\uFE0F":"2195-fe0f","\u2195":"2195","\u2196\uFE0F":"2196-fe0f","\u2196":"2196","\u2197\uFE0F":"2197-fe0f","\u2197":"2197","\u2198\uFE0F":"2198-fe0f","\u2198":"2198","\u2199\uFE0F":"2199-fe0f","\u2199":"2199","\u21A9\uFE0F":"21a9-fe0f","\u21A9":"21a9","\u21AA\uFE0F":"21aa-fe0f","\u21AA":"21aa","\u231A\uFE0F":"231a-fe0f","\u231A":"231a","\u231B\uFE0F":"231b-fe0f","\u231B":"231b","\u24C2\uFE0F":"24c2-fe0f","\u24C2":"24c2","\u25AA\uFE0F":"25aa-fe0f","\u25AA":"25aa","\u25AB\uFE0F":"25ab-fe0f","\u25AB":"25ab","\u25B6\uFE0F":"25b6-fe0f","\u25B6":"25b6","\u25C0\uFE0F":"25c0-fe0f","\u25C0":"25c0","\u25FB\uFE0F":"25fb-fe0f","\u25FB":"25fb","\u25FC\uFE0F":"25fc-fe0f","\u25FC":"25fc","\u25FD\uFE0F":"25fd-fe0f","\u25FD":"25fd","\u25FE\uFE0F":"25fe-fe0f","\u25FE":"25fe","\u2600\uFE0F":"2600-fe0f","\u2600":"2600","\u2601\uFE0F":"2601-fe0f","\u2601":"2601","\u260E\uFE0F":"260e-fe0f","\u260E":"260e","\u2611\uFE0F":"2611-fe0f","\u2611":"2611","\u2614\uFE0F":"2614-fe0f","\u2614":"2614","\u2615\uFE0F":"2615-fe0f","\u2615":"2615","\u261D\uFE0F":"261d-fe0f","\u261D":"261d","\u263A\uFE0F":"263a-fe0f","\u263A":"263a","\u2648\uFE0F":"2648-fe0f","\u2648":"2648","\u2649\uFE0F":"2649-fe0f","\u2649":"2649","\u264A\uFE0F":"264a-fe0f","\u264A":"264a","\u264B\uFE0F":"264b-fe0f","\u264B":"264b","\u264C\uFE0F":"264c-fe0f","\u264C":"264c","\u264D\uFE0F":"264d-fe0f","\u264D":"264d","\u264E\uFE0F":"264e-fe0f","\u264E":"264e","\u264F\uFE0F":"264f-fe0f","\u264F":"264f","\u2650\uFE0F":"2650-fe0f","\u2650":"2650","\u2651\uFE0F":"2651-fe0f","\u2651":"2651","\u2652\uFE0F":"2652-fe0f","\u2652":"2652","\u2653\uFE0F":"2653-fe0f","\u2653":"2653","\u2660\uFE0F":"2660-fe0f","\u2660":"2660","\u2663\uFE0F":"2663-fe0f","\u2663":"2663","\u2665\uFE0F":"2665-fe0f","\u2665":"2665","\u2666\uFE0F":"2666-fe0f","\u2666":"2666","\u2668\uFE0F":"2668-fe0f","\u2668":"2668","\u267B\uFE0F":"267b-fe0f","\u267B":"267b","\u267F\uFE0F":"267f-fe0f","\u267F":"267f","\u2693\uFE0F":"2693-fe0f","\u2693":"2693","\u26A0\uFE0F":"26a0-fe0f","\u26A0":"26a0","\u26A1\uFE0F":"26a1-fe0f","\u26A1":"26a1","\u26AA\uFE0F":"26aa-fe0f","\u26AA":"26aa","\u26AB\uFE0F":"26ab-fe0f","\u26AB":"26ab","\u26BD\uFE0F":"26bd-fe0f","\u26BD":"26bd","\u26BE\uFE0F":"26be-fe0f","\u26BE":"26be","\u26C4\uFE0F":"26c4-fe0f","\u26C4":"26c4","\u26C5\uFE0F":"26c5-fe0f","\u26C5":"26c5","\u26D4\uFE0F":"26d4-fe0f","\u26D4":"26d4","\u26EA\uFE0F":"26ea-fe0f","\u26EA":"26ea","\u26F2\uFE0F":"26f2-fe0f","\u26F2":"26f2","\u26F3\uFE0F":"26f3-fe0f","\u26F3":"26f3","\u26F5\uFE0F":"26f5-fe0f","\u26F5":"26f5","\u26FA\uFE0F":"26fa-fe0f","\u26FA":"26fa","\u26FD\uFE0F":"26fd-fe0f","\u26FD":"26fd","\u2702\uFE0F":"2702-fe0f","\u2702":"2702","\u2708\uFE0F":"2708-fe0f","\u2708":"2708","\u2709\uFE0F":"2709-fe0f","\u2709":"2709","\u270C\uFE0F":"270c-fe0f","\u270C":"270c","\u270F\uFE0F":"270f-fe0f","\u270F":"270f","\u2712\uFE0F":"2712-fe0f","\u2712":"2712","\u2714\uFE0F":"2714-fe0f","\u2714":"2714","\u2716\uFE0F":"2716-fe0f","\u2716":"2716","\u2733\uFE0F":"2733-fe0f","\u2733":"2733","\u2734\uFE0F":"2734-fe0f","\u2734":"2734","\u2744\uFE0F":"2744-fe0f","\u2744":"2744","\u2747\uFE0F":"2747-fe0f","\u2747":"2747","\u2757\uFE0F":"2757-fe0f","\u2757":"2757","\u2764\uFE0F":"2764-fe0f","\u2764":"2764","\u27A1\uFE0F":"27a1-fe0f","\u27A1":"27a1","\u2934\uFE0F":"2934-fe0f","\u2934":"2934","\u2935\uFE0F":"2935-fe0f","\u2935":"2935","\u2B05\uFE0F":"2b05-fe0f","\u2B05":"2b05","\u2B06\uFE0F":"2b06-fe0f","\u2B06":"2b06","\u2B07\uFE0F":"2b07-fe0f","\u2B07":"2b07","\u2B1B\uFE0F":"2b1b-fe0f","\u2B1B":"2b1b","\u2B1C\uFE0F":"2b1c-fe0f","\u2B1C":"2b1c","\u2B50\uFE0F":"2b50-fe0f","\u2B50":"2b50","\u2B55\uFE0F":"2b55-fe0f","\u2B55":"2b55","\u3030\uFE0F":"3030-fe0f","\u3030":"3030","\u303D\uFE0F":"303d-fe0f","\u303D":"303d","\u3297\uFE0F":"3297-fe0f","\u3297":"3297","\u3299\uFE0F":"3299-fe0f","\u3299":"3299","\u271D\uFE0F":"271d-fe0f","\u271D":"271d","\u2328\uFE0F":"2328-fe0f","\u2328":"2328","\u270D\uFE0F":"270d-fe0f","\u270D":"270d","\u23CF\uFE0F":"23cf-fe0f","\u23CF":"23cf","\u23ED\uFE0F":"23ed-fe0f","\u23ED":"23ed","\u23EE\uFE0F":"23ee-fe0f","\u23EE":"23ee","\u23EF\uFE0F":"23ef-fe0f","\u23EF":"23ef","\u23F1\uFE0F":"23f1-fe0f","\u23F1":"23f1","\u23F2\uFE0F":"23f2-fe0f","\u23F2":"23f2","\u23F8\uFE0F":"23f8-fe0f","\u23F8":"23f8","\u23F9\uFE0F":"23f9-fe0f","\u23F9":"23f9","\u23FA\uFE0F":"23fa-fe0f","\u23FA":"23fa","\u2602\uFE0F":"2602-fe0f","\u2602":"2602","\u2603\uFE0F":"2603-fe0f","\u2603":"2603","\u2604\uFE0F":"2604-fe0f","\u2604":"2604","\u2618\uFE0F":"2618-fe0f","\u2618":"2618","\u2620\uFE0F":"2620-fe0f","\u2620":"2620","\u2622\uFE0F":"2622-fe0f","\u2622":"2622","\u2623\uFE0F":"2623-fe0f","\u2623":"2623","\u2626\uFE0F":"2626-fe0f","\u2626":"2626","\u262A\uFE0F":"262a-fe0f","\u262A":"262a","\u262E\uFE0F":"262e-fe0f","\u262E":"262e","\u262F\uFE0F":"262f-fe0f","\u262F":"262f","\u2638\uFE0F":"2638-fe0f","\u2638":"2638","\u2639\uFE0F":"2639-fe0f","\u2639":"2639","\u2692\uFE0F":"2692-fe0f","\u2692":"2692","\u2694\uFE0F":"2694-fe0f","\u2694":"2694","\u2696\uFE0F":"2696-fe0f","\u2696":"2696","\u2697\uFE0F":"2697-fe0f","\u2697":"2697","\u2699\uFE0F":"2699-fe0f","\u2699":"2699","\u269B\uFE0F":"269b-fe0f","\u269B":"269b","\u269C\uFE0F":"269c-fe0f","\u269C":"269c","\u26B0\uFE0F":"26b0-fe0f","\u26B0":"26b0","\u26B1\uFE0F":"26b1-fe0f","\u26B1":"26b1","\u26C8\uFE0F":"26c8-fe0f","\u26C8":"26c8","\u26CF\uFE0F":"26cf-fe0f","\u26CF":"26cf","\u26D1\uFE0F":"26d1-fe0f","\u26D1":"26d1","\u26D3\uFE0F":"26d3-fe0f","\u26D3":"26d3","\u26E9\uFE0F":"26e9-fe0f","\u26E9":"26e9","\u26F0\uFE0F":"26f0-fe0f","\u26F0":"26f0","\u26F1\uFE0F":"26f1-fe0f","\u26F1":"26f1","\u26F4\uFE0F":"26f4-fe0f","\u26F4":"26f4","\u26F7\uFE0F":"26f7-fe0f","\u26F7":"26f7","\u26F8\uFE0F":"26f8-fe0f","\u26F8":"26f8","\u26F9\uFE0F":"26f9-fe0f","\u26F9":"26f9","\u2721\uFE0F":"2721-fe0f","\u2721":"2721","\u2763\uFE0F":"2763-fe0f","\u2763":"2763","\uD83E\uDD49":"1f949","\uD83E\uDD48":"1f948","\uD83E\uDD47":"1f947","\uD83E\uDD3A":"1f93a","\uD83E\uDD45":"1f945","\uD83E\uDD3E":"1f93e","\uD83C\uDDFF":"1f1ff","\uD83E\uDD3D":"1f93d","\uD83E\uDD4B":"1f94b","\uD83E\uDD4A":"1f94a","\uD83E\uDD3C":"1f93c","\uD83E\uDD39":"1f939","\uD83E\uDD38":"1f938","\uD83D\uDEF6":"1f6f6","\uD83D\uDEF5":"1f6f5","\uD83D\uDEF4":"1f6f4","\uD83D\uDED2":"1f6d2","\uD83C\uDCCF":"1f0cf","\uD83C\uDD70":"1f170","\uD83C\uDD71":"1f171","\uD83C\uDD7E":"1f17e","\uD83D\uDED1":"1f6d1","\uD83C\uDD8E":"1f18e","\uD83C\uDD91":"1f191","\uD83C\uDDFE":"1f1fe","\uD83C\uDD92":"1f192","\uD83C\uDD93":"1f193","\uD83C\uDD94":"1f194","\uD83C\uDD95":"1f195","\uD83C\uDD96":"1f196","\uD83C\uDD97":"1f197","\uD83C\uDD98":"1f198","\uD83E\uDD44":"1f944","\uD83C\uDD99":"1f199","\uD83C\uDD9A":"1f19a","\uD83E\uDD42":"1f942","\uD83E\uDD43":"1f943","\uD83C\uDE01":"1f201","\uD83E\uDD59":"1f959","\uD83C\uDE32":"1f232","\uD83C\uDE33":"1f233","\uD83C\uDE34":"1f234","\uD83C\uDE35":"1f235","\uD83C\uDE36":"1f236","\uD83E\uDD58":"1f958","\uD83C\uDE38":"1f238","\uD83C\uDE39":"1f239","\uD83E\uDD57":"1f957","\uD83C\uDE3A":"1f23a","\uD83C\uDE50":"1f250","\uD83C\uDE51":"1f251","\uD83C\uDF00":"1f300","\uD83E\uDD56":"1f956","\uD83C\uDF01":"1f301","\uD83C\uDF02":"1f302","\uD83C\uDF03":"1f303","\uD83C\uDF04":"1f304","\uD83C\uDF05":"1f305","\uD83C\uDF06":"1f306","\uD83E\uDD55":"1f955","\uD83C\uDF07":"1f307","\uD83C\uDF08":"1f308","\uD83E\uDD54":"1f954","\uD83C\uDF09":"1f309","\uD83C\uDF0A":"1f30a","\uD83C\uDF0B":"1f30b","\uD83C\uDF0C":"1f30c","\uD83C\uDF0F":"1f30f","\uD83C\uDF11":"1f311","\uD83E\uDD53":"1f953","\uD83C\uDF13":"1f313","\uD83C\uDF14":"1f314","\uD83C\uDF15":"1f315","\uD83C\uDF19":"1f319","\uD83C\uDF1B":"1f31b","\uD83C\uDF1F":"1f31f","\uD83E\uDD52":"1f952","\uD83C\uDF20":"1f320","\uD83C\uDF30":"1f330","\uD83E\uDD51":"1f951","\uD83C\uDF31":"1f331","\uD83C\uDF34":"1f334","\uD83C\uDF35":"1f335","\uD83C\uDF37":"1f337","\uD83C\uDF38":"1f338","\uD83C\uDF39":"1f339","\uD83C\uDF3A":"1f33a","\uD83C\uDF3B":"1f33b","\uD83C\uDF3C":"1f33c","\uD83C\uDF3D":"1f33d","\uD83E\uDD50":"1f950","\uD83C\uDF3E":"1f33e","\uD83C\uDF3F":"1f33f","\uD83C\uDF40":"1f340","\uD83C\uDF41":"1f341","\uD83C\uDF42":"1f342","\uD83C\uDF43":"1f343","\uD83C\uDF44":"1f344","\uD83C\uDF45":"1f345","\uD83C\uDF46":"1f346","\uD83C\uDF47":"1f347","\uD83C\uDF48":"1f348","\uD83C\uDF49":"1f349","\uD83C\uDF4A":"1f34a","\uD83E\uDD40":"1f940","\uD83C\uDF4C":"1f34c","\uD83C\uDF4D":"1f34d","\uD83C\uDF4E":"1f34e","\uD83C\uDF4F":"1f34f","\uD83C\uDF51":"1f351","\uD83C\uDF52":"1f352","\uD83C\uDF53":"1f353","\uD83E\uDD8F":"1f98f","\uD83C\uDF54":"1f354","\uD83C\uDF55":"1f355","\uD83C\uDF56":"1f356","\uD83E\uDD8E":"1f98e","\uD83C\uDF57":"1f357","\uD83C\uDF58":"1f358","\uD83C\uDF59":"1f359","\uD83E\uDD8D":"1f98d","\uD83C\uDF5A":"1f35a","\uD83C\uDF5B":"1f35b","\uD83E\uDD8C":"1f98c","\uD83C\uDF5C":"1f35c","\uD83C\uDF5D":"1f35d","\uD83C\uDF5E":"1f35e","\uD83C\uDF5F":"1f35f","\uD83E\uDD8B":"1f98b","\uD83C\uDF60":"1f360","\uD83C\uDF61":"1f361","\uD83E\uDD8A":"1f98a","\uD83C\uDF62":"1f362","\uD83C\uDF63":"1f363","\uD83E\uDD89":"1f989","\uD83C\uDF64":"1f364","\uD83C\uDF65":"1f365","\uD83E\uDD88":"1f988","\uD83C\uDF66":"1f366","\uD83E\uDD87":"1f987","\uD83C\uDF67":"1f367","\uD83C\uDDFD":"1f1fd","\uD83C\uDF68":"1f368","\uD83E\uDD86":"1f986","\uD83C\uDF69":"1f369","\uD83E\uDD85":"1f985","\uD83C\uDF6A":"1f36a","\uD83D\uDDA4":"1f5a4","\uD83C\uDF6B":"1f36b","\uD83C\uDF6C":"1f36c","\uD83C\uDF6D":"1f36d","\uD83C\uDF6E":"1f36e","\uD83C\uDF6F":"1f36f","\uD83E\uDD1E":"1f91e","\uD83C\uDF70":"1f370","\uD83C\uDF71":"1f371","\uD83C\uDF72":"1f372","\uD83E\uDD1D":"1f91d","\uD83C\uDF73":"1f373","\uD83C\uDF74":"1f374","\uD83C\uDF75":"1f375","\uD83C\uDF76":"1f376","\uD83C\uDF77":"1f377","\uD83C\uDF78":"1f378","\uD83C\uDF79":"1f379","\uD83C\uDF7A":"1f37a","\uD83C\uDF7B":"1f37b","\uD83C\uDF80":"1f380","\uD83C\uDF81":"1f381","\uD83C\uDF82":"1f382","\uD83C\uDF83":"1f383","\uD83E\uDD1B":"1f91b","\uD83E\uDD1C":"1f91c","\uD83C\uDF84":"1f384","\uD83C\uDF85":"1f385","\uD83C\uDF86":"1f386","\uD83E\uDD1A":"1f91a","\uD83C\uDF87":"1f387","\uD83C\uDF88":"1f388","\uD83C\uDF89":"1f389","\uD83C\uDF8A":"1f38a","\uD83C\uDF8B":"1f38b","\uD83C\uDF8C":"1f38c","\uD83E\uDD19":"1f919","\uD83C\uDF8D":"1f38d","\uD83D\uDD7A":"1f57a","\uD83C\uDF8E":"1f38e","\uD83E\uDD33":"1f933","\uD83C\uDF8F":"1f38f","\uD83E\uDD30":"1f930","\uD83C\uDF90":"1f390","\uD83E\uDD26":"1f926","\uD83E\uDD37":"1f937","\uD83C\uDF91":"1f391","\uD83C\uDF92":"1f392","\uD83C\uDF93":"1f393","\uD83C\uDFA0":"1f3a0","\uD83C\uDFA1":"1f3a1","\uD83C\uDFA2":"1f3a2","\uD83C\uDFA3":"1f3a3","\uD83C\uDFA4":"1f3a4","\uD83C\uDFA5":"1f3a5","\uD83C\uDFA6":"1f3a6","\uD83C\uDFA7":"1f3a7","\uD83E\uDD36":"1f936","\uD83C\uDFA8":"1f3a8","\uD83E\uDD35":"1f935","\uD83C\uDFA9":"1f3a9","\uD83C\uDFAA":"1f3aa","\uD83E\uDD34":"1f934","\uD83C\uDFAB":"1f3ab","\uD83C\uDFAC":"1f3ac","\uD83C\uDFAD":"1f3ad","\uD83E\uDD27":"1f927","\uD83C\uDFAE":"1f3ae","\uD83C\uDFAF":"1f3af","\uD83C\uDFB0":"1f3b0","\uD83C\uDFB1":"1f3b1","\uD83C\uDFB2":"1f3b2","\uD83C\uDFB3":"1f3b3","\uD83C\uDFB4":"1f3b4","\uD83E\uDD25":"1f925","\uD83C\uDFB5":"1f3b5","\uD83C\uDFB6":"1f3b6","\uD83C\uDFB7":"1f3b7","\uD83E\uDD24":"1f924","\uD83C\uDFB8":"1f3b8","\uD83C\uDFB9":"1f3b9","\uD83C\uDFBA":"1f3ba","\uD83E\uDD23":"1f923","\uD83C\uDFBB":"1f3bb","\uD83C\uDFBC":"1f3bc","\uD83C\uDFBD":"1f3bd","\uD83E\uDD22":"1f922","\uD83C\uDFBE":"1f3be","\uD83C\uDFBF":"1f3bf","\uD83C\uDFC0":"1f3c0","\uD83C\uDFC1":"1f3c1","\uD83E\uDD21":"1f921","\uD83C\uDFC2":"1f3c2","\uD83C\uDFC3":"1f3c3","\uD83C\uDFC4":"1f3c4","\uD83C\uDFC6":"1f3c6","\uD83C\uDFC8":"1f3c8","\uD83C\uDFCA":"1f3ca","\uD83C\uDFE0":"1f3e0","\uD83C\uDFE1":"1f3e1","\uD83C\uDFE2":"1f3e2","\uD83C\uDFE3":"1f3e3","\uD83C\uDFE5":"1f3e5","\uD83C\uDFE6":"1f3e6","\uD83C\uDFE7":"1f3e7","\uD83C\uDFE8":"1f3e8","\uD83C\uDFE9":"1f3e9","\uD83C\uDFEA":"1f3ea","\uD83C\uDFEB":"1f3eb","\uD83C\uDFEC":"1f3ec","\uD83E\uDD20":"1f920","\uD83C\uDFED":"1f3ed","\uD83C\uDFEE":"1f3ee","\uD83C\uDFEF":"1f3ef","\uD83C\uDFF0":"1f3f0","\uD83D\uDC0C":"1f40c","\uD83D\uDC0D":"1f40d","\uD83D\uDC0E":"1f40e","\uD83D\uDC11":"1f411","\uD83D\uDC12":"1f412","\uD83D\uDC14":"1f414","\uD83D\uDC17":"1f417","\uD83D\uDC18":"1f418","\uD83D\uDC19":"1f419","\uD83D\uDC1A":"1f41a","\uD83D\uDC1B":"1f41b","\uD83D\uDC1C":"1f41c","\uD83D\uDC1D":"1f41d","\uD83D\uDC1E":"1f41e","\uD83D\uDC1F":"1f41f","\uD83D\uDC20":"1f420","\uD83D\uDC21":"1f421","\uD83D\uDC22":"1f422","\uD83D\uDC23":"1f423","\uD83D\uDC24":"1f424","\uD83D\uDC25":"1f425","\uD83D\uDC26":"1f426","\uD83D\uDC27":"1f427","\uD83D\uDC28":"1f428","\uD83D\uDC29":"1f429","\uD83D\uDC2B":"1f42b","\uD83D\uDC2C":"1f42c","\uD83D\uDC2D":"1f42d","\uD83D\uDC2E":"1f42e","\uD83D\uDC2F":"1f42f","\uD83D\uDC30":"1f430","\uD83D\uDC31":"1f431","\uD83D\uDC32":"1f432","\uD83D\uDC33":"1f433","\uD83D\uDC34":"1f434","\uD83D\uDC35":"1f435","\uD83D\uDC36":"1f436","\uD83D\uDC37":"1f437","\uD83D\uDC38":"1f438","\uD83D\uDC39":"1f439","\uD83D\uDC3A":"1f43a","\uD83D\uDC3B":"1f43b","\uD83D\uDC3C":"1f43c","\uD83D\uDC3D":"1f43d","\uD83D\uDC3E":"1f43e","\uD83D\uDC40":"1f440","\uD83D\uDC42":"1f442","\uD83D\uDC43":"1f443","\uD83D\uDC44":"1f444","\uD83D\uDC45":"1f445","\uD83D\uDC46":"1f446","\uD83D\uDC47":"1f447","\uD83D\uDC48":"1f448","\uD83D\uDC49":"1f449","\uD83D\uDC4A":"1f44a","\uD83D\uDC4B":"1f44b","\uD83D\uDC4C":"1f44c","\uD83D\uDC4D":"1f44d","\uD83D\uDC4E":"1f44e","\uD83D\uDC4F":"1f44f","\uD83D\uDC50":"1f450","\uD83D\uDC51":"1f451","\uD83D\uDC52":"1f452","\uD83D\uDC53":"1f453","\uD83D\uDC54":"1f454","\uD83D\uDC55":"1f455","\uD83D\uDC56":"1f456","\uD83D\uDC57":"1f457","\uD83D\uDC58":"1f458","\uD83D\uDC59":"1f459","\uD83D\uDC5A":"1f45a","\uD83D\uDC5B":"1f45b","\uD83D\uDC5C":"1f45c","\uD83D\uDC5D":"1f45d","\uD83D\uDC5E":"1f45e","\uD83D\uDC5F":"1f45f","\uD83D\uDC60":"1f460","\uD83D\uDC61":"1f461","\uD83D\uDC62":"1f462","\uD83D\uDC63":"1f463","\uD83D\uDC64":"1f464","\uD83D\uDC66":"1f466","\uD83D\uDC67":"1f467","\uD83D\uDC68":"1f468","\uD83D\uDC69":"1f469","\uD83D\uDC6A":"1f46a","\uD83D\uDC6B":"1f46b","\uD83D\uDC6E":"1f46e","\uD83D\uDC6F":"1f46f","\uD83D\uDC70":"1f470","\uD83D\uDC71":"1f471","\uD83D\uDC72":"1f472","\uD83D\uDC73":"1f473","\uD83D\uDC74":"1f474","\uD83D\uDC75":"1f475","\uD83D\uDC76":"1f476","\uD83D\uDC77":"1f477","\uD83D\uDC78":"1f478","\uD83D\uDC79":"1f479","\uD83D\uDC7A":"1f47a","\uD83D\uDC7B":"1f47b","\uD83D\uDC7C":"1f47c","\uD83D\uDC7D":"1f47d","\uD83D\uDC7E":"1f47e","\uD83D\uDC7F":"1f47f","\uD83D\uDC80":"1f480","\uD83D\uDCC7":"1f4c7","\uD83D\uDC81":"1f481","\uD83D\uDC82":"1f482","\uD83D\uDC83":"1f483","\uD83D\uDC84":"1f484","\uD83D\uDC85":"1f485","\uD83D\uDCD2":"1f4d2","\uD83D\uDC86":"1f486","\uD83D\uDCD3":"1f4d3","\uD83D\uDC87":"1f487","\uD83D\uDCD4":"1f4d4","\uD83D\uDC88":"1f488","\uD83D\uDCD5":"1f4d5","\uD83D\uDC89":"1f489","\uD83D\uDCD6":"1f4d6","\uD83D\uDC8A":"1f48a","\uD83D\uDCD7":"1f4d7","\uD83D\uDC8B":"1f48b","\uD83D\uDCD8":"1f4d8","\uD83D\uDC8C":"1f48c","\uD83D\uDCD9":"1f4d9","\uD83D\uDC8D":"1f48d","\uD83D\uDCDA":"1f4da","\uD83D\uDC8E":"1f48e","\uD83D\uDCDB":"1f4db","\uD83D\uDC8F":"1f48f","\uD83D\uDCDC":"1f4dc","\uD83D\uDC90":"1f490","\uD83D\uDCDD":"1f4dd","\uD83D\uDC91":"1f491","\uD83D\uDCDE":"1f4de","\uD83D\uDC92":"1f492","\uD83D\uDCDF":"1f4df","\uD83D\uDCE0":"1f4e0","\uD83D\uDC93":"1f493","\uD83D\uDCE1":"1f4e1","\uD83D\uDCE2":"1f4e2","\uD83D\uDC94":"1f494","\uD83D\uDCE3":"1f4e3","\uD83D\uDCE4":"1f4e4","\uD83D\uDC95":"1f495","\uD83D\uDCE5":"1f4e5","\uD83D\uDCE6":"1f4e6","\uD83D\uDC96":"1f496","\uD83D\uDCE7":"1f4e7","\uD83D\uDCE8":"1f4e8","\uD83D\uDC97":"1f497","\uD83D\uDCE9":"1f4e9","\uD83D\uDCEA":"1f4ea","\uD83D\uDC98":"1f498","\uD83D\uDCEB":"1f4eb","\uD83D\uDCEE":"1f4ee","\uD83D\uDC99":"1f499","\uD83D\uDCF0":"1f4f0","\uD83D\uDCF1":"1f4f1","\uD83D\uDC9A":"1f49a","\uD83D\uDCF2":"1f4f2","\uD83D\uDCF3":"1f4f3","\uD83D\uDC9B":"1f49b","\uD83D\uDCF4":"1f4f4","\uD83D\uDCF6":"1f4f6","\uD83D\uDC9C":"1f49c","\uD83D\uDCF7":"1f4f7","\uD83D\uDCF9":"1f4f9","\uD83D\uDC9D":"1f49d","\uD83D\uDCFA":"1f4fa","\uD83D\uDCFB":"1f4fb","\uD83D\uDC9E":"1f49e","\uD83D\uDCFC":"1f4fc","\uD83D\uDD03":"1f503","\uD83D\uDC9F":"1f49f","\uD83D\uDD0A":"1f50a","\uD83D\uDD0B":"1f50b","\uD83D\uDCA0":"1f4a0","\uD83D\uDD0C":"1f50c","\uD83D\uDD0D":"1f50d","\uD83D\uDCA1":"1f4a1","\uD83D\uDD0E":"1f50e","\uD83D\uDD0F":"1f50f","\uD83D\uDCA2":"1f4a2","\uD83D\uDD10":"1f510","\uD83D\uDD11":"1f511","\uD83D\uDCA3":"1f4a3","\uD83D\uDD12":"1f512","\uD83D\uDD13":"1f513","\uD83D\uDCA4":"1f4a4","\uD83D\uDD14":"1f514","\uD83D\uDD16":"1f516","\uD83D\uDCA5":"1f4a5","\uD83D\uDD17":"1f517","\uD83D\uDD18":"1f518","\uD83D\uDCA6":"1f4a6","\uD83D\uDD19":"1f519","\uD83D\uDD1A":"1f51a","\uD83D\uDCA7":"1f4a7","\uD83D\uDD1B":"1f51b","\uD83D\uDD1C":"1f51c","\uD83D\uDCA8":"1f4a8","\uD83D\uDD1D":"1f51d","\uD83D\uDD1E":"1f51e","\uD83D\uDCA9":"1f4a9","\uD83D\uDD1F":"1f51f","\uD83D\uDCAA":"1f4aa","\uD83D\uDD20":"1f520","\uD83D\uDD21":"1f521","\uD83D\uDCAB":"1f4ab","\uD83D\uDD22":"1f522","\uD83D\uDD23":"1f523","\uD83D\uDCAC":"1f4ac","\uD83D\uDD24":"1f524","\uD83D\uDD25":"1f525","\uD83D\uDCAE":"1f4ae","\uD83D\uDD26":"1f526","\uD83D\uDD27":"1f527","\uD83D\uDCAF":"1f4af","\uD83D\uDD28":"1f528","\uD83D\uDD29":"1f529","\uD83D\uDCB0":"1f4b0","\uD83D\uDD2A":"1f52a","\uD83D\uDD2B":"1f52b","\uD83D\uDCB1":"1f4b1","\uD83D\uDD2E":"1f52e","\uD83D\uDCB2":"1f4b2","\uD83D\uDD2F":"1f52f","\uD83D\uDCB3":"1f4b3","\uD83D\uDD30":"1f530","\uD83D\uDD31":"1f531","\uD83D\uDCB4":"1f4b4","\uD83D\uDD32":"1f532","\uD83D\uDD33":"1f533","\uD83D\uDCB5":"1f4b5","\uD83D\uDD34":"1f534","\uD83D\uDD35":"1f535","\uD83D\uDCB8":"1f4b8","\uD83D\uDD36":"1f536","\uD83D\uDD37":"1f537","\uD83D\uDCB9":"1f4b9","\uD83D\uDD38":"1f538","\uD83D\uDD39":"1f539","\uD83D\uDCBA":"1f4ba","\uD83D\uDD3A":"1f53a","\uD83D\uDD3B":"1f53b","\uD83D\uDCBB":"1f4bb","\uD83D\uDD3C":"1f53c","\uD83D\uDCBC":"1f4bc","\uD83D\uDD3D":"1f53d","\uD83D\uDD50":"1f550","\uD83D\uDCBD":"1f4bd","\uD83D\uDD51":"1f551","\uD83D\uDCBE":"1f4be","\uD83D\uDD52":"1f552","\uD83D\uDCBF":"1f4bf","\uD83D\uDD53":"1f553","\uD83D\uDCC0":"1f4c0","\uD83D\uDD54":"1f554","\uD83D\uDD55":"1f555","\uD83D\uDCC1":"1f4c1","\uD83D\uDD56":"1f556","\uD83D\uDD57":"1f557","\uD83D\uDCC2":"1f4c2","\uD83D\uDD58":"1f558","\uD83D\uDD59":"1f559","\uD83D\uDCC3":"1f4c3","\uD83D\uDD5A":"1f55a","\uD83D\uDD5B":"1f55b","\uD83D\uDCC4":"1f4c4","\uD83D\uDDFB":"1f5fb","\uD83D\uDDFC":"1f5fc","\uD83D\uDCC5":"1f4c5","\uD83D\uDDFD":"1f5fd","\uD83D\uDDFE":"1f5fe","\uD83D\uDCC6":"1f4c6","\uD83D\uDDFF":"1f5ff","\uD83D\uDE01":"1f601","\uD83D\uDE02":"1f602","\uD83D\uDE03":"1f603","\uD83D\uDCC8":"1f4c8","\uD83D\uDE04":"1f604","\uD83D\uDE05":"1f605","\uD83D\uDCC9":"1f4c9","\uD83D\uDE06":"1f606","\uD83D\uDE09":"1f609","\uD83D\uDCCA":"1f4ca","\uD83D\uDE0A":"1f60a","\uD83D\uDE0B":"1f60b","\uD83D\uDCCB":"1f4cb","\uD83D\uDE0C":"1f60c","\uD83D\uDE0D":"1f60d","\uD83D\uDCCC":"1f4cc","\uD83D\uDE0F":"1f60f","\uD83D\uDE12":"1f612","\uD83D\uDCCD":"1f4cd","\uD83D\uDE13":"1f613","\uD83D\uDE14":"1f614","\uD83D\uDCCE":"1f4ce","\uD83D\uDE16":"1f616","\uD83D\uDE18":"1f618","\uD83D\uDCCF":"1f4cf","\uD83D\uDE1A":"1f61a","\uD83D\uDE1C":"1f61c","\uD83D\uDCD0":"1f4d0","\uD83D\uDE1D":"1f61d","\uD83D\uDE1E":"1f61e","\uD83D\uDCD1":"1f4d1","\uD83D\uDE20":"1f620","\uD83D\uDE21":"1f621","\uD83D\uDE22":"1f622","\uD83D\uDE23":"1f623","\uD83D\uDE24":"1f624","\uD83D\uDE25":"1f625","\uD83D\uDE28":"1f628","\uD83D\uDE29":"1f629","\uD83D\uDE2A":"1f62a","\uD83D\uDE2B":"1f62b","\uD83D\uDE2D":"1f62d","\uD83D\uDE30":"1f630","\uD83D\uDE31":"1f631","\uD83D\uDE32":"1f632","\uD83D\uDE33":"1f633","\uD83D\uDE35":"1f635","\uD83D\uDE37":"1f637","\uD83D\uDE38":"1f638","\uD83D\uDE39":"1f639","\uD83D\uDE3A":"1f63a","\uD83D\uDE3B":"1f63b","\uD83D\uDE3C":"1f63c","\uD83D\uDE3D":"1f63d","\uD83D\uDE3E":"1f63e","\uD83D\uDE3F":"1f63f","\uD83D\uDE40":"1f640","\uD83D\uDE45":"1f645","\uD83D\uDE46":"1f646","\uD83D\uDE47":"1f647","\uD83D\uDE48":"1f648","\uD83D\uDE49":"1f649","\uD83D\uDE4A":"1f64a","\uD83D\uDE4B":"1f64b","\uD83D\uDE4C":"1f64c","\uD83D\uDE4D":"1f64d","\uD83D\uDE4E":"1f64e","\uD83D\uDE4F":"1f64f","\uD83D\uDE80":"1f680","\uD83D\uDE83":"1f683","\uD83D\uDE84":"1f684","\uD83D\uDE85":"1f685","\uD83D\uDE87":"1f687","\uD83D\uDE89":"1f689","\uD83D\uDE8C":"1f68c","\uD83D\uDE8F":"1f68f","\uD83D\uDE91":"1f691","\uD83D\uDE92":"1f692","\uD83D\uDE93":"1f693","\uD83D\uDE95":"1f695","\uD83D\uDE97":"1f697","\uD83D\uDE99":"1f699","\uD83D\uDE9A":"1f69a","\uD83D\uDEA2":"1f6a2","\uD83D\uDEA4":"1f6a4","\uD83D\uDEA5":"1f6a5","\uD83D\uDEA7":"1f6a7","\uD83D\uDEA8":"1f6a8","\uD83D\uDEA9":"1f6a9","\uD83D\uDEAA":"1f6aa","\uD83D\uDEAB":"1f6ab","\uD83D\uDEAC":"1f6ac","\uD83D\uDEAD":"1f6ad","\uD83D\uDEB2":"1f6b2","\uD83D\uDEB6":"1f6b6","\uD83D\uDEB9":"1f6b9","\uD83D\uDEBA":"1f6ba","\uD83D\uDEBB":"1f6bb","\uD83D\uDEBC":"1f6bc","\uD83D\uDEBD":"1f6bd","\uD83D\uDEBE":"1f6be","\uD83D\uDEC0":"1f6c0","\uD83E\uDD18":"1f918","\uD83D\uDE00":"1f600","\uD83D\uDE07":"1f607","\uD83D\uDE08":"1f608","\uD83D\uDE0E":"1f60e","\uD83D\uDE10":"1f610","\uD83D\uDE11":"1f611","\uD83D\uDE15":"1f615","\uD83D\uDE17":"1f617","\uD83D\uDE19":"1f619","\uD83D\uDE1B":"1f61b","\uD83D\uDE1F":"1f61f","\uD83D\uDE26":"1f626","\uD83D\uDE27":"1f627","\uD83D\uDE2C":"1f62c","\uD83D\uDE2E":"1f62e","\uD83D\uDE2F":"1f62f","\uD83D\uDE34":"1f634","\uD83D\uDE36":"1f636","\uD83D\uDE81":"1f681","\uD83D\uDE82":"1f682","\uD83D\uDE86":"1f686","\uD83D\uDE88":"1f688","\uD83D\uDE8A":"1f68a","\uD83D\uDE8D":"1f68d","\uD83D\uDE8E":"1f68e","\uD83D\uDE90":"1f690","\uD83D\uDE94":"1f694","\uD83D\uDE96":"1f696","\uD83D\uDE98":"1f698","\uD83D\uDE9B":"1f69b","\uD83D\uDE9C":"1f69c","\uD83D\uDE9D":"1f69d","\uD83D\uDE9E":"1f69e","\uD83D\uDE9F":"1f69f","\uD83D\uDEA0":"1f6a0","\uD83D\uDEA1":"1f6a1","\uD83D\uDEA3":"1f6a3","\uD83D\uDEA6":"1f6a6","\uD83D\uDEAE":"1f6ae","\uD83D\uDEAF":"1f6af","\uD83D\uDEB0":"1f6b0","\uD83D\uDEB1":"1f6b1","\uD83D\uDEB3":"1f6b3","\uD83D\uDEB4":"1f6b4","\uD83D\uDEB5":"1f6b5","\uD83D\uDEB7":"1f6b7","\uD83D\uDEB8":"1f6b8","\uD83D\uDEBF":"1f6bf","\uD83D\uDEC1":"1f6c1","\uD83D\uDEC2":"1f6c2","\uD83D\uDEC3":"1f6c3","\uD83D\uDEC4":"1f6c4","\uD83D\uDEC5":"1f6c5","\uD83C\uDF0D":"1f30d","\uD83C\uDF0E":"1f30e","\uD83C\uDF10":"1f310","\uD83C\uDF12":"1f312","\uD83C\uDF16":"1f316","\uD83C\uDF17":"1f317","\uD83C\uDF18":"1f318","\uD83C\uDF1A":"1f31a","\uD83C\uDF1C":"1f31c","\uD83C\uDF1D":"1f31d","\uD83C\uDF1E":"1f31e","\uD83C\uDF32":"1f332","\uD83C\uDF33":"1f333","\uD83C\uDF4B":"1f34b","\uD83C\uDF50":"1f350","\uD83C\uDF7C":"1f37c","\uD83C\uDFC7":"1f3c7","\uD83C\uDFC9":"1f3c9","\uD83C\uDFE4":"1f3e4","\uD83D\uDC00":"1f400","\uD83D\uDC01":"1f401","\uD83D\uDC02":"1f402","\uD83D\uDC03":"1f403","\uD83D\uDC04":"1f404","\uD83D\uDC05":"1f405","\uD83D\uDC06":"1f406","\uD83D\uDC07":"1f407","\uD83D\uDC08":"1f408","\uD83D\uDC09":"1f409","\uD83D\uDC0A":"1f40a","\uD83D\uDC0B":"1f40b","\uD83D\uDC0F":"1f40f","\uD83D\uDC10":"1f410","\uD83D\uDC13":"1f413","\uD83D\uDC15":"1f415","\uD83D\uDC16":"1f416","\uD83D\uDC2A":"1f42a","\uD83D\uDC65":"1f465","\uD83D\uDC6C":"1f46c","\uD83D\uDC6D":"1f46d","\uD83D\uDCAD":"1f4ad","\uD83D\uDCB6":"1f4b6","\uD83D\uDCB7":"1f4b7","\uD83D\uDCEC":"1f4ec","\uD83D\uDCED":"1f4ed","\uD83D\uDCEF":"1f4ef","\uD83D\uDCF5":"1f4f5","\uD83D\uDD00":"1f500","\uD83D\uDD01":"1f501","\uD83D\uDD02":"1f502","\uD83D\uDD04":"1f504","\uD83D\uDD05":"1f505","\uD83D\uDD06":"1f506","\uD83D\uDD07":"1f507","\uD83D\uDD09":"1f509","\uD83D\uDD15":"1f515","\uD83D\uDD2C":"1f52c","\uD83D\uDD2D":"1f52d","\uD83D\uDD5C":"1f55c","\uD83D\uDD5D":"1f55d","\uD83D\uDD5E":"1f55e","\uD83D\uDD5F":"1f55f","\uD83D\uDD60":"1f560","\uD83D\uDD61":"1f561","\uD83D\uDD62":"1f562","\uD83D\uDD63":"1f563","\uD83D\uDD64":"1f564","\uD83D\uDD65":"1f565","\uD83D\uDD66":"1f566","\uD83D\uDD67":"1f567","\uD83D\uDD08":"1f508","\uD83D\uDE8B":"1f68b","\uD83C\uDFC5":"1f3c5","\uD83C\uDFF4":"1f3f4","\uD83D\uDCF8":"1f4f8","\uD83D\uDECC":"1f6cc","\uD83D\uDD95":"1f595","\uD83D\uDD96":"1f596","\uD83D\uDE41":"1f641","\uD83D\uDE42":"1f642","\uD83D\uDEEB":"1f6eb","\uD83D\uDEEC":"1f6ec","\uD83C\uDFFB":"1f3fb","\uD83C\uDFFC":"1f3fc","\uD83C\uDFFD":"1f3fd","\uD83C\uDFFE":"1f3fe","\uD83C\uDFFF":"1f3ff","\uD83D\uDE43":"1f643","\uD83E\uDD11":"1f911","\uD83E\uDD13":"1f913","\uD83E\uDD17":"1f917","\uD83D\uDE44":"1f644","\uD83E\uDD14":"1f914","\uD83E\uDD10":"1f910","\uD83E\uDD12":"1f912","\uD83E\uDD15":"1f915","\uD83E\uDD16":"1f916","\uD83E\uDD81":"1f981","\uD83E\uDD84":"1f984","\uD83E\uDD82":"1f982","\uD83E\uDD80":"1f980","\uD83E\uDD83":"1f983","\uD83E\uDDC0":"1f9c0","\uD83C\uDF2D":"1f32d","\uD83C\uDF2E":"1f32e","\uD83C\uDF2F":"1f32f","\uD83C\uDF7F":"1f37f","\uD83C\uDF7E":"1f37e","\uD83C\uDFF9":"1f3f9","\uD83C\uDFFA":"1f3fa","\uD83D\uDED0":"1f6d0","\uD83D\uDD4B":"1f54b","\uD83D\uDD4C":"1f54c","\uD83D\uDD4D":"1f54d","\uD83D\uDD4E":"1f54e","\uD83D\uDCFF":"1f4ff","\uD83C\uDFCF":"1f3cf","\uD83C\uDFD0":"1f3d0","\uD83C\uDFD1":"1f3d1","\uD83C\uDFD2":"1f3d2","\uD83C\uDFD3":"1f3d3","\uD83C\uDFF8":"1f3f8","\uD83E\uDD41":"1f941","\uD83E\uDD90":"1f990","\uD83E\uDD91":"1f991","\uD83E\uDD5A":"1f95a","\uD83E\uDD5B":"1f95b","\uD83E\uDD5C":"1f95c","\uD83E\uDD5D":"1f95d","\uD83E\uDD5E":"1f95e","\uD83C\uDDFC":"1f1fc","\uD83C\uDDFB":"1f1fb","\uD83C\uDDFA":"1f1fa","\uD83C\uDDF9":"1f1f9","\uD83C\uDDF8":"1f1f8","\uD83C\uDDF7":"1f1f7","\uD83C\uDDF6":"1f1f6","\uD83C\uDDF5":"1f1f5","\uD83C\uDDF4":"1f1f4","\uD83C\uDDF3":"1f1f3","\uD83C\uDDF2":"1f1f2","\uD83C\uDDF1":"1f1f1","\uD83C\uDDF0":"1f1f0","\uD83C\uDDEF":"1f1ef","\uD83C\uDDEE":"1f1ee","\uD83C\uDDED":"1f1ed","\uD83C\uDDEC":"1f1ec","\uD83C\uDDEB":"1f1eb","\uD83C\uDDEA":"1f1ea","\uD83C\uDDE9":"1f1e9","\uD83C\uDDE8":"1f1e8","\uD83C\uDDE7":"1f1e7","\uD83C\uDDE6":"1f1e6","\u23E9":"23e9","\u23EA":"23ea","\u23EB":"23eb","\u23EC":"23ec","\u23F0":"23f0","\u23F3":"23f3","\u26CE":"26ce","\u2705":"2705","\u270A":"270a","\u270B":"270b","\u2728":"2728","\u274C":"274c","\u274E":"274e","\u2753":"2753","\u2754":"2754","\u2755":"2755","\u2795":"2795","\u2796":"2796","\u2797":"2797","\u27B0":"27b0","\u27BF":"27bf","\u00A9":"00a9","\u00AE":"00ae","\u203C":"203c","\u2049":"2049","\u2122":"2122","\u2139":"2139","\u2194":"2194","\u2195":"2195","\u2196":"2196","\u2197":"2197","\u2198":"2198","\u2199":"2199","\u21A9":"21a9","\u21AA":"21aa","\u231A":"231a","\u231B":"231b","\u24C2":"24c2","\u25AA":"25aa","\u25AB":"25ab","\u25B6":"25b6","\u25C0":"25c0","\u25FB":"25fb","\u25FC":"25fc","\u25FD":"25fd","\u25FE":"25fe","\u2600":"2600","\u2601":"2601","\u260E":"260e","\u2611":"2611","\u2614":"2614","\u2615":"2615","\u261D":"261d","\u263A":"263a","\u2648":"2648","\u2649":"2649","\u264A":"264a","\u264B":"264b","\u264C":"264c","\u264D":"264d","\u264E":"264e","\u264F":"264f","\u2650":"2650","\u2651":"2651","\u2652":"2652","\u2653":"2653","\u2660":"2660","\u2663":"2663","\u2665":"2665","\u2666":"2666","\u2668":"2668","\u267B":"267b","\u267F":"267f","\u2693":"2693","\u26A0":"26a0","\u26A1":"26a1","\u26AA":"26aa","\u26AB":"26ab","\u26BD":"26bd","\u26BE":"26be","\u26C4":"26c4","\u26C5":"26c5","\u26D4":"26d4","\u26EA":"26ea","\u26F2":"26f2","\u26F3":"26f3","\u26F5":"26f5","\u26FA":"26fa","\u26FD":"26fd","\u2702":"2702","\u2708":"2708","\u2709":"2709","\u270C":"270c","\u270F":"270f","\u2712":"2712","\u2714":"2714","\u2716":"2716","\u2733":"2733","\u2734":"2734","\u2744":"2744","\u2747":"2747","\u2757":"2757","\u2764":"2764","\u27A1":"27a1","\u2934":"2934","\u2935":"2935","\u2B05":"2b05","\u2B06":"2b06","\u2B07":"2b07","\u2B1B":"2b1b","\u2B1C":"2b1c","\u2B50":"2b50","\u2B55":"2b55","\u3030":"3030","\u303D":"303d","\u3297":"3297","\u3299":"3299","\uD83C\uDC04":"1f004","\uD83C\uDD7F":"1f17f","\uD83C\uDE02":"1f202","\uD83C\uDE1A":"1f21a","\uD83C\uDE2F":"1f22f","\uD83C\uDE37":"1f237","\uD83C\uDF9E":"1f39e","\uD83C\uDF9F":"1f39f","\uD83C\uDFCB":"1f3cb","\uD83C\uDFCC":"1f3cc","\uD83C\uDFCD":"1f3cd","\uD83C\uDFCE":"1f3ce","\uD83C\uDF96":"1f396","\uD83C\uDF97":"1f397","\uD83C\uDF36":"1f336","\uD83C\uDF27":"1f327","\uD83C\uDF28":"1f328","\uD83C\uDF29":"1f329","\uD83C\uDF2A":"1f32a","\uD83C\uDF2B":"1f32b","\uD83C\uDF2C":"1f32c","\uD83D\uDC3F":"1f43f","\uD83D\uDD77":"1f577","\uD83D\uDD78":"1f578","\uD83C\uDF21":"1f321","\uD83C\uDF99":"1f399","\uD83C\uDF9A":"1f39a","\uD83C\uDF9B":"1f39b","\uD83C\uDFF3":"1f3f3","\uD83C\uDFF5":"1f3f5","\uD83C\uDFF7":"1f3f7","\uD83D\uDCFD":"1f4fd","\u271D":"271d","\uD83D\uDD49":"1f549","\uD83D\uDD4A":"1f54a","\uD83D\uDD6F":"1f56f","\uD83D\uDD70":"1f570","\uD83D\uDD73":"1f573","\uD83D\uDD76":"1f576","\uD83D\uDD79":"1f579","\uD83D\uDD87":"1f587","\uD83D\uDD8A":"1f58a","\uD83D\uDD8B":"1f58b","\uD83D\uDD8C":"1f58c","\uD83D\uDD8D":"1f58d","\uD83D\uDDA5":"1f5a5","\uD83D\uDDA8":"1f5a8","\u2328":"2328","\uD83D\uDDB2":"1f5b2","\uD83D\uDDBC":"1f5bc","\uD83D\uDDC2":"1f5c2","\uD83D\uDDC3":"1f5c3","\uD83D\uDDC4":"1f5c4","\uD83D\uDDD1":"1f5d1","\uD83D\uDDD2":"1f5d2","\uD83D\uDDD3":"1f5d3","\uD83D\uDDDC":"1f5dc","\uD83D\uDDDD":"1f5dd","\uD83D\uDDDE":"1f5de","\uD83D\uDDE1":"1f5e1","\uD83D\uDDE3":"1f5e3","\uD83D\uDDE8":"1f5e8","\uD83D\uDDEF":"1f5ef","\uD83D\uDDF3":"1f5f3","\uD83D\uDDFA":"1f5fa","\uD83D\uDEE0":"1f6e0","\uD83D\uDEE1":"1f6e1","\uD83D\uDEE2":"1f6e2","\uD83D\uDEF0":"1f6f0","\uD83C\uDF7D":"1f37d","\uD83D\uDC41":"1f441","\uD83D\uDD74":"1f574","\uD83D\uDD75":"1f575","\u270D":"270d","\uD83D\uDD90":"1f590","\uD83C\uDFD4":"1f3d4","\uD83C\uDFD5":"1f3d5","\uD83C\uDFD6":"1f3d6","\uD83C\uDFD7":"1f3d7","\uD83C\uDFD8":"1f3d8","\uD83C\uDFD9":"1f3d9","\uD83C\uDFDA":"1f3da","\uD83C\uDFDB":"1f3db","\uD83C\uDFDC":"1f3dc","\uD83C\uDFDD":"1f3dd","\uD83C\uDFDE":"1f3de","\uD83C\uDFDF":"1f3df","\uD83D\uDECB":"1f6cb","\uD83D\uDECD":"1f6cd","\uD83D\uDECE":"1f6ce","\uD83D\uDECF":"1f6cf","\uD83D\uDEE3":"1f6e3","\uD83D\uDEE4":"1f6e4","\uD83D\uDEE5":"1f6e5","\uD83D\uDEE9":"1f6e9","\uD83D\uDEF3":"1f6f3","\u23CF":"23cf","\u23ED":"23ed","\u23EE":"23ee","\u23EF":"23ef","\u23F1":"23f1","\u23F2":"23f2","\u23F8":"23f8","\u23F9":"23f9","\u23FA":"23fa","\u2602":"2602","\u2603":"2603","\u2604":"2604","\u2618":"2618","\u2620":"2620","\u2622":"2622","\u2623":"2623","\u2626":"2626","\u262A":"262a","\u262E":"262e","\u262F":"262f","\u2638":"2638","\u2639":"2639","\u2692":"2692","\u2694":"2694","\u2696":"2696","\u2697":"2697","\u2699":"2699","\u269B":"269b","\u269C":"269c","\u26B0":"26b0","\u26B1":"26b1","\u26C8":"26c8","\u26CF":"26cf","\u26D1":"26d1","\u26D3":"26d3","\u26E9":"26e9","\u26F0":"26f0","\u26F1":"26f1","\u26F4":"26f4","\u26F7":"26f7","\u26F8":"26f8","\u26F9":"26f9","\u2721":"2721","\u2763":"2763","\uD83C\uDF24":"1f324","\uD83C\uDF25":"1f325","\uD83C\uDF26":"1f326","\uD83D\uDDB1":"1f5b1"};
    ns.imagePathPNG = 'https://cdn.jsdelivr.net/emojione/assets/png/';
    ns.imagePathSVG = 'https://cdn.jsdelivr.net/emojione/assets/svg/';
    ns.imagePathSVGSprites = './../assets/sprites/emojione.sprites.svg';
    ns.imageType = 'png'; // or svg
    ns.imageTitleTag = true; //set to false to remove title attribute from img tag
    ns.sprites = false; // if this is true then sprite markup will be used (if SVG image type is set then you must include the SVG sprite file locally)
    ns.unicodeAlt = true; // use the unicode char as the alt attribute (makes copy and pasting the resulting text better)
    ns.ascii = false; // change to true to convert ascii smileys
    ns.cacheBustParam = '?v=2.2.7'; // you can [optionally] modify this to force browsers to refresh their cache. it will be appended to the send of the filenames

    ns.regShortNames = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+ns.shortnames+")", "gi");
    ns.regAscii = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|((\\s|^)"+ns.asciiRegexp+"(?=\\s|$|[!,.?]))", "g");
    ns.regUnicode = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+ns.unicodeRegexp+")", "gi");

    ns.toImage = function(str) {
        str = ns.unicodeToImage(str);
        str = ns.shortnameToImage(str);
        return str;
    };

    // Uses toShort to transform all unicode into a standard shortname
    // then transforms the shortname into unicode
    // This is done for standardization when converting several unicode types
    ns.unifyUnicode = function(str) {
        str = ns.toShort(str);
        str = ns.shortnameToUnicode(str);
        return str;
    };

    // Replace shortnames (:wink:) with Ascii equivalents ( ;^) )
    // Useful for systems that dont support unicode nor images
    ns.shortnameToAscii = function(str) {
        var unicode,
        // something to keep in mind here is that array flip will destroy
        // half of the ascii text "emojis" because the unicode numbers are duplicated
        // this is ok for what it's being used for
            unicodeToAscii = ns.objectFlip(ns.asciiList);

        str = str.replace(ns.regShortNames, function(shortname) {
            if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
                // if the shortname doesnt exist just return the entire match
                return shortname;
            }
            else {
                unicode = ns.emojioneList[shortname].unicode[ns.emojioneList[shortname].unicode.length-1];
                if(typeof unicodeToAscii[unicode] !== 'undefined') {
                    return unicodeToAscii[unicode];
                } else {
                    return shortname;
                }
            }
        });
        return str;
    };

    // will output unicode from shortname
    // useful for sending emojis back to mobile devices
    ns.shortnameToUnicode = function(str) {
        // replace regular shortnames first
        var unicode,fname,uc;
        str = str.replace(ns.regShortNames, function(shortname) {
            if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
                // if the shortname doesnt exist just return the entire match
                return shortname;
            }
            unicode = ns.emojioneList[shortname].unicode[0].toUpperCase();
            fname = ns.emojioneList[shortname].fname;
            uc = ns.emojioneList[shortname].uc;
            //return ns.convert(unicode);
            return ns.convert(uc);
        });

        // if ascii smileys are turned on, then we'll replace them!
        if (ns.ascii) {

            str = str.replace(ns.regAscii, function(entire, m1, m2, m3) {
                if( (typeof m3 === 'undefined') || (m3 === '') || (!(ns.unescapeHTML(m3) in ns.asciiList)) ) {
                    // if the shortname doesnt exist just return the entire match
                    return entire;
                }

                m3 = ns.unescapeHTML(m3);
                unicode = ns.asciiList[m3].toUpperCase();
                return m2+ns.convert(unicode);
            });
        }

        return str;
    };

    ns.shortnameToImage = function(str) {
        // replace regular shortnames first
        var replaceWith,unicode,alt,title;
        str = str.replace(ns.regShortNames, function(shortname) {
            if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
                // if the shortname doesnt exist just return the entire match
                return shortname;
            }
            else {
                unicode = ns.emojioneList[shortname].unicode[ns.emojioneList[shortname].unicode.length-1];
                title = ns.imageTitleTag ? 'title="'+shortname+'"' : '';

                // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
                alt = (ns.unicodeAlt) ? ns.convert(unicode.toUpperCase()) : shortname;

                if(ns.imageType === 'png') {
                    if(ns.sprites) {
                        replaceWith = '<span class="emojione emojione-'+unicode+'" ' + title + '>'+alt+'</span>';
                    }
                    else {
                        replaceWith = '<img class="emojione" alt="'+alt+'" ' + title + ' src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
                    }
                }
                else {
                    // svg
                    if(ns.sprites) {
                        replaceWith = '<svg class="emojione"><description>'+alt+'</description><use xlink:href="'+ns.imagePathSVGSprites+'#emoji-'+unicode+'"></use></svg>';
                    }
                    else {
                        replaceWith = '<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
                    }
                }

                return replaceWith;
            }
        });

        // if ascii smileys are turned on, then we'll replace them!
        if (ns.ascii) {

            str = str.replace(ns.regAscii, function(entire, m1, m2, m3) {
                if( (typeof m3 === 'undefined') || (m3 === '') || (!(ns.unescapeHTML(m3) in ns.asciiList)) ) {
                    // if the ascii doesnt exist just return the entire match
                    return entire;
                }

                m3 = ns.unescapeHTML(m3);
                unicode = ns.asciiList[m3];
                title = ns.imageTitleTag ? 'title="'+ns.escapeHTML(m3)+'"' : '';

                // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
                alt = (ns.unicodeAlt) ? ns.convert(unicode.toUpperCase()) : ns.escapeHTML(m3);

                if(ns.imageType === 'png') {
                    if(ns.sprites) {
                        replaceWith = m2+'<span class="emojione emojione-'+unicode+'"  ' + title + '>'+alt+'</span>';
                    }
                    else {
                        replaceWith = m2+'<img class="emojione" alt="'+alt+'" ' + title + ' src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
                    }
                }
                else {
                    // svg
                    if(ns.sprites) {
                        replaceWith = '<svg class="emojione"><description>'+alt+'</description><use xlink:href="'+ns.imagePathSVGSprites+'#emoji-'+unicode+'"></use></svg>';
                    }
                    else {
                        replaceWith = m2+'<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
                    }
                }

                return replaceWith;
            });
        }

        return str;
    };

    ns.unicodeToImage = function(str) {

        var replaceWith,unicode,short,fname,alt,title;
        var mappedUnicode = ns.mapUnicodeToShort();
        str = str.replace(ns.regUnicode, function(unicodeChar) {
            if( (typeof unicodeChar === 'undefined') || (unicodeChar === '') || (!(unicodeChar in ns.jsEscapeMap)) ) {
                // if the unicodeChar doesnt exist just return the entire match
                return unicodeChar;
            }
            else {
                // get the unicode codepoint from the actual char
                unicode = ns.jsEscapeMap[unicodeChar];

                //then map to shortname and locate the filename
                short = mappedUnicode[unicode];
                fname = ns.emojioneList[short].fname;

                // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
                alt = (ns.unicodeAlt) ? ns.convert(unicode.toUpperCase()) : short;
                title = ns.imageTitleTag ? 'title="'+short+'"' : '';

                if(ns.imageType === 'png') {
                    if(ns.sprites) {
                        replaceWith = '<span class="emojione emojione-'+unicode+'" ' + title + '>'+alt+'</span>';
                    }
                    else {
                        replaceWith = '<img class="emojione" alt="'+alt+'" ' + title + ' src="'+ns.imagePathPNG+fname+'.png'+ns.cacheBustParam+'"/>';
                    }
                }
                else {
                    // svg
                    if(ns.sprites) {
                        replaceWith = '<svg class="emojione"><description>'+alt+'</description><use xlink:href="'+ns.imagePathSVGSprites+'#emoji-'+unicode+'"></use></svg>';
                    }
                    else {
                        replaceWith = '<img class="emojione" alt="'+alt+'" ' + title + ' src="'+ns.imagePathSVG+fname+'.svg'+ns.cacheBustParam+'"/>';
                    }
                }

                return replaceWith;
            }
        });

        return str;
    };

    // this is really just unicodeToShortname() but I opted for the shorthand name to match toImage()
    ns.toShort = function(str) {
        var find = ns.getUnicodeReplacementRegEx(),
            replacementList = ns.mapUnicodeCharactersToShort();
        return  ns.replaceAll(str, find,replacementList);
    };

    // for converting unicode code points and code pairs to their respective characters
    ns.convert = function(unicode) {
        if(unicode.indexOf("-") > -1) {
            var parts = [];
            var s = unicode.split('-');
            for(var i = 0; i < s.length; i++) {
                var part = parseInt(s[i], 16);
                if (part >= 0x10000 && part <= 0x10FFFF) {
                    var hi = Math.floor((part - 0x10000) / 0x400) + 0xD800;
                    var lo = ((part - 0x10000) % 0x400) + 0xDC00;
                    part = (String.fromCharCode(hi) + String.fromCharCode(lo));
                }
                else {
                    part = String.fromCharCode(part);
                }
                parts.push(part);
            }
            return parts.join('');
        }
        else {
            var s = parseInt(unicode, 16);
            if (s >= 0x10000 && s <= 0x10FFFF) {
                var hi = Math.floor((s - 0x10000) / 0x400) + 0xD800;
                var lo = ((s - 0x10000) % 0x400) + 0xDC00;
                return (String.fromCharCode(hi) + String.fromCharCode(lo));
            }
            else {
                return String.fromCharCode(s);
            }
        }
    };

    ns.escapeHTML = function (string) {
        var escaped = {
            '&' : '&amp;',
            '<' : '&lt;',
            '>' : '&gt;',
            '"' : '&quot;',
            '\'': '&#039;'
        };

        return string.replace(/[&<>"']/g, function (match) {
            return escaped[match];
        });
    };
    ns.unescapeHTML = function (string) {
        var unescaped = {
            '&amp;'  : '&',
            '&#38;'  : '&',
            '&#x26;' : '&',
            '&lt;'   : '<',
            '&#60;'  : '<',
            '&#x3C;' : '<',
            '&gt;'   : '>',
            '&#62;'  : '>',
            '&#x3E;' : '>',
            '&quot;' : '"',
            '&#34;'  : '"',
            '&#x22;' : '"',
            '&apos;' : '\'',
            '&#39;'  : '\'',
            '&#x27;' : '\''
        };

        return string.replace(/&(?:amp|#38|#x26|lt|#60|#x3C|gt|#62|#x3E|apos|#39|#x27|quot|#34|#x22);/ig, function (match) {
            return unescaped[match];
        });
    };

    ns.mapEmojioneList = function (addToMapStorage) {
        for (var shortname in ns.emojioneList) {
            if (!ns.emojioneList.hasOwnProperty(shortname)) { continue; }
            for (var i = 0, len = ns.emojioneList[shortname].unicode.length; i < len; i++) {
                var unicode = ns.emojioneList[shortname].unicode[i];
                addToMapStorage(unicode, shortname);
            }
        }
    };

    ns.mapUnicodeToShort = function() {
        if (!ns.memMapShortToUnicode) {
            ns.memMapShortToUnicode = {};
            ns.mapEmojioneList(function (unicode, shortname) {
                ns.memMapShortToUnicode[unicode] = shortname;
            });
        }
        return ns.memMapShortToUnicode;
    };

    ns.memoizeReplacement = function() {
        if (!ns.unicodeReplacementRegEx || !ns.memMapShortToUnicodeCharacters) {
            var unicodeList = [];
            ns.memMapShortToUnicodeCharacters = {};
            ns.mapEmojioneList(function (unicode, shortname) {
                var emojiCharacter = ns.convert(unicode);
                if(ns.emojioneList[shortname].isCanonical) {
                    ns.memMapShortToUnicodeCharacters[emojiCharacter] = shortname;
                }
                unicodeList.push(emojiCharacter);
            });
            ns.unicodeReplacementRegEx = unicodeList.join('|');
        }
    };

    ns.mapUnicodeCharactersToShort = function() {
        ns.memoizeReplacement();
        return ns.memMapShortToUnicodeCharacters;
    };

    ns.getUnicodeReplacementRegEx = function() {
        ns.memoizeReplacement();
        return ns.unicodeReplacementRegEx;
    };

    //reverse an object
    ns.objectFlip = function (obj) {
        var key, tmp_obj = {};

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                tmp_obj[obj[key]] = key;
            }
        }

        return tmp_obj;
    };

    ns.escapeRegExp = function(string) {
        return string.replace(/[-[\]{}()*+?.,;:&\\^$#\s]/g, "\\$&");
    };

    ns.replaceAll = function(string, find, replacementList) {
        var escapedFind = ns.escapeRegExp(find);
        var search = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+escapedFind+")", "gi");

        // callback prevents replacing anything inside of these common html tags as well as between an <object></object> tag
        var replace = function(entire, m1) {
            return ((typeof m1 === 'undefined') || (m1 === '')) ? entire : replacementList[m1];
        };

        return string.replace(search,replace);
    };

}(this.emojione = this.emojione || {}));
if(typeof module === "object") module.exports = this.emojione;
emojione.unicodeAlt = false;

emojione.imagePathPNG = "/img/emojis/";

emojione.ascii = true;

_.fromPairs = function(pairs) {
  var index, length, pair, result;
  index = -1;
  length = pairs === null ? 0 : pairs.length;
  result = {};
  while (++index < length) {
    pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
};

_.pickBy = function(object, fn) {
  var i, key, len, ref, result;
  result = {};
  ref = _.keys(object);
  for (i = 0, len = ref.length; i < len; i++) {
    key = ref[i];
    if (fn(object[key])) {
      result[key] = object[key];
    }
  }
  return result;
};
