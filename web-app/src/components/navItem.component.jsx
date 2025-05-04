import { Link } from "react-router";

export default function NavItem({ icon, text, routeTo = "/" }) {
  return (
    <li className="sidebar-item">
      <Link to={routeTo} className="sidebar-link">
        <i className={icon}></i>
        <span>{text}</span>
      </Link>
    </li>
  );
}