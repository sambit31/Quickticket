import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({success: false, message: "Unauthorized",});
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (user.privateMetadata.role !== "admin") {
      return res.status(403).json({success: false, message: "Not Authorized"});
    }

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Authorization Failed",
    });
  }
};