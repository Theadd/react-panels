
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
    var transform = "translate3d(" + Utils.pixelsOf(this.state.left) + ", " + Utils.pixelsOf(this.state.top) + ", 0)",
      wrapperStyle = React.addons.update({
        WebkitTransform: transform,
        MozTransform: transform,
        msTransform: transform,
        transform: transform,
        width: Utils.pixelsOf(this.state.width),
        position: "absolute"
      }, {$merge: this.props.style});

    if (this._pflag) {
      this.inner = (
        <ReactPanel title={this.props.title} icon={this.props.icon} buttons={this.props.buttons}
          onDragStart={this.dragStart} onDragEnd={this.dragEnd} floating={true}>
          {this.props.children}
        </ReactPanel>
      );
      this._pflag = false;
    }

    return (
      <div style={wrapperStyle}>
        {this.inner}
      </div>
    );
  }

});

var Panel = React.createClass({
  displayName: 'Panel',
  mixins: [Mixins.PanelWrapper],

  render: function() {
    return (
      <ReactPanel title={this.props.title} icon={this.props.icon} buttons={this.props.buttons}>
        {this.props.children}
      </ReactPanel>
    );
  }

});

var ReactPanel = React.createClass({
  displayName: 'Panel',
  mixins: [Mixins.Styleable],

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
    onTabChange: React.PropTypes.func
  },

  getSelectedIndex: function () {
    return this.context.selectedIndex;
  },

  handleClick: function (event, index) {
    this.context.onTabChange(parseInt(index));
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
      sheet = this.getSheet("Panel");

    var icon = (this.props.icon) ? (
        <span style={sheet.icon.style}>
          <i className={this.props.icon}></i>
        </span>
      ) : null,
      title = (this.props.title.length) ? (
        <div style={sheet.box.style}><div style={sheet.title.style}>{this.props.title}</div></div>
      ) : null;

    var tabIndex = 0,
      selectedIndex = this.getSelectedIndex(),
      tabButtons = [],
      tabs = [],
      groupIndex = 0;

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
        <TabButton key={tabIndex} title={props.title} icon={props.icon}
          index={tabIndex} ref={ref} showTitle={showTitle} onClick={self.handleClick} />
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
      <div style={sheet.style}>
        <header draggable={draggable} onDragEnd={self.handleDragEnd}
            onDragStart={self.handleDragStart} ref="header" style={sheet.header.style}>
          {icon}
          {title}
          <div style={sheet.tabsStart.style} ref="tabs-start" />
          <ul style={sheet.tabs.style} ref="tabs">
            {tabButtons}
          </ul>
          <div style={sheet.tabsEnd.style} ref="tabs-end" />
          {this._getGroupedButtons().map(function (group) {
            return (
              <ul style={sheet.group.style} key={groupIndex++}>
                {group}
              </ul>
            );
          })}
        </header>
        <div style={sheet.body.style}>
          {tabs}
        </div>
      </div>
    );
  }

});
