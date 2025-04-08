// Helper function to get and set cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
};
// Custom storage adapter for cookies
export const cookieStorage = {
  getItem: (name) => {
    return getCookie(name) || null;
  },
  setItem: (name, value) => {
    setCookie(name, value, 7); // Expires in 7 days
  },
  removeItem: (name) => {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  }
};
