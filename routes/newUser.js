require("dotenv").config();
const express = require("express");
const User = require("../database/model/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const {
  createMailOptions,
  adminMailoption,
  welcomeMailToUser,
} = require("./mailTemplate");

const router = express.Router();

router.use(express.json());

// path : /api/user/
router.get("/", (req, res) => {
  res.send(
    `<h1 style="color:green;text-align:center;margin-top:25rem;font-size:3rem;">User api route is working properly</h1>`
  );
});

// when resistarion of user happen they initilly don't have a isVerified artibute
// to verify them when regrestion happened then one token is sand them through email
// or when thy try to signup without having isVerified artibute then redirected to vrifie user page for their veification where they manualy enter email and get a isVerified aritibute
// then normal signup happen by them to acess website

// for verifying mail
const verifyUserByMail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return {
      msg: "user not exist try with other Mail",
      success: false,
    };
  }
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
  await User.findOneAndUpdate({ email }, { verificationToken: token });

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  const mailOptions = createMailOptions(email, token);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err, "error sending email");
      return {
        msg: "User registered successfully but email verification link could not be sent to the user's email address",
        success: false,
      };
    } else {
      console.log(info, "info sending email");
      return {
        msg: "User registered successfully and email verification link sent to the user's email address",
        success: true,
      };
    }
  });
  return {
    msg: "Email sent",
  };
};

// path : /api/user/register
router.put("/register", async (req, res) => {
  let success = false;
  try {
    const { fname, lname, email, password } = req.body;
    if (!fname || !lname || !email || !password) {
      return res
        .status(200)
        .json({ msg: "Please enter all fields", reqBody: req.body, success });
    }

    // CHECK USER EXIXTANCE
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({
        msg: "User already exists",
        user: user.isVerified,
        success,
        email,
      });
    }

    // CREATING A VERIFICATION ON REGISTRAION INSTANCE and saving passwd
    bycrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bycrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        const newUser = new User({
          fname,
          lname,
          email,
          password: hash,
        });
        await newUser.save();
        const { msg } = await verifyUserByMail(email);

        return res.status(200).json({
          msg: msg,
          success: true,
          verified: false,
          email,
        });
      });
    });
  } catch (error) {
    console.log("Some Error Occure", error.msg);
  }
});

// path: /api/user/reqVerify which need email and passwd as req.body
router.post("/reqVerify", async (req, res) => {
  let success = false;
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(200)
        .json({ msg: "Please enter all fields", reqBody: req.body, success });
    }
    // CHECK USER EXIXTANCE
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ msg: "User Does Not exists", success, email });
    }

    // checking that same  user try to verify himself
    bycrypt.compare(password, user.password, async (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const { msg } = await verifyUserByMail(email);
        return res
          .status(200)
          .json({ msg: msg, success, verified: false, email });
      }
      return res.status(200).json({
        msg: "Please Enter Correct Passwd",
        reqBody: req.body,
        success,
      });
    });
  } catch (error) {
    console.log("SomThing went worng With User Verification", error.msg);
  }
});

// if user not verified yet and try to login then resand verify mail and it provide jwt
router.post("/login", async (req, res) => {
  try {
    let success = false;
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(200)
        .json({ msg: "Please enter all fields", reqBody: req.body, success });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ msg: "User does not exists", success });
    } 
    else if (user && !user?.isVerified) {
      // alternative rediect to verify section
      const { msg } = await verifyUserByMail(email);

      return res.status(200).json({
        msg: msg,
        success,
        verified: false,
        email,
      });
    } else if (user && user?.isVerified) {
      bycrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
            expiresIn: 3600,
          });
          return res.status(200).json({
            msg: "User logged in successfully",
            token,
            user: user.email,
            success: true,
          });
        } else {
          return res.status(200).json({ msg: "Invalid credentials", success });
        }
      });
    }
  } catch (error) {
    console.log(error, "error");
  }
});

//  get the specific user with authorization token in header

// this route Currently do noting with user logout
router.get("/logout", async (req, res) => {
  let success = false;
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ msg: "No token, authorization denied", success }); // 401: Unauthorized
    }
    const bearerToken = token.split(" ").parts[1];

    if (!bearerToken) {
      return res
        .status(401)
        .json({ msg: "Invalid token, authorization denied", success }); // 401: Unauthorized
    } else {
      try {
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user._id).select("-password");
        if (!user) {
          return res.status(404).json({ msg: "User not found", success });
        } else {
          // logout Steps Goes here

          return res
            .status(200)
            .json({ msg: "User logged out successfully", success: true });
        }
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ msg: "Token expired, please log in again", success }); // 401: Unauthorized
        } else {
          console.log(error, "error");
          return res
            .status(500)
            .json({ msg: "Internal Server error", success: false });
        }
      }
    }
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ error: "Internal Server error", success: false });
  }
});

