

export function checkThemeLocal() {
    return { type: 'CHECK_THEME_LOCAL'}
}

export function getTheme() {
    return { type: 'GET_THEME' }
}

export function setTheme(theme) {
    return { type: 'SET_THEME', payload: theme }
}