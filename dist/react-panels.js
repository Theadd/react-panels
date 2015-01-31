/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

var Panel = React.createClass({displayName: "Panel",

  applyPreset: function (preset) {
    var self = this,
      defaultProps = {
        "icon": "",
        "title": "",
        "theme": "default",
        "bordered": false,
        "opaque": false,
        "raised": false,
        "rounded": false,
        "buttons": [],
        /** Set panel title based on the title of the active tab. */
        "getTitleFromActiveTab": false,
        "displayTabTitles": true
      };

    Object.keys(defaultProps).forEach(function(prop) {
      var value = defaultProps[prop];

      if (typeof self.props[prop] !== "undefined") {
        value = self.props[prop];
      } else if (typeof preset[prop] !== "undefined") {
        value = preset[prop];
      }

      self.props[prop] = value;
    });
  },

  getInitialState: function () {
    var tabList = [],
      defaultTabIndex = 0,
      i = 0;

    this.applyPreset(this.props.preset || {});

    React.Children.forEach(this.props.children, function(tab) {
      var hasToolbar = (typeof tab.props.toolbar !== "undefined"),
        toolbarState = tab.props.toolbarState || ((hasToolbar) ? "visible" : "none");

      if (tab.props.active || false) {
        defaultTabIndex = i;
      }
      tabList.push({
        index: i,
        icon: tab.props.icon || false,
        title: tab.props.title || "",
        toolbar: toolbarState,
        padding: Boolean(!(tab.props.noPadding || false))
      });

      ++i;
    });

    return {
      tabIndex: defaultTabIndex,
      tabCount: React.Children.count(this.props.children),
      tabList: tabList,
      state: "default"
    };
  },

  getIcon: function () {
    var icon = null;

    if (this.props.icon) {
      icon = (
        React.createElement("span", {className: "rpanel-icon"}, 
          React.createElement("i", {className: this.props.icon})
        )
      );
    }

    return icon;
  },

  getTabs: function () {
    var self = this,
      classes = "rpanel-tabs" + (((self.state.tabCount > 1) || (self.props.forceTabs || false)) ? "" : " hidden");

    return (
      React.createElement("ul", {className: classes}, 
        self.state.tabList.map(function(tab) {
          return React.createElement(PanelTab, {
            title: tab.title, 
            icon: tab.icon, 
            showTitle: self.props.displayTabTitles, 
            index: tab.index, 
            key: tab.index, 
            selected: self.state.tabIndex, 
            onClick: self.handleClickOnTab});
        })
      )
    );
  },

  getBody: function () {
    var self = this,
      index = 0;

    return (
      React.createElement("div", {className: "rpanel-body"}, 
        React.Children.map(this.props.children, function (child) {
          var showToolbar = (['visible', 'locked'].indexOf(self.state.tabList[index].toolbar) != -1),
            display = (index == self.state.tabIndex),
            classes = "rpanel-tab-body" + ((display) ? " active" : ""),
            toolbarClasses = "rpanel-toolbar" + ((showToolbar) ? " active" : ""),
            contentClasses = "rpanel-content" + ((!self.state.tabList[index].padding) ? " no-padding" : "");

          ++index;

          if (React.isValidElement(child.props.toolbar)) {
            child.props.toolbar.props.parentPanel = self;
          }

          return (
            React.createElement("div", {className: classes, key: index - 1}, 
              React.createElement("div", {className: toolbarClasses}, child.props.toolbar), 
              React.createElement("div", {className: contentClasses}, child.props.children)
            )
          );
        })
      )
    );
  },

  getButtons: function () {
    var self = this,
      buttons = null,
      keyIndex = 0;

    if (self.props.buttons.length) {
      buttons = [];

      for (var i = self.props.buttons.length; --i >= 0;) {
        var button = self.props.buttons[i],
          buttonIdentifier = "",
          customButtonProps = {};

        if (typeof button === "string" || ((typeof button === "object") && !React.isValidElement(button))) {
          if (typeof button === "string") {
            buttonIdentifier = button;
          } else {
            buttonIdentifier = Object.keys(button)[0];
            customButtonProps = button[buttonIdentifier];
          }
          var predefinedButton = self.getButton(buttonIdentifier, keyIndex, customButtonProps);
          if (predefinedButton || false) {
            buttons.push(predefinedButton);
            ++keyIndex;
          }
        } else if (React.isValidElement(button)) {
          var panelButton = (
            React.createElement(PanelButton, React.__spread({},  button.props, 
              {key: keyIndex, 
              tabIndex: keyIndex, 
              parent: this})
            )
          );

          buttons.push(panelButton);
          ++keyIndex;
        }
      }
    }

    return buttons;
  },

  handleClickOnTab: function (child) {
    this.setState({tabIndex: child.props.index});
  },

  handleClickOnClose: function (event) {
    event.preventDefault();
    this.setState({state: "closed"});
  },

  handleClickOnCollapse: function (event) {
    var newState = (this.state.state == "collapsed") ? "default" : "collapsed";

    event.preventDefault();
    this.setState({state: newState});
  },

  handleClickOnFullscreen: function (event) {
    var newState = (this.state.state == "fullscreen") ? "default" : "fullscreen";

    event.preventDefault();
    this.setState({state: newState});
  },

  handleClickOnToggleToolbar: function (event) {
    var toolbarState = this.state.tabList[this.state.tabIndex].toolbar,
      tabList = this.state.tabList;

    event.preventDefault();
    if (toolbarState == "visible") {
      tabList[this.state.tabIndex].toolbar = "hidden";
      this.setState({tabList: tabList});
    } else if (toolbarState == "hidden") {
      tabList[this.state.tabIndex].toolbar = "visible";
      this.setState({tabList: tabList});
    }

  },

  dragStart: function (e) {
    this.panelBounds = {
      startLeft: Number(this.props.left) || 80,
      startTop: Number(this.props.top) || 100,
      startPageX: e.pageX,
      startPageY: e.pageY
    };

    try {
      e.dataTransfer.setData('text/plain', "Panel");
    } catch (err) { /* Fix for IE */ }

    window.addEventListener('dragover', this.dragOver);
  },

  dragEnd: function() {
    delete this.panelBounds;
    window.removeEventListener('dragover', this.dragOver);
  },

  dragOver: function(e) {
    if (this.panelBounds || false) {
      var left = this.panelBounds.startLeft + (e.pageX - this.panelBounds.startPageX),
        top = this.panelBounds.startTop + (e.pageY - this.panelBounds.startPageY);
      this.setProps({ left: left, top: top });
    }
  },

  render: function() {
    var classes = this.getClasses(),
      icon = this.getIcon(),
      tabs = this.getTabs(),
      buttons = this.getButtons(),
      title = this.props.title + (
          (this.props.getTitleFromActiveTab) ? this.state.tabList[this.state.tabIndex].title : ""
        ),
      header = (this.props.draggable || false) ? (
        React.createElement("header", {
          draggable: "true", 
          onDragEnd: this.dragEnd, 
          onDragStart: this.dragStart}, 
          icon, 
          React.createElement("span", {className: "rpanel-title"}, title), 
          buttons, 
          tabs
        )
      ) : (
        React.createElement("header", null, 
          icon, 
          React.createElement("span", {className: "rpanel-title"}, title), 
          buttons, 
          tabs
        )
      ),
      body = this.getBody();

    var left = Number(this.props.left) || 80,
      top = Number(this.props.top) || 100,
      width = String(this.props.width || 800) + "px",
      transform = (this.state.state == "fullscreen") ? "inherit" : "translate3d(" + left + "px, " + top + "px, 0)";

    return ((this.props.floating || false) && (this.props.draggable)) ? (
      React.createElement("div", {className: classes, style: {
        WebkitTransform: transform,
        MozTransform: transform,
        msTransform: transform,
        transform: transform,
        width: (this.state.state == "fullscreen") ? "100%" : width
      }}, 
        header, 
        body
      )
    ) : (
      React.createElement("div", {className: classes}, 
        header, 
        body
      )
    );
  },

  getClasses: function () {
    var classes = "rpanel " + this.props.theme;

    if (this.props.rounded) {
      classes += " rounded";
    } else {
      if (this.props.roundedTop) {
        classes += " rounded-top";
      }
      if (this.props.roundedBottom) {
        classes += " rounded-bottom";
      }
    }

    if (this.props.rounded) {
      if (this.props.rounded == "top") {
        classes += " rounded-top";
      } else if (this.props.rounded == "bottom") {
        classes += " rounded-bottom";
      } else {
        classes += " rounded";
      }
    }

    if (this.props.bordered) {
      classes += " bordered";
    }

    if (this.props.raised) {
      classes += " raised";
    }

    if (this.props.floating) {
      classes += " floating";
    }

    if (this.state.state != "default") {
      classes += " rpanel-state-" + this.state.state;
    }

    return classes;
  },

  getButton: function (identifier, key, customProps) {
    var preset = {};

    switch (identifier) {

      case "close":
        preset = {"onClick": this.handleClickOnClose};
        break;

      case "collapse":
        preset = {
          "identifier": "collapse",
          "icon": "fa fa-minus",
          "title": "Toggle panel",
          "active": function (button) {
            return (button.props.parent.state.state == "collapsed");
          },
          "hiddenOnFullscreen": true,
          "onClick": this.handleClickOnCollapse
        };
        break;

      case "fullscreen":
        preset = {
          "identifier": "fullscreen",
          "icon": "fa fa-expand",
          "title": "Toggle fullscreen",
          "active": function (button) {
            return (button.props.parent.state.state == "fullscreen");
          },
          "onClick": this.handleClickOnFullscreen
        };
        break;

      case "toggleToolbar":
        preset = {
          "identifier": "toggleToolbar",
          "icon": "fa fa-pencil-square-o",
          "title": "Toggle toolbar of active tab",
          "active": function (button) {
            return (["visible", "locked"].indexOf(button.props.parent.state.tabList[button.props.parent.state.tabIndex].toolbar) != -1);
          },
          "disabled": function (button) {
            return (["locked", "none"].indexOf(button.props.parent.state.tabList[button.props.parent.state.tabIndex].toolbar) != -1);
          },
          "hiddenOnFullscreen": true,
          "onClick": this.handleClickOnToggleToolbar
        };
        break;

      case "custom":
        break;

      default:
        throw new Error("Predefined button '" + identifier + "' not found.");
    }

    Object.keys(customProps || {}).forEach(function(prop) {
      preset[prop] = customProps[prop];
    });

    return (Object.keys(preset).length) ?
      (React.createElement(PanelButton, {key: key, tabIndex: key, parent: this, preset: preset})) : null;
  },

  addPanelContent: function (panelContent, selected) {
    var _state = this.state,
      i = _state.tabList.length,
      hasToolbar = (typeof panelContent.props.toolbar !== "undefined"),
      toolbarState = panelContent.props.toolbarState || ((hasToolbar) ? "visible" : "none");

    _state.tabList.push({
      index: i,
      icon: panelContent.props.icon || false,
      title: panelContent.props.title || "",
      toolbar: toolbarState,
      padding: Boolean(!(panelContent.props.noPadding || false))
    });

    _state.tabCount = i + 1;
    if (selected || false) {
      _state.tabIndex = i;
    }

    this.props.children.push(panelContent);
    this.setState(_state);
  },

  setPanelContentTitle: function (newTitle, index) {
    if (typeof index === "undefined" || index == null) {
      index = this.state.tabIndex;
    }

    var tabList = this.state.tabList;
    try {
      tabList[index].title = newTitle;
      this.props.children[index].props.title = newTitle;
      this.setState({tabList: tabList});
    } catch (err) {
      console.error(err);
    }
  }

});

