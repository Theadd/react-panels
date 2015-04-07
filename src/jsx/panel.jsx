
var Utils = {
  pixelsOf: function (value) {
    var val = parseInt(value) || 0
    return (val) ? String(val) + "px" : "0";
  }
};

var FloatingPanelWrapper = React.createClass({
  displayName: 'FloatingPanelWrapper',

  getDefaultProps: function () {
    return {
      "left": 0,
      "top": 0,
      "width": 420,
      "style": {}
    };
  },

  getInitialState: function () {
    return {
      left: parseInt(this.props.left),
      top: parseInt(this.props.top),
      width: parseInt(this.props.width)
    };
  },

  dragStart: function (e) {
    this.panelBounds = {
      startLeft: this.state.left,
      startTop: this.state.top,
      startPageX: e.pageX,
      startPageY: e.pageY
    };

    try {
      var img = document.createElement("img");
      img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAADUlEQVQI12NgYGBgAAAABQABXvMqOgAAAABJRU5ErkJggg==";
      img.width = 1;
      e.dataTransfer.setData('text/plain', "Panel");
      e.dataTransfer.setDragImage(img, -1000, -1000);
    } catch (err) { /* Fix for IE */ }

    window.addEventListener('dragover', this.dragOver);
  },

  dragEnd: function() {
    delete this.panelBounds;
    window.removeEventListener('dragover', this.dragOver);
  },

  dragOver: function(e) {
    if (this.panelBounds || false) {
      var left = this.panelBounds.startLeft + (e.pageX - this.panelBounds.startPageX),
        top = this.panelBounds.startTop + (e.pageY - this.panelBounds.startPageY);
      this.setState({ left: left, top: top });
    }
  },

  render: function() {
    var self = this,
      transform = "translate3d(" + Utils.pixelsOf(self.state.left) + ", " + Utils.pixelsOf(self.state.top) + ", 0)",
      wrapperStyle = React.addons.update({
        WebkitTransform: transform,
        MozTransform: transform,
        msTransform: transform,
        transform: transform,
        width: Utils.pixelsOf(self.state.width),
        position: "absolute"
      }, {$merge: self.props.style});

    var child = React.Children.only(this.props.children);

    if (React.isValidElement(child)) {
      // TODO: FIXME
      /*child = React.addons.cloneWithProps(child, {
        floating: true,
        onDragStart: self.dragStart,
        onDragEnd: self.dragEnd,
        ref: child.ref
      });*/
      child.props.floating = true;
      child.props.onDragStart = self.dragStart;
      child.props.onDragEnd = self.dragEnd;

    }

    return (
      <div className="react-panel-wrapper" style={wrapperStyle}>
        {child}
      </div>
    );
  }

});

