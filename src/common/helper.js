export function saveLocalStorage(storage) {
  return localStorage.storage = JSON.stringify(storage);
}

export function getLocalStorage(storage) {
  return localStorage.getItem(storage);
}

export function removeLocalStorage(storage) {
  return localStorage.removeItem(storage);
}