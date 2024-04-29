export type Feature = {
  text: string;
  correct: boolean;
};

export type Product = {
  title: string;
  features: Feature[];
  price: number;
  productId: number;
  type: "FREE" | "STANDARD_MARATHI" | "STANDARD_ENGLISH" | "PREMIUM";
};
