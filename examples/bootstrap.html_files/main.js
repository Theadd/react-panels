
var MoveTabButton = React.createClass({displayName: "MoveTabButton",
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
      React.createElement("div", {className: classes}, 
        React.createElement("a", {className: "dropdown-toggle", "data-toggle": "dropdown", href: "#", role: "button", "aria-expanded": "false"}, 
          React.createElement("i", {className: "glyphicon glyphicon-move"})
        ), 
        React.createElement("ul", {className: "dropdown-menu dropdown-menu-right", role: "menu"}, 
        panelContentList.map(function(panelContent) {
          var id = String(panelContent.getId()),
            title = panelContent.getTitle(),
            hidden = panelContent.isHidden(),
            removed = panelContent.isRemoved(),
            icon = "glyphicon glyphicon-" + ((hidden) ? "minus" : (removed) ? "remove" : "ok");

          return (
            React.createElement("li", {onClick: self.handleClick, "data-id": id, key: ++index}, 
              React.createElement("a", {href: "#"}, React.createElement("i", {className: icon}), " ", title)
            )
          );
        })
        )
      )
    );
  }

});

var ToggleTabVisibilityButton = React.createClass({displayName: "ToggleTabVisibilityButton",
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
      React.createElement("div", {className: classes}, 
        React.createElement("a", {className: "dropdown-toggle", "data-toggle": "dropdown", href: "#", role: "button", "aria-expanded": "false"}, 
          React.createElement("i", {className: "glyphicon glyphicon-menu-down"})
        ), 
        React.createElement("ul", {className: "dropdown-menu dropdown-menu-right", role: "menu"}, 
        panelContentList.map(function(panelContent) {
          var id = String(panelContent.getId()),
            title = panelContent.getTitle(),
            hidden = panelContent.isHidden(),
            removed = panelContent.isRemoved(),
            icon = "glyphicon glyphicon-" + ((hidden) ? "minus" : (removed) ? "remove" : "ok");

          return (
            React.createElement("li", {onClick: self.handleClick, "data-id": id, key: ++index}, 
              React.createElement("a", {href: "#"}, React.createElement("i", {className: icon}), " ", title)
            )
          );
        })
        )
      )
    );
  }

});


var ChangeTitleToolbar = React.createClass({displayName: "ChangeTitleToolbar",

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
        (React.createElement(MenuItem, {
          key: ++index, 
          "data-id": panel.id, 
          onClick: self.handleClickOnMove
        }, panel.name)) : null;
      });

    return (
      React.createElement("div", {className: "custom-toolbar-example"}, 
        React.createElement("div", {className: "pull-right toolbar-control-not-first"}, 
          React.createElement(DropdownButton, {bsStyle: "primary", title: "Move To", key: "0", pullRight: true}, 
            moveToButtons
          )
        ), 
        React.createElement(Input, {type: "text", 
          ref: "newTitleInput", 
          placeholder: "Change title of this tab", 
          defaultValue: "", 
          buttonAfter: 
            React.createElement(Button, {bsStyle: "default", onClick: this.handleClickOnUpdate}, "Update")
          }
        )
      )
    );
  }

});



var SomeContentComponent = React.createClass({displayName: "SomeContentComponent",

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
      React.createElement("div", null, 
        React.createElement("ul", null, 
          React.createElement("li", null, "Click ", React.createElement("a", {href: "#", onClick: this.handleClick}, "here"), " to display the title in an alert!"), 
          React.createElement("li", null, "Click ", React.createElement("a", {href: "#", onClick: this.handleClick2}, "here"), " to hide current tab instead of removing it!"), 
          React.createElement("li", null, "Click ", React.createElement("a", {href: "#", onClick: this.handleClick3}, "here"), " to restore the first tab on the left side of the current tab. Either it was removed, hidden or it is already visible."), 
          React.createElement("li", null, "Click ", React.createElement("a", {href: "#", onClick: this.handleClick4}, "here"), " to ", toolbarAction, " the toolbar.")
        ), 
        React.createElement("p", null, "Created in: ", React.createElement("strong", null, this.props.createdIn))
      )
    );
  }

});


