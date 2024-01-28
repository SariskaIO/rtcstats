"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _browserDetection = require("@jitsi/js-utils/browser-detection");
var _logger = require("@jitsi/logger");
var _events = require("./events");
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : String(i);
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
} /* eslint-disable prefer-rest-params */ /* eslint-disable no-param-reassign */
var logger = (0, _logger.getLogger)('rtctstats');
/**
 * transforms a maplike to an object. Mostly for getStats + JSON.parse(JSON.stringify())
 * @param {*} m
 */
function map2obj(m) {
  if (!m.entries) {
    return m;
  }
  var o = {};
  m.forEach(function (v, k) {
    o[k] = v;
  });
  return o;
}

/**
 *
 * @param {*} pc
 * @param {*} response
 */
function mangleChromeStats(pc, response) {
  var standardReport = {};
  var reports = response.result();
  reports.forEach(function (report) {
    var standardStats = {
      id: report.id,
      timestamp: report.timestamp.getTime(),
      type: report.type
    };
    report.names().forEach(function (name) {
      standardStats[name] = report.stat(name);
    });
    standardReport[standardStats.id] = standardStats;
  });
  return standardReport;
}

/**
 * Apply a delta compression to the stats report. Reduces size by ~90%.
 * To reduce further, report keys could be compressed.
 * @param {*} oldStats
 * @param {*} newStats
 */
function deltaCompression(oldStats, newStatsArg) {
  var newStats = JSON.parse(JSON.stringify(newStatsArg));

  // Go through each report of the newly fetches stats entry and compare it with the previous one (old)
  // If a field value (e.g. ssrc.id) from the new report matches the corresponding one from the old report
  // delete it.
  // The new stats entry will be returned thus any reports from the old stats entry that are no longer found
  // in the new one will me considered as removed.
  // stats entries are expected to have the following format:
  // {reportName1: {
  //    key1: value,
  //    key2: value2
  // },
  // reportName2: {
  //    key1: value,
  //    key2, value2,
  // }}

  Object.keys(newStats).forEach(function (id) {
    var report = newStats[id];
    delete report.id;
    if (!oldStats[id]) {
      return;
    }
    Object.keys(report).forEach(function (name) {
      if (report[name] === oldStats[id][name]) {
        delete newStats[id][name];
      }
    });
  });

  // TODO Snippet bellow adds the last timestamp as a stats level fields, probably used in feature extraction on the
  // rtcstats-server side, most likely not used anymore, verify if this can be removed.
  var timestamp = -Infinity;
  Object.keys(newStats).forEach(function (id) {
    var report = newStats[id];
    if (report.timestamp > timestamp) {
      timestamp = report.timestamp;
    }
  });
  Object.keys(newStats).forEach(function (id) {
    var report = newStats[id];
    if (report.timestamp === timestamp) {
      report.timestamp = 0;
    }
  });
  newStats.timestamp = timestamp;
  return newStats;
}

/**
 *
 * @param {*} stream
 */
function dumpStream(stream) {
  return {
    id: stream.id,
    tracks: stream.getTracks().map(function (track) {
      return {
        id: track.id,
        // unique identifier (GUID) for the track
        kind: track.kind,
        // `audio` or `video`
        label: track.label,
        // identified the track source
        enabled: track.enabled,
        // application can control it
        muted: track.muted,
        // application cannot control it (read-only)
        readyState: track.readyState // `live` or `ended`
      };
    })
  };
}

/**
 *
 * @param {*} trace
 * @param {*} getStatsInterval
 * @param {*} prefixesToWrap
 * @param {*} connectionFilter
 */
