var React = require('react');
var _ = require('lodash');

var Constants = require('../constants');

var ServiceActions = require('../actions/ServiceActions');

var ServiceStore = require('../stores/ServiceStore');

var Service = require('./Service.jsx');

var Services = React.createClass({
    timer: null,
    updateState: function() {
        this.setState({
            up: ServiceStore.getUp(),
            down: ServiceStore.getDown()
        });
    },
    getInitialState: function() {
        return {
            up: ServiceStore.getUp(),
            down: ServiceStore.getDown()
        };
    },
    componentDidMount: function() {
        ServiceActions.refresh();

        this.timer = setInterval(function() {
            ServiceActions.refresh();
        }, 60000);

        ServiceStore.on(Constants.SERVICES_UPDATED, this.updateState);
    },
    componentWillUnmount: function() {
        clearInterval(this.timer);
        ServiceStore.removeListener(Constants.SERVICES_UPDATED, this.updateState);
    },
    render: function() {
        var down = _.map(this.state.down, function(s, i) {
            return <Service key={'down-' + i} service={s}/>;
        });

        var up = _.map(this.state.up, function(s, i) {
            return <Service key={'up-' + i} service={s}/>;
        });

        return (up.length || down.length) ? (
            <div className="services">
                <div className="services-down">
                    {down}
                </div>
                <div className="services-up">
                    {up}
                </div>
            </div>) : (
            <div className="spinner">
                <div className="rect1"></div>
                <div className="rect2"></div>
                <div className="rect3"></div>
                <div className="rect4"></div>
                <div className="rect5"></div>
            </div>);
    }
});

module.exports = Services;

