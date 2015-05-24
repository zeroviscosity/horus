var React = require('react');

var Constants = require('../constants');

var ServiceStore = require('../stores/ServiceStore');

var Klaxon = React.createClass({
    play: function() {
        this.refs.klaxon.getDOMNode().play();
    },
    componentDidMount: function() {
        ServiceStore.on(Constants.SERVICES_DOWN, this.play);
    },
    componentWillUnmount: function() {
        ServiceStore.removeListener(Constants.SERVICES_DOWN, this.play);
    },
    render: function() {
        return <audio ref="klaxon" src="/mp3/klaxon.mp3"></audio>;
    }
});

module.exports = Klaxon;

