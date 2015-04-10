
var TabButton = React.createClass({
  mixins: [Mixins.StyleableWithEvents],

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "index": 0,
      "showTitle": true
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number
  },

  handleClick: function (event) {
    event.preventDefault();
    this.props.onClick(event, this.props.index);
  },

  render: function() {
    var icon = null,
      title = "",
      mods = (this.context.selectedIndex == this.props.index) ? ['active'] : [];

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
      React.createElement("li", React.__spread({onClick: this.handleClick, style: sheet.style},  this.listeners),
        React.createElement("div", {title: this.props.title},
          icon, " ", React.createElement("div", {style: sheet.box.style}, title)
        )
      )
    );
  }
});

var Tab = React.createClass({
  displayName: 'Tab',
  mixins: [Mixins.Styleable],

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
      mods = (this.isActive()) ? ['active'] : [],
      sheet = {};

    var innerContent = React.Children.map(self.props.children, function(child) {
      var type = (vIndex == 0 && numChilds >= 2) ? 0 : 1;   // 0: Toolbar, 1: Content, 2: Footer
      if (React.isValidElement(child) && (typeof child.props.panelComponentType !== "undefined")) {
        switch (String(child.props.panelComponentType)) {
          case "Toolbar": type = 0; break;
          case "Content": type = 1; break;
          case "Footer": type = 2; break;
        }
      }
      if (vIndex == 0) {
        if (type == 0 && self.props.showToolbar) mods.push('withToolbar');
        sheet = self.getSheet("Tab", mods);
      }
      switch (type) {
        case 0: return (<div key={vIndex++} style={sheet.toolbar.style}>{child}</div>);
        case 1: return (<div key={vIndex++} style={sheet.content.style}>{child}</div>);
        case 2: return (<div key={vIndex++} style={sheet.footer.style}>{child}</div>);
      }
    });

    return (
      <div style={sheet.style}>
        {innerContent}
      </div>
    );
  }

});
