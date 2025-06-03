import mongoose, { Schema, Document } from "mongoose";

export type ShopCategory = "pets" | "clocks" | "backgrounds" | "costumes";

export interface IShopItem extends Document {
  title: string;
  image: string;
  money: number;
  category: ShopCategory;
}

const shopItemSchema: Schema = new Schema<IShopItem>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    money: { type: Number, required: true },
    category: {
      type: String,
      enum: ["pets", "clocks", "backgrounds", "costumes"],
      required: true,
    },
  },
  { timestamps: true }
);

const ShopItem = mongoose.model<IShopItem>("ShopItem", shopItemSchema);

export default ShopItem;
