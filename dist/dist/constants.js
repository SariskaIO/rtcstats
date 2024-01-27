"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageTypes = exports.PROTOCOL_ITERATION = exports.MAX_RECONNECT_TIME = exports.DUMP_ERROR_CODE = exports.CUSTOM_ERROR_CODES = exports.CONFERENCE_LEAVE_CODE = exports.BUFFER_LIMIT = void 0;
var PROTOCOL_ITERATION = exports.PROTOCOL_ITERATION = '3.1';

// the maximum number of ms allowed for the client to try reconnect
var MAX_RECONNECT_TIME = exports.MAX_RECONNECT_TIME = 600000;
var messageTypes = exports.messageTypes = {
  SequenceNumber: 'sn'
};
var CONFERENCE_LEAVE_CODE = exports.CONFERENCE_LEAVE_CODE = 3001;
var DUMP_ERROR_CODE = exports.DUMP_ERROR_CODE = 3002;
var CUSTOM_ERROR_CODES = exports.CUSTOM_ERROR_CODES = [CONFERENCE_LEAVE_CODE, DUMP_ERROR_CODE];

// The limit chosen for the buffer so that memory overflows do not happen.
var BUFFER_LIMIT = exports.BUFFER_LIMIT = 1000;