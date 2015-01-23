/*
 * rpanel
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
      var tab = this.props.children[i];
      if (tab.props.active || false) {
        defaultTabIndex = i;
      }
      tabList.push({
        index: i,
        icon: tab.props.icon || false,
        title: tab.props.title || ""
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
          var display = (index++ == self.state.tabIndex),
            classes = "rpanel-tab-body" + ((display) ? " active" : "");

          return (
            <div className={classes} key={index - 1}>
              <div className="rpanel-toolbar">{child.props.toolbar}</div>
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

  render: function() {
    var classes = this.getClasses(),
      icon = this.getIcon(),
      tabs = this.getTabs(),
      buttons = this.getButtons(),
      header = (
        <header>
          {icon}
          <span className="rpanel-title">{this.props.title}</span>
          {buttons}
          {tabs}
        </header>
      ),
      body = this.getBody();

    return this.transferPropsTo(
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

    if (this.state.state != "default") {
      classes += " rpanel-state-" + this.state.state;
    }

    return classes;
  },

  getPredefinedButton: function (identifier) {
    var button = null,
      classes = "rpanel-control";

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
        classes += (this.state.state == "collapsed") ? " active" : "";
        button = (
          <div className={classes} onClick={this.handleClickOnCollapse}>
            <a href="#" className="rpanel-button">
              <i className="fa fa-minus"></i>
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
