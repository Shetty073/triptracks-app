export default function DropdownNavItem({ icon, title, targetId, children }) {
  return (
    <li className="sidebar-item">
      <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" data-bs-target={`#${targetId}`} aria-expanded="false" aria-controls={targetId}>
        <i className={icon}></i>
        <span>{title}</span>
      </a>
      <ul id={targetId} className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
        {children}
      </ul>
    </li>
  );
}
