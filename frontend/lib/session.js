const SESSION_USER_KEY = "commerce-bank-user";
const SESSION_USER_EVENT = "commerce-bank-user-change";

export function getSessionUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(SESSION_USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    window.localStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}

export function saveSessionUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_USER_EVENT));
}

export function clearSessionUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_USER_KEY);
  window.dispatchEvent(new Event(SESSION_USER_EVENT));
}

export function subscribeToSessionUser(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => callback(getSessionUser());
  window.addEventListener(SESSION_USER_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(SESSION_USER_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}
