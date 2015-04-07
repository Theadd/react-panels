
var MyItemTab = React.createClass({
  displayName: 'MyItemTab',
  mixins: [TabWrapperMixin],

  render: function() {
    var strItem = JSON.stringify(this.props.item, null, '  ');

    return (
      <Tab
        icon={this.props.icon}
        title={this.props.title}
      >
        <Content>
          <p><strong>Item value:</strong></p>
          <pre>{strItem}</pre>
        </Content>

        <Footer>
          <span style={{textAlign: "left", display: "block"}}>
            <input type="button" value="A Button" />
          </span>
        </Footer>
      </Tab>
    );
  }

});