var PanelTab = React.createClass({displayName: "PanelTab",
  //This is the tab button in header not the tab's content

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "index": 0,
      "selected": false,
      "showTitle": true
    };
  },

  handleClick: function (event) {
    event.preventDefault();
    this.props.onClick(this);
  },

  render: function() {
    var icon = null,
      title = (this.props.showTitle && this.props.title.length) ? (
        React.createElement("span", {className: "rpanel-title"}, this.props.title)
      ) : (
        React.createElement("span", {className: "rpanel-title hidden"})
      ),
      classes = (this.props.index == this.props.selected) ? "rpanel-tab active" : "rpanel-tab";

    if (this.props.icon) {
      icon = (
        React.createElement("span", {className: "rpanel-icon"}, 
          React.createElement("i", {className: this.props.icon})
        )
      );
    }

    return (
      React.createElement("li", {className: classes, onClick: this.handleClick}, 
        React.createElement("a", {href: "#", title: this.props.title}, icon, " ", title)
      )
    );
  }
});

var PanelContent = React.createClass({displayName: "PanelContent",
  render: function() {
    //dummy
  }
});

/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

var PanelButton = React.createClass({displayName: "PanelButton",

  applyPreset: function (preset) {
    var self = this,
      defaultProps = {
        "identifier": "close",
        "icon": "fa fa-times",
        "title": "Close",
        "active": false,
        "disabled": false,
        "hiddenOnFullscreen": false,
        "onClick": function () {}
      };

    Object.keys(defaultProps).forEach(function(prop) {
      var value = defaultProps[prop];

      if (typeof self.props[prop] !== "undefined") {
        value = self.props[prop];
      } else if (typeof preset[prop] !== "undefined") {
        value = preset[prop];
      }

      self.props[prop] = value;
    });

    if (typeof self.props.active === "function") {
      self.props.active = self.props.active(self);
    }
    if (typeof self.props.disabled === "function") {
      self.props.disabled = self.props.disabled(self);
    }
  },

  handleClick: function (event) {
    if (typeof this.props.onClick === "function") {
      this.props.onClick(event, this);
    }
  },

  render: function() {
    this.applyPreset(this.props.preset || {});

    var classes = "rpanel-control" +
      ((this.props.active) ? " active" : "") +
      ((this.props.disabled) ? " disabled" : "") +
      ((this.props.hiddenOnFullscreen && this.props.parent.state.state == "fullscreen") ? " hidden" : "");

    return (
      React.createElement("div", {className: classes, key: this.props.tabIndex, onClick: this.handleClick}, 
        React.createElement("a", {href: "#", className: "rpanel-button", title: this.props.title}, 
          React.createElement("i", {className: this.props.icon})
        )
      )
    );
  }

});

var CustomPanelButton = React.createClass({displayName: "CustomPanelButton",
  render: function() {
    //dummy
  }
});
