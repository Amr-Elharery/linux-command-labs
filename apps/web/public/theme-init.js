(() => {
  try {
    const saved = localStorage.getItem("linux-labs.workspace.v1");
    const theme = saved ? JSON.parse(saved).theme : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    document.documentElement.classList.remove("dark");
  }
})();
