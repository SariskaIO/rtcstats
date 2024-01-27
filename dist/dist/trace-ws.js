"use strict";

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _uuid = require("uuid");
var _constants = require("./constants");
var _obfuscator = _interopRequireDefault(require("./obfuscator"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
} /* eslint-disable prefer-rest-params */
/**
 * Function that returns the timeout time for the reconnect based on number of attempts.
 *
 * @param {*} reconnectAttempts
 * @returns
 */
function getTimeout(reconnectAttempts) {
  return Math.pow(2, reconnectAttempts) * 1000 + Math.floor(Math.random() * 10000);
}

/**
 *
 * @param {*} endpoint
 * @param {*} onCloseCallback
 * @param {*} pingInterval
 */
function _default(_ref) {
  var endpoint = _ref.endpoint,
    meetingFqn = _ref.meetingFqn,
    onCloseCallback = _ref.onCloseCallback,
    useLegacy = _ref.useLegacy,
    _ref$obfuscate = _ref.obfuscate,
    obfuscate = _ref$obfuscate === void 0 ? true : _ref$obfuscate,
    _ref$pingInterval = _ref.pingInterval,
    pingInterval = _ref$pingInterval === void 0 ? 30000 : _ref$pingInterval;
  // Parent stats session id, used when breakout rooms occur to keep track of the initial stats session id.
  var parentStatsSessionId;

  // Buffer for storing stats if there is no connection to the server.
  var buffer = [];
  var statsSessionId = (0, _uuid.v4)();
  var connection;
  var keepAliveInterval;

  // the number of ms spent trying to reconnect to the server.
  var reconnectSpentTime = 0;

  // flag indicating if data can be sent to the server.
  var canSendMessage = false;

  // The sequence number of the last stat.
  var sequenceNumber = 1;

  // Timeout time for the reconnect protocol.
  var reconnectTimeout;

  // We maintain support for legacy chrome rtcstats just in case we need some critical statistic
  // only obtainable from that format, ideally we'd remove this in the future.
  var protocolVersion = useLegacy ? "".concat(_constants.PROTOCOL_ITERATION, "_LEGACY") : "".concat(_constants.PROTOCOL_ITERATION, "_STANDARD");

  // Function setting the timestamp and the sequence number of the entry.
  var setTransportParams = function setTransportParams(data) {
    data.push(new Date().getTime());
    data.push(sequenceNumber++);
  };

  // Function sending the message to the server if there is a connection.
  var sendMessage = function sendMessage(msg) {
    // It creates a copy of the message so that the message from the buffer have the data attribute unstringified
    var copyMsg = Object.assign({}, msg);
    if (copyMsg.type !== 'identity' && copyMsg.data) {
      copyMsg.data = JSON.stringify(copyMsg.data);
    }
    if (connection && connection.readyState === WebSocket.OPEN && canSendMessage) {
      connection.send(JSON.stringify(copyMsg));
    }
  };
  var trace = function trace(msg) {
    sendMessage(msg);
    if (buffer.length < _constants.BUFFER_LIMIT && msg.data) {
      buffer.push(msg);
    }
  };
  trace.isConnected = function () {
    if (!connection) {
      return false;
    }
    var _connection = connection,
      readyState = _connection.readyState;
    return readyState === WebSocket.OPEN;
  };
  trace.isClosed = function () {
    if (!connection) {
      return true;
    }
    var _connection2 = connection,
      readyState = _connection2.readyState;
    return readyState === WebSocket.CLOSED;
  };
  trace.identity = function () {
    for (var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++) {
      data[_key] = arguments[_key];
    }
    setTransportParams(data);
    if (parentStatsSessionId) {
      data[2].parentStatsSessionId = parentStatsSessionId;
    }
    var identityMsg = {
      statsSessionId: statsSessionId,
      type: 'identity',
      data: data
    };
    trace(identityMsg);
  };
  trace.statsEntry = function () {
    for (var _len2 = arguments.length, data = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      data[_key2] = arguments[_key2];
    }
    var myData = data;
    if (obfuscate) {
      switch (data[0]) {
        case 'addIceCandidate':
        case 'onicecandidate':
        case 'setLocalDescription':
        case 'setRemoteDescription':
          // These functions need to original values to work with
          // so we need a deep copy to do the obfuscation on.
          myData = JSON.parse(JSON.stringify(myData));
          break;
        default:
          break;
      }

      // Obfuscate the ips is required.
      (0, _obfuscator["default"])(myData);
    }
    setTransportParams(myData);
    var statsEntryMsg = {
      statsSessionId: statsSessionId,
      type: 'stats-entry',
      data: myData
    };
    trace(statsEntryMsg);
  };
  trace.keepAlive = function () {
    var keepaliveMsg = {
      statsSessionId: statsSessionId,
      type: 'keepalive'
    };
    trace(keepaliveMsg);
  };
  trace.close = function () {
    connection && connection.close(_constants.CONFERENCE_LEAVE_CODE);
  };
  trace.connect = function (isBreakoutRoom) {
    var isReconnect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (isBreakoutRoom && !parentStatsSessionId) {
      parentStatsSessionId = statsSessionId;
    }
    if (parentStatsSessionId) {
      statsSessionId = (0, _uuid.v4)();
      buffer.forEach(function (entry) {
        entry.statsSessionId = statsSessionId;
      });
    }
    if (connection) {
      connection.close();
    }
    connection = new WebSocket("".concat(endpoint, "/").concat(meetingFqn, "?statsSessionId=").concat(statsSessionId, "&isReconnect=").concat(isReconnect), protocolVersion, {
      headers: {
        'User-Agent': navigator.userAgent
      }
    });
    connection.onclose = function (closeEvent) {
      keepAliveInterval && clearInterval(keepAliveInterval);
      canSendMessage && (canSendMessage = false);
      onCloseCallback({
        code: closeEvent.code,
        reason: closeEvent.reason
      });

      // Do not try to reconnect if connection was closed intentionally.
      if (_constants.CUSTOM_ERROR_CODES.includes(closeEvent.code)) {
        return;
      }
      if (reconnectSpentTime < _constants.MAX_RECONNECT_TIME) {
        var reconnectTimeoutTimeCandidate = getTimeout(reconnectSpentTime);
        var reconnectTimeoutTime = reconnectSpentTime + reconnectTimeoutTimeCandidate < _constants.MAX_RECONNECT_TIME ? reconnectTimeoutTimeCandidate : _constants.MAX_RECONNECT_TIME - reconnectSpentTime;
        reconnectSpentTime += reconnectTimeoutTime;
        reconnectTimeout = setTimeout(function () {
          return trace.connect(isBreakoutRoom, true);
        }, reconnectTimeoutTime);
      }
    };
    connection.onopen = function () {
      keepAliveInterval = setInterval(trace.keepAlive, pingInterval);
    };
    connection.onmessage = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(msg) {
        var _JSON$parse, type, body, value, state, firstSN, lastSN, lastReceivedSNIndex, i;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _JSON$parse = JSON.parse(msg.data), type = _JSON$parse.type, body = _JSON$parse.body; // if the server sends back the last sequence number that it has been received.
              if (!(type === _constants.messageTypes.SequenceNumber)) {
                _context.next = 12;
                break;
              }
              value = body.value, state = body.state; // if there are entries in the buffer
              if (!buffer.length) {
                _context.next = 11;
                break;
              }
              firstSN = buffer[0].data[4];
              lastSN = buffer[buffer.length - 1].data[4]; // messages would not be in order, some messages might be missing
              if (!(value < firstSN - 1 && value > lastSN)) {
                _context.next = 9;
                break;
              }
              connection && connection.close(_constants.DUMP_ERROR_CODE);
              return _context.abrupt("return");
            case 9:
              lastReceivedSNIndex = buffer.findIndex(function (statsEntry) {
                return statsEntry.data[4] === value;
              });
              buffer = buffer.slice(lastReceivedSNIndex + 1);
            case 11:
              // this happens when the connection is established
              if (state === 'initial') {
                reconnectTimeout && clearTimeout(reconnectTimeout);
                reconnectSpentTime = 0;
                canSendMessage = true;
                for (i = 0; i < buffer.length; i++) {
                  sendMessage(buffer[i]);
                }
              }
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
  };
  return trace;
}