import { useEffect, useRef } from "react";
import useThemeSwitcher from "../hooks/useThemeSwitcher";
import NavItem from "./navItem.component";
import DropdownNavItem from "./dropdownNavItem.component";

export default function SideNav() {
  const sidebarRef = useRef(null);
  const iconRef = useRef(null);
  const themeBtnIconRef = useRef(null);
  const themeBtnTextRef = useRef(null);

  // custom hook for theme switching
  const { toggleTheme } = useThemeSwitcher(themeBtnIconRef, themeBtnTextRef);

  const handleNavToggle = () => {
    // This function expands or collapses the side nav bar
    const sidebar = sidebarRef.current;
    const icon = iconRef.current;
  
    sidebar.classList.toggle("expand");
  
    const isExpanded = sidebar.classList.contains("expand");
  
    sessionStorage.setItem("navbarState", isExpanded ? "expand" : "collapsed");
  
    icon.classList.toggle("bx-chevrons-right", !isExpanded);
    icon.classList.toggle("bx-chevrons-left", isExpanded);
  };

  const loaLastSideNavState = () => {
    // Load the last state of side nav bar and expand or collapse accordingly. This is for maintaining the side bar state across page re-loads
    const sidebar = sidebarRef.current;
    const icon = iconRef.current;
  
    const navbarState = sessionStorage.getItem("navbarState");
    const isExpanded = navbarState === "expand";
  
    if (isExpanded) {
      sidebar.classList.add("expand");
      icon.classList.remove("bx-chevrons-right");
      icon.classList.add("bx-chevrons-left");
    } else {
      sidebar.classList.remove("expand");
      icon.classList.remove("bx-chevrons-left");
      icon.classList.add("bx-chevrons-right");
    }
  };

  const handleLogout = () => {
    console.debug("Logout button was clicked! 😲🔲")
  };
  
  useEffect(() => {
    loaLastSideNavState();
  }, []);
  

  return (
    <aside id="sidebar" ref={sidebarRef}>
      <div className="d-flex justify-content-between p-4">
        <div className="sidebar-logo">
          <a href="#">AdmiLite</a>
        </div>
        <button className="toggle-btn border-0" type="button" onClick={handleNavToggle}>
          <i className='bx bx-chevrons-right' ref={iconRef}></i>
        </button>
      </div>

      <ul className="sidebar-nav">
        <NavItem icon="bx bxs-user-account" text="Profile" routeTo="/dashboard/cards" />
        <NavItem icon="bx bxs-layer" text="Tasks" routeTo="/dashboard/forms" />

        <DropdownNavItem icon="bx bxs-bug-alt" title="Auth" targetId="auth">
          <NavItem text="Login" />
          <NavItem text="Register" />
        </DropdownNavItem>

        <DropdownNavItem icon="bx bxs-bar-chart-alt-2" title="Multi-Level" targetId="multi">
          <DropdownNavItem title="Two Links" targetId="multi-inner-1">
            <NavItem text="Link 1" />
            <NavItem text="Link 2" />
          </DropdownNavItem>
        </DropdownNavItem>

        <NavItem icon="bx bxs-bell-ring" text="Notification" />
        <NavItem icon="bx bxs-cog" text="Setting" />
      </ul>

      <div className="sidebar-footer">
        <a id="switch-theme-button" href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); toggleTheme(); }}>
          <i className='bx bx-moon' ref={themeBtnIconRef}></i>
          <span ref={themeBtnTextRef}>Dark Theme</span>
        </a>
        <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
          <i className='bx bx-log-out'></i>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}
