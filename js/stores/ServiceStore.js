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
                _up = action.up;
                _down = action.down;
                ServicesStore.emit(Constants.SERVICES_UPDATED);
                if (_down.length) {
                    ServicesStore.emit(Constants.SERVICES_DOWN);
                }
            }
            break;
    }
});

function changed(a, b) {
    console.log(a, b);
    return !_.isEmpty(_.xor(_.map(a, function(x) {
        return x.label;
    }), _.map(b, function(x) {
        return x.label;
    })));
}

module.exports = ServicesStore;

