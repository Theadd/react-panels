
var React = require('react');
var ReactDOM = require('react-dom');
var ReactPanels = require('../../index');

var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Content = ReactPanels.Content;

var SimplePanelExample = React.createClass({

    render: function(){
        return(
            <Panel theme="chemical">
                <Tab title="One" icon="fa fa-plane">
                    <Content>Content of One</Content>
                </Tab>
                <Tab title="Two" icon="fa fa-fire">
                    <Content>Content of Two</Content>
                </Tab>
            </Panel>
        )
    }
});

ReactDOM.render(
    <SimplePanelExample/>,
        document.getElementById('root')
);