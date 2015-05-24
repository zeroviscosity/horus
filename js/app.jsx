var React = require('react');

var Klaxon = require('./components/Klaxon.jsx');
var Services = require('./components/Services.jsx');

React.render(
    <div>
        <Services />
        <Klaxon />
    </div>,
    document.getElementById('horus')
);
