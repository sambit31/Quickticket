import User from "../models/User.js";

export const syncUser = async (req, res) => {
  try {
    const { id, firstName, lastName, email, image } = req.body;
   
    const fullName =`${firstName || ""} ${lastName || ""}`.trim() || "User";


    let user = await User.findById(id);

    if (user) {
      user.name = fullName;
      user.email = email;
      user.image = image;

      await user.save();

      return res.json({
        success: true,
        message: "User Updated",
      });
    }

    user = await User.create({
      _id: id,
      name: fullName,
      email,
      image,
    });

    res.json({
      success: true,
      message: "User Created",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};


 