var Panel = React.createClass({
  displayName: 'Panel',

  getDefaultProps: function () {
    return {
      "icon": false,
      "title": "",
      "selectedIndex": 0,
      "autocompact": true,
      "floating": false,
      "onDragStart": null,
      "onDragEnd": null,
      "maxTitleWidth": 130
    };
  },

  getInitialState: function () {
    return {
      selectedIndex: parseInt(this.props.selectedIndex),
      compacted: (this.props.autocompact)
    };
  },

  getSelectedIndex: function () {
    return this.state.selectedIndex;
  },

  setSelectedIndex: function (index) {
    this.setState({selectedIndex: parseInt(index)});
    this.forceUpdate();
  },

  _getIcon: function () {
    var icon = null;

    if (this.props.icon) {
      icon = (
        <span className="panel-icon">
          <i className={this.props.icon}></i>
        </span>
      );
    }

    return icon;
  },

  handleClick: function (event, index) {
    if (typeof this.props.onTabClick === "function") {
      if (this.props.onTabClick(index, this) !== false) {
        this.setSelectedIndex(index);
      }
    } else {
      this.setSelectedIndex(index);
    }
  },

  componentDidMount: function () {
    var tabsStart = this.refs['tabs-start'].getDOMNode(),
      tabsEnd = this.refs['tabs-end'].getDOMNode(),
      using = this.refs.tabs.getDOMNode().offsetWidth,
      total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth);

    if (using * 2 <= total) {   // TODO: ... * 2 is obviously not what it should be
      this.setState({compacted: false});
    }
  },

  componentWillReceiveProps: function(nextProps) {
    var childs = React.Children.count(this.props.children),
      next_childs = React.Children.count(nextProps.children);

    if (next_childs > childs && this.props.autocompact && !this.state.compacted) {
      var tabsStart = this.refs['tabs-start'].getDOMNode(),
        tabsEnd = this.refs['tabs-end'].getDOMNode(),
        using = this.refs.tabs.getDOMNode().offsetWidth,
        total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth),
        maxTabWidth = this.props.maxTitleWidth + 35;

      if (using + maxTabWidth >= total) {
        this.setState({compacted: true});
      }
    } else {
      // TODO
    }
  },

  handleDragStart: function (e) {
    if (typeof this.props.onDragStart === "function") {
      this.props.onDragStart(e);
    }
  },

  handleDragEnd: function () {
    if (typeof this.props.onDragEnd === "function") {
      this.props.onDragEnd();
    }
  },

  render: function() {
    var self = this,
      classes = "react-panel" + ((typeof this.props.theme === "string") ? " " + this.props.theme : ""),
      icon = this._getIcon(),
      title = (this.props.title.length) ? (
        <div className="panel-title-box" style={{maxWidth: Utils.pixelsOf(this.props.maxTitleWidth)}}><div className="panel-title">{this.props.title}</div></div>
      ) : null,
      draggable = (this.props.floating) ? "true" : "false";

    var tabIndex = 0,
      selectedIndex = this.getSelectedIndex(),
      tabButtons = [],
      tabs = [];

    React.Children.forEach(self.props.children, function(child) {
      var ref = "tabb-" + tabIndex,
        tabRef = "tab-" + tabIndex,
        showTitle = true,
        props = {
          "icon": child.props.icon,
          "title": child.props.title,
          "pinned": child.props.pinned
        };

      if (self.state.compacted) {
        if (!(props.pinned || selectedIndex == tabIndex)) {
          showTitle = false;
        }
      }

      tabButtons.push(
        <TabButton key={tabIndex} title={props.title} icon={props.icon} selectedIndex={selectedIndex}
          index={tabIndex} ref={ref} showTitle={showTitle} maxTitleWidth={self.props.maxTitleWidth} onClick={self.handleClick} />
      );

      tabs.push(
        React.addons.cloneWithProps(child, {
          // key: (typeof child.key !== "undefined") ? child.key : tabIndex,
          key: tabIndex,
          ref: tabRef,  // TODO: Remove if not being used
          selectedIndex: selectedIndex,
          index: tabIndex
        })
      );
      ++tabIndex;
    });

    return (
      <div className={classes}>
        <header draggable={draggable} onDragEnd={self.handleDragEnd} onDragStart={self.handleDragStart} ref="header">
          {icon}
          {title}
          <div className="panel-tabs-start" ref="tabs-start" />
          <ul className="panel-tabs" ref="tabs">
            {tabButtons}
          </ul>
          <div className="panel-tabs-end" ref="tabs-end" />
        </header>
        <div className="panel-body">
          {tabs}
        </div>
      </div>
    );
  }

});


