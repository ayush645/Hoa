const bcrypt = require("bcryptjs");
const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");
const { uploadImageToCloudinary } = require("../config/imageUploader");

const registerCtrl = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authModel.create({
      name,
      email,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,

      phone,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    // Set cookie for token
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options);

    return res.status(200).json({
      success: true,
      token,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

const updateUserCtrl = async (req, res) => {
  try {
    const id = req.user.id; // Logged-in User ID
    const { name, email, phone, newPassword } = req.body;
    const file = req.files ? req.files.image : null; // Image file if exists

    // Validation
    if (!name || !phone) {
      return res.status(403).json({
        success: false,
        message: "Name and phone are required!",
      });
    }

    // Pehle se jo user hai use find karo
    const existingUser = await authModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Agar naye image hai toh upload karo, nahi toh purani wali hi rakho
    let imageProfile = existingUser.image;
    if (file) {
      const response = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
      
      imageProfile = response.url

    }

    // Agar newPassword diya gaya toh uska hash banao, warna purana password rakho
    let hashedPassword = existingUser.password;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // User update karo
    const updatedUser = await authModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        image: imageProfile,
        password: hashedPassword,
      },
      { new: true } // Updated document return karega
    );

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "User updated successfully!",
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "User update failed. Please try again.",
    });
  }
};


const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET
      );

      user.token = token;
      user.password = undefined;
      const options = {
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

module.exports = { registerCtrl, loginCtrl, updateUserCtrl };
