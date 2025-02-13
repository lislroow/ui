import { AllCodeRes } from "@/types/main/CodeTypes";
import { MenuType } from "@/types/main/MenuTypes";
import { PreferenceType } from "@/types/main/PreferenceTypes";
import { UserType } from "@/types/main/UserTypes";


const clear = (): void => {
  localStorage.clear();
  sessionStorage.clear();
};

const hasCodes = (): boolean => {
  return localStorage.getItem('code') ? true : false;
};
const setCodes = (data?: AllCodeRes[]): void => {
  localStorage.setItem('code', JSON.stringify(data));
};
const getCodes = (): AllCodeRes[] => {
  return JSON.parse(localStorage.getItem('code'));
};

const setLastActiveTime = (now?: number): void => {
  localStorage.setItem('last', now.toString());
};
const getLastActiveTime = (): number => {
  const lastActiveTime = localStorage.getItem('last');
  return lastActiveTime ? parseInt(lastActiveTime) : 0;
};

const setX_RTK = (rtk: string): void => {
  localStorage.setItem('X-RTK', rtk);
};
const getX_RTK = (): string => {
  return localStorage.getItem('X-RTK');
};

const setX_ATK = (atk: string): void => {
  localStorage.setItem('X-ATK', atk);
};
const getX_ATK = (): string => {
  return localStorage.getItem('X-ATK');
};

const setX_SESSION = (session?: number): void => {
  localStorage.setItem('X-SESSION', session.toString());
};
const getX_SESSION = (def?: number): number => {
  const sessionSec = localStorage.getItem('X-SESSION');
  return sessionSec ? parseInt(sessionSec) : def;
};

const setUser = (user?: UserType): void => {
  localStorage.setItem('user', JSON.stringify(user));
};
const getUser = (): UserType => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const setMenu = (menu?: any): void => {
  localStorage.setItem('menu', JSON.stringify(menu));
};
const getMenu = (): MenuType[] => {
  const menu = localStorage.getItem('menu');
  return menu ? JSON.parse(menu) : null;
};

const setPreference = (key: string, value: any) => {
  let preference = allPreferences();
  preference = {...preference, [key]: value};
  localStorage.setItem('preference', JSON.stringify(preference));
};
const allPreferences = (): PreferenceType => {
  const preference = localStorage.getItem('preference');
  return preference ? JSON.parse(preference) : {};
};
const getPreference = (key: string): any => {
  const preference = localStorage.getItem('preference');
  return preference ? JSON.parse(preference)[key] : undefined;
};
const getSidebarPinned = (): boolean => {
  const preference = localStorage.getItem('preference');
  if (!preference) {
    return false;
  }
  return JSON.parse(preference)['sidebarPinned'] === true;
};

const storage = {
  clear,
  hasCodes,
  setCodes,
  getCodes,
  setLastActiveTime,
  getLastActiveTime,
  setX_RTK,
  getX_RTK,
  setX_ATK,
  getX_ATK,
  setX_SESSION,
  getX_SESSION,
  setUser,
  getUser,
  setMenu,
  getMenu,
  setPreference,
  getPreference,
  getSidebarPinned,
};

export default storage;
