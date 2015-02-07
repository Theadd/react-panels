
var leftPanel = (
  <Panel
    title="Left Panel"
    icon="glyphicon glyphicon-fire"
    name="Left Panel"
    bordered={true}
    raised={true}
    rounded={true}
    forceTabs={true}
    buttons={[
      <ToggleTabVisibilityButton identifier="actionList" />,
      <PanelButton
        title="Add Tab!"
        preset={{
          "identifier": "addTab",
          "icon": "glyphicon glyphicon-plus",
          "onClick": function (event, button) {
            event.preventDefault();
            button.getPanel().addPanelContent(
              <PanelContent
                icon="glyphicon glyphicon-leaf"
                title="New Tab!"
                toolbar={(<ChangeTitleToolbar />)}
              >
                <SomeContentComponent createdIn="Left Panel" />
              </PanelContent>,
              true
            );
          }
        }}
      />,
      <PanelButton
        title="Remove Active Tab!"
        preset={{
          "identifier": "removeTab",
          "icon": "glyphicon glyphicon-trash",
          "onClick": function (event, button) {
            event.preventDefault();
            button.getPanel().removePanelContent();
          }
        }}
      />
    ]}>
    <PanelContent
      icon="glyphicon glyphicon-education"
      title="Default Tab"
    >
      <div>Click on the top-right buttons of this panel to add/remove tabs!</div>
    </PanelContent>
  </Panel>
);

var rightPanel = (
  <Panel
    title=""
    icon="glyphicon glyphicon-compressed"
    name="Right Panel"
    bordered={true}
    raised={true}
    rounded={true}
    forceTabs={true}
    getTitleFromActiveTab={true}
    displayTabTitles={false}
    buttons={[
      <MoveTabButton identifier="moveTab" />,
      <ToggleTabVisibilityButton identifier="actionList" />,
      <PanelButton
        title="Add Tab!"
        preset={{
          "identifier": "addTab",
          "icon": "glyphicon glyphicon-plus",
          "onClick": function (event, button) {
            event.preventDefault();
            button.getPanel().addPanelContent(
              <PanelContent
                icon="glyphicon glyphicon-leaf"
                title="New Tab!"
                toolbar={(<ChangeTitleToolbar />)}
              >
                <SomeContentComponent createdIn="Right Panel" />
              </PanelContent>,
              true
            );
          }
        }}
      />
    ]}>
    <PanelContent
      icon="glyphicon glyphicon-flash"
      title="RightPanel"
    >
      <div>Click on the top-right buttons of this panel to add/remove tabs!</div>
    </PanelContent>
  </Panel>
);

var floatingPanel = (
  <Panel
    title=""
    name="Floating Panel"
    bordered={true}
    raised={true}
    rounded={true}
    forceTabs={false}
    panelState="closed"
    getTitleFromActiveTab={true}
    displayTabTitles={false}
    buttons={[{"toggleToolbar": {
      "icon": "glyphicon glyphicon-edit"
    }}]}
    floating={true}
    draggable={true}
    left="410"
    top="200"
    width="450"
    onTabCountChanged={function (panel, values) {
      if (values.next > 0 && values.prev == 0) {
        panel.restore();
      } else if (values.next == 0) {
        panel.close();
      }
    }}
  />
);

React.render(floatingPanel, document.getElementById('window-example'));
