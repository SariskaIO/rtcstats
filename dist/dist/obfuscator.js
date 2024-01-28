"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _sdp = _interopRequireDefault(require("sdp"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
} // obfuscate ip addresses which should not be stored long-term.
/**
 * obfuscate ip, keeping address family intact.
 * @param {*} ip
 */
function maskIP(ip) {
  if (ip.indexOf('[') === 0 || ip.indexOf(':') !== -1) {
    // IPv6
    // obfuscate last five bits like Chrome does.
    return "".concat(ip.split(':').slice(0, 3).join(':'), ":x:x:x:x:x");
  }
  var parts = ip.split('.');
  if (parts.length === 4) {
    parts[3] = 'x';
    return parts.join('.');
  }
  return ip;
}

/**
 * Returns a simple IP mask.
 *
 * @returns masked IP.
 */
function obfuscateIP(ip) {
  if (ip.indexOf('[') === 0 || ip.indexOf(':') !== -1) {
    return 'x:x:x:x:x:x:x:x';
  }
  return 'x.x.x.x';
}

/**
 * obfuscate the ip in ice candidates. Does NOT obfuscate the ip of the TURN server to allow
 * selecting/grouping sessions by TURN server.
 * @param {*} candidate
 */
function obfuscateCandidate(candidate) {
  var cand = _sdp["default"].parseCandidate(candidate);
  if (!(cand.type === 'relay' || cand.protocol === 'ssltcp')) {
    cand.ip = cand.ip;
    cand.address = cand.address;
  }
  if (cand.relatedAddress) {
    cand.relatedAddress = cand.relatedAddress;
  }
  return _sdp["default"].writeCandidate(cand);
}

/**
 *
 * @param {*} sdp
 */
function obfuscateSDP(sdp) {
  var lines = _sdp["default"].splitLines(sdp);
  return "".concat(lines.map(function (line) {
    // obfuscate a=candidate, c= and a=rtcp
    if (line.indexOf('a=candidate:') === 0) {
      return "a=".concat(obfuscateCandidate(line));
    } else if (line.indexOf('c=') === 0) {
      return 'c=IN IP4 0.0.0.0';
    } else if (line.indexOf('a=rtcp:') === 0) {
      return 'a=rtcp:9 IN IP4 0.0.0.0';
    }
    return line;
  }).join('\r\n').trim(), "\r\n");
}

/**
 *
 * @param {*} stats
 */
function obfuscateStats(stats) {
  Object.keys(stats).forEach(function (id) {
    var report = stats[id];

    // TODO Safari and Firefox seem to be sending empty statistic files
    if (!report) {
      return;
    }

    // obfuscate different variants of how the ip is contained in different stats / versions.
    ['ipAddress', 'ip', 'address'].forEach(function (address) {
      if (report[address] && report.candidateType !== 'relay') {
        report[address] = obfuscateIP(report[address]);
      }
    });
    ['googLocalAddress', 'googRemoteAddress'].forEach(function (name) {
      // contains both address and port
      var port;
      var ip;
      var splitBy;

      // These fields also have the port, separate it first and the obfuscate.
      if (report[name]) {
        // IPv6 has the following format [1fff:0:a88:85a3::ac1f]:8001
        // IPv5 has the following format 127.0.0.1:8001
        if (report[name][0] === '[') {
          splitBy = ']:';
        } else {
          splitBy = ':';
        }
        var _report$name$split = report[name].split(splitBy);
        var _report$name$split2 = _slicedToArray(_report$name$split, 2);
        ip = _report$name$split2[0];
        port = _report$name$split2[1];
        report[name] = "".concat(obfuscateIP(ip), ":").concat(port);
      }
    });
  });
}

/**
 * Obfuscates the ip addresses from webrtc statistics.
 * NOTE. The statistics spec is subject to change, consider evaluating which statistics contain IP addresses
 * before usage.
 *
 * @param {*} data
 */
function _default(data) {
  switch (data[0]) {
    case 'addIceCandidate':
    case 'onicecandidate':
      if (data[2] && data[2].candidate) {
        var jsonRepr = data[2];
        jsonRepr.candidate = obfuscateCandidate(jsonRepr.candidate);
        data[2] = jsonRepr;
      }
      break;
    case 'setLocalDescription':
    case 'setRemoteDescription':
    case 'createOfferOnSuccess':
    case 'createAnswerOnSuccess':
      if (data[2] && data[2].sdp) {
        data[2].sdp = obfuscateSDP(data[2].sdp);
      }
      break;
    case 'getStats':
    case 'getstats':
      if (data[2]) {
        obfuscateStats(data[2]);
      }
      break;
    default:
      break;
  }
}