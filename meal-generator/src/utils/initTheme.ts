export function initializeTheme() {
  const savedTheme = localStorage.getItem('mealgen-storage');

  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      if (parsed.state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Fallback to system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  } else {
    // Use system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
}
