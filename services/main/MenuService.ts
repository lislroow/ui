import storage from '@/utils/storage';
import menu from '@/json/menu.json';
import { MenuType } from '@/types/main/MenuTypes';

const initMenu = (): MenuType[] => {
  if (!storage.getMenu()) {
    storage.setMenu(menu);
    console.log('menu: ' + JSON.stringify(menu));
  }
  return storage.getMenu();
};

const MenuService = {
  initMenu,
};

export default MenuService;
