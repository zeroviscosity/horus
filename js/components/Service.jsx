var React = require('react');

var ServiceStore = require('../stores/ServiceStore');

var Service = React.createClass({
    render: function() {
        return (
            <div className="service grid">
                <div className="col-1-12">
                    <div className="service-status"></div>
                </div>
                <div className="col-3-12">
                    <div className="service-label">{this.props.service.label}</div>
                </div>
                <div className="col-3-12">
                    <a className="service-url" href={this.props.service.url} target="_blank">
                        {this.props.service.url}
                    </a>
                </div>
                <div className="col-3-12">
                    <div className="service-display">{this.props.service.display}</div>
                </div>
                <div className="col-2-12">
                    <div className="service-last-seen">
                        {ServiceStore.getLastSeen(this.props.service.label)}
                    </div>
                </div>
            </div>);
    }
});

module.exports = Service;

