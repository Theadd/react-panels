/*
 * react-panels
 * https://github.com/Theadd/rpanel
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

var Panel = React.createClass({

  getInitialState: function () {
    var tabList = [],
      defaultTabIndex = 0;

    for (var i = 0; i < this.props.children.length; ++i) {
      var tab = this.props.children[i],
        hasToolbar = (typeof tab.props.toolbar !== "undefined"),
        toolbarState = tab.props.toolbarState || ((hasToolbar) ? "visible" : "none");

      if (tab.props.active || false) {
        defaultTabIndex = i;
      }
      tabList.push({
        index: i,
        icon: tab.props.icon || false,
        title: tab.props.title || "",
        toolbar: toolbarState
      });
    }

    return {
      tabIndex: defaultTabIndex,
      tabCount: this.props.children.length,
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
    var self = this;

    return (
      <ul className="rpanel-tabs">
        {self.state.tabList.map(function(tab) {
          return <PanelTab
            title={tab.title}
            icon={tab.icon}
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
            display = (index++ == self.state.tabIndex),
            classes = "rpanel-tab-body" + ((display) ? " active" : ""),
            toolbarClasses = "rpanel-toolbar" + ((showToolbar) ? " active" : "");

          return (
            <div className={classes} key={index - 1}>
              <div className={toolbarClasses}>{child.props.toolbar}</div>
              <div className="rpanel-content">{child.props.children}</div>
            </div>
          );
        })}
      </div>
    );
  },

  getButtons: function () {
    var self = this,
      buttons = null;

    if (self.props.buttons) {
      buttons = [];

      for (var i = self.props.buttons.length; --i >= 0;) {
        var button = self.props.buttons[i];

        if (typeof button === "string") {
          var predefinedButton = self.getPredefinedButton(button);
          if (predefinedButton || false) {
            buttons.push(predefinedButton);
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
    //this.dragged = e.currentTarget.parentNode;
    //console.log("dragStart");
    //console.log(JSON.stringify(e, null, '  '));
    //console.dir(e.currentTarget);
    this.panelBounds = {
      startLeft: this.props.left || 80,
      startTop: this.props.top || 100,
      startPageX: e.pageX,
      startPageY: e.pageY
    };

    var self = this;

    self.dragOverListener = function (e) {
      if (self.panelBounds || false) {
        var left = self.panelBounds.startLeft + (e.pageX - self.panelBounds.startPageX),
          top = self.panelBounds.startTop + (e.pageY - self.panelBounds.startPageY);
        self.setProps({ left: left, top: top });
      } else console.log("WTFFFF");

    };
    window.addEventListener('dragover', self.dragOverListener);
    //console.dir(this.panelBounds);
    //e.dataTransfer.effectAllowed = 'move';
    //e.dataTransfer.setData("text/html", e.currentTarget.parentNode);
  },

  dragEnd: function(e) {
    /*this.dragged.style.display = "block";
    console.log("dragEnd");
    console.dir(e);
    console.log("PAGEXY: " + e.pageX + ", " + e.pageY);
    console.dir(this.panelBounds);*/
    delete this.panelBounds;
    window.removeEventListener('dragover', this.dragOverListener);

  },

  dragOver: function(e) {
    //console.log("dragOver");
    //console.dir(e);
    //console.log("dragOver PAGEXY: " + e.pageX + ", " + e.pageY);
    /*if (this.panelBounds || false) {
      var left = this.panelBounds.startLeft + (e.pageX - this.panelBounds.startPageX),
        top = this.panelBounds.startTop + (e.pageY - this.panelBounds.startPageY);
      this.setProps({ left: left, top: top });
    }*/
    console.log("NOOOOOOOOOOOOOOOOO");

    /*e.preventDefault();
    this.dragged.style.display = "none";
    if(e.target.className == "placeholder") return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);*/
  },

  /*window.addEventListener("dragover", function(e) {
    s(e), p && (e.dataTransfer.dropEffect = p, p = null), a && (D() && i() ? e.preventDefault() : y() && (clearTimeout(h), h = setTimeout(o, 140)))
  })*/

  render: function() {
    var classes = this.getClasses(),
      icon = this.getIcon(),
      tabs = this.getTabs(),
      buttons = this.getButtons(),
      header = (this.props.draggable || false) ? (
        <header
          draggable="true"
          onDragEnd={this.dragEnd}
          onDragStart={this.dragStart}>
          {icon}
          <span className="rpanel-title">{this.props.title}</span>
          {buttons}
          {tabs}
        </header>
      ) : (
        <header>
          {icon}
          <span className="rpanel-title">{this.props.title}</span>
          {buttons}
          {tabs}
        </header>
      ),
      body = this.getBody();

    var left = this.props.left || 80,
      top = this.props.top || 100,
      transform = `translate3d(${left}px, ${top}px, 0)`;

    //<div className="rpanel-wrapper" onDragOver={this.dragOver}>
    //      </div>
    return ((this.props.floating || false) && (this.props.draggable)) ? this.transferPropsTo(
      <div className={classes} style={{
        WebkitTransform: transform,
        transform: transform
      }}>
        {header}
        {body}
      </div>
    ) : this.transferPropsTo(
      <div className={classes}>
        {header}
        {body}
      </div>
    );
  },

  getClasses: function () {
    var classes = "rpanel";

    if (this.props.theme) {
      classes += " " + this.props.theme;
    }

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

  getPredefinedButton: function (identifier) {
    var button = null,
      classes = "rpanel-control",
      hiddenOnFullscreen = (this.state.state == "fullscreen") ? " hidden" : "",
      toolbarState = "";

    switch (identifier) {
      case "close":
        button = (
          <div className={classes} onClick={this.handleClickOnClose}>
            <a href="#" className="rpanel-button">
              <i className="fa fa-times"></i>
            </a>
          </div>
        );
        break;
      case "collapse":
        classes += ((this.state.state == "collapsed") ? " active" : "") + hiddenOnFullscreen;
        button = (
          <div className={classes} onClick={this.handleClickOnCollapse}>
            <a href="#" className="rpanel-button">
              <i className="fa fa-minus"></i>
            </a>
          </div>
        );
        break;
      case "fullscreen":
        classes += (this.state.state == "fullscreen") ? " active" : "";
        button = (
          <div className={classes} onClick={this.handleClickOnFullscreen}>
            <a href="#" className="rpanel-button">
              <i className="fa fa-expand"></i>
            </a>
          </div>
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
          <div className={classes} onClick={this.handleClickOnToggleToolbar}>
            <a href="#" className="rpanel-button">
              <i className="fa fa-pencil-square-o"></i>
            </a>
          </div>
        );
        break;
      default:
        throw new Error("Predefined button '" + identifier + "' not found.");
    }

    return button;
  }
});

var PanelTab = React.createClass({

  handleClick: function (event) {
    event.preventDefault();
    this.props.onClick(this);
  },

  render: function() {
    var icon = null,
      title = (<span className="rpanel-title">{this.props.title}</span>),
      classes = (this.props.index == this.props.selected) ? "rpanel-tab active" : "rpanel-tab";

    if (this.props.icon) {
      icon = (
        <span className="rpanel-icon">
          <i className={this.props.icon}></i>
        </span>
      );
    }

    //TODO: transferPropsTo DEPRECATED, use: <Component {...this.props} more="values" />; https://gist.github.com/sebmarkbage/a6e220b7097eb3c79ab7
    return this.transferPropsTo(
      <li className={classes} data-target={this.props.target} onClick={this.handleClick}>
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
