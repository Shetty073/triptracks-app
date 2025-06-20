import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router';
import useThemeSwitcher from "../hooks/useThemeSwitcher";
import NavItem from "./navItem.component";
import DropdownNavItem from "./dropdownNavItem.component";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../contexts/authContext";

export default function SideNav() {
  const sidebarRef = useRef(null);
  const iconRef = useRef(null);
  const themeBtnIconRef = useRef(null);
  const themeBtnTextRef = useRef(null);

  const navigate = useNavigate();

  const { logout } = useAuth();

  // custom hook for theme switching
  const { toggleTheme } = useThemeSwitcher(themeBtnIconRef, themeBtnTextRef);

  const handleNavToggle = () => {
    // This function expands or collapses the side nav bar
    const sidebar = sidebarRef.current;
    const icon = iconRef.current;
  
    sidebar.classList.toggle("expand");
  
    const isExpanded = sidebar.classList.contains("expand");
  
    localStorage.setItem("navbarState", isExpanded ? "expand" : "collapsed");
  
    icon.classList.toggle("bx-chevrons-right", !isExpanded);
    icon.classList.toggle("bx-chevrons-left", isExpanded);
  };

  const loaLastSideNavState = () => {
    // Load the last state of side nav bar and expand or collapse accordingly. This is for maintaining the side bar state across page re-loads
    const sidebar = sidebarRef.current;
    const icon = iconRef.current;
  
    const navbarState = localStorage.getItem("navbarState");
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

  const handleLogout = async () => {
    try {
      const response = await axiosClient.post('/identity/api/logout/');

      sessionStorage.removeItem('authToken');
      logout();
      navigate('/auth');
    } catch (err) {
      // Error already handled by interceptor
      console.error(`Something went wrong ${err}`);
    }
  };
  
  useEffect(() => {
    loaLastSideNavState();
  }, []);
  

  return (
    <aside id="sidebar" ref={sidebarRef}>
      <div className="d-flex justify-content-between p-4">
        <div className="sidebar-logo">
          <a href="#">TripTracks</a>
        </div>
        <button className="toggle-btn border-0" type="button" onClick={handleNavToggle}>
          <i className='bx bx-chevrons-right' ref={iconRef}></i>
        </button>
      </div>

      <ul className="sidebar-nav">
        <NavItem icon="bx bx-trip" text="Trips" routeTo="/dashboard/trips" />
        <NavItem icon="bx bxs-car" text="Vehicles" routeTo="/dashboard/vehicles" />
        <NavItem icon="bx bxs-group" text="Crew" routeTo="/dashboard/crew" />
        <NavItem icon="bx bxs-conversation" text="Messages" routeTo="/dashboard/forms" />
        <DropdownNavItem icon="bx bxs-cog" title="Settings" targetId="auth">
          <NavItem text="My Profile" routeTo="/dashboard/forms" />
          <NavItem text="Analytics" routeTo="/dashboard/forms" />
          <NavItem text="Help Center" routeTo="/dashboard/forms" />
        </DropdownNavItem>
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
