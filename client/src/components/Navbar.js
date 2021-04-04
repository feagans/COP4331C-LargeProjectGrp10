import React from "react";
import "./Navbar.css";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";

function clickMe() {
  alert("You Clicked me");
}
function Navbar() {
  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars"></Link>
      </div>
      <nav className="nav-menu active">
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <h1>Settings</h1>
            <Link to="#" className="menu-bars" />
          </li>
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
          <button className="button" onClick={clickMe}>
            Back to Home
            <Link to="#"></Link>
          </button>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
