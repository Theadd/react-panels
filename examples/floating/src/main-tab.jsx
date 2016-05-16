
var React = require('react');

var ReactPanels = require('../../../index.js');
var Tab = ReactPanels.Tab;
var Content = ReactPanels.Content;
var Toolbar = ReactPanels.Toolbar;
var Footer = ReactPanels.Footer;
var TabWrapperMixin = ReactPanels.Mixins.TabWrapper;

var MyMainTab = React.createClass({
  displayName: 'MyMainTab',
  mixins: [TabWrapperMixin],

  getInitialState: function () {
    this.filter = "";
    return {};
  },

  handleChangeOnFilter: function () {
    this.filter = this.refs.filter.getDOMNode().value;
    this.forceUpdate();
  },

  handleClick: function (event) {
    var element = event.currentTarget,
      index = parseInt(element.dataset.index);

    if (!isNaN(index)) {
      if (typeof this.props.onClickOnItem === "function") {
        this.props.onClickOnItem(index);
      }
    }
  },

  render: function() {
    var self = this,
      index = -1;

    return (
      <Tab
        icon={this.props.icon}
        title={this.props.title}
        showToolbar={this.props.showToolbar}
      >
        <Toolbar>
          <input type="text"
            ref="filter"
            placeholder="Filter..."
            style={{width: "100%"}}
            onChange={this.handleChangeOnFilter}
          />
        </Toolbar>

        <Content>
          <ul className="items-list">
            {$_data.map(function (item) {
              ++index;
              if (self.filter.length && item.name.indexOf(self.filter) == -1 && item.type.indexOf(self.filter) == -1)
                return null;
              return (<li key={index} data-index={index} onClick={self.handleClick}><strong>[{item.type}]</strong> {item.name}</li>);
            })}
          </ul>
        </Content>

        <Footer>
          <span style={{textAlign: "left", display: "block"}}>
            <input type="button"
              value="Ok"
              style={{width: "110px", margin: "0 0 0 10px", float: "right"}}
            />
            <input type="button"
              value="Cancel"
              style={{width: "110px", margin: "0 0 0 10px"}}
            />
          </span>
        </Footer>
      </Tab>
    );
  }

});

module.exports = MyMainTab;