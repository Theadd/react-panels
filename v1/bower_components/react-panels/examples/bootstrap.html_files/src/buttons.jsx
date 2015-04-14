
var MoveTabButton = React.createClass({
  mixins: [PanelButtonMixin, PanelButtonOpenableMixin],

  handleClick: function(event) {
    var element = event.target,
      leftPanelId = Panel.getPanelByName("Left Panel").getId();

    while (isNaN(element.dataset.id)) {
      element = element.parentElement;
    }

    Panel.movePanelContent(Number(element.dataset.id), leftPanelId, false);
    event.preventDefault();
  },

  render: function() {
    var self = this,
      panel = self.getPanel(),
      index = -1,
      panelContentList = panel.getPanelContentList(true, true, true, false, true),
      classes = (this.state.open) ? "dropdown open" : "dropdown";

    return (
      <div className={classes}>
        <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
          <i className="glyphicon glyphicon-move"></i>
        </a>
        <ul className="dropdown-menu dropdown-menu-right" role="menu">
        {panelContentList.map(function(panelContent) {
          var id = String(panelContent.getId()),
            title = panelContent.getTitle(),
            hidden = panelContent.isHidden(),
            removed = panelContent.isRemoved(),
            icon = "glyphicon glyphicon-" + ((hidden) ? "minus" : (removed) ? "remove" : "ok");

          return (
            <li onClick={self.handleClick} data-id={id} key={++index}>
              <a href="#"><i className={icon}></i> {title}</a>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }

});

var ToggleTabVisibilityButton = React.createClass({
  mixins: [PanelButtonMixin, PanelButtonOpenableMixin],

  handleClick: function(event) {
    var element = event.target;

    while (isNaN(element.dataset.id)) {
      element = element.parentElement;
    }

    var panelContent = Panel.getPanelContent(Number(element.dataset.id));

    if (panelContent) {
      if (panelContent.isHidden() || panelContent.isRemoved()) {
        panelContent.restore();
      } else {
        panelContent.hide();
      }
    }
    event.preventDefault();
  },

  render: function() {
    var self = this,
      panel = self.getPanel(),
      index = -1,
      panelContentList = panel.getPanelContentList(true, true, true, false, true),
      classes = (this.state.open) ? "dropdown open" : "dropdown";

    return (
      <div className={classes}>
        <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
          <i className="glyphicon glyphicon-menu-down"></i>
        </a>
        <ul className="dropdown-menu dropdown-menu-right" role="menu">
        {panelContentList.map(function(panelContent) {
          var id = String(panelContent.getId()),
            title = panelContent.getTitle(),
            hidden = panelContent.isHidden(),
            removed = panelContent.isRemoved(),
            icon = "glyphicon glyphicon-" + ((hidden) ? "minus" : (removed) ? "remove" : "ok");

          return (
            <li onClick={self.handleClick} data-id={id} key={++index}>
              <a href="#"><i className={icon}></i> {title}</a>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }

});
