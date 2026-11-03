"use client"

import { createContext, useCallback, useEffect, useSyncExternalStore } from "react"

// The theme lives on <html class="dark">. The inline script in layout.js sets
// it before first paint (stored choice, else the OS preference), and this
// context just reads and writes that class. `isDark` is null during SSR and
// hydration so the server and client markup match; consumers render a
// neutral state until it becomes true/false right after mount.
const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const DarkContext = createContext([null, () => {}]);

function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
}

function readStoredTheme() {
    try {
        const theme = localStorage.getItem(STORAGE_KEY);
        return theme === "dark" || theme === "light" ? theme : null;
    } catch {
        return null;
    }
}

// Re-render whenever the class on <html> changes, whoever changed it.
function subscribe(onChange) {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
    return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => null;

export const DarkContextProvider = ({children}) => {
    const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Accepts a boolean or an updater, like a state setter. An explicit choice
    // is stored and wins over the OS preference from then on.
    const setisDark = useCallback((next) => {
        const current = getSnapshot();
        const dark = typeof next === "function" ? next(current) : next;
        const theme = dark ? "dark" : "light";
        applyTheme(theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Storage blocked (private mode etc.): the choice lasts this page view.
        }
    }, []);

    useEffect(() => {
        // Follow the OS setting while the user hasn't picked a theme.
        const media = window.matchMedia(DARK_QUERY);
        const onSystemChange = (event) => {
            if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light");
        };
        // Keep other tabs in sync with a choice made here.
        const onStorage = (event) => {
            if (event.key !== STORAGE_KEY) return;
            const theme = readStoredTheme() ?? (media.matches ? "dark" : "light");
            applyTheme(theme);
        };
        media.addEventListener("change", onSystemChange);
        window.addEventListener("storage", onStorage);
        return () => {
            media.removeEventListener("change", onSystemChange);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    return(
        <DarkContext.Provider value={[isDark,setisDark]}>
            {children}
        </DarkContext.Provider>
    )
}

export default DarkContext;