function _default(_ref, _ref2) {
  var sendStatsEntry = _ref.statsEntry;
  var connectionFilter = _ref2.connectionFilter,
    pollInterval = _ref2.pollInterval,
    useLegacy = _ref2.useLegacy,
    _ref2$sendSdp = _ref2.sendSdp,
    sendSdp = _ref2$sendSdp === void 0 ? false : _ref2$sendSdp,
    _ref2$prefixesToWrap = _ref2.prefixesToWrap,
    prefixesToWrap = _ref2$prefixesToWrap === void 0 ? [''] : _ref2$prefixesToWrap,
    eventCallback = _ref2.eventCallback;
  var peerconnectioncounter = 0;
  var browserDetection = new _browserDetection.BrowserDetection();
  var isFirefox = browserDetection.isFirefox();
  var isChromiumBased = browserDetection.isChromiumBased();
  var isWebKitBased = browserDetection.isWebKitBased();
  var isReactNative = browserDetection.isReactNative();

  // Only initialize rtcstats if it's run in a supported browser
  if (!(isFirefox || isChromiumBased || isWebKitBased || isReactNative)) {
    logger.warn('RTCStats unsupported browser.');
    return;
  }
  prefixesToWrap.forEach(function (prefix) {
    if (!window["".concat(prefix, "RTCPeerConnection")]) {
      return;
    }
    var OrigPeerConnection = window["".concat(prefix, "RTCPeerConnection")];
    var peerconnection = function peerconnection(config) {
      var constraints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // We want to make sure that any potential errors that occur at this point, caused by rtcstats logic,
      // does not affect the normal flow of any application that might integrate it.
      var origConfig = _objectSpread({}, config);
      var _constraints$optional = constraints.optional,
        optional = _constraints$optional === void 0 ? [] : _constraints$optional;
      var isP2P = false;
      try {
        // Verify if the connection is configured as P2P
        optional.some(function (option) {
          return option.rtcStatsSFUP2P === true;
        }) && (isP2P = true);
        var pc = new OrigPeerConnection(config, constraints);

        // In case the client wants to skip some rtcstats connections, a filter function can be provided which
        // will return the original PC object without any strings attached.
        if (connectionFilter && connectionFilter(config)) {
          return pc;
        }
        var id = "PC_".concat(peerconnectioncounter++);
        pc.__rtcStatsId = id;
        if (!config) {
          config = {
            nullConfig: true
          };
        }
        config = JSON.parse(JSON.stringify(config)); // deepcopy
        // don't log credentials
        (config && config.iceServers || []).forEach(function (server) {
          delete server.credential;
        });
        if (isFirefox) {
          config.browserType = 'moz';
        } else {
          config.browserType = 'webkit';
        }
        sendStatsEntry('create', id, config);
        pc.__dtlsTransport = null;

        // TODO: do we want to log constraints here? They are chrome-proprietary.
        // eslint-disable-next-line max-len
        // http://stackoverflow.com/questions/31003928/what-do-each-of-these-experimental-goog-rtcpeerconnectionconstraints-do
        sendStatsEntry('constraints', id, constraints);
        pc.addEventListener('icecandidate', function (e) {
          sendStatsEntry('onicecandidate', id, e.candidate);
        });
        pc.addEventListener('addstream', function (e) {
          sendStatsEntry('onaddstream', id, "".concat(e.stream.id, " ").concat(e.stream.getTracks().map(function (t) {
            return "".concat(t.kind, ":").concat(t.id);
          })));
        });
        pc.addEventListener('track', function (e) {
          sendStatsEntry('ontrack', id, "".concat(e.track.kind, ":").concat(e.track.id, " ").concat(e.streams.map(function (stream) {
            return "stream:".concat(stream.id);
          })));
        });
        pc.addEventListener('removestream', function (e) {
          sendStatsEntry('onremovestream', id, "".concat(e.stream.id, " ").concat(e.stream.getTracks().map(function (t) {
            return "".concat(t.kind, ":").concat(t.id);
          })));
        });
        pc.addEventListener('signalingstatechange', function () {
          sendStatsEntry('onsignalingstatechange', id, pc.signalingState);
        });
        pc.addEventListener('iceconnectionstatechange', function () {
          var iceConnectionState = pc.iceConnectionState;
          sendStatsEntry('oniceconnectionstatechange', id, iceConnectionState);
          eventCallback === null || eventCallback === void 0 || eventCallback({
            type: _events.PC_ICE_CON_STATE_CHANGE,
            body: {
              pcId: id,
              isP2P: isP2P,
              state: iceConnectionState
            }
          });
        });
        pc.addEventListener('icegatheringstatechange', function () {
          sendStatsEntry('onicegatheringstatechange', id, pc.iceGatheringState);
        });
        pc.addEventListener('connectionstatechange', function () {
          var connectionState = pc.connectionState;
          sendStatsEntry('onconnectionstatechange', id, pc.connectionState);
          eventCallback === null || eventCallback === void 0 || eventCallback({
            type: _events.PC_CON_STATE_CHANGE,
            body: {
              pcId: id,
              isP2P: isP2P,
              state: connectionState
            }
          });
        });
        pc.addEventListener('negotiationneeded', function () {
          sendStatsEntry('onnegotiationneeded', id, undefined);
        });
        pc.addEventListener('datachannel', function (event) {
          sendStatsEntry('ondatachannel', id, [event.channel.id, event.channel.label]);
        });
        var prev = {};
        var getStats = function getStats() {
          if (isFirefox || isWebKitBased || isReactNative || isChromiumBased && !useLegacy) {
            pc.getStats(null).then(function (res) {
              var now = map2obj(res);
              var base = JSON.parse(JSON.stringify(now)); // our new prev

              sendStatsEntry('getstats', id, deltaCompression(prev, now));
              prev = base;
            });
          } else if (isChromiumBased) {
            // for chromium based env we have the option of using the chrome getstats api via the
            // useLegacy flag.
            pc.getStats(function (res) {
              var now = mangleChromeStats(pc, res);
              var base = JSON.parse(JSON.stringify(now)); // our new prev

              sendStatsEntry('getstats', id, deltaCompression(prev, now));
              prev = base;
            });
          }

          // If the current env doesn't support any getstats call do nothing.
        };

        // TODO: do we want one big interval and all peerconnections
        //    queried in that or one setInterval per PC?
        //    we have to collect results anyway so...
        if (pollInterval) {
          var interval = window.setInterval(function () {
            if (pc.signalingState === 'closed' || pc.iceConnectionState === 'closed') {
              window.clearInterval(interval);
              return;
            }
            getStats();
          }, pollInterval);
        }
        pc.addEventListener('connectionstatechange', function () {
          if (['connected', 'failed'].includes(pc.connectionState)) {
            getStats();
          }
        });
        return pc;
      } catch (error) {
        // If something went wrong, return a normal PeerConnection
        console.error('RTCStats PeerConnection bind failed: ', error);
        return new OrigPeerConnection(origConfig, constraints);
      }
    };
    ['createDataChannel', 'close'].forEach(function (method) {
      var nativeMethod = OrigPeerConnection.prototype[method];
      if (nativeMethod) {
        OrigPeerConnection.prototype[method] = function () {
          try {
            sendStatsEntry(method, this.__rtcStatsId, arguments);
          } catch (error) {
            console.error("RTCStats ".concat(method, " bind failed: "), error);
          }
          return nativeMethod.apply(this, arguments);
        };
      }
    });
    ['addStream', 'removeStream'].forEach(function (method) {
      var nativeMethod = OrigPeerConnection.prototype[method];
      if (nativeMethod) {
        OrigPeerConnection.prototype[method] = function () {
          try {
            var stream = arguments[0];
            var streamInfo = stream.getTracks().map(function (t) {
              return "".concat(t.kind, ":").concat(t.id);
            }).join(',');
            sendStatsEntry(method, this.__rtcStatsId, "".concat(stream.id, " ").concat(streamInfo));
          } catch (error) {
            console.error("RTCStats ".concat(method, " bind failed: "), error);
          }
          return nativeMethod.apply(this, arguments);
        };
      }
    });
    ['addTrack'].forEach(function (method) {
      var nativeMethod = OrigPeerConnection.prototype[method];
      if (nativeMethod) {
        OrigPeerConnection.prototype[method] = function () {
          try {
            var track = arguments[0];
            var streams = [].slice.call(arguments, 1);
            sendStatsEntry(method, this.__rtcStatsId, "".concat(track.kind, ":").concat(track.id, " ").concat(streams.map(function (s) {
              return "stream:".concat(s.id);
            }).join(';') || '-'));
          } catch (error) {
            console.error("RTCStats ".concat(method, " bind failed: "), error);
          }
          return nativeMethod.apply(this, arguments);
        };
      }
    });
    ['removeTrack'].forEach(function (method) {
      var nativeMethod = OrigPeerConnection.prototype[method];
      if (nativeMethod) {
        OrigPeerConnection.prototype[method] = function () {
          try {
            var track = arguments[0].track;
            sendStatsEntry(method, this.__rtcStatsId, track ? "".concat(track.kind, ":").concat(track.id) : 'null');
          } catch (error) {
            console.error("RTCStats ".concat(method, " bind failed: "), error);
          }
          return nativeMethod.apply(this, arguments);
        };
      }
    });
    ['addTransceiver'].forEach(function (method) {
      var nativeMethod = OrigPeerConnection.prototype[method];
      if (nativeMethod) {
        OrigPeerConnection.prototype[method] = function () {
          try {
            var trackOrKind = arguments[0];
            var opts;
            if (typeof trackOrKind === 'string') {
              opts = trackOrKind;
            } else {
              opts = "".concat(trackOrKind.kind, ":").concat(trackOrKind.id);
            }
            if (arguments.length === 2 && _typeof(arguments[1]) === 'object') {
              opts += " ".concat(JSON.stringify(arguments[1]));
            }
            sendStatsEntry(method, this.__rtcStatsId, opts);
          } catch (error) {
            console.error("RTCStats ".concat(method, " bind failed: "), error);
          }
          return nativeMethod.apply(this, arguments);
        };
      }
    });
    ['createOffer', 'createAnswer'].forEach(function (method) {
      var nativeMethod = OrigPeerConnection.prototype[method];
      if (nativeMethod) {
        OrigPeerConnection.prototype[method] = function () {
          // The logic here extracts the arguments and establishes if the API
          // is callback or Promise based.
          var rtcStatsId = this.__rtcStatsId;
          var args = arguments;
          var opts;
          if (arguments.length === 1 && _typeof(arguments[0]) === 'object') {
            opts = arguments[0];
          } else if (arguments.length === 3 && _typeof(arguments[2]) === 'object') {
            opts = arguments[2];
          }

          // We can only put a "barrier" at this point because the above logic is
          // necessary in all cases, if something fails there we can't just bypass it.
          try {
            sendStatsEntry(method, this.__rtcStatsId, opts);
          } catch (error) {
            console.error("RTCStats ".concat(method, " bind failed: "), error);
          }
          return nativeMethod.apply(this, opts ? [opts] : undefined).then(function (description) {
            try {
              var data = sendSdp ? description : '';
              sendStatsEntry("".concat(method, "OnSuccess"), rtcStatsId, data);
            } catch (error) {
              console.error("RTCStats ".concat(method, " promise success bind failed: "), error);
            }

            // We can't safely bypass this part of logic because it's necessary for Proxying this
            // request. It determines weather the call is callback or promise based.
            if (args.length > 0 && typeof args[0] === 'function') {
              args[0].apply(null, [description]);
              return undefined;
            }
            return description;
          }, function (err) {
            try {
              sendStatsEntry("".concat(method, "OnFailure"), rtcStatsId, err.toString());
            } catch (error) {
              console.error("RTCStats ".concat(method, " promise failure bind failed: "), error);
            }

            // We can't safely bypass this part of logic because it's necessary for
            // Proxying this request. It determines weather the call is callback or promise based.
            if (args.length > 1 && typeof args[1] === 'function') {
              args[1].apply(null, [err]);
              return;
            }
            throw err;
          });
        };
      }
    });
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
      var nativeMethod = OrigPeerConnection.prototype[method];
      if (nativeMethod) {
        OrigPeerConnection.prototype[method] = function () {
          var _this = this;
          var rtcStatsId = this.__rtcStatsId;
          var args = arguments;
          try {
            var data = sendSdp ? args[0] : '';
            sendStatsEntry(method, this.__rtcStatsId, data);
          } catch (error) {
            console.error("RTCStats ".concat(method, " bind failed: "), error);
          }
          return nativeMethod.apply(this, [args[0]]).then(function () {
            try {
              sendStatsEntry("".concat(method, "OnSuccess"), rtcStatsId, undefined);
            } catch (error) {
              console.error("RTCStats ".concat(method, " promise success bind failed: "), error);
            }
            if (!_this.__dtlsTransport && method.endsWith('Description') && !isReactNative) {
              _this.getSenders().forEach(function (sender) {
                if (!_this.__dtlsTransport && sender.transport) {
                  _this.__dtlsTransport = sender.transport;
                  sender.transport.addEventListener('error', function (error) {
                    sendStatsEntry('ondtlserror', rtcStatsId, error);
                  });
                  sender.transport.addEventListener('statechange', function () {
                    var newstate = sender.transport.state;
                    sendStatsEntry('ondtlsstatechange', rtcStatsId, newstate);
                  });
                }
              });
            }

            // We can't safely bypass this part of logic because it's necessary for
            // Proxying this request. It determines weather the call is callback or promise based.
            if (args.length >= 2 && typeof args[1] === 'function') {
              args[1].apply(null, []);
              return undefined;
            }
            return undefined;
          }, function (err) {
            try {
              sendStatsEntry("".concat(method, "OnFailure"), rtcStatsId, err.toString());
            } catch (error) {
              console.error("RTCStats ".concat(method, " promise failure bind failed: "), error);
            }

            // We can't safely bypass this part of logic because it's necessary for
            // Proxying this request. It determines weather the call is callback or promise based
            if (args.length >= 3 && typeof args[2] === 'function') {
              args[2].apply(null, [err]);
              return undefined;
            }
            throw err;
          });
        };
      }
    });

    // wrap static methods. Currently just generateCertificate.
    if (OrigPeerConnection.generateCertificate) {
      Object.defineProperty(peerconnection, 'generateCertificate', {
        get: function get() {
          return arguments.length ? OrigPeerConnection.generateCertificate.apply(null, arguments) : OrigPeerConnection.generateCertificate;
        }
      });
    }
    window["".concat(prefix, "RTCPeerConnection")] = peerconnection;
    window["".concat(prefix, "RTCPeerConnection")].prototype = OrigPeerConnection.prototype;
  });

  // getUserMedia wrappers
  prefixesToWrap.forEach(function (prefix) {
    var name = prefix + (prefix.length ? 'GetUserMedia' : 'getUserMedia');
    if (!navigator[name]) {
      return;
    }
    var origGetUserMedia = navigator[name].bind(navigator);
    var gum = function gum() {
      try {
        sendStatsEntry('getUserMedia', null, arguments[0]);
      } catch (error) {
        console.error('RTCStats getUserMedia bind failed: ', error);
      }
      var cb = arguments[1];
      var eb = arguments[2];
      origGetUserMedia(arguments[0], function (stream) {
        try {
          sendStatsEntry('getUserMediaOnSuccess', null, dumpStream(stream));
        } catch (error) {
          console.error('RTCStats getUserMediaOnSuccess bind failed: ', error);
        }

        // we log the stream id, track ids and tracks readystate since that is ended GUM fails
        // to acquire the cam (in chrome)
        if (cb) {
          cb(stream);
        }
      }, function (err) {
        try {
          sendStatsEntry('getUserMediaOnFailure', null, err.name);
        } catch (error) {
          console.error('RTCStats getUserMediaOnFailure bind failed: ', error);
        }
        if (eb) {
          eb(err);
        }
      });
    };
    navigator[name] = gum.bind(navigator);
  });
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    var gum = function gum() {
      try {
        sendStatsEntry('navigator.mediaDevices.getUserMedia', null, arguments[0]);
      } catch (error) {
        console.error('RTCStats navigator.mediaDevices.getUserMedia bind failed: ', error);
      }
      return origGetUserMedia.apply(navigator.mediaDevices, arguments).then(function (stream) {
        try {
          sendStatsEntry('navigator.mediaDevices.getUserMediaOnSuccess', null, dumpStream(stream));
        } catch (error) {
          console.error('RTCStats navigator.mediaDevices.getUserMediaOnSuccess bind failed: ', error);
        }
        return stream;
      }, function (err) {
        try {
          sendStatsEntry('navigator.mediaDevices.getUserMediaOnFailure', null, err.name);
        } catch (error) {
          console.error('RTCStats navigator.mediaDevices.getUserMediaOnFailure bind failed: ', error);
        }
        return Promise.reject(err);
      });
    };
    navigator.mediaDevices.getUserMedia = gum.bind(navigator.mediaDevices);
  }

  // getDisplayMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    var origGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    var gdm = function gdm() {
      try {
        sendStatsEntry('navigator.mediaDevices.getDisplayMedia', null, arguments[0]);
      } catch (error) {
        console.error('RTCStats navigator.mediaDevices.getDisplayMedia bind failed: ', error);
      }
      return origGetDisplayMedia.apply(navigator.mediaDevices, arguments).then(function (stream) {
        try {
          sendStatsEntry('navigator.mediaDevices.getDisplayMediaOnSuccess', null, dumpStream(stream));
        } catch (error) {
          console.error('RTCStats navigator.mediaDevices.getDisplayMediaOnSuccess bind failed: ', error);
        }
        return stream;
      }, function (err) {
        try {
          sendStatsEntry('navigator.mediaDevices.getDisplayMediaOnFailure', null, err.name);
        } catch (error) {
          console.error('RTCStats navigator.mediaDevices.getDisplayMediaOnFailure bind failed: ', error);
        }
        return Promise.reject(err);
      });
    };
    navigator.mediaDevices.getDisplayMedia = gdm.bind(navigator.mediaDevices);
  }
}