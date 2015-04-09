/*
 * react-panels
 * https://github.com/Theadd/react-panels
 *
 * Copyright (c) 2015 R.Beltran https://github.com/Theadd
 * Licensed under the MIT license.
 */

(function() {



var chemicalStyle = function (opts, skin) {
  var colors;
  skin = skin || opts.skin;

  switch (skin) {
    default:
      colors = {
        tabColor: "#ffffff",
        activeTabColor: "rgba(0, 0, 0, 0.9)",
        tabTextShadow: "#bbbbbb",
        activeTabTextShadow: "#999999",
        activeTabBackgroundColor: "rgba(255, 255, 255, 0.9)",
        activeTabBorderColor: "rgba(0, 0, 0, 0.5)",
        titleTextShadow: "#a6a6a6",
        iconTextShadow: "rgba(0, 0, 0, 0.9)",
        iconColor: "#ffffff"
      }
      break;
  }

  return {
    header: {
      icon: {
        style: {
          color: colors.iconColor,
          textShadow: "2px 2px 2px " + colors.iconTextShadow,
          float: "left"
        }
      },
      box: {
        style: {

        }
      },
      title: {
        style: {
          textShadow: "1px 1px 1px " + colors.titleTextShadow,
          float: "left"
        }
      }
    },
    TabButton: {
      style: {
        borderRadius: "2px 2px 0 0",
        marginLeft: 1
      },
      state: {
        hover: {
          style: {
            backgroundColor: "rgba(224, 230, 240, 0.65)"
          },
          icon: {
            style: {
              color: "rgba(0, 0, 0, 0.9)",
              textShadow: "1px 1px 1px #999999"
            }
          },
          title: {
            style: {
              color: "rgba(0, 0, 0, 0.9)",
              textShadow: "1px 1px 1px #999999"
            }
          }
        }
      },
      mods: {
        active: {
          style: {
            borderColor: colors.activeTabBorderColor,
            backgroundColor: colors.activeTabBackgroundColor
          },
          state: {
            hover: {
              style: {
                backgroundColor: colors.activeTabBackgroundColor
              },
              icon: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.activeTabTextShadow
                }
              },
              title: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.activeTabTextShadow
                }
              }
            }
          },
          icon: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.activeTabTextShadow
            }
          },
          title: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.activeTabTextShadow
            }
          }
        }
      },
      icon: {
        style: {
          color: colors.tabColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow
        }
      },
      title: {
        style: {
          color: colors.tabColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow
        }
      }
    }
  };
}


var buildStyle = function (opts) {
  opts = opts || {};
  opts = {
    theme: opts.theme || "base",
    skin: opts.skin || "default",
    headerHeight: opts.headerHeight || 32,
    headerFontSize: opts.headerFontSize || 14,
    borderRadius: opts.borderRadius || 3,
    maxTitleWidth: opts.maxTitleWidth || 130
  };

  var styles = {
    base: {
      header: {
        icon: {
          style: {
            display: "block",
            float: "left",
            fontSize: "125%",
            height: opts.headerHeight,
            lineHeight: Utils.pixelsOf(opts.headerHeight - 4),
            marginRight: -6,
            textAlign: "center",
            width: opts.headerHeight - 2
          }
        },
        box: {
          style: {
            marginLeft: 10,
            height: "100%",
            display: "inline-block",
            position: "relative",
            maxWidth: Utils.pixelsOf(opts.maxTitleWidth)
          }
        },
        title: {
          style: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: 0,
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            width: "auto"
          }
        }
      },
      TabButton: {
        style: {
          position: "relative",
          float: "left",
          display: "block",
          listStyle: "none",
          padding: "0 5px",
          height: opts.headerHeight,
          fontSize: "0.95em"
        },
        mods: {
          untitled: {
            box: {
              style: {
                marginLeft: 0
              }
            }
          }
        },
        icon: {
          style: {
            display: "block",
            float: "left",
            fontSize: "125%",
            height: opts.headerHeight,
            textAlign: "center",
            width: opts.headerHeight - 2,
            lineHeight: Utils.pixelsOf(opts.headerHeight - 2),
            marginRight: -9,
            marginLeft: -3,
            opacity: 0.85
          }
        },
        box: {
          style: {
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            marginRight: 6,
            opacity: 0.85,
            marginLeft: 10,
            height: "100%",
            display: "inline-block",
            position: "relative",
            maxWidth: Utils.pixelsOf(opts.maxTitleWidth)
          }
        },
        title: {
          style: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: 0,
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            width: "auto"
          }
        }
      }
    },
    /* THEME: Chemical */
    chemical: chemicalStyle
  };

  var theme = (opts.theme != "base") ? styles[opts.theme](opts) : {};

  return Utils.merge(styles.base, theme);
};

