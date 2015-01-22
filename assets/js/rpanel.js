
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

    return {tabIndex: defaultTabIndex, tabCount: this.props.children.length, tabList: tabList};
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

  handleClickOnTab: function (child) {
    this.setState({tabIndex: child.props.index});
  },

  render: function() {
    var classes = this.getClasses(),
      icon = this.getIcon(),
      tabs = this.getTabs(),
      header = (
        <header>
          {icon}
          <span className="rpanel-title">{this.props.title}</span>
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

    return classes;
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
