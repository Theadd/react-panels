
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
    <RPanelContent>panel body content here</RPanelContent>
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
      <RPanelControl>
        <a href="#" className="rpanel-button">
          <i className="fa fa-pencil-square-o"></i>
        </a>
      </RPanelControl>

      <RPanelTabs>
        <RPanelTab icon="fa fa-area-chart" title="Area Chart" target="area-chart" active={true} />
        <RPanelTab icon="fa fa-pie-chart" title="Pie Chart" target="pie-chart" />
        <RPanelTab icon="fa fa-line-chart" title="Line Chart" target="line-chart" />
      </RPanelTabs>
    </RPanelHeader>
    <RPanelBody>
      <RPanelToolbar>
        <span>Toolbar content here</span>
      </RPanelToolbar>
      <RPanelContent>panel body content here</RPanelContent>
    </RPanelBody>
  </RPanel>
);

React.render(solidbg, document.getElementById('panel-solidbg'));

React.render(base, document.getElementById('panel-base'));

var solidbg2 = (
  <RPanel
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
      <RPanelControl>
        <a href="#" className="rpanel-button">
          <i className="fa fa-pencil-square-o"></i>
        </a>
      </RPanelControl>

      <RPanelTabs>
        <RPanelTab icon="fa fa-area-chart" title="Area Chart" target="area-chart" active={true} />
        <RPanelTab icon="fa fa-pie-chart" title="Pie Chart" target="pie-chart" />
        <RPanelTab icon="fa fa-line-chart" title="Line Chart" target="line-chart" />
      </RPanelTabs>
    </RPanelHeader>
    <RPanelBody>
      <RPanelToolbar>
        <span>Toolbar content here</span>
      </RPanelToolbar>
      <RPanelContent>panel body content here</RPanelContent>
    </RPanelBody>
  </RPanel>
);

React.render(solidbg2, document.getElementById('panel-solidbg-2'));

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
      <RPanelControl>
        <a href="#" className="rpanel-button">
          <i className="fa fa-pencil-square-o"></i>
        </a>
      </RPanelControl>

      <RPanelTabs>
        <RPanelTab icon="fa fa-area-chart" title="Area Chart" target="area-chart" active={true} />
        <RPanelTab icon="fa fa-pie-chart" title="Pie Chart" target="pie-chart" />
        <RPanelTab icon="fa fa-line-chart" title="Line Chart" target="line-chart" />
      </RPanelTabs>
    </RPanelHeader>
    <RPanelBody>
      <RPanelToolbar>
        <span>Toolbar content here</span>
      </RPanelToolbar>
      <RPanelContent>panel body content here</RPanelContent>
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
      <RPanelToolbar>
        <span>Toolbar content here</span>
      </RPanelToolbar>
      <RPanelContent>panel body content here</RPanelContent>
    </RPanelBody>
  </RPanel>
);

React.render(flatbg2, document.getElementById('panel-flagbg-2'));
