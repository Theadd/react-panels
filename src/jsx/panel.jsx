
var Utils = {
  pixelsOf: function (value) {
    var val = parseInt(value) || 0
    return (val) ? String(val) + "px" : "0";
  },
  /* Copyright (c) 2012 Nicholas Fisher (MIT License) https://github.com/KyleAMathews/deepmerge */
  merge: function (target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function(e, i) {
        if (typeof dst[i] === 'undefined') {
          dst[i] = e;
        } else if (typeof e === 'object') {
          dst[i] = Utils.merge(target[i], e);
        } else {
          if (target.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else {
      if (target && typeof target === 'object') {
        Object.keys(target).forEach(function (key) {
          dst[key] = target[key];
        })
      }
      Object.keys(src).forEach(function (key) {
        if (typeof src[key] !== 'object' || !src[key]) {
          dst[key] = src[key];
        }
        else {
          if (!target[key]) {
            dst[key] = src[key];
          } else {
            dst[key] = Utils.merge(target[key], src[key]);
          }
        }
      });
    }

    return dst;
  }
};

var Mixins = {
  Styleable: {
    getInitialState: function () {
      this.__ssv = {};
      this.__ssvh = false;
      this.__ssa = {target: '', mods: [], alter: {}};
      return {};
    },
    contextTypes: {
      sheet: React.PropTypes.func
    },
    getSheet: function (target, mods, alter) {
      var rebuild = false, i;

      mods = mods || []
      alter = alter || {}
      if (target != this.__ssa.target) rebuild = true;
      else {
        if (mods.length != this.__ssa.mods.length) rebuild = true;
        else if (mods.length != 0) {
          for (i = mods.length; --i >= 0;) {
            if (this.__ssa.mods.indexOf(mods[i]) == -1) {
              rebuild = true;
              break;
            }
          }
        }
        // TODO: check if alter has changed
      }

      if (rebuild) {
        this.__ssv = this.context.sheet(target, mods, alter);
        this.__ssvh = false;
        this.__ssa = {
          target: target,
          mods: Utils.merge(mods, []),
          alter: Utils.merge(alter, {})
        };
      }
      if ((typeof this.state._hover === "boolean")) {
        if (this.state._hover) {
          if (this.__ssvh || false) {
            return this.__ssvh;
          }
          if ((this.__ssv.state || false) && (this.__ssv.state.hover || false)) {
            this.__ssvh = Utils.merge(this.__ssv, this.__ssv.state.hover);
            return this.__ssvh;
          }
        }
      }

      return this.__ssv;
    }
  },
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

Mixins.StyleableWithEvents = {
  mixins: [Mixins.Styleable],

    getInitialState: function () {
    this.listeners = {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave
    };
    return {
      _hover: false,
      _focus: false
    };
  },

  handleMouseEnter: function (ev) {
    if (typeof this.props['onMouseEnter'] === "function") this.props['onMouseEnter'](ev);

    this.setState({
      _hover: true
    });
  },

  handleMouseLeave: function (ev) {
    if (typeof this.props['onMouseLeave'] === "function") this.props['onMouseLeave'](ev);

    this.setState({
      _hover: false
    });
  }

};

var FloatingPanel = React.createClass({
  displayName: 'FloatingPanel',

  getDefaultProps: function () {
    return {
      "left": 0,
      "top": 0,
      "width": 420,
      "style": {}
    };
  },

  getInitialState: function () {
    this._pflag = true;

    return {
      left: parseInt(this.props.left),
      top: parseInt(this.props.top),
      width: parseInt(this.props.width)
    };
  },

  getSelectedIndex: function () {
    return this.refs.panel.getSelectedIndex();
  },

  setSelectedIndex: function (index) {
    this.refs.panel.setSelectedIndex(index);
    this._pflag = true;
    this.forceUpdate();
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

    if (self._pflag) {
      var props = React.addons.update(self.props, {$merge: {style: {}}});
      delete props.style;

      self.inner = (
        <Panel {...props} ref="panel" onDragStart={self.dragStart} onDragEnd={self.dragEnd} floating={true}>
          {self.props.children}
        </Panel>
      );
      self._pflag = false;
    }

    return (
      <div className="react-panel-wrapper" style={wrapperStyle}>
        {self.inner}
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
    var opts = {
      theme: this.props.theme,
      skin: this.props.skin,
      headerHeight: this.props.headerHeight,
      headerFontSize: this.props.headerFontSize,
      borderRadius: this.props.borderRadius,
      maxTitleWidth: this.props.maxTitleWidth
    };
    this._sheet = createSheet(opts);
    return {
      selectedIndex: parseInt(this.props.selectedIndex),
      compacted: (this.props.autocompact),
      theme: (typeof this.props.theme === "string") ? this.props.theme : "base"
    };
  },

  childContextTypes: {
    selectedIndex: React.PropTypes.number,
    sheet: React.PropTypes.func
  },

  getChildContext: function () {
    return {
      selectedIndex: this.state.selectedIndex,
      sheet: this._sheet
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
  mixins: [Mixins.StyleableWithEvents],

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
      title = "",
      mods = (this.props.selectedIndex == this.props.index) ? ['active'] : [];

    if (!(this.props.showTitle && this.props.title.length)) mods.push('untitled');
    var sheet = this.getSheet("TabButton", mods, {});

    if (this.props.showTitle && this.props.title.length) {
      title = (<div style={sheet.title.style}>{this.props.title}</div>);
    }

    if (this.props.icon) {
      icon = (
        <div style={sheet.icon.style}>
          <i className={this.props.icon}></i>
        </div>
      );
    }

    return (
      <li onClick={this.handleClick} style={sheet.style} {...this.listeners}>
        <div title={this.props.title}>
          {icon} <div style={sheet.box.style}>{title}</div>
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
