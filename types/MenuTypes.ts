export type MenuType = {
  mid: string,
  title: string,
  icon?: string,
  pathname?: string,
  submenus?: MenuType[]
};
