/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

/**
 * A panel component.
 *
 * @class Panel
 * @namespace Panel
 */
var Panel = React.createClass(/** @lends Panel.prototype */{displayName: "Panel",

  /**
   * @exports Panel/props
   * @namespace Panel.props
   */
  defaultProps: {
    "icon": "",
    /**
     * Title of the panel.
     * @memberof! Panel.props#
     * @member title
     */
    "title": "",
    /**
     * Name of the panel (Not shown, you can use it to set/get panels by name).
     * @memberof! Panel.props#
     * @member name
     * @see [getName]{@link Panel#getName}
     * @see [setName]{@link Panel#setName}
     * @see [getPanelByName]{@link Panel.getPanelByName}
     */
    "name": "",
    "theme": "default",
    "bordered": false,
    "opaque": false,
    "raised": false,
    "rounded": false,
    "forceTabs": false,
    "panelState": "default",
    "buttons": [],
    "getTitleFromActiveTab": false,
    "displayTabTitles": true,
    "emptyPanelContent": function () {
      return (React.createElement(PanelContent, {noPadding: true}));
    },
    /**
     * Reports a change in the number of visible tabs before it happens.
     * @memberof! Panel.props#
     * @method onTabCountChange
     *
     * @example
     * var someListener = function (panel, tabCountEvent) {
     *   console.dir(panel);
     *   console.dir(tabCountEvent);
     * };
     *
     * var somePanel = (&lt;Panel ... onTabCountChange={someListener}&gt;...&lt;/Panel&gt;);
     * @default false
     * @param {Panel} self - {@link Panel} Instance.
     * @param {*} value - A [TabCount]{@link Panel#event:TabCount} event.
     * @listens Panel#event:TabCount
     */
    "onTabCountChange": false,
    /**
     * Reports a change in the number of visible tabs after it happened, triggered from <componentDidUpdate>.
     * @memberof! Panel.props#
     * @method onTabCountChanged
     *
     * @example
     * var someListener = function (panel, tabCountEvent) {
     *   console.dir(panel);
     *   console.dir(tabCountEvent);
     * };
     *
     * var somePanel = (&lt;Panel ... onTabCountChanged={someListener}&gt;...&lt;/Panel&gt;);
     * @default false
     * @param {Panel} self - {@link Panel} Instance.
     * @param {*} value - A [TabCount]{@link Panel#event:TabCount} event.
     * @listens Panel#event:TabCount
     */
    "onTabCountChanged": false
  },

  applyPreset: function (preset) {
    var self = this,
      defaultProps = this.defaultProps;

    Object.keys(defaultProps).forEach(function(prop) {
      var value = defaultProps[prop];

      if (typeof self.props[prop] !== "undefined") {
        value = self.props[prop];
      } else if (typeof preset[prop] !== "undefined") {
        value = preset[prop];
      }

      self.props[prop] = value;
    });
    if (typeof self.props.emptyPanelContent === "function") {
      self.props.emptyPanelContent = self.props.emptyPanelContent();
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    var self = this;

    Object.keys(self._eventStack).forEach(function(name) {
      var value = self._eventStack[name];
      value.prevProps = prevProps;
      value.prevState = prevState;
      self._dispatchEvent(name, value, true);
      delete self._eventStack[name];
    });
  },

  _dispatchEvent: function (name, value, final) {
    var listener;

    if (!(final || false)) {
      this._eventStack[name] = value;
      listener = this.props["on" + name + "Change"];
      if (typeof listener === "function") {
        listener(this, value);
      }
    } else {
      listener = this.props["on" + name + "Changed"];
      if (typeof listener === "function") {
        listener(this, value);
      }
    }
  },

  getInitialState: function () {
    var self = this,
      tabList = [],
      defaultTabIndex = 0;

    this.applyPreset(this.props.preset || {});

    self._id = Panel._register(self);
    self._childrenList = [];
    self._eventStack = {};

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
      state: self.props.panelState
    };
  },

  /**
   * Returns the id of this panel.
   * @return {Number}
   */
  getId: function () {
    return this._id;
  },

  /**
   * Returns the name of this panel.
   * @return {string}
   */
  getName: function () {
    return String(this.props.name);
  },

  /**
   * Sets the name of the panel.
   * @param name
   */
  setName: function (name) {
    this.setProps({"name": String(name)});
  },

  /**
   * Closes (in fact, it only hides) the panel.
   */
  close: function () {
    this.setState({state: "closed"});
  },

  restore: function () {
    this.setState({state: "default"});
  },

  collapse: function () {
    this.setState({state: "collapsed"});
  },

  fullscreen: function () {
    this.setState({state: "fullscreen"});
  },

   /**
   * Event reporting a change in the number of visible tabs.
   *
   * @event Panel#event:TabCount
   * @property {number] prev - Previous value.
   * @property {number] next - Next value.
   */

  /**
   * Get proper tab count.
   * @fires Panel#event:TabCount
   * @param [suppliedTabList]
   * @returns {number}
   * @private
   */
  _getTabCount: function (suppliedTabList) {
    var count = 0;

    suppliedTabList = suppliedTabList || this.state.tabList;

    for (var i = 0; i < this._childrenList.length; ++i) {
      if (this._childrenList[i] != null) {
        if (suppliedTabList[i].state == "visible") {
          ++count;
        }
      }
    }
    this._dispatchEvent("TabCount", {"prev": this.state.tabCount, "next": count});

    return count;
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
      keyIndex = 0,
      id = self.getId();

    if (self.props.buttons.length) {
      buttons = [];

      for (var i = self.props.buttons.length; --i >= 0;) {
        var button = self.props.buttons[i],
          buttonIdentifier = "",
          customButtonProps = {},
          control;

        if (typeof button === "string" || ((typeof button === "object") && !React.isValidElement(button))) {
          if (typeof button === "string") {
            buttonIdentifier = button;
          } else {
            buttonIdentifier = Object.keys(button)[0];
            customButtonProps = button[buttonIdentifier];
          }
          var predefinedButton = self._getButton(buttonIdentifier, keyIndex, customButtonProps);
          if (predefinedButton || false) {

            /*"identifier": "toggleToolbar",
             "icon": "fa fa-pencil-square-o",
             "title": "Toggle toolbar of active tab",
             "active": function (button) {
             //return (["visible", "locked"].indexOf(button.props.parent.state.tabList[button.props.parent.state.tabIndex].toolbar) != -1);
             return (["visible", "locked"].indexOf(self._getActivePanelContent().props.toolbarState) != -1);
             },
             "disabled": function (button) {
             //return (["locked", "none"].indexOf(button.props.parent.state.tabList[button.props.parent.state.tabIndex].toolbar) != -1);
             return (["locked", "none"].indexOf(self._getActivePanelContent().props.toolbarState) != -1);
             },
             "hiddenOnFullscreen": true,
             "onClick": this.handleClickOnToggleToolbar*/

            control = (
              React.createElement(PanelControl, {preset: predefinedButton.props.preset, 
                key: keyIndex, 
                _panelId: id
              }, 
                predefinedButton
              )
            );
            buttons.push(control);
            ++keyIndex;
          }
        } else if (React.isValidElement(button)) {
          /*var panelButton = (
           <PanelButton {...button.props} />
           );*/

          control = (
            React.createElement(PanelControl, React.__spread({},  button.props, 
              {key: keyIndex, 
              _panelId: id
            }), 
              button
            )
          );
          buttons.push(control);
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
    this.close();
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
      title = this.props.title;

    try {
      if (this.props.getTitleFromActiveTab) {
        title += this._getActivePanelContent().props.title || "";
      }
    } catch (e) {
      console.trace();
      console.error(e);
    }

    var header = (this.props.draggable || false) ?
      (
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
    var self = this,
      preset = {};

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
            return (button.getPanel().state.state == "collapsed");
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
            return (button.getPanel().state.state == "fullscreen");
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
            return (["visible", "locked"].indexOf(self._getActivePanelContent().props.toolbarState) != -1);
          },
          "disabled": function (button) {
            return (["locked", "none"].indexOf(self._getActivePanelContent().props.toolbarState) != -1);
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

    _state.tabCount = this._getTabCount(_state.tabList);
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
    var newTabIndex = _state.tabIndex;
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
    _state.tabCount = this._getTabCount(_state.tabList);
    _state.tabIndex = newTabIndex;
    this.setState(_state);
  },

  _getValidTabIndex: function (currentTabIndex, skipCurrentTabIndex) {
    var _state = this.state,
      newTabIndex = -1,
      i;

    if ((typeof currentTabIndex === "undefined") || (currentTabIndex == null)) {
      currentTabIndex = _state.tabIndex;
    }

    i = (skipCurrentTabIndex || false) ? currentTabIndex + 1 : currentTabIndex;
    for (; i < _state.tabList.length; ++i) {
      if (_state.tabList[i].state == "visible" && this._childrenList[i] != null) {
        newTabIndex = i;
        break;
      }
    }
    if (newTabIndex == -1) {
      for (i = currentTabIndex; --i >= 0;) {
        if (_state.tabList[i].state == "visible" && this._childrenList[i] != null) {
          newTabIndex = i;
          break;
        }
      }
    }

    return newTabIndex;
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

  _getPanelContentAt: function (index) {
    var id = this._childrenList[index];

    return (id == null) ? false : Panel._getPanelContent(id);
  },

  setActivePanelContent: function (index) {
    this.setState({tabIndex: index || 0});
  },

  getActivePanelContent: function () {
    return this.getPanelContentAt(this.state.tabIndex);
  },

  _getActivePanelContent: function () {
    return (this.state.tabCount) ? this._getPanelContentAt(this.state.tabIndex) : this.props.emptyPanelContent;
  },

  getPanelContentList: function (visible, hidden, removed, activeOnly, childrenOnly) {
    var self = this,
      list = [];

    Object.keys(Panel._panelContentObjectList).forEach(function(id) {
      var index = self._childrenList.indexOf(Number(id));
      if ((childrenOnly || false) && index == -1) return;
      var panelContent = Panel._panelContentObjectList[id];
      if ((activeOnly || false) && !panelContent.isActive()) return;
      if (!(removed || false) && panelContent.isRemoved()) return;
      if (!(hidden || false) && panelContent.isHidden()) return;
      if (!(visible || false) && (!panelContent.isRemoved() && !panelContent.isHidden())) return;

      list.push(panelContent);
    });

    return list;
  },

  _childrenList: [],
  _id: null,
  _eventStack: null,

  statics: {

    _register: function (panel) {
      return (Panel._panelList.push(panel) - 1);
    },

    /**
     * Returns the {@link Panel} with supplied id.
     * @memberof Panel
     * @static
     * @param id
     * @returns {*|boolean}
     */
    getPanel: function (id) {
      return Panel._panelList[id] || false;
    },

    /**
     * Returns the {@link Panel} with specified name if found or false otherwise.
     * @memberof Panel
     * @static
     * @param name
     * @returns {*|boolean}
     */
    getPanelByName: function (name) {
      for (var id = 0; id < Panel._panelList.length; ++id) {
        var panel = Panel.getPanel(id);
        if (panel) {
          if (panel.getName() == String(name)) {
            return panel;
          }
        }
      }

      return false;
    },

    _getPanelContent: function (id) {
      return Panel._panelContentList[id] || false;
    },

    /**
     * Returns the {@link PanelContent} with specified id if found or false otherwise.
     * @memberof Panel
     * @static
     * @param id
     * @returns {*|boolean}
     */
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

    movePanelContent: function (panelContentId, targetPanelId, activeOnTarget, targetIndex) {
      var panelContentObject = Panel.getPanelContent(panelContentId),
        targetPanel = Panel.getPanel(targetPanelId),
        currentPanel = panelContentObject.getPanel(),
        currentIndex = panelContentObject.getIndex();

      if (targetPanelId != currentPanel.getId()) {
        targetIndex = ((typeof targetIndex === "undefined") || (targetIndex == null)) ?
        targetPanel._childrenList.push(panelContentId) - 1 : targetIndex;

        var currentTab = currentPanel.state.tabList[currentIndex],
          targetTab = {
            index: targetIndex,
            toolbar: currentTab.toolbar,
            padding: currentTab.padding,  //DEPRECATED
            state: currentTab.state,
            id: panelContentId
          };
        currentPanel._childrenList[currentIndex] = null;
        panelContentObject.props._panelId = targetPanelId;
        panelContentObject.props._index = targetIndex;

        var targetState = targetPanel.state;
        targetState.tabList[targetIndex] = targetTab;
        targetState.tabCount = targetPanel._getTabCount(targetState.tabList);
        targetState.tabIndex = (activeOnTarget || false) ? targetIndex : targetState.tabIndex;
        targetPanel.setState(targetState);

        currentPanel.setState({
          "tabCount": currentPanel._getTabCount(),
          "tabIndex": currentPanel._getValidTabIndex(null, (currentPanel.state.tabIndex == currentIndex))
        });
      }
    },

    getPanelList: function() {
      var list = [];

      for (var i = 0; i < Panel._panelList.length; ++i) {
        var _panel = {
          "id": i,
          "name": Panel.getPanel(i).getName()
        };
        list.push(_panel);
      }

      return list;
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
        React.createElement("span", {className: "rpanel-title rpanel-no-title"})
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

/**
 * A PanelContent component that can be used within a {@link Panel}.
 * @class PanelContent
 * @namespace PanelContent
 */
var PanelContent = React.createClass(/** @lends PanelContent.prototype */{displayName: "PanelContent",

  getDefaultProps: function () {
    /**
     * @exports PanelContent/props
     * @namespace PanelContent.props
     */
    var defaultProps = {
      "noPadding": false,
      "_panelId": null,
      "_index": null,
      "_id": null,
      /**
       * Tab's title.
       * @memberof! PanelContent.props#
       * @member title
       * @type {string}
       */
      "title": "",
      /**
       * Tab's icon className, like the ones used in bootstrap's glyphicons or font-awesome.
       * @memberof! PanelContent.props#
       * @member icon
       * @type {string}
       * @default false
       */
      "icon": false
    };

    return defaultProps;
  },

  getInitialState: function () {
    Panel._setPanelContentObject(this);
    return {};
  },

  updateProps: function (props) {
    this.setProps(props);
  },

  /**
   * Returns the Panel instance containing this PanelContent.
   * @return {*}
   */
  getPanel: function () {
    if (this.props._panelId != null) {
      return Panel.getPanel(this.props._panelId);
    } else {
      console.error("This PanelContent is not attached to any Panel.");
      return false;
    }
  },

  /**
   * Returns this PanelContent's ID.
   * @return {Number}
   */
  getId: function () {
    return Number(this.props._id);
  },

  getIndex: function () {
    return Number(this.props._index);
  },

  isHidden: function () {
    return (this.props.visibility == "hidden");
  },

  isRemoved: function () {
    return (this.props.visibility == "none");
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
    if (this.isToolbarActive() != shouldBeActive) {
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

  moveTo: function (targetPanelId, activeOnTarget, targetIndex) {
    var id = this.getId();

    targetIndex = ((typeof targetIndex === "undefined") || (targetIndex == null)) ? null : targetIndex;
    Panel.movePanelContent(id, targetPanelId, activeOnTarget || false, targetIndex);
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

/**
 * Main mixin for panel buttons.
 *
 * @exports PanelButtonMixin
 * @namespace PanelButtonMixin
 */
var PanelButtonMixin = {
  getPanel: function () {
    if (this.props._panelId != null) {
      return Panel.getPanel(this.props._panelId);
    } else {
      console.error("Button " + this.props.identifier + " is not attached to any Panel.");
      return false;
    }
  },

  /**
   * Returns true if button is active, false otherwise.
   *
   * @memberof! PanelButtonMixin#
   * @method isActive
   */
  isActive: function () {
    return this.props._active;
  },

  isEnabled: function () {
    return !this.props._disabled;
  },

  isValidEvent: function (event) {
    var nativeEvent = (typeof event.nativeEvent !== "undefined") ? event.nativeEvent : event,
      reactid = this.getDOMNode().dataset.reactid,
      hasOrigin = (typeof nativeEvent.origin !== "undefined"),
      condition = true;

    if (!hasOrigin) {
      nativeEvent.origin = reactid;
    } else {
      condition = (nativeEvent.origin != reactid);
    }

    return condition;
  },

  componentDidMount: function() {
    this.props._parentControl.attach(this);
  }
};

/**
 * Mixin for openable panel buttons.
 *
 * @example
 * var MoveTabButton = React.createClass({
 *   mixins: [PanelButtonMixin, PanelButtonOpenableMixin],
 *   handleClick: function(event) {
 *     var element = event.target,
 *       leftPanelId = Panel.getPanelByName("Left Panel").getId();
 *     while (isNaN(element.dataset.id)) {
 *       element = element.parentElement;
 *     }
 *     Panel.movePanelContent(Number(element.dataset.id), leftPanelId, false);
 *     event.preventDefault();
 *   },
 *   render: function() {
 *     var self = this,
 *       panel = self.getPanel(),
 *       index = -1,
 *       panelContentList = panel.getPanelContentList(true, true, true, false, true),
 *       classes = (this.state.open) ? "dropdown open" : "dropdown";
 *     return (
 *       &lt;div className={classes}&gt;
 *         &lt;a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false"&gt;
 *           &lt;i className="glyphicon glyphicon-move"&gt;&lt;/i&gt;
 *         &lt;/a&gt;
 *         &lt;ul className="dropdown-menu dropdown-menu-right" role="menu"&gt;
 *         {panelContentList.map(function(panelContent) {
 *           var id = String(panelContent.getId()),
 *             title = panelContent.getTitle(),
 *             hidden = panelContent.isHidden(),
 *             removed = panelContent.isRemoved(),
 *             icon = "glyphicon glyphicon-" + ((hidden) ? "minus" : (removed) ? "remove" : "ok");
 *           return (
 *             &lt;li onClick={self.handleClick} data-id={id} key={++index}&gt;
 *               &lt;a href="#"&gt;&lt;i className={icon}&gt;&lt;/i&gt; {title}&lt;/a&gt;
 *             &lt;/li&gt;
 *           );
 *         })}
 *         &lt;/ul&gt;
 *       &lt;/div&gt;
 *     );
 *   }
 * });
 * @exports PanelButtonOpenableMixin
 * @namespace PanelButtonOpenableMixin
 */
var PanelButtonOpenableMixin = {
  _isListeningToOutsideClick: false,

  getInitialState: function() {
    return { "open": false };
  },

  handleClickOnControl: function (event) {
    if (this.isValidEvent(event)) {
      if (!this.state.open) {
        this._isListeningToOutsideClick = true;
        window.addEventListener('click', this.handleClickOnControl);
      } else if (this._isListeningToOutsideClick) {
        this._isListeningToOutsideClick = false;
        window.removeEventListener('click', this.handleClickOnControl);
      }
      this.setState({"open": !this.state.open});
    }
  }
};

/**
 * Wrapper for panel buttons.
 * @class
 * @ignore
 */
var PanelControl = React.createClass(/** @lends PanelControl.prototype */{displayName: "PanelControl",
  _childObject: false,

  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  getInitialState: function() {
    this._childObject = false;
    return {};
  },

  applyPreset: function (preset) {
    var self = this,
      defaultProps = {
        "identifier": "",
        "active": false,
        "disabled": false,
        "hiddenOnFullscreen": false,
        "onClick": function () {},
        "className": ""
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

    self.props._active = (typeof self.props.active === "function") ? self.props.active(self) : self.props.active;
    self.props._disabled = (typeof self.props.disabled === "function") ? self.props.disabled(self) : self.props.disabled;

  },

  getPanel: function () {
    return Panel.getPanel(this.props._panelId);
  },

  attach: function (object) {
    this._childObject = object;
  },

  handleClick: function (event) {
    var handled = false;
    if (this._childObject != false) {
      if (typeof this._childObject.handleClickOnControl === "function") {
        this._childObject.handleClickOnControl(event);
        handled = true;
      }
    }
    if (!handled) {
      if (typeof this.props.onClick === "function") {
        this.props.onClick(event, (this._childObject || this));
      }
    }
  },

  render: function() {
    this.applyPreset(this.props.preset || {});

    var classes = "rpanel-control" +
        ((this.props.className.length) ? " " + this.props.className : "") +
        ((this.props._active) ? " active" : "") +
        ((this.props._disabled) ? " disabled" : "") +
        ((this.props.hiddenOnFullscreen && this.getPanel().state.state == "fullscreen") ? " hidden" : "");

    var childContent = React.Children.only(this.props.children);

    if (React.isValidElement(childContent)) {
      childContent.props._panelId = Number(this.props._panelId);
      childContent.props._active = this.props._active;
      childContent.props._disabled = this.props._disabled;
      childContent.props._parentControl = this;
    }

    return (
      React.createElement("div", {className: classes, onClick: this.handleClick}, 
        this.props.children
      )
    );
  }
});

/**
 * A basic panel button.
 * @class PanelButton
 * @mixes PanelButtonMixin
 */
var PanelButton = React.createClass(/** @lends PanelButton.prototype */{displayName: "PanelButton",
  mixins: [PanelButtonMixin],

  applyPreset: function (preset) {
    var self = this,
      defaultProps = {
        "identifier": "close",
        "icon": "fa fa-times",
        "title": "Close",
        "showContent": false,
        "button": function (self) {
          return (
            React.createElement("a", {href: "#", className: "rpanel-button", title: self.props.title}, 
              React.createElement("i", {className: self.props.icon})
            )
          );
        },
        "onClick": function () {},
        "className": ""
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

  handleClickOnControl: function (event) {
    if (this.isValidEvent(event)) {
      if (typeof this.props.onClick === "function") {
        this.props.onClick(event, this);
      }
    }
  },

  render: function() {
    this.applyPreset(this.props.preset || {});

    var self = this,
      hasContentVisible = false,
      button = this.props.button(this);

    return (
      React.createElement("div", null, 
        button
      )
    );
  }

});
