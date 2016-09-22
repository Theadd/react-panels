
var React = require('react');
var ReactDOM = require('react-dom');
var ReactPanels = require('../../../index');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var ToggleButton = ReactPanels.ToggleButton;

var MyPanel = React.createClass({

    getInitialState: function () {
        return {toolbars: true};
    },

    handleToggleToolbars: function () {
        console.debug("IN handleToggleToolbars");
        this.setState({toolbars: !this.state.toolbars});
    },

    render: function () {
        console.debug("IN RENDER 1, toolbars: " + this.state.toolbars);
        return (
            <Panel theme="flexbox" useAvailableHeight={true} buttons={[
          <ToggleButton title="Toggle Toolbar" active={this.state.toolbars} onChange={this.handleToggleToolbars}>
            <i className="fa fa-wrench"></i>
          </ToggleButton>
        ]}>
                <Tab title="One" icon="fa fa-plane" showToolbar={this.state.toolbars}>
                    <Toolbar>Toolbar content of One</Toolbar>
                    <Content>Content of One</Content>
                    <Footer>Footer content of One</Footer>
                </Tab>
                <Tab title="Two" icon="fa fa-fire" showToolbar={this.state.toolbars}>
                    <Content>Content of Two</Content>
                </Tab>
            </Panel>
        );
    }
});

ReactDOM.render(
    <MyPanel />,
    document.getElementById('root')
);