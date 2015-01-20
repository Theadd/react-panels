
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
