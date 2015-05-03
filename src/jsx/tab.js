
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
    selectedIndex: React.PropTypes.number,
    numTabs: React.PropTypes.number
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
    if (this.props.index == this.context.numTabs - 1) mods.push('last');
    var sheet = this.getSheet("TabButton", mods, {});

    if (this.props.showTitle && this.props.title.length) {
      title = React.createElement("div", {style:sheet.title.style},this.props.title);
    }

    if (this.props.icon) {
      icon = (
        React.createElement("div", {style:sheet.icon.style},
          React.createElement("i", {className:this.props.icon})
        )
      );
    }

    return (
      React.createElement("li", React.__spread({onClick: this.handleClick, style: sheet.style},  this.listeners),
        React.createElement("div", {title: this.props.title},
          icon, React.createElement("div", {style: sheet.box.style}, title)
        )
      )
    );
  }
});

var Tab = React.createClass({
  displayName: 'Tab',
  mixins: [Mixins.Styleable, Mixins.Transitions],

  propTypes: {
    onActiveChanged: React.PropTypes.func,
    maxContentHeight: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "pinned": false,
      "showToolbar": true,
      "showFooter": true,
      "panelComponentType": "Tab",
      "automount": false,
      "maxContentHeight": 0
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number,
    index: React.PropTypes.number,
    globals: React.PropTypes.object
  },

  componentDidMount: function () {
    this._doEvents();
  },

  componentDidUpdate: function () {
    this._doEvents();
  },

  _doEvents: function () {
    if (typeof this.props.onActiveChanged === "function") {
      this.wasActive = this.wasActive || false;
      var active = this.isActive();
      if (this.wasActive != active) {
        this.props.onActiveChanged(this, active);
        this.wasActive = active;
      }
    }
  },

  getValue: function (name) {
    switch (name) {
      case "index":
        return (typeof this.props.index !== "undefined") ? this.props.index : this.context.index;
      case "selectedIndex":
        return this.context.selectedIndex;
      case "showToolbar":
        return this.props.showToolbar;
      case "showFooter":
        return this.props.showFooter;
      case "active":
        return this.isActive();
      case "hasToolbar":
        return this.hasToolbar || false;
      case "hasFooter":
        return this.hasFooter || false;
      case "mounted":
        return this.mounted || false;
      case "automount":
        return this.props.automount;
      case "numChilds":
        return React.Children.count(this.props.children);
      case "tabKey":
        return (typeof this.props.tabKey !== "undefined") ? this.props.tabKey : this.context.tabKey;
    }
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
      active = this.isActive(),
      tp = this.getTransitionProps(),
      mods = (active) ? ['active'] : [],
      sheet = {};

    this.mounted = (this.mounted || false) || this.props.automount || active;
    this.hasToolbar=this.hasFooter=false;
    
    var innerContent = (this.mounted) ? React.Children.map(self.props.children, function(child, i) {
      var type = (i == 0 && numChilds >= 2) ? 0 : 1;   // 0: Toolbar, 1: Content, 2: Footer
      if (React.isValidElement(child) && (typeof child.props.panelComponentType !== "undefined")) {
        switch (String(child.props.panelComponentType)) {
          case "Toolbar": type = 0; break;
          case "Content": type = 1; break;
          case "Footer": type = 2; break;
        }
      }
      if (i == 0) {
        if (type == 0) {
          this.hasToolbar = true;
          if (self.props.showToolbar) mods.push('withToolbar');
        }
        sheet = self.getSheet("Tab", mods);
      }
      if (i == self.props.children.length-1 && type == 2) {
        this.hasFooter = true;
        if (self.props.showFooter) {
          mods.push('withFooter');
          sheet = self.getSheet("Tab", mods);
        }
      }
      switch (type) {
        case 0:
          return (self.props.showToolbar) ? (
            React.createElement("div", {key: i, style: sheet.toolbar.style},
              React.createElement("div", {className: "tab-toolbar", style: sheet.toolbar.children.style},
                child
              )
            )
          ) : null;
        case 1:
          var contentStyle = React.addons.update({
            maxHeight : this.props.maxContentHeight || "none",
            overflowX :"hidden",
            overflowY : this.props.maxContentHeight?"auto":"hidden"
          }, {$merge: sheet.content.style});

          return (
            React.createElement("div", {key: i, style: contentStyle},
              React.createElement("div", {className: "tab-content", style: sheet.content.children.style},
                child
              )
            )
          );
        case 2:
          return (self.props.showFooter) ? (
            React.createElement("div", {key: i, style: sheet.footer.style},
              React.createElement("div", {className: "tab-footer", style: sheet.footer.children.style},
                child
              )
            )
          ) : null;
      }
    }.bind(this)) : null;

    return (
      React.createElement(tp.transitionComponent, React.__spread({component: "div", style: sheet.style,
            transitionName: tp.transitionName, transitionAppear: tp.transitionAppear && active,
            transitionEnter: tp.transitionEnter && active, transitionLeave: tp.transitionLeave && active},
          tp.transitionCustomProps),
        innerContent
      )
    );

  }

});
