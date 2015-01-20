

var Example = React.createClass({
  render: function() {
    var header = null;
    header = (
      <RPanelHeader
        icon="fa fa-comments"
        title="Panel Title">
        <RPanelControl>
          <a href="#" className="rpanel-button">
            <i className="fa fa-times"></i>
          </a>
        </RPanelControl>
      </RPanelHeader>
    );
    return (
      <RPanel>
      {header}
        <RPanelBody>
        panel body content here
        </RPanelBody>
      </RPanel>
    );
  }
});

React.render(<Example />, document.getElementById('panel-base'));
React.render(<Example />, document.getElementById('panel-solidbg'));

var flatbg = (
  <RPanel
    theme="flatbg"
    roundedTop={true}>
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
    theme="flatbg"
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

/*<div class="demo-base">
 <div id="panel-base"></div>
 </div>
 <div class="demo-solidbg">
 <div id="panel-solidbg"></div>
 </div>
 <div class="demo-flagbg">
 <div id="panel-flagbg"></div>
 </div>
 <div class="demo-flagbg">
 <div id="panel-flagbg-2"></div>
 </div>*/

