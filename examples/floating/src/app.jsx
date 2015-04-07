
var MyFloatingPanel = React.createClass({
  displayName: 'MyFloatingPanel',

  getInitialState: function () {
    this.itemsShown = [];
    return {};
  },

  handleClickOnItem: function (itemIndex) {
    this.refs.myPanel.setSelectedIndex(this.itemsShown.push($_data[itemIndex]));
    this.forceUpdate();
  },

  handleClickOnCloseItemTab: function (itemIndex) {
    this.itemsShown.splice(itemIndex - 1, 1);
    this.refs.myPanel.setSelectedIndex(0);
    this.forceUpdate();
  },

  render: function() {
    var self = this;

    return (
      <FloatingPanelWrapper left={200} top={100} width={520} >
        <Panel
          ref="myPanel"
          theme="chemical"
          floating={true}>
          <MyMainTab
            icon="fa fa-cubes"
            title="List of Items"
            pinned={true}
            onClickOnItem={self.handleClickOnItem}
          />
          {self.itemsShown.map(function (item) {
            return (
              <MyItemTab title={item.name} icon="fa fa-cube" item={item}
                onClose={self.handleClickOnCloseItemTab} key={item.id} />
            );
          })}
        </Panel>
      </FloatingPanelWrapper>
    );
  }
});


var App = React.render(
  <div>
    <MyFloatingPanel />
  </div>,
  document.getElementById('root')
);
