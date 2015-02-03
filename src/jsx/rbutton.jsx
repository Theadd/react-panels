/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

var PanelButton = React.createClass({

  applyPreset: function (preset) {
    var self = this,
      defaultProps = {
        "identifier": "close",
        "icon": "fa fa-times",
        "title": "Close",
        "active": false,
        "disabled": false,
        "hiddenOnFullscreen": false,
        "showContent": false,
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

  getPanel: function () {
    return this.props.parent;
  },

  isContentVisible: function () {
    return this.props.showContent;
  },

  setContentVisible: function (shouldBeVisible) {
    if (this.isContentVisible() != shouldBeVisible) {
      this.toggleContent();
    }
  },

  toggleContent: function () {
    this.props.showContent = !this.props.showContent;
    this.forceUpdate();
  },

  handleClick: function (event) {
    if (typeof this.props.onClick === "function") {
      this.props.onClick(event, this);
    }
  },

  render: function() {
    this.applyPreset(this.props.preset || {});

    var self = this,
      classes = "rpanel-control" +
      ((this.props.active) ? " active" : "") +
      ((this.props.disabled) ? " disabled" : "") +
      ((this.props.hiddenOnFullscreen && this.props.parent.state.state == "fullscreen") ? " hidden" : ""),
      content = ((this.props.showContent && React.Children.count(this.props.children)) ?
        React.Children.map(this.props.children, function(child) {
          child.props._button = self;

          return child;
        }) : null);

    return (
      <div className={classes} key={this.props.tabIndex} onClick={this.handleClick}>
        <a href="#" className="rpanel-button" title={this.props.title}>
          <i className={this.props.icon}></i>
        </a>
      {content}
      </div>
    );
  }

});

var CustomPanelButton = React.createClass({
  render: function() {
    //dummy
  }
});