var leftPanel = (
  React.createElement(Panel, {
    title: "Left Panel", 
    icon: "glyphicon glyphicon-fire", 
    name: "Left Panel", 
    bordered: true, 
    raised: true, 
    rounded: true, 
    forceTabs: true, 
    buttons: [
      React.createElement(ToggleTabVisibilityButton, {identifier: "actionList"}),
      React.createElement(PanelButton, {
        title: "Add Tab!", 
        preset: {
          "identifier": "addTab",
          "icon": "glyphicon glyphicon-plus",
          "onClick": function (event, button) {
            event.preventDefault();
            button.getPanel().addPanelContent(
              React.createElement(PanelContent, {
                icon: "glyphicon glyphicon-leaf", 
                title: "New Tab!", 
                toolbar: (React.createElement(ChangeTitleToolbar, null))
              }, 
                React.createElement(SomeContentComponent, {createdIn: "Left Panel"})
              ),
              true
            );
          }
        }}
      ),
      React.createElement(PanelButton, {
        title: "Remove Active Tab!", 
        preset: {
          "identifier": "removeTab",
          "icon": "glyphicon glyphicon-trash",
          "onClick": function (event, button) {
            event.preventDefault();
            button.getPanel().removePanelContent();
          }
        }}
      )
    ]}, 
    React.createElement(PanelContent, {
      icon: "glyphicon glyphicon-education", 
      title: "Default Tab"
    }, 
      React.createElement("div", null, "Click on the top-right buttons of this panel to add/remove tabs!")
    )
  )
);

var rightPanel = (
  React.createElement(Panel, {
    title: "", 
    icon: "glyphicon glyphicon-compressed", 
    name: "Right Panel", 
    bordered: true, 
    raised: true, 
    rounded: true, 
    forceTabs: true, 
    getTitleFromActiveTab: true, 
    displayTabTitles: false, 
    buttons: [
      React.createElement(MoveTabButton, {identifier: "moveTab"}),
      React.createElement(ToggleTabVisibilityButton, {identifier: "actionList"}),
      React.createElement(PanelButton, {
        title: "Add Tab!", 
        preset: {
          "identifier": "addTab",
          "icon": "glyphicon glyphicon-plus",
          "onClick": function (event, button) {
            event.preventDefault();
            button.getPanel().addPanelContent(
              React.createElement(PanelContent, {
                icon: "glyphicon glyphicon-leaf", 
                title: "New Tab!", 
                toolbar: (React.createElement(ChangeTitleToolbar, null))
              }, 
                React.createElement(SomeContentComponent, {createdIn: "Right Panel"})
              ),
              true
            );
          }
        }}
      )
    ]}, 
    React.createElement(PanelContent, {
      icon: "glyphicon glyphicon-flash", 
      title: "RightPanel"
    }, 
      React.createElement("div", null, "Click on the top-right buttons of this panel to add/remove tabs!")
    )
  )
);

var floatingPanel = (
  React.createElement(Panel, {
    title: "", 
    name: "Floating Panel", 
    bordered: true, 
    raised: true, 
    rounded: true, 
    forceTabs: false, 
    panelState: "closed", 
    getTitleFromActiveTab: true, 
    displayTabTitles: false, 
    buttons: [{"toggleToolbar": {
      "icon": "glyphicon glyphicon-edit"
    }}], 
    floating: true, 
    draggable: true, 
    left: "410", 
    top: "200", 
    width: "450", 
    onTabCountChanged: function (panel, values) {
      if (values.next > 0 && values.prev == 0) {
        panel.restore();
      } else if (values.next == 0) {
        panel.close();
      }
    }}
  )
);

React.render(floatingPanel, document.getElementById('window-example'));


var navbarInstance = (
  React.createElement(Navbar, {className: "navbar-fixed-top"}, 
    React.createElement(Nav, null, 
      React.createElement(NavItem, null, React.createElement("span", {className: "example-title"}, "react-panels (w/ react-bootstrap)"))
    ), 
    React.createElement(Nav, {className: "navbar-right"}, 
      React.createElement(DropdownButton, {title: "Left Panel"}, 
        React.createElement(MenuItem, {eventKey: "1"}, "Close"), 
        React.createElement(MenuItem, {eventKey: "2"}, "Collapse"), 
        React.createElement(MenuItem, {divider: true}), 
        React.createElement(MenuItem, {eventKey: "4"}, "Restore")
      ), 
      React.createElement(DropdownButton, {title: "Right Panel"}, 
        React.createElement(MenuItem, {eventKey: "1"}, "Close"), 
        React.createElement(MenuItem, {eventKey: "2"}, "Collapse"), 
        React.createElement(MenuItem, {divider: true}), 
        React.createElement(MenuItem, {eventKey: "4"}, "Restore")
      )
    )
  )
);

React.render(navbarInstance, document.getElementById('navbar'));

var gridInstance = (
  React.createElement(Grid, null, 
    React.createElement(Row, null, 
      React.createElement(Col, {xs: 12, md: 8}, 
        leftPanel
      ), 
      React.createElement(Col, {xs: 12, md: 4}, 
        rightPanel
      )
    )
  )
);

React.render(gridInstance, document.getElementById('grid-example'));
