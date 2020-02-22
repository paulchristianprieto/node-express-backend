import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { Container, Navbar } from "react-bulma-components";

const Navbah = () => {
  const [toggle, setToggle] = useState(false);

  let admin =
    localStorage.getItem("user") === "admin@email.com"
      ? localStorage.getItem("user")
      : localStorage.removeItem("user");

  return (
    <Navbar
      className="has-background-light shadow-lg mb-5 bg-white rounded p-0"
      active={toggle}
    >
      <Container>
        <Navbar.Brand>
          <NavLink exact to="/" className="navbar-item brand">
            <span className="Logo">
              <i className="fas fa-film"></i> M
              <i className="fas fa-circle-notch"></i>
              VIEBOOKER
            </span>
          </NavLink>

          <Navbar.Burger
            className="has-text-dark"
            active={toggle ? "true" : "false"}
            onClick={() => setToggle(!toggle)}
            data-target="navMenu"
          />
        </Navbar.Brand>

        <Navbar.Menu id="navMenu">
          <Navbar.Container position="end">
            <NavLink
              exact
              to="/movies"
              className={admin ? "navbar-item" : "navbar-item d-none"}
              activeClassName="navbar-item active-page"
            >
              Movies
            </NavLink>
            <NavLink
              exact
              to="/nowshowing"
              className="navbar-item"
              activeClassName="navbar-item active-page"
            >
              Now Showing
            </NavLink>
            <NavLink
              exact
              to="/bookings"
              className={admin ? "navbar-item" : "navbar-item d-none"}
              activeClassName="navbar-item active-page"
            >
              Reservations
            </NavLink>
            <NavLink
              exact
              to="/login"
              className={admin ? "navbar-item d-none" : "navbar-item"}
              activeClassName="navbar-item active-page"
              onClick={() => {
                window.location = "/login";
              }}
            >
              Login
            </NavLink>
            <NavLink
              exact
              to="/login"
              className={admin ? "navbar-item" : "navbar-item d-none"}
              activeClassName="navbar-item active-page"
              onClick={() => {
                localStorage.removeItem("user");
                Swal.fire(
                  "Thank You!",
                  "You successfully logged out!",
                  "success"
                );
              }}
            >
              Logout
            </NavLink>
          </Navbar.Container>
        </Navbar.Menu>
      </Container>
    </Navbar>
  );
};

export default Navbah;
