

var SomeContentComponent = React.createClass({

  handleClick: function(event) {
    event.preventDefault();
    alert("Title of active tab: " + this.getPanelContent().getTitle());
  },

  handleClick2: function(event) {
    event.preventDefault();
    this.getPanelContent().hide();
  },

  handleClick3: function(event) {
    var panelContent = this.getPanelContent(),
      leftIndex = (panelContent.getIndex() || 1) - 1,
      leftPanelContent = panelContent.getPanel().getPanelContentAt(leftIndex);

    event.preventDefault();
    if (leftPanelContent) {
      leftPanelContent.restore(false);
    }
  },

  handleClick4: function(event) {
    event.preventDefault();
    this.getPanelContent().toggleToolbar();
  },

  getPanelContent: function () {
    return Panel.getPanelContent(this.props._panelContentId);
  },

  render: function() {
    var toolbarAction = (this.getPanelContent().isToolbarActive()) ? "hide" : "show";

    return (
      <div>
        <ul>
          <li>Click <a href="#" onClick={this.handleClick}>here</a> to display the title in an alert!</li>
          <li>Click <a href="#" onClick={this.handleClick2}>here</a> to hide current tab instead of removing it!</li>
          <li>Click <a href="#" onClick={this.handleClick3}>here</a> to restore the first tab on the left side of the current tab. Either it was removed, hidden or it is already visible.</li>
          <li>Click <a href="#" onClick={this.handleClick4}>here</a> to {toolbarAction} the toolbar.</li>
        </ul>
        <p>Created in: <strong>{this.props.createdIn}</strong></p>
      </div>
    );
  }

});
