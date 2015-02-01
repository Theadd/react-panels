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
    var self = this,
      tabList = [],
      defaultTabIndex = 0;

    this.applyPreset(this.props.preset || {});

    self._id = Panel._register(self);

    React.Children.forEach(this.props.children, function(tab) {
      var _tab = self._registerPanelContent(tab);

      if (tab.props.active || false) {
        defaultTabIndex = _tab.index;
      }
      tabList[_tab.index] = _tab;
    });

    return {
      tabIndex: defaultTabIndex,
      tabCount: self._childrenList.length,
      tabList: tabList,
      state: "default"
    };
  },

  _getIcon: function () {
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

  _getTabs: function () {
    var self = this,
      index = -1,
      classes = "rpanel-tabs" + (((self.state.tabCount > 1) || (self.props.forceTabs || false)) ? "" : " hidden");

    return (
      React.createElement("ul", {className: classes}, 
        self._childrenList.map(function(id) {
          ++index;
          if (id == null) return null;

          var child = Panel._getPanelContent(id),
            tab = self.state.tabList[index],
            title = child.props.title || "",
            icon = child.props.icon || false;

          return (tab.state != "none") ? (
            React.createElement(PanelTab, {
              title: title, 
              icon: icon, 
              showTitle: self.props.displayTabTitles, 
              index: index, 
              key: index, 
              selected: self.state.tabIndex, 
              state: tab.state, 
              _id: tab.id, 
              onClick: self.handleClickOnTab}
            )) : null;
        })
      )
    );
  },

  _getBody: function () {
    var self = this,
      index = -1;

    return (
      React.createElement("div", {className: "rpanel-body"}, 

        self._childrenList.map(function(id) {
          ++index;
          if (id == null) return null;

          var child = Panel._getPanelContent(id),
            showToolbar = (['visible', 'locked'].indexOf(self.state.tabList[index].toolbar) != -1),
            display = (index == self.state.tabIndex),
            visibility = self.state.tabList[index].state;

          Panel._setPanelContent(
            React.createElement(PanelContent, React.__spread({},  child.props, 
              {key: index, 
              _index: index, 
              showToolbar: showToolbar, 
              display: display, 
              visibility: visibility})
            )
          );

          return Panel._getPanelContent(id);
        })
      )
    );
  },

  _getButtons: function () {
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
          var predefinedButton = self._getButton(buttonIdentifier, keyIndex, customButtonProps);
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
    this.setActivePanelContent(child.props.index);
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
    var panelContent = this.getActivePanelContent();

    event.preventDefault();
    if (panelContent) {
      panelContent.toggleToolbar();
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
    var classes = this._getClasses(),
      icon = this._getIcon(),
      body = this._getBody(),
      tabs = this._getTabs(),
      buttons = this._getButtons(),
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
      );

    /*if (this._needsForceUpdate) {
      this._needsForceUpdate = false;
      this.forceUpdate();
      //TODO: forceUpdate active PanelContent
    }*/

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

  _getClasses: function () {
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

  _getButton: function (identifier, key, customProps) {
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

  _registerPanelContent: function (panelContent) {
    var hasToolbar = (typeof panelContent.props.toolbar !== "undefined"),
      toolbarState = panelContent.props.toolbarState || ((hasToolbar) ? "visible" : "none");

    panelContent.props._panelId = this._id;

    var id = Panel._setPanelContent(panelContent),
      index = this._childrenList.push(id) - 1;

    return {
      index: index,
      toolbar: toolbarState,
      padding: Boolean(!(panelContent.props.noPadding || false)), //TODO: deprecated
      state: "visible",
      id: id
    };
  },

  addPanelContent: function (panelContent, selected) {
    var _state = this.state,
      _tab = this._registerPanelContent(panelContent);

    _state.tabList[_tab.index] = _tab;

    _state.tabCount = this._childrenList.length;
    if (selected || false) {
      _state.tabIndex = _tab.index;
    }

    this.setState(_state);
  },

  removePanelContent: function (index, hideOnly) {
    var _state = this.state,
      switchToOtherTab,
      newTabState = (hideOnly || false) ? "hidden" : "none",
      i = 0;

    if (typeof index === "undefined" || index == null) {
      index = _state.tabIndex;
    }
    switchToOtherTab = (index == _state.tabIndex);
    _state.tabList[index].state = newTabState;
    var newTabIndex = index;
    if (switchToOtherTab) {
      for (i = index + 1; i < _state.tabList.length; ++i) {
        if (_state.tabList[i].state == "visible") {
          newTabIndex = i;
          break;
        }
      }
      if (newTabIndex == index) {
        for (i = index; --i >= 0;) {
          if (_state.tabList[i].state == "visible") {
            newTabIndex = i;
            break;
          }
        }
      }
    }
    _state.tabIndex = newTabIndex;
    this.setState(_state);
  },

  restorePanelContent: function (index, selected) {
    var _state = this.state,
      newTabState = "visible";

    _state.tabList[index].state = newTabState;

    if (selected || (_state.tabList[_state.tabIndex].state != newTabState)) {
      _state.tabIndex = index;
    }
    this.setState(_state);
  },

  getPanelContentAt: function (index) {
    var id = this._childrenList[index];

    return (id == null) ? false : Panel.getPanelContent(id);
  },

  setActivePanelContent: function (index) {
    this.setState({tabIndex: index || 0});
  },

  getActivePanelContent: function () {
    return this.getPanelContentAt(this.state.tabIndex);
  },

  _childrenList: [],
  _id: null,

  statics: {

    _register: function (panel) {
      return (Panel._panelList.push(panel) - 1);
    },

    getPanel: function (id) {
      return Panel._panelList[id] || false;
    },

    _getPanelContent: function (id) {
      return Panel._panelContentList[id] || false;
    },

    getPanelContent: function (id) {
      return Panel._panelContentObjectList[id] || false;
    },

    _setPanelContent: function (panelContent) {
      var id = null;

      if (panelContent.props._id != null) {
        id = Number(panelContent.props._id);
        Panel._panelContentList[id] = (panelContent);
      } else {
        id = Panel._panelContentList.length;
        Panel._panelContentList[id] = (
          React.createElement(PanelContent, React.__spread({},  panelContent.props, 
            {_id: id})
          )
        );
      }

      return id;
    },

    _setPanelContentObject: function (panelContentObject) {
      var id = Number(panelContentObject.getId());

      Panel._panelContentObjectList[id] = panelContentObject;

      return id;
    },

    _panelContentList: [],
    _panelContentObjectList: [],
    _panelList: []
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

    classes += " " + this.props.state;

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

/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

var PanelContent = React.createClass({displayName: "PanelContent",

  getDefaultProps: function () {
    return {
      "noPadding": false,
      "_panel": {},
      "_panelId": null,
      "_index": null,
      "_id": null,
      "title": "",
      "icon": false
    };

  },

  getInitialState: function () {
    Panel._setPanelContentObject(this);
    return {};
  },

  updateProps: function (props) {
    this.setProps(props);
  },

  getPanel: function () {
    if (this.props._panelId != null) {
      return Panel.getPanel(this.props._panelId);
    } else {
      console.error("This PanelContent is not attached to any Panel.");
      return false;
    }
  },

  getId: function () {
    return this.props._id;
  },

  getIndex: function () {
    return this.props._index;
  },

  isHidden: function () {
    return (this.props.visibility == "hidden");
  },

  isRemoved: function () {
    return (this.props.visibility == "removed");
  },

  isActive: function () {
    return this.props.display;
  },

  setActive: function () {
    this.getPanel().setActivePanelContent(this.getIndex());
  },

  hide: function () {
    this.getPanel().removePanelContent(this.getIndex(), true);
  },

  remove: function () {
    this.getPanel().removePanelContent(this.getIndex(), false);
  },

  restore: function (shouldBeActive) {
    this.getPanel().restorePanelContent(this.getIndex(), shouldBeActive || false);
  },

  isToolbarActive: function () {
    return this.props.showToolbar;
  },

  setToolbarActive: function (shouldBeActive) {
    if (this.isToolbarActive != shouldBeActive) {
      this.toggleToolbar();
    }
  },

  toggleToolbar: function () {
    var panel = this.getPanel(),
      index = this.getIndex(),
      toolbarState = panel.state.tabList[index].toolbar,
      tabList = panel.state.tabList;

    if (toolbarState == "visible") {
      tabList[index].toolbar = "hidden";
      panel.setState({tabList: tabList});
    } else if (toolbarState == "hidden") {
      tabList[index].toolbar = "visible";
      panel.setState({tabList: tabList});
    }
  },

  getTitle: function () {
    return this.props.title;
  },

  setTitle: function (newTitle) {
    this.props.title = newTitle || "";
    this.getPanel().forceUpdate();
  },

  getIcon: function () {
    return this.props.icon;
  },

  setIcon: function (newIcon) {
    this.props.icon = newIcon || false;
    this.getPanel().forceUpdate();
  },

  render: function() {
    var classes = "rpanel-tab-body" + ((this.isActive() && !this.isHidden()) ? " active" : ""),
      toolbarClasses = "rpanel-toolbar" + ((this.isToolbarActive()) ? " active" : ""),
      contentClasses = "rpanel-content" + ((this.props.noPadding) ? " no-padding" : "");

    var id = this.getId(),
      childContent = React.Children.only(this.props.children);

    if (React.isValidElement(this.props.toolbar)) {
      this.props.toolbar.props._panelContentId = id;
    }
    if (React.isValidElement(childContent)) {
      childContent.props._panelContentId = id;
    }

    return (!this.isRemoved()) ? (
      React.createElement("div", {className: classes}, 
        React.createElement("div", {className: toolbarClasses}, this.props.toolbar), 
        React.createElement("div", {className: contentClasses}, childContent)
      )
    ) : null;
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
