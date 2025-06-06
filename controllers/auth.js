const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, telephone } = req.body;

    if (!name || !email || !password || !role || !telephone) {
      return res.status(400).json({
        success: false,
        msg: "Please provide name, email, password, role and telephone number",
      });
    }

    if (telephone.length !== 10) {
      return res.status(400).json({
        success: false,
        msg: "Telephone number must be exactly 10 digits long",
      });
    }

    //duplicated email preventation
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        msg: "Email already in use",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        msg: "Please provide a valid email address",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      telephone,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email or password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res
      .status(401)
      .json({
        success: false,
        msg: `Cannot convert email or password to string`,
      });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res
      .status(501)
      .json({
        success: false,
        msg: `Error with logout controllers`,
      });
  }
};
