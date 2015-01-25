
var panel0 = (
  <Panel
    theme="grayscale"
    icon="fa fa-cube"
    title="Tabbed Panel"
    forceTabs={true}
    buttons={['collapse', 'fullscreen', 'close']}>
    <PanelContent
      active={true}
      icon="fa fa-area-chart"
      title="Area Chart"
      toolbar={(<span>Toolbar content here</span>)}>
      <div>Panel content here</div>
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
    rounded={true}
    floating={true}
    draggable={true}
    buttons={['toggleToolbar', 'collapse', 'fullscreen', 'close']}>
    <PanelContent
      active={true}
      icon="fa fa-area-chart"
      title="Area Chart"
      toolbarState="visible"
      toolbar={(<span><input type="text" placeholder="Example text input in toolbar" className="input-example" /></span>)}>
      <div>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        <br /><br />
        Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
      </div>
    </PanelContent>
    <PanelContent
      icon="fa fa-pie-chart"
      title="Pie Chart"
      toolbarState="hidden"
      toolbar={(<span><input type="text" placeholder="Example text input in toolbar" className="input-example" /></span>)}>
      <div>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </div>
    </PanelContent>
    <PanelContent
      icon="fa fa-line-chart"
      title="Line Chart"
      toolbarState="locked"
      toolbar={(<span><input type="text" placeholder="Example text input in toolbar" className="input-example" /></span>)}>
      <div>
        At solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles. Ma quande lingues coalesce, li grammatica del resultant lingue es plu simplic e regulari quam ti del coalescent lingues.
      </div>
    </PanelContent>
    <PanelContent
      icon="fa fa-bar-chart"
      title="Bar Chart"
      toolbarState="none"
      toolbar={(<span><input type="text" placeholder="Example text input in toolbar" className="input-example" /></span>)}>
      <div>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        <br /><br />
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
      </div>
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
    rounded="top"
    buttons={['collapse', 'fullscreen']}>
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
