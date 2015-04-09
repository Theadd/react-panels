
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

Mixins.TabWrapper = {

  getDefaultProps: function () {
    return {
      panelComponentType: "TabWrapper",
      icon: "",
      title: "",
      pinned: false
    };
  },

  childContextTypes: {
    index: React.PropTypes.number
  },

  getChildContext: function () {
    return {
      index: this.props.index
    };
  },

  contextTypes: {
    selectedIndex: React.PropTypes.number
  }

};
