// Sistema de Temas - Colores y Configuración
export const colors = {
  // Colores Primarios
  primary: {
    light: "#ffffff",
    dark: "#0f172a"
  },
  
  // Colores de Fondo
  background: {
    light: "#f8fafc",
    dark: "#000000"
  },
  
  // Colores de Acento
  accent: {
    primary: "#3b82f6",
    dark: "#1e40af",
    light: "#dbeafe"
  },
  
  // Colores de Texto
  text: {
    primary: {
      light: "#0f172a",
      dark: "#ffffff"
    },
    secondary: {
      light: "#64748b",
      dark: "#cbd5e1"
    },
    muted: {
      light: "#94a3b8",
      dark: "#78716c"
    }
  },
  
  // Colores de Bordes
  border: {
    light: "#e2e8f0",
    dark: "#27272a"
  },
  
  // Colores de Hover
  hover: {
    light: "#f1f5f9",
    dark: "#1f2937"
  },
  
  // Estados
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6"
};

export const themes = {
  light: {
    bg: colors.background.light,
    bgSecondary: "#ffffff",
    text: colors.text.primary.light,
    textSecondary: colors.text.secondary.light,
    border: colors.border.light,
    hover: colors.hover.light,
    navBg: "rgba(255, 255, 255, 0.8)",
    cardBg: "#ffffff",
    dropdownBg: "#ffffff",
    accent: colors.accent.primary
  },
  dark: {
    bg: colors.background.dark,
    bgSecondary: "#0f172a",
    text: colors.text.primary.dark,
    textSecondary: colors.text.secondary.dark,
    border: colors.border.dark,
    hover: colors.hover.dark,
    navBg: "rgba(0, 0, 0, 0.8)",
    cardBg: "#1f2937",
    dropdownBg: "#1f2937",
    accent: colors.accent.primary
  }
};

// Gestión del tema
export class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.applyTheme(this.currentTheme);
  }
  
  getStoredTheme() {
    return localStorage.getItem('tecno-theme');
  }
  
  setStoredTheme(theme) {
    localStorage.setItem('tecno-theme', theme);
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  applyTheme(theme) {
    this.currentTheme = theme;
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    this.setStoredTheme(theme);
    this.dispatchThemeChangeEvent();
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
  
  dispatchThemeChangeEvent() {
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: this.currentTheme }
    }));
  }
  
  getTheme() {
    return this.currentTheme;
  }
  
  getThemeColors() {
    return themes[this.currentTheme];
  }
}

// Exportar instancia única
export const themeManager = new ThemeManager();
