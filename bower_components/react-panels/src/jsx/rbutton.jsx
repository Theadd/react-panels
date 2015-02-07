/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
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

var PanelControl = React.createClass({
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
      <div className={classes} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
});


var PanelButton = React.createClass({
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
            <a href="#" className="rpanel-button" title={self.props.title}>
              <i className={self.props.icon}></i>
            </a>
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
      <div>
        {button}
      </div>
    );
  }

});
