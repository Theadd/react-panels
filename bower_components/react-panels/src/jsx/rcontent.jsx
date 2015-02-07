/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

var PanelContent = React.createClass({

  getDefaultProps: function () {
    return {
      "noPadding": false,
      "_panel": {}, //DEPRECATED
      "_panelId": null,
      "_index": null,
      "_id": null,
      "title": "",
      "icon": false
    };

  },

  getInitialState: function () {
    Panel._setPanelContentObject(this);
    return {};
  },

  updateProps: function (props) {
    this.setProps(props);
  },

  getPanel: function () {
    if (this.props._panelId != null) {
      return Panel.getPanel(this.props._panelId);
    } else {
      console.error("This PanelContent is not attached to any Panel.");
      return false;
    }
  },

  getId: function () {
    return Number(this.props._id);
  },

  getIndex: function () {
    return Number(this.props._index);
  },

  isHidden: function () {
    return (this.props.visibility == "hidden");
  },

  isRemoved: function () {
    return (this.props.visibility == "none");
  },

  isActive: function () {
    return this.props.display;
  },

  setActive: function () {
    this.getPanel().setActivePanelContent(this.getIndex());
  },

  hide: function () {
    this.getPanel().removePanelContent(this.getIndex(), true);
  },

  remove: function () {
    this.getPanel().removePanelContent(this.getIndex(), false);
  },

  restore: function (shouldBeActive) {
    this.getPanel().restorePanelContent(this.getIndex(), shouldBeActive || false);
  },

  isToolbarActive: function () {
    return this.props.showToolbar;
  },

  setToolbarActive: function (shouldBeActive) {
    if (this.isToolbarActive() != shouldBeActive) {
      this.toggleToolbar();
    }
  },

  toggleToolbar: function () {
    var panel = this.getPanel(),
      index = this.getIndex(),
      toolbarState = panel.state.tabList[index].toolbar,
      tabList = panel.state.tabList;

    if (toolbarState == "visible") {
      tabList[index].toolbar = "hidden";
      panel.setState({tabList: tabList});
    } else if (toolbarState == "hidden") {
      tabList[index].toolbar = "visible";
      panel.setState({tabList: tabList});
    }
  },

  getTitle: function () {
    return this.props.title;
  },

  setTitle: function (newTitle) {
    this.props.title = newTitle || "";
    this.getPanel().forceUpdate();
  },

  getIcon: function () {
    return this.props.icon;
  },

  setIcon: function (newIcon) {
    this.props.icon = newIcon || false;
    this.getPanel().forceUpdate();
  },

  moveTo: function (targetPanelId, activeOnTarget, targetIndex) {
    var id = this.getId();

    targetIndex = ((typeof targetIndex === "undefined") || (targetIndex == null)) ? null : targetIndex;
    Panel.movePanelContent(id, targetPanelId, activeOnTarget || false, targetIndex);
  },

  render: function() {
    var classes = "rpanel-tab-body" + ((this.isActive() && !this.isHidden()) ? " active" : ""),
      toolbarClasses = "rpanel-toolbar" + ((this.isToolbarActive()) ? " active" : ""),
      contentClasses = "rpanel-content" + ((this.props.noPadding) ? " no-padding" : "");

    var id = this.getId(),
      childContent = React.Children.only(this.props.children);

    if (React.isValidElement(this.props.toolbar)) {
      this.props.toolbar.props._panelContentId = id;
    }
    if (React.isValidElement(childContent)) {
      childContent.props._panelContentId = id;
    }

    return (!this.isRemoved()) ? (
      <div className={classes}>
        <div className={toolbarClasses}>{this.props.toolbar}</div>
        <div className={contentClasses}>{childContent}</div>
      </div>
    ) : null;
  }
});
