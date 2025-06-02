import { useEffect } from "react";

export default function useThemeSwitcher(iconRef, textRef) {
  const applyTheme = (theme) => {
    const tables = document.querySelectorAll(".table");

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      iconRef.current?.classList.replace("bx-moon", "bx-sun");
      textRef.current.textContent = "Light Mode";
      tables.forEach((table) => table.classList.add("table-dark"));
    } else {
      iconRef.current?.classList.replace("bx-sun", "bx-moon");
      textRef.current.textContent = "Dark Theme";
      tables.forEach((table) => table.classList.remove("table-dark"));
    }
  };

  const toggleTheme = (e) => {
    e?.preventDefault();
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    applyTheme(saved);
  }, []);

  return { toggleTheme };
}
