
var ChangeTitleToolbar = React.createClass({

  handleClickOnUpdate: function(event) {
    var title = this.refs.newTitleInput.getValue();
    this.getPanelContent().setTitle(title);
    event.preventDefault();
  },

  handleClickOnMove: function(event) {
    var element = event.target;
    while (isNaN(element.dataset.id)) {
      element = element.parentElement;
    }
    this.getPanelContent().moveTo(Number(element.dataset.id), true);
    event.preventDefault();
  },

  getPanelContent: function () {
    return Panel.getPanelContent(this.props._panelContentId);
  },

  render: function() {
    var self = this,
      panelList = Panel.getPanelList(),
      index = -1,
      currentPanelId = this.getPanelContent().getPanel().getId(),
      moveToButtons = panelList.map(function(panel) {
        return (panel.id != currentPanelId) ?
        (<MenuItem
          key={++index}
          data-id={panel.id}
          onClick={self.handleClickOnMove}
        >{panel.name}</MenuItem>) : null;
      });

    return (
      <div className="custom-toolbar-example">
        <div className="pull-right toolbar-control-not-first">
          <DropdownButton bsStyle="primary" title="Move To" key="0" pullRight>
            {moveToButtons}
          </DropdownButton>
        </div>
        <Input type="text"
          ref="newTitleInput"
          placeholder="Change title of this tab"
          defaultValue=""
          buttonAfter={
            <Button bsStyle="default" onClick={this.handleClickOnUpdate}>Update</Button>
          }
        />
      </div>
    );
  }

});
