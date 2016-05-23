/**
 * Created by twi18192 on 23/05/16.
 */

var React = require('react');
var ReactPanels = require('../../../index');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

var MyPanel = React.createClass({

    propTypes: {
        theme: React.PropTypes.string,
        extendedProps: React.PropTypes.object.isRequired,
        initialTabs: React.PropTypes.array.isRequired
    },

    getInitialState: function () {
        return {
            tabs: this.props.initialTabs,
            toolbars: true
        };
    },

    handleToggleToolbars: function () {
        this.setState({toolbars: !this.state.toolbars});
    },

    addTab: function () {                   //produces a 4 digit random string to use as tab's name and key
        var newTabs = this.state.tabs.concat([("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4).toUpperCase()])
        this.setState({tabs: newTabs});
    },

    removeTab: function () {
        var self = this,
            newTabs = this.state.tabs,
            selectedIndex = this.refs.panel.getSelectedIndex();
        newTabs.splice(selectedIndex, 1);
        self.setState({tabs: newTabs});
    },

    render: function () {
        var tabs = this.state.tabs.map(function(item, i) {
            var tabTitle = "TAB " + item;
            return (
                <Tab key={item} title={tabTitle} icon="fa fa-cube"
                     showToolbar={this.state.toolbars} {...this.props.extendedProps.tab}>
                    <Toolbar>Toolbar</Toolbar>
                    <Content>Content of {tabTitle}</Content>
                    <Footer>Footer</Footer>
                </Tab>
            );
        }.bind(this));

        return (
            <Panel ref="panel" theme={this.props.theme || "flexbox"} skin={this.props.skin || "default"} useAvailableHeight={true}
                {...this.props.extendedProps.panel} buttons={[
          <ToggleButton title="Toggle Toolbar" active={this.state.toolbars} onChange={this.handleToggleToolbars}>
            <i className="fa fa-wrench"></i>
          </ToggleButton>,
          <Button title="Add another tab" onButtonClick={this.addTab}>
            <i className="fa fa-plus"></i>
          </Button>,
          <Button title="Remove active tab" onButtonClick={this.removeTab}>
            <i className="fa fa-times"></i>
          </Button>
        ]}>
                {tabs}
            </Panel>
        );
    }
});

module.exports = MyPanel;