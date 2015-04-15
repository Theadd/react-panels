react-panels
===========
### [Website](http://theadd.github.io/react-panels/)

Tabbed panel component made with [React](http://facebook.github.io/react/) **v0.13.1** (with **addons**).


## Features

* No dependencies, single JS file with React inline styles.
* Support for themes and skins.
* Fixed or as a draggable floating panel.
* Optional footer, multi-content components and toggleable toolbars in tabs.
* Auto-collapsible tab header buttons when don't fit in a single row.
* Custom panel buttons.
* Easily extensible by *mixins*.


## Roadmap

* Optional *className* in props to allow CSS styling.
* Restore collapsed tab headers when there's available space.
* More themes and skins.
* Allow prebuilt styles to increase performance.
* More...


## Install

**Using bower** *<sup>(Recomended)</sup>*
```sh
bower install react-panels
```
Include ```bower_components/react-panels/dist/react-panels[.min].js``` after ```react-with-addons[.min].js```

**Using npm**
```sh
npm install react-panels
```
```js
var ReactPanels = require('react-panels')
// or
var ReactPanels = require('react-panels/addons')
```


## Example usage

```jsx
var Panel = ReactPanels.Panel;
var Tab = ReactPanels.Tab;
var Toolbar = ReactPanels.Toolbar;
var Content = ReactPanels.Content;
var Footer = ReactPanels.Footer;

var MyPanel = React.createClass({
  render: function () {
    return (
      <Panel theme="chemical">
        <Tab title="One" icon="fa fa-plane">
          <Toolbar>Toolbar content of One</Toolbar>
          <Content>Content of One</Content>
          <Footer>Footer content of One</Footer>
        </Tab>
        <Tab title="Two" icon="fa fa-fire">
          <Content>Content of Two</Content>
        </Tab>
      </Panel>
    );
  }
});
```

* More examples [here](http://theadd.github.io/react-panels/).


## Compatibility

* Compatible with [MoreartyJS](https://github.com/moreartyjs/moreartyjs). <sup>[*Slightly tweaked*](https://github.com/Theadd/react-panels/blob/c3af7999177b4f36fcb9fff5960f6684df6ab412/dist/react-panels.js#L580)</sup>
* Tested in Google Chrome, Mozilla Firefox, Opera and Internet Explorer 10 & 11.


## [License](https://github.com/Theadd/react-panels/blob/master/LICENSE)

The MIT License (MIT)
