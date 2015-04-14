
var Toolbar = React.createClass({
  displayName: 'Toolbar',
  mixins: [Mixins.Toolbar],

  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

});

var Content = React.createClass({
  displayName: 'Content',
  mixins: [Mixins.Content],

  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

});

var Footer = React.createClass({
  displayName: 'Footer',
  mixins: [Mixins.Footer],

  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

});

var PanelAddons = {};
