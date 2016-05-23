/**
 * Created by twi18192 on 23/05/16.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ReactPanels = require('../../../index');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;
var Button = ReactPanels.Button;

var MyPanel = React.createClass({

    getInitialState: function () {
        return {
            tabs: ['wb6w', '9q1f', '5gfe'],
            toolbars: true
        };
    },

    handleToggleToolbars: function () {
        this.setState({toolbars: !this.state.toolbars});
    },

    addTab: function () {
        var newTabs = this.state.tabs.concat([("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)])
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
        var skin = this.props.skin || "default",
            globals = this.props.globals || {};

        var tabs = this.state.tabs.map(function(item, i) {
            var tabTitle = "Tab " + item;
            return (
                <Tab key={item} title={tabTitle} icon="fa fa-cube" showToolbar={this.state.toolbars}>
                    <Toolbar>Toolbar</Toolbar>
                    <Content>Content of {tabTitle}</Content>
                    <Footer>Footer</Footer>
                </Tab>
            );
        }.bind(this));

        return (
            <Panel ref="panel" theme="flexbox" skin={skin} useAvailableHeight={true} globals={globals} buttons={[
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

var panelGlobals = {
    "Panel": {
        "transitionName": "animated-flex-panel",
        "transitionEnter": true,
        "transitionLeave": true,
        "transitionAppear": true
    },
    "Tab": {
        "transitionName": "animated-tab",
        "transitionEnter": true,
        "transitionLeave": true
    }
};

ReactDOM.render(
    <MyPanel skin="fiery" globals={panelGlobals} />,
    document.getElementById('flexbox-fiery')
);
ReactDOM.render(
    <MyPanel />,
    document.getElementById('flexbox')
);