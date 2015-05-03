
var FloatingPanel = React.createClass({
  displayName: 'FloatingPanel',
  mixins: [Mixins.PanelWrapper],

  getDefaultProps: function () {
    return {
      "left": 0,
      "top": 0,
      "width": 420,
      "style": {}
    };
  },

  getInitialState: function () {
    this.skipUpdate = false;
    return {
      left: parseInt(this.props.left),
      top: parseInt(this.props.top),
      width: parseInt(this.props.width)
    };
  },

  componentWillReceiveProps:function(nextProps) {
    this.setState({width:nextProps.width});
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
    if (this.props.onBoundsChange) {
      var height=this.getDOMNode().offsetHeight;
      this.props.onBoundsChange({left:this.state.left, top:this.state.top, width:this.state.width, height:height});
    }
  },

  dragOver: function(e) {
    if (this.panelBounds || false) {
      var left = this.panelBounds.startLeft + (e.pageX - this.panelBounds.startPageX),
        top = this.panelBounds.startTop + (e.pageY - this.panelBounds.startPageY);
      this.skipUpdate = true;
      this.setState({ left: left, top: top });
    }
  },

  render: function() {
    var transform = "translate3d(" + Utils.pixelsOf(this.state.left) + ", " + Utils.pixelsOf(this.state.top) + ", 0)",
      wrapperStyle = React.addons.update({
        WebkitTransform: transform,
        MozTransform: transform,
        msTransform: transform,
        transform: transform,
        width: Utils.pixelsOf(this.state.width),
        position: "absolute"
      }, {$merge: this.props.style});

    if (!this.skipUpdate) {
      var props = React.addons.update({
          onDragStart: this.dragStart,
          onDragEnd: this.dragEnd,
          floating: true
        }, {$merge: this.config}),
        keys = Object.keys(this.props);

      for (var i = keys.length; --i >= 0;) {
        if (["children", "left", "top", "width", "style"].indexOf(keys[i]) != -1) continue;
        props[keys[i]] = this.props[keys[i]];
      }
      this.inner = (
        React.createElement(ReactPanel, props,
          this.props.children
        )
      );
    } else {
      this.skipUpdate = false;
    }

    return React.createElement("div", {style:wrapperStyle}, this.inner);
  }

});

var Panel = React.createClass({
  displayName: 'Panel',
  mixins: [Mixins.PanelWrapper],

  render: function() {
    var props = React.addons.update({}, {$merge: this.config}),
      keys = Object.keys(this.props);

    for (var i = keys.length; --i >= 0;) {
      if (["children"].indexOf(keys[i]) != -1) continue;
      props[keys[i]] = this.props[keys[i]];
    }
    return React.createElement(ReactPanel, props,
        this.props.children
    );
  }

});

var ReactPanel = React.createClass({
  displayName: 'ReactPanel',
  mixins: [Mixins.Styleable, Mixins.Transitions, Mixins.SortableTabs],

  getDefaultProps: function () {
    return {
      "icon": false,
      "title": "",
      "autocompact": true,
      "floating": false,
      "onDragStart": null,
      "onDragEnd": null,
      "maxTitleWidth": 130,
      "buttons": []
    };
  },

  getInitialState: function () {
    return {
      compacted: (this.props.autocompact)
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number,
    sheet: React.PropTypes.func,
    onTabChange: React.PropTypes.func,
    globals: React.PropTypes.object
  },

  getSelectedIndex: function () {
    return this.context.selectedIndex;
  },

  handleClick: function (event, index) {
    this.context.onTabChange(parseInt(index));
  },

  componentDidMount: function () {
    if (this.props.autocompact) {
      var tabsStart = this.refs['tabs-start'].getDOMNode(),
        tabsEnd = this.refs['tabs-end'].getDOMNode(),
        using = this.refs.tabs.getDOMNode().offsetWidth,
        total = tabsEnd.offsetLeft - (tabsStart.offsetLeft + tabsStart.offsetWidth);

      if (using * 2 <= total) {   // TODO: ... * 2 is obviously not what it should be
        this.setState({compacted: false});
      }
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.autocompact) {
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

  _getGroupedButtons: function () {
    var len = this.props.buttons.length,
      i, j, item, group = [], groups = [];

    for (i = 0; i < len; ++i) {
      item = this.props.buttons[i];

      if (typeof item === "object" && item instanceof Array) {
        if (group.length) {
          groups.push(group);
          group = [];
        }
        for (j = 0; j < item.length; ++j) {
          group.push(React.addons.cloneWithProps(item[j], {key: j}));
        }
        if (group.length) {
          groups.push(group);
          group = [];
        }
      } else {
        group.push(React.addons.cloneWithProps(item, {key: i}));
      }
    }
    if (group.length) {
      groups.push(group);
    }

    return groups;
  },

  render: function() {
    var self = this,
      draggable = (this.props.floating) ? "true" : "false",
      sheet = this.getSheet("Panel"),
      tp = this.getTransitionProps("Panel"),
      sp = this.getSortableProps("Panel");

    var icon = (this.props.icon) ? (
        React.createElement("span", {style:sheet.icon.style},
          React.createElement("i", {className:this.props.icon})
        )
      ) : null,
      title = (this.props.title.length) ? (
        React.createElement("div", {style:sheet.box.style},
          React.createElement("div", {style:sheet.title.style},
            this.props.title
          )
        )
      ) : null;

    var tabIndex = 0,
      selectedIndex = this.getSelectedIndex(),
      tabButtons = [],
      tabs = [],
      groupIndex = 0;

    React.Children.forEach(self.props.children, function(child) {
      var ref = "tabb-" + tabIndex,
        tabKey = (typeof child.key !== "undefined" && child.key != null) ? child.key : ref,
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
        React.createElement(TabButton, React.__spread({key: tabKey, title: props.title, icon: props.icon,
          index: tabIndex, ref: ref, showTitle: showTitle, onClick: self.handleClick,
          "data-index": tabIndex, "data-key": tabKey}, sp.tabButtons))
      );

      tabs.push(
        React.addons.cloneWithProps(child, {
          key: tabKey,
          tabKey: tabKey,
          selectedIndex: selectedIndex,
          index: tabIndex
        })
      );
      ++tabIndex;
    });

    return (
      React.createElement("div", {style: sheet.style},
        React.createElement("header", {draggable: draggable, onDragEnd: self.handleDragEnd,
            onDragStart: self.handleDragStart, ref: "header", style: sheet.header.style},
          icon, title,
          React.createElement("div", {style: sheet.tabsStart.style, ref: "tabs-start"}),
          React.createElement(tp.transitionComponent, React.__spread({component: "ul", ref: "tabs",
              style: sheet.tabs.style, transitionName: tp.transitionName,
              transitionAppear: tp.transitionAppear, transitionEnter: tp.transitionEnter,
              transitionLeave: tp.transitionLeave}, tp.transitionCustomProps, sp.tabs),
            tabButtons
          ),
          React.createElement("div", {style: sheet.tabsEnd.style, ref: "tabs-end"}),
          this._getGroupedButtons().map(function (group) {
            return React.createElement("ul", {style: sheet.group.style, key: groupIndex++}, group );
          })
        ),
        React.createElement("div", {style: sheet.body.style}, tabs )
      )
    );
  }

});
