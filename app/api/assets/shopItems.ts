export type ShopCategory = 'pets' | 'clocks' | 'backgrounds' | 'costumes';

export type ShopItem = {
  id: number;
  title: string;
  image: string;
  money: number;
};

export const shopItems: Record<ShopCategory, ShopItem[]> = {
  pets: [
    { id: 1, title: "Cat", image: "/shop/pets/cat.png", money: 100 },
    { id: 2, title: "Dog", image: "/shop/pets/dog.png", money: 150 },
  ],
  clocks: [
    { id: 3, title: "Future Clock", image: "/shop/clocks/future.png", money: 200 },
  ],
  backgrounds: [
    { id: 4, title: "Sunset", image: "/shop/backgrounds/sunset.png", money: 120 },
  ],
  costumes: [
    { id: 5, title: "Ninja", image: "/shop/costumes/ninja.png", money: 180 },
  ],
};
