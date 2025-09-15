import { Request, Response } from "express";
import { Vendor, Shop } from "@/models/vendor.model";
import mongoose from "mongoose";
import { createAccessToken, createRefreshToken } from "@/utils/jwt";
async function Signup(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { name, email, phone, password, storeName } = req.body;
  try {
    const existingEmail = await Vendor.findOne({ email });
    if (existingEmail) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "This email already exists",
      });
    }
    const existingPhone = await Vendor.findOne({ phone });
    if (existingPhone) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "This phone number already exists",
      });
    }

    // 2️⃣ Check if storeName already exists (normalize)
    const normalizedInput = storeName.en.replace(/\s+/g, "").toLowerCase();
    const existingStore = await Shop.findOne({
      $expr: {
        $eq: [
          {
            $toLower: {
              $replaceAll: {
                input: "$storeName.en",
                find: " ",
                replacement: "",
              },
            },
          },
          normalizedInput,
        ],
      },
    }).session(session);

    if (existingStore) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "This store name already exists",
      });
    }
    const vendor = await Vendor.create(
      [
        {
          name,
          email,
          phone,
          password,
        },
      ],
      { session }
    );
    const shop = await Shop.create(
      [
        {
          storeName: {
            en: storeName.en,
            bn: storeName.bn || storeName.en,
          },
          vendor: vendor[0]._id,
        },
      ],
      { session }
    );
    await Vendor.findByIdAndUpdate(
      vendor[0]._id,
      { shop: shop[0]._id },
      { session }
    );

    const accessToken = createAccessToken(vendor[0]._id as string);
    const refreshToken = createRefreshToken(vendor[0]._id as string);
    vendor[0].refreshTokens.push(refreshToken);
    await vendor[0].save({ session });
    await session.commitTransaction();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Vendor created successfully",
      accessToken,
    });
  } catch (error: any) {
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
}

async function Login(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const vendor = await Vendor.findOne({
      $or: [{ email: username }, { phone: username }],
    });
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    if (!(await vendor.comparePassword(password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const accessToken = createAccessToken(vendor._id as string);
    const refreshToken = createRefreshToken(vendor._id as string);
    vendor.refreshTokens.push(refreshToken);
    await vendor.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (error: any) {
    console.log(error);
  }
}
async function GetVendors(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  // console.log(req.headers["user-agent"]);
  console.log(req.ip);
  try {
    const vendors = await Vendor.find().populate("shop");
    res.status(200).json({ success: true, data: vendors });
  } catch (error: any) {}
}
export default { Signup, Login, GetVendors };
