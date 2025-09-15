import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import GenerateID from "@/utils/generateId";
/* ---------------------- SHOP INTERFACE & SCHEMA ---------------------- */

interface IShop extends Document {
  storeName: { en: string; bn: string };
  storeLogo: string;
  vendor: mongoose.Types.ObjectId;
  shopId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    storeName: {
      en: { type: String, required: true, unique: true },
      bn: { type: String, required: false },
    },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    storeLogo: { type: String },
    shopId: {
      type: String,
      default: () => GenerateID(10, "number-lowercase"),
      unique: true,
    },
  },
  { versionKey: false, timestamps: true }
);

/* ---------------------- VENDOR INTERFACE & SCHEMA ---------------------- */
export enum VendorTypeEnum {
  INDIVIDUAL = "Individual",
  BUSINESS = "Business",
}

export interface IVendor extends Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  isActive: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  blockReason: string;
  shop: mongoose.Types.ObjectId;
  vendorType: VendorTypeEnum;
  vendorId: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const VendorSchema = new Schema<IVendor>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
    vendorType: {
      type: String,
      required: true,
      enum: Object.values(VendorTypeEnum),
      default: VendorTypeEnum.INDIVIDUAL,
    },
    vendorId: {
      type: String,
      default: () => GenerateID(10, "number-uppercase"),
      unique: true,
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    refreshTokens: { type: [String], default: [] },
  },
  { versionKey: false, timestamps: true }
);
// 🔐 Hash password before save
VendorSchema.pre("save", async function (next) {
  const vendor = this;

  if (!vendor.isModified("password")) return next();
  this.password = await bcrypt.hash(vendor.password, 10);
  next();
});
// 🔐 Compare passwords
VendorSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};
/* ---------------------- EXPORT MODELS ---------------------- */
export const Vendor = mongoose.model<IVendor>("Vendor", VendorSchema);
export const Shop = mongoose.model<IShop>("Shop", ShopSchema);
