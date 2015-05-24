var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var Constants = require('../constants');

var AppDispatcher = require('../dispatcher/AppDispatcher');

var _up = [];
var _down = [];

var ServicesStore = assign({}, EventEmitter.prototype, {
    getUp: function() {
        return _up;
    },
    getDown: function() {
        return _down;
    }
});

AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case Constants.SERVICES_UPDATED:
            if (changed(_up, action.up) || changed(_down, action.down)) {
                if (!_.isEmpty(_.difference(labels(action.down), labels(_down)))) {
                    ServicesStore.emit(Constants.SERVICES_DOWN);
                }
                _up = action.up;
                _down = action.down;
                ServicesStore.emit(Constants.SERVICES_UPDATED);
            }
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