var createSheet = (function (opts) {
  var _sheet = buildStyle(opts),
    _skin = {};

  return function (target, mods, alter) {
    var using = _sheet;

    mods = mods || [];
    alter = alter || {}
    if (alter.skin || false) {
      if (!(_skin[alter.skin] || false)) {
        _skin[alter.skin] = buildStyle(React.addons.update(opts, {$merge: {skin: alter.skin}}));
      }
      using = _skin[alter.skin];
    }
    if (!mods.length) return using[target];
    var sheet = React.addons.update(using[target], {$merge: {}}),
      i;
    for (i = 0; i < mods.length; ++i) {
      if (sheet.mods[mods[i]] || false) {
        sheet = Utils.merge(sheet, sheet.mods[mods[i]]);
      }
    }
    return sheet;
  }
});

/*var alter = {
  skin: 'light',
  merge: {  //TODO
    style: {
      fontWeight: 'bold'
    }
  }
};*/


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
        React.createElement(Panel, React.__spread({},  props, {ref: "panel", onDragStart: self.dragStart, onDragEnd: self.dragEnd, floating: true}), 
          self.props.children
        )
      );
      self._pflag = false;
    }

    return (
      React.createElement("div", {className: "react-panel-wrapper", style: wrapperStyle}, 
        self.inner
      )
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
        React.createElement("span", {className: "panel-icon"}, 
          React.createElement("i", {className: this.props.icon})
        )
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
        React.createElement("div", {className: "panel-title-box", style: {maxWidth: Utils.pixelsOf(this.props.maxTitleWidth)}}, React.createElement("div", {className: "panel-title"}, this.props.title))
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
        React.createElement(TabButton, {key: tabIndex, title: props.title, icon: props.icon, selectedIndex: selectedIndex, 
          index: tabIndex, ref: ref, showTitle: showTitle, maxTitleWidth: self.props.maxTitleWidth, onClick: self.handleClick})
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
      React.createElement("div", {className: classes}, 
        React.createElement("header", {draggable: draggable, onDragEnd: self.handleDragEnd, onDragStart: self.handleDragStart, ref: "header"}, 
          icon, 
          title, 
          React.createElement("div", {className: "panel-tabs-start", ref: "tabs-start"}), 
          React.createElement("ul", {className: "panel-tabs", ref: "tabs"}, 
            tabButtons
          ), 
          React.createElement("div", {className: "panel-tabs-end", ref: "tabs-end"})
        ), 
        React.createElement("div", {className: "panel-body"}, 
          tabs
        )
      )
    );
  }

});

var TabButton = React.createClass({displayName: "TabButton",
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
      title = (React.createElement("div", {style: sheet.title.style}, this.props.title));
    }

    if (this.props.icon) {
      icon = (
        React.createElement("div", {style: sheet.icon.style}, 
          React.createElement("i", {className: this.props.icon})
        )
      );
    }

    return (
      React.createElement("li", React.__spread({onClick: this.handleClick, style: sheet.style},  this.listeners), 
        React.createElement("div", {title: this.props.title}, 
          icon, " ", React.createElement("div", {style: sheet.box.style}, title)
        )
      )
    );
  }
});


var Tab = React.createClass({displayName: "Tab",

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
          return (React.createElement("div", {className: "panel-toolbar", key: vIndex++, style: toolbarStyle}, child));
        case 1: return (React.createElement("div", {className: "panel-content", key: vIndex++}, child));
        case 2: return (React.createElement("div", {className: "panel-footer", key: vIndex++}, child));
      }
    });
    tabClasses += (this.props.showToolbar && hasToolbar) ? " with-toolbar" : "";

    return (
      React.createElement("div", {className: tabClasses, style: tabStyle}, 
        innerContent
      )
    );
  }

});

var Toolbar = React.createClass({
  displayName: 'Toolbar',
  mixins: [Mixins.Toolbar],

  render: function () {
    return (
      React.createElement("div", null, 
        this.props.children
      )
    );
  }

});


var Content = React.createClass({
  displayName: 'Content',
  mixins: [Mixins.Content],

  render: function () {
    return (
      React.createElement("div", null, 
        this.props.children
      )
    );
  }

});

var Footer = React.createClass({
  displayName: 'Footer',
  mixins: [Mixins.Footer],

  render: function () {
    return (
      React.createElement("div", null, 
        this.props.children
      )
    );
  }

});

var PanelAddons = {};


window.ReactPanels = {
  Panel: Panel,
  FloatingPanel: FloatingPanel,
  Tab: Tab,
  Mixins: Mixins,
  Toolbar: Toolbar,
  Content: Content,
  Footer: Footer,
  addons: PanelAddons
};

}());
