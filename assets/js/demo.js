
var base = (
  <RPanel
    bordered={true}
    rounded={true}>
    <RPanelHeader
      icon="fa fa-comments"
      title="Panel Title">
      <RPanelControl>
        <a href="#" className="rpanel-button">
          <i className="fa fa-times"></i>
        </a>
      </RPanelControl>
    </RPanelHeader>
    <RPanelBody>
    panel body content here
    </RPanelBody>
  </RPanel>
);

React.render(base, document.getElementById('panel-base'));

var solidbg = (
  <RPanel
    bordered={true}
    opaque={true}
    theme="lightblue"
    raised={true}
    rounded={true}>
    <RPanelHeader
      icon="fa fa-comments"
      title="Panel Title">
      <RPanelControl>
        <a href="#" className="rpanel-button">
          <i className="fa fa-times"></i>
        </a>
      </RPanelControl>
    </RPanelHeader>
    <RPanelBody>
    panel body content here
    </RPanelBody>
  </RPanel>
);

React.render(solidbg, document.getElementById('panel-solidbg'));

var flatbg = (
  <RPanel
    theme="grayscale"
    rounded="top">
    <RPanelHeader
      icon="fa fa-comments"
      title="Panel Title">
      <RPanelControl>
        <a href="#" className="rpanel-button">
          <i className="fa fa-times"></i>
        </a>
      </RPanelControl>
    </RPanelHeader>
    <RPanelBody>
    panel body content here
    </RPanelBody>
  </RPanel>
);

React.render(flatbg, document.getElementById('panel-flagbg'));

var flatbg2 = (
  <RPanel
    theme="grayscale"
    rounded={false}>
    <RPanelHeader
      icon="fa fa-comments"
      title="Panel Title">
      <RPanelControl>
        <a href="#" className="rpanel-button">
          <i className="fa fa-times"></i>
        </a>
      </RPanelControl>
    </RPanelHeader>
    <RPanelBody>
    panel body content here
    </RPanelBody>
  </RPanel>
);

React.render(flatbg2, document.getElementById('panel-flagbg-2'));
