
var React = require('react');

var ReactPanels = require('../../../index.js');
var Tab = ReactPanels.Tab;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;
var TabWrapperMixin = ReactPanels.Mixins.TabWrapper;

var MyItemTab = React.createClass({
  displayName: 'MyItemTab',
  mixins: [TabWrapperMixin],

  handleClick: function () {
    if (typeof this.props.onClose === "function") {
      this.props.onClose(this.props.index); //NOTE: props.index is assigned by Panel, props.selectedIndex too
    }
  },

  render: function() {
    var strItem = JSON.stringify(this.props.item, null, '  ');

    return (
      <Tab
        icon={this.props.icon}
        title={this.props.title}
      >
        <Content>
          <p><strong>Item value:</strong></p>
          <pre style={{wordWrap: "break-word"}}>{strItem}</pre>
        </Content>

        <Footer>
          <span style={{textAlign: "left", display: "block"}}>
            <input type="button" value="Close" onClick={this.handleClick} />
          </span>
        </Footer>
      </Tab>
    );
  }

});

module .exports = MyItemTab;