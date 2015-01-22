
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

  getInitialState: function () {
    for (var i = 0; i < this.props.children.length; ++i) {
      if (this.props.children[i].props.active || false) {
        return {selected: i};
      }
    }
  },

  handleClick: function (child) {
    this.setState({selected: child.props.key});
  },

  render: function() {
    for (var i = 0; i < this.props.children.length; ++i) {
      this.props.children[i].props.onClick = this.handleClick;
      this.props.children[i].props.key = i;
      this.props.children[i].props.selected = this.state.selected;
    }

    return this.transferPropsTo(
      <ul className="rpanel-tabs">
        {this.props.children}
      </ul>
    );
  }
});

var RPanelTab = React.createClass({

  handleClick: function (event) {
    event.preventDefault();
    this.props.onClick(this);
  },

  render: function() {
    var icon = null,
      title = (<span className="rpanel-title">{this.props.title}</span>),
      classes = (this.props.key == this.props.selected) ? "rpanel-tab active" : "rpanel-tab";

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
