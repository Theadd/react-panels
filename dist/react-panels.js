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
        var button = self.props.buttons[i];

        if (typeof button === "string") {
          var predefinedButton = self.getPredefinedButton(button, keyIndex);
          if (predefinedButton || false) {
            buttons.push(predefinedButton);
            ++keyIndex;
          }
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

  getPredefinedButton: function (identifier, key) {
    var button = null,
      classes = "rpanel-control",
      hiddenOnFullscreen = (this.state.state == "fullscreen") ? " hidden" : "",
      toolbarState = "";

    switch (identifier) {
      case "close":
        button = (
          React.createElement("div", {className: classes, key: key, onClick: this.handleClickOnClose}, 
            React.createElement("a", {href: "#", className: "rpanel-button"}, 
              React.createElement("i", {className: "fa fa-times"})
            )
          )
        );
        break;
      case "collapse":
        classes += ((this.state.state == "collapsed") ? " active" : "") + hiddenOnFullscreen;
        button = (
          React.createElement("div", {className: classes, key: key, onClick: this.handleClickOnCollapse}, 
            React.createElement("a", {href: "#", className: "rpanel-button"}, 
              React.createElement("i", {className: "fa fa-minus"})
            )
          )
        );
        break;
      case "fullscreen":
        classes += (this.state.state == "fullscreen") ? " active" : "";
        button = (
          React.createElement("div", {className: classes, key: key, onClick: this.handleClickOnFullscreen}, 
            React.createElement("a", {href: "#", className: "rpanel-button"}, 
              React.createElement("i", {className: "fa fa-expand"})
            )
          )
        );
        break;
      case "toggleToolbar":
        toolbarState = this.state.tabList[this.state.tabIndex].toolbar;
        switch (toolbarState) {
          case "visible": classes += " active"; break;
          //case "hidden": break;
          case "locked": classes += " active disabled"; break;
          case "none": classes += " disabled"; break;
        }
        classes += hiddenOnFullscreen;
        button = (
          React.createElement("div", {className: classes, key: key, onClick: this.handleClickOnToggleToolbar}, 
            React.createElement("a", {href: "#", className: "rpanel-button"}, 
              React.createElement("i", {className: "fa fa-pencil-square-o"})
            )
          )
        );
        break;
      default:
        throw new Error("Predefined button '" + identifier + "' not found.");
    }

    return button;
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
