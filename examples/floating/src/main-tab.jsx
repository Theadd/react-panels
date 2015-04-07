
var MyMainTab = React.createClass({
  displayName: 'MyMainTab',
  mixins: [TabWrapperMixin],

  handleChangeOnFilter: function (event) {

  },

  handleClick: function (event) {
    var element = event.currentTarget,
      index = parseInt(element.dataset.index);

    if (!isNaN(index)) {
      if (typeof this.props.onClickOnItem === "function") {
        this.props.onClickOnItem(index);
      }
    }
  },

  render: function() {
    var self = this,
      index = -1;

    return (
      <Tab
        icon={this.props.icon}
        title={this.props.title}
      >
        <Toolbar>
          <input type="text"
            ref="filter"
            placeholder="Filter..."
            style={{width: "100%"}}
            onChange={this.handleChangeOnFilter}
          />
        </Toolbar>

        <Content>
          <ul className="items-list">
            {$_data.map(function (item) {
              ++index;
              return (<li key={index} data-index={index} onClick={self.handleClick}><strong>[{item.type}]</strong> {item.name}</li>);
            })}
          </ul>
        </Content>

        <Footer>
          <span style={{textAlign: "left", display: "block"}}>
            <input type="button"
              value="Ok"
              style={{width: "110px", margin: "0 0 0 10px", float: "right"}}
            />
            <input type="button"
              value="Cancel"
              style={{width: "110px", margin: "0 0 0 10px"}}
            />
          </span>
        </Footer>
      </Tab>
    );
  }

});
