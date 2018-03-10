function getData(name, defaultValue) {
    return localStorage.getItem(name) || defaultValue;
}
function setData(name, value) {
    localStorage.setItem(name, value);
}