
var ToggleButton = React.createClass({
  displayName: 'ToggleButton',
  mixins: [Mixins.Button],

  handleClick: function (ev) {
    var self = this;

    this.setState({active: !this.state.active});
    this.forceUpdate(function () {
      if (typeof self.props.onChange === "function") {
        self.props.onChange(this);
      }
    });
  },

  render: function () {
    var sheet = this.getSheet('ToggleButton');

    return (
      <li style={sheet.style} {...this.listeners} title={this.props.title}>
        <span style={sheet.children.style}>
          {this.props.children}
        </span>
      </li>
    );
  }
});
