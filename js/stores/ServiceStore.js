var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var Constants = require('../constants');

var AppDispatcher = require('../dispatcher/AppDispatcher');

var _available = true;
var _up = [];
var _down = [];
var _lastSeen = {};

var ServicesStore = assign({}, EventEmitter.prototype, {
    getUp: function() {
        return _up;
    },
    getDown: function() {
        return _down;
    },
    getLastSeen: function(label) {
        if (!_lastSeen[label]) return '-';
        var diff = Date.now() - _lastSeen[label];
        return Math.round(diff / 1000) + 's';
    },
    isAvailable: function() {
        return _available;
    }
});

_.each(window.HorusConfig.services, function(s) {
    _lastSeen[s.label] = 0;
});

AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case Constants.SERVICES_UPDATED:
            _available = true;
            if (changed(_up, action.up) || changed(_down, action.down)) {
                if (!_.isEmpty(_.difference(labels(action.down), labels(_down)))) {
                    ServicesStore.emit(Constants.SERVICES_DOWN);
                }
                _up = action.up;
                _down = action.down;
                ServicesStore.emit(Constants.SERVICES_UPDATED);
            }
            _.each(_up, function(s) {
                _lastSeen[s.label] = Date.now();
            });
            break;
        case Constants.SERVICES_UNAVAILABLE:
            _available = false;
            ServicesStore.emit(Constants.SERVICES_UPDATED);
            break;
    }
});

function labels(xs) {
    return _.map(xs, function(x) { return x.label; });
}

function changed(a, b) {
    return !_.isEmpty(_.xor(labels(a), labels(b)));
}

module.exports = ServicesStore;

