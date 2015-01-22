/*<div class="demo0">
 <div id="panel0"></div>
 </div>
 <div class="demo1">
 <div id="panel1"></div>
 <br />
 <br />
 <div id="panel1-2"></div>
 </div>
 <div class="demo2">
 <div id="panel2"></div>
 </div>*/

var panel0 = (
  <Panel
    theme="grayscale"
    icon="fa fa-cube"
    title="Tabbed Panel"
    buttons={['collapse', 'fullscreen', 'close']}>
    <PanelContent
      active={true}
      icon="fa fa-area-chart"
      title="Area Chart"
      toolbar={(<span>Toolbar content here</span>)}>
      <div>Panel content here</div>
    </PanelContent>
    <PanelContent
      icon="fa fa-pie-chart"
      title="Pie Chart"
      toolbar={(<span>Toolbar content for pie chart here</span>)}>
      <div>Panel content of pie chart here</div>
    </PanelContent>
  </Panel>
);

React.render(panel0, document.getElementById('panel0'));

var panel1 = (
  <Panel
    theme="lightblue"
    icon="fa fa-comments"
    title="Panel Title"
    bordered={true}
    opaque={true}
    raised={true}
    rounded={true}>
    <PanelContent
      active={true}
      icon="fa fa-area-chart"
      title="Area Chart"
      toolbar={(<span>Toolbar content here</span>)}>
      <div>Panel content here</div>
    </PanelContent>
    <PanelContent
      icon="fa fa-pie-chart"
      title="Pie Chart"
      toolbar={(<span>Toolbar content for pie chart here</span>)}>
      <div>Panel content of pie chart here</div>
    </PanelContent>
    <PanelContent
      icon="fa fa-line-chart"
      title="Line Chart"
      toolbar={(<span>Toolbar content for line chart here</span>)}>
      <div>Panel content of line chart here</div>
    </PanelContent>
  </Panel>
);

React.render(panel1, document.getElementById('panel1'));

var panel1_2 = (
  <Panel
    theme="lightblue"
    icon="fa fa-cutlery"
    title="Panel Title"
    raised={true}>
    <PanelContent
      active={true}
      icon="fa fa-area-chart"
      title="Area Chart"
      toolbar={(<span>Toolbar content here</span>)}>
      <div>Panel content here</div>
    </PanelContent>
    <PanelContent
      icon="fa fa-pie-chart"
      title="Pie Chart"
      toolbar={(<span>Toolbar content for pie chart here</span>)}>
      <div>Panel content of pie chart here</div>
    </PanelContent>
    <PanelContent
      icon="fa fa-line-chart"
      title="Line Chart"
      toolbar={(<span>Toolbar content for line chart here</span>)}>
      <div>Panel content of line chart here</div>
    </PanelContent>
  </Panel>
);

React.render(panel1_2, document.getElementById('panel1-2'));

var panel2 = (
  <Panel
    theme="grayscale"
    icon="fa fa-share-alt"
    title="Panel Title"
    rounded="top">
    <PanelContent
      active={true}
      icon="fa fa-area-chart"
      title="Area Chart"
      toolbar={(<span>Toolbar content here</span>)}>
      <div>Panel content here</div>
    </PanelContent>
    <PanelContent
      icon="fa fa-pie-chart"
      title="Pie Chart"
      toolbar={(<span>Toolbar content for pie chart here</span>)}>
      <div>Panel content of pie chart here</div>
    </PanelContent>
    <PanelContent
      icon="fa fa-line-chart"
      title="Line Chart"
      toolbar={(<span>Toolbar content for line chart here</span>)}>
      <div>Panel content of line chart here</div>
    </PanelContent>
  </Panel>
);

React.render(panel2, document.getElementById('panel2'));
