import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="dark" theme="secondary"  expand="lg">
        <NavbarBrand href="/">NBA</NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/players">
                Player Hub
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/matches" >
                Games Hub
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/teams" >
                Team Hub
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
