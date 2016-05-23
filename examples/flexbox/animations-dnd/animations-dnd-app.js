/**
 * Created by twi18192 on 23/05/16.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var ReactPanels = require('../../../index');

var MyPanel = require('./animations-dnd-my-panel');

var DragAndDropHandler = ReactPanels.DragAndDropHandler;

var App = React.createClass({

    getInitialState: function () {
        this.extendedProps = {
            tab: {
                transitionName: "animated-tab",
                transitionEnter: true,
                transitionLeave: true
            },
            panel: {
                transitionName: "animated-flex-panel",
                transitionEnter: true,
                transitionLeave: true,
                transitionAppear: true,
                dragAndDropHandler: new DragAndDropHandler({}, this.handleDragAndDropTab)
            }
        };

        return {
            msg: "Try to drag&drop a tab. It won't preserve the final state but you'll get the necessary information " +
            "to do it at \"owner\" level."
        };
    },

    handleDragAndDropTab: function (args) {
        this.setState({msg: JSON.stringify(args, null, '  ')});
        this.forceUpdate();
    },

    render: function () {

        return (
            <div>
                <div id="flexbox-fiery">
                    <MyPanel theme="flexbox" skin="fiery" extendedProps={this.extendedProps} initialTabs={['WB6W', '9QLF', '5GFE']} />
                </div>
                <div id="flexbox">
                    <MyPanel theme="flexbox2" extendedProps={this.extendedProps} initialTabs={['D9HJ', 'R2D2', 'C3PO']} />
                </div>
                <p id="left-overlay">Animated panel</p>
                <div id="info">
                    {this.state.msg || ""}
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);