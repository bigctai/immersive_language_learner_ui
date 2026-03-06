import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ routes }) {
  return (
    <nav className="nav-bar">
      <ul className="routes-list">
        {routes.map((route, index) => (
          <li className="route" key={route.name}>
            <NavLink id={index} className="route-text" to={route.path}>
              {route.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