var TabButton = React.createClass({

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "index": 0,
      "selectedIndex": false,
      "showTitle": true,
      "maxTitleWidth": 130
    };
  },

  handleClick: function (event) {
    event.preventDefault();
    this.props.onClick(event, this.props.index);
  },

  render: function() {
    var icon = null,
      titleStyle = {maxWidth: Utils.pixelsOf(this.props.maxTitleWidth)},
      selected = (this.props.selectedIndex == this.props.index),
      title = "",
      tabClasses = "panel-tab";

    if (this.props.showTitle && this.props.title.length) {
      title = (<div className="panel-title">{this.props.title}</div>);
    } else {
      titleStyle = {
        marginLeft: 0
      };
    }
    tabClasses += (selected) ? " active" : "";

    if (this.props.icon) {
      icon = (
        <div className="panel-icon">
          <i className={this.props.icon}></i>
        </div>
      );
    }

    return (
      <li className={tabClasses} onClick={this.handleClick}>
        <div title={this.props.title}>
          {icon} <div className="panel-title-box" style={titleStyle}>{title}</div>
        </div>
      </li>
    );
  }
});


var Tab = React.createClass({

  getDefaultProps: function () {
    return {
      "icon": "",
      "title": "",
      "index": 0,
      "selectedIndex": 0,
      "pinned": false,
      "showToolbar": true,
      "panelComponentType": "Tab"
    };
  },

  getInitialState: function () {
    this._internalValues = {};
    this._wrapped = false;
    return {};
  },

  setInternalValues: function (values) {
    // TODO, FIXME: newly added tabs appear stacked in main tab until we select another tab
    this._wrapped = true;
    this._internalValues = values;
  },

  getSelectedIndex: function () {
    if (this._wrapped) {
      return this._internalValues.selectedIndex;
    } else {
      return this.props.selectedIndex;
    }
  },

  getIndex: function () {
    if (this._wrapped) {
      return this._internalValues.index;
    } else {
      return this.props.index;
    }
  },

  render: function() {
    var self = this,
      numChilds = React.Children.count(this.props.children),
      vIndex = 0,
      tabStyle = {
        display: (this.getSelectedIndex() == this.getIndex()) ? "block" : "none"
      }, toolbarStyle = {
        display: (this.props.showToolbar) ? "block" : "none"
      },
      tabClasses = "panel-tab",
      hasToolbar = false;

    var innerContent = React.Children.map(self.props.children, function(child) {
      var type = (vIndex == 0 && numChilds >= 2) ? 0 : 1;   // 0: Toolbar, 1: Content, 2: Footer
      if (React.isValidElement(child) && (typeof child.props.panelComponentType !== "undefined")) {
        switch (String(child.props.panelComponentType)) {
          case "Toolbar": type = 0; break;
          case "Content": type = 1; break;
          case "Footer": type = 2; break;
        }
      }
      switch (type) {
        case 0:
          hasToolbar = true;
          return (<div className="panel-toolbar" key={vIndex++} style={toolbarStyle}>{child}</div>);
        case 1: return (<div className="panel-content" key={vIndex++}>{child}</div>);
        case 2: return (<div className="panel-footer" key={vIndex++}>{child}</div>);
      }
    });
    tabClasses += (this.props.showToolbar && hasToolbar) ? " with-toolbar" : "";

    return (
      <div className={tabClasses} style={tabStyle}>
        {innerContent}
      </div>
    );
  }

});

var Mixins = {
  Toolbar: {
    getDefaultProps: function () {
      return {
        panelComponentType: "Toolbar"
      };
    }
  },
  Content: {
    getDefaultProps: function () {
      return {
        panelComponentType: "Content"
      };
    }
  },
  Footer: {
    getDefaultProps: function () {
      return {
        panelComponentType: "Footer"
      };
    }
  },
  TabWrapper: {
    getDefaultProps: function () {
      return {
        panelComponentType: "TabWrapper",
        icon: "",
        title: "",
        pinned: false
      };
    },
    getInitialState: function () {
      this._propagated = false;
      return {};
    },
    componentWillReceiveProps: function(nextProps) {
      if (!this._propagated || this.props.index != nextProps.index || this.props.selectedIndex != nextProps.selectedIndex) {
        this._propagated = true;
        this._reactInternalInstance._renderedComponent._instance.setInternalValues({
          selectedIndex: nextProps.selectedIndex,
          index: nextProps.index
        });
        this.forceUpdate();
      }
    }
  }
};

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
