function getConfig(name, defaultValue) {
    return localStorage.getItem(name) || defaultValue;
}
function setConfig(name, value) {
    localStorage.setItem(name, value);
}