// user Need to sand all { fname, lname, phone, address } as req.body
router.put("/update", async (req, res) => {
  try {
    let success = false;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "No token, authorization denied", success });
    } else {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user._id).select("-password");
        if (!user) {
          return res.status(404).json({ error: "User not found", success });
        } else {
          const { fname, lname, phone, address } = req.body;
          if (!fname || !lname || !phone || !address) {
            return res.status(400).json({
              error: "Please enter all fields",
              reqBody: req.body,
              success,
            });
          } else {
            user.fname = fname;
            user.lname = lname;
            user.phone = phone;
            user.address = address;
            await user.save();
            return res
              .status(200)
              .json({ msg: "User updated successfully", user, success: true });
          }
        }
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ error: "Token expired, please log in again", success });
        } else if (error.name === "JsonWebTokenError") {
          return res
            .status(401)
            .json({ error: "Invalid token, please log in again", success });
        } else {
          console.log(error, "error");
          return res
            .status(500)
            .json({ error: "Internal Server error", success: false });
        }
      }
    }
  } catch (error) {
    console.log(error, "error");
    return res
      .status(500)
      .json({ error: "Internal Server error", success: false });
  }
});

router.post("/verify-captcha", async (req, res) => {
  try {
    let success = false;
    const { captchaToken } = req.body;
    const secretKey = process.env.REACT_APP_RECAPTCHA_SECRET_KEY;
    console.log(captchaToken, secretKey, "captchaToken, secretKey");
    if (!captchaToken || !secretKey) {
      return res
        .status(404)
        .json({ error: "Please Verify Propely", reqBody: req.body, success });
    } else {
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
      const response = await fetch(url, { method: "POST" });
      const data = await response.json();
      console.log(data, "data");
      if (data.success) {
        return res
          .status(200)
          .json({ msg: "Captcha verified successfully", data, success: true });
      } else {
        return res
          .status(400)
          .json({ error: "Captcha verification failed", data, success });
      }
    }
  } catch (error) {
    console.log("SomeThin Worng With Captcha verify", error.msg);
  }
});

// verify the user's email address and activate the account of the user if the user's email address is verified successfully and send a welcome email to the user's email address after successful email verification and account activation of the user and send a email to the admin's email address after successful email verification and account activation of the user to notify the admin about the email verification and account activation of the user

router.get("/verify/:token", async (req, res) => {
  try {
    let success = false;
    const { token } = req.params;
    if (!token) {
      return res.status(404).json({
        error: "Please enter all fields",
        reqBody: req.body,
        success,
        verified: false,
      });
    } else {
      try {
        // VERIFY USER BY TOKEN AND FIND HIM IN DB
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
          return res
            .status(404)
            .json({ error: "User not found", success, verified: false });
        }
        if (user && user.isVerified) {
          return res.status(200).json({
            msg: "User already exists and email is verified",
            success,
            verified: true,
          });
        }
        user.isVerified = true;
        user.verificationToken = "";
        await user.save();

        // now send a welcome email to the user's email address
        const transporter = nodeMailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
          },
        });
        const mailOptions = welcomeMailToUser(user.email);

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err, "error sending email");
            return res.status(200).json({
              msg: "User email verified successfully but welcome email could not be sent to the user's email address",
              success: false,
              verified: true,
            });
          } else {
            console.log(info, date, "info sending email");
            return res.status(200).json({
              msg: "User email verified successfully and welcome email sent to the user's email address",
              success: true,
              verified: true,
            });
          }
        });

        // now send a email to the admin's email address to notify the admin about the email verification and account activation of the user
        const transporter1 = nodeMailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
          },
        });

        const mailOptions1 = adminMailoption(
          "aryanak9163@gmail.com;ban1onur@gmail.com"
        );

        transporter1.sendMail(mailOptions1, (err, info) => {
          if (err) {
            console.log(err, "error sending email");
            return res.status(200).json({
              msg: "User email verified successfully but email could not be sent to the admin's email address to notify the admin about the email verification and account activation of the user",
              success: false,
              verified: true,
            });
          } else {
            console.log(info, date, "info sending email");
            return res.status(200).json({
              msg: "User email verified successfully and email sent to the admin's email address to notify the admin about the email verification and account activation of the user",
              success: true,
              verified: true,
            });
          }
        });

        return res.status(200).json({
          msg: "User email verified successfully",
          success: true,
          verified: true,
        });
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            error: "Token expired, please resend verification link",
            success,
            verified: false,
          });
        } else if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            error: "Invalid token, please resend verification link",
            success,
            verified: false,
          });
        } else {
          console.log(error, "error");
          return res.status(500).json({
            error: "Internal Server error",
            success: false,
            verified: false,
            invalidToken: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({
      error: "Internal Server error",
      success: false,
      verified: false,
      invalidToken: true,
    });
  }
});

module.exports = router;

