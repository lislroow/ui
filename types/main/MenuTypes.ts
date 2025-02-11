export type MenuType = {
  mid: string,
  title: string,
  icon?: string,
  pathname?: string,
  isOpen?: boolean,
  isActive?: boolean,
  submenus?: MenuType[]
};
