export interface MenuItem {
  id: number;
  name_en: string;
  name_am: string;
  description_en: string;
  description_am: string;
  price: number;
  image: string;
  isSpecial: boolean;
  isSoldOut: boolean;
  isNew: boolean;
  clicks?: number;
  cartAdds?: number;
}

export interface MenuSection {
  category_en: string;
  category_am: string;
  id: string;
  items: MenuItem[];
}

export const initialMenuData: MenuSection[] = [];
