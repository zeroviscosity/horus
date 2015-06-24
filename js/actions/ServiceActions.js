var $ = require('jquery');
var _ = require('lodash');
var async = require('async');

var AppDispatcher = require('../dispatcher/AppDispatcher');

var Constants = require('../constants');

var ServiceActions = {
    refresh: function() {
        // Ensure that Horus is reachable
        $.ajax({
            url: '/api/status',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data && data.status === 'ok') {
                    checkServices();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                AppDispatcher.dispatch({
                    actionType: Constants.SERVICES_UNAVAILABLE
                });
            }
        });
    }
};

function checkServices() {
    var requests = [];

    _.each(window.HorusConfig.services, function(service) {
        requests.push(function(callback) {
            $.ajax({
                url: '/api/service?url=' + service.url,
                method: 'GET',
                timeout: 10000,
                success: function(data) {
                    callback(null, {
                        label: service.label,
                        url: service.url,
                        status: 'ok',
                        display: service.parse(data)
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    callback(null, {
                        label: service.label,
                        url: service.url,
                        status: 'error',
                        display: textStatus + ': ' + errorThrown
                    });
                }
            });
        });
    });

    async.series(requests, function(err, services) {
        if (err) {
            console.log('This should not happen.');
        }

        var sorted = _.sortBy(services, 'label');

        AppDispatcher.dispatch({
            actionType: Constants.SERVICES_UPDATED,
            up: _.filter(sorted, function(service) {
                return service.status === 'ok';
            }),
            down: _.filter(sorted, function(service) {
                return service.status === 'error';
            })
        });
    });
}

module.exports = ServiceActions;

