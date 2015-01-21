
var RPanel = React.createClass({
  render: function() {
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

    return this.transferPropsTo(
      <div className={classes}>
      {this.props.children}
      </div>
    );
  }
});

var RPanelHeader = React.createClass({
  render: function() {
    var icon = null;

    if (this.props.icon) {
      icon = (
        <span className="rpanel-icon">
          <i className={this.props.icon}></i>
        </span>
      );
    }

    return this.transferPropsTo(
      <header>
        {icon}
        <span className="rpanel-title">{this.props.title}</span>
        {this.props.children}
      </header>
    );
  }
});

var RPanelBody = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <div className="rpanel-body">
        {this.props.children}
      </div>
    );
  }
});

var RPanelControl = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <div className="rpanel-control">
        {this.props.children}
      </div>
    );
  }
});

var RPanelToolbar = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <div className="rpanel-toolbar">
        {this.props.children}
      </div>
    );
  }
});

var RPanelContent = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <div className="rpanel-content">
        {this.props.children}
      </div>
    );
  }
});

var RPanelTabs = React.createClass({
  render: function() {
    return this.transferPropsTo(
      <ul className="rpanel-tabs">
        {this.props.children}
      </ul>
    );
  }
});

var RPanelTab = React.createClass({
  render: function() {
    var icon = null,
      title = null,
      classes = (this.props.active) ? "rpanel-tab active" : "rpanel-tab";

    if (this.props.icon) {
      icon = (
        <span className="rpanel-icon">
          <i className={this.props.icon}></i>
        </span>
      );
    }

    title = (<span className="rpanel-title">{this.props.title}</span>);

    return this.transferPropsTo(
      <li className={classes} data-target={this.props.target}>
        <a href="#" title={this.props.title}>{icon} {title}</a>
      </li>
    );
  }
});
