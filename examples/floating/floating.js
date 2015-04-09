
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
      React.createElement(Tab, {
        icon: this.props.icon, 
        title: this.props.title
      }, 
        React.createElement(Content, null, 
          React.createElement("p", null, React.createElement("strong", null, "Item value:")), 
          React.createElement("pre", {style: {wordWrap: "break-word"}}, strItem)
        ), 

        React.createElement(Footer, null, 
          React.createElement("span", {style: {textAlign: "left", display: "block"}}, 
            React.createElement("input", {type: "button", value: "Close", onClick: this.handleClick})
          )
        )
      )
    );
  }

});


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
      React.createElement(Tab, {
        icon: this.props.icon, 
        title: this.props.title
      }, 
        React.createElement(Toolbar, null, 
          React.createElement("input", {type: "text", 
            ref: "filter", 
            placeholder: "Filter...", 
            style: {width: "100%"}, 
            onChange: this.handleChangeOnFilter}
          )
        ), 

        React.createElement(Content, null, 
          React.createElement("ul", {className: "items-list"}, 
            $_data.map(function (item) {
              ++index;
              if (self.filter.length && item.name.indexOf(self.filter) == -1 && item.type.indexOf(self.filter) == -1)
                return null;
              return (React.createElement("li", {key: index, "data-index": index, onClick: self.handleClick}, React.createElement("strong", null, "[", item.type, "]"), " ", item.name));
            })
          )
        ), 

        React.createElement(Footer, null, 
          React.createElement("span", {style: {textAlign: "left", display: "block"}}, 
            React.createElement("input", {type: "button", 
              value: "Ok", 
              style: {width: "110px", margin: "0 0 0 10px", float: "right"}}
            ), 
            React.createElement("input", {type: "button", 
              value: "Cancel", 
              style: {width: "110px", margin: "0 0 0 10px"}}
            )
          )
        )
      )
    );
  }

});


var MyFloatingPanel = React.createClass({
  displayName: 'MyFloatingPanel',

  getInitialState: function () {
    this.itemsShown = [];
    return {};
  },

  handleClickOnItem: function (itemIndex) {
    this.refs.myPanel.setSelectedIndex(this.itemsShown.push($_data[itemIndex]));
    this.forceUpdate();
  },

  handleClickOnCloseItemTab: function (itemIndex) {
    this.itemsShown.splice(itemIndex - 1, 1);
    this.refs.myPanel.setSelectedIndex(0);
    this.forceUpdate();
  },

  render: function() {
    var self = this;

    return (
      React.createElement(FloatingPanel, {left: 200, top: 100, width: 520, ref: "myPanel", theme: "chemical"}, 
        React.createElement(MyMainTab, {
          icon: "fa fa-cubes", 
          title: "List of Items", 
          pinned: true, 
          onClickOnItem: self.handleClickOnItem}
        ), 
        self.itemsShown.map(function (item) {
          return (
            React.createElement(MyItemTab, {title: item.name, icon: "fa fa-cube", item: item, 
              onClose: self.handleClickOnCloseItemTab, key: item.id})
          );
        })
      )
    );
  }
});


var App = React.render(
  React.createElement("div", null, 
    React.createElement(MyFloatingPanel, null)
  ),
  document.getElementById('root')
);
