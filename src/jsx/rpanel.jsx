/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

var Panel = React.createClass({

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
        <span className="rpanel-icon">
          <i className={this.props.icon}></i>
        </span>
      );
    }

    return icon;
  },

  getTabs: function () {
    var self = this,
      classes = "rpanel-tabs" + (((self.state.tabCount > 1) || (self.props.forceTabs || false)) ? "" : " hidden");

    return (
      <ul className={classes}>
        {self.state.tabList.map(function(tab) {
          return <PanelTab
            title={tab.title}
            icon={tab.icon}
            showTitle={self.props.displayTabTitles}
            index={tab.index}
            key={tab.index}
            selected={self.state.tabIndex}
            onClick={self.handleClickOnTab} />;
        })}
      </ul>
    );
  },

  getBody: function () {
    var self = this,
      index = 0;

    return (
      <div className="rpanel-body">
        {React.Children.map(this.props.children, function (child) {
          var showToolbar = (['visible', 'locked'].indexOf(self.state.tabList[index].toolbar) != -1),
            display = (index == self.state.tabIndex),
            classes = "rpanel-tab-body" + ((display) ? " active" : ""),
            toolbarClasses = "rpanel-toolbar" + ((showToolbar) ? " active" : ""),
            contentClasses = "rpanel-content" + ((!self.state.tabList[index].padding) ? " no-padding" : "");

          ++index;

          return (
            <div className={classes} key={index - 1}>
              <div className={toolbarClasses}>{child.props.toolbar}</div>
              <div className={contentClasses}>{child.props.children}</div>
            </div>
          );
        })}
      </div>
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
            <PanelButton {...button.props}
              key={keyIndex}
              tabIndex={keyIndex}
              parent={this}
            />
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
        <header
          draggable="true"
          onDragEnd={this.dragEnd}
          onDragStart={this.dragStart}>
          {icon}
          <span className="rpanel-title">{title}</span>
          {buttons}
          {tabs}
        </header>
      ) : (
        <header>
          {icon}
          <span className="rpanel-title">{title}</span>
          {buttons}
          {tabs}
        </header>
      ),
      body = this.getBody();

    var left = Number(this.props.left) || 80,
      top = Number(this.props.top) || 100,
      width = String(this.props.width || 800) + "px",
      transform = (this.state.state == "fullscreen") ? "inherit" : "translate3d(" + left + "px, " + top + "px, 0)";

    return ((this.props.floating || false) && (this.props.draggable)) ? (
      <div className={classes} style={{
        WebkitTransform: transform,
        MozTransform: transform,
        msTransform: transform,
        transform: transform,
        width: (this.state.state == "fullscreen") ? "100%" : width
      }}>
        {header}
        {body}
      </div>
    ) : (
      <div className={classes}>
        {header}
        {body}
      </div>
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
      (<PanelButton key={key} tabIndex={key} parent={this} preset={preset} />) : null;
  }
});

var PanelTab = React.createClass({
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
        <span className="rpanel-title">{this.props.title}</span>
      ) : (
        <span className="rpanel-title hidden"></span>
      ),
      classes = (this.props.index == this.props.selected) ? "rpanel-tab active" : "rpanel-tab";

    if (this.props.icon) {
      icon = (
        <span className="rpanel-icon">
          <i className={this.props.icon}></i>
        </span>
      );
    }

    return (
      <li className={classes} onClick={this.handleClick}>
        <a href="#" title={this.props.title}>{icon} {title}</a>
      </li>
    );
  }
});

var PanelContent = React.createClass({
  render: function() {
    //dummy
  }
});
