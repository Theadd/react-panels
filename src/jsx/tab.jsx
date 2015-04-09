
var TabButton = React.createClass({
  mixins: [Mixins.StyleableWithEvents],

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "index": 0,
      "selectedIndex": false,
      "showTitle": true
    };
  },

  handleClick: function (event) {
    event.preventDefault();
    this.props.onClick(event, this.props.index);
  },

  render: function() {
    var icon = null,
      title = "",
      mods = (this.props.selectedIndex == this.props.index) ? ['active'] : [];

    if (!(this.props.showTitle && this.props.title.length)) mods.push('untitled');
    var sheet = this.getSheet("TabButton", mods, {});

    if (this.props.showTitle && this.props.title.length) {
      title = (<div style={sheet.title.style}>{this.props.title}</div>);
    }

    if (this.props.icon) {
      icon = (
        <div style={sheet.icon.style}>
          <i className={this.props.icon}></i>
        </div>
      );
    }

    return (
      <li onClick={this.handleClick} style={sheet.style} {...this.listeners}>
        <div title={this.props.title}>
          {icon} <div style={sheet.box.style}>{title}</div>
        </div>
      </li>
    );
  }
});

var Tab = React.createClass({

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "pinned": false,
      "showToolbar": true,
      "panelComponentType": "Tab"
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number,
    index: React.PropTypes.number
  },

  isActive: function () {
    if (typeof this.props.index !== "undefined") {
      return (this.props.index == this.context.selectedIndex);
    } else {
      return (this.context.index == this.context.selectedIndex);
    }
  },

  render: function() {
    var self = this,
      numChilds = React.Children.count(this.props.children),
      vIndex = 0,
      tabStyle = {display: (this.isActive()) ? "block" : "none"},
      toolbarStyle = {
        display: (this.props.showToolbar) ? "block" : "none"
      },
      tabClasses = "panel-tab",
      hasToolbar = false;

    var innerContent = React.Children.map(self.props.children, function(child) {
      var type = (vIndex == 0 && numChilds >= 2) ? 0 : 1;   // 0: Toolbar, 1: Content, 2: Footer
      if (React.isValidElement(child) && (typeof child.props.panelComponentType !== "undefined")) {
        switch (String(child.props.panelComponentType)) {
          case "Toolbar": type = 0; break;
          case "Content": type = 1; break;
          case "Footer": type = 2; break;
        }
      }
      switch (type) {
        case 0:
          hasToolbar = true;
          return (<div className="panel-toolbar" key={vIndex++} style={toolbarStyle}>{child}</div>);
        case 1: return (<div className="panel-content" key={vIndex++}>{child}</div>);
        case 2: return (<div className="panel-footer" key={vIndex++}>{child}</div>);
      }
    });
    tabClasses += (this.props.showToolbar && hasToolbar) ? " with-toolbar" : "";

    return (
      <div className={tabClasses} style={tabStyle}>
        {innerContent}
      </div>
    );
  }

});
