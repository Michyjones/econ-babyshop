import { cloudinaryImage } from "@keystone-next/cloudinary";
import { relationship, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import "dotenv/config";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "stevewear",
};

export const ProductImage = list({
  fields: {
    image: cloudinaryImage({
      cloudinary,
      label: "source",
    }),
    alText: text(),
    product: relationship({ ref: "Product.photo" }),
  },
  ui: {
    listView: {
      intialColumns: ['image', 'alText', 'product'],
    },
  },
});
