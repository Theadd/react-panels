
var navbarInstance = (
  <Navbar className="navbar-fixed-top">
    <Nav>
      <NavItem><span className="example-title">react-panels (w/ react-bootstrap)</span></NavItem>
    </Nav>
    <Nav className="navbar-right">
      <DropdownButton title="Left Panel">
        <MenuItem eventKey="1">Close</MenuItem>
        <MenuItem eventKey="2">Collapse</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Restore</MenuItem>
      </DropdownButton>
      <DropdownButton title="Right Panel">
        <MenuItem eventKey="1">Close</MenuItem>
        <MenuItem eventKey="2">Collapse</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Restore</MenuItem>
      </DropdownButton>
    </Nav>
  </Navbar>
);

React.render(navbarInstance, document.getElementById('navbar'));

var gridInstance = (
  <Grid>
    <Row>
      <Col xs={12} md={8}>
        {leftPanel}
      </Col>
      <Col xs={12} md={4}>
        {rightPanel}
      </Col>
    </Row>
  </Grid>
);

React.render(gridInstance, document.getElementById('grid-example'));
