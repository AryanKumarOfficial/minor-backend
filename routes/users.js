require('dotenv').config();
const express = require('express');
const User = require('../database/model/User');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.send(`<h1 style="color:green;text-align:center;margin-top:25rem;font-size:3rem;">User route is working properly</h1>`);
});
// register the user and send a email verification link to the user's email address with a token in the link to verify the user's email address and activate the account of the user if the user's email address is verified successfully and send a welcome email to the user's email address after successful registration and email verification and account activation of the user and send a email to the admin's email address after successful registration and email verification and account activation of the user to notify the admin about the new user registration and email verification and account activation of the user 
router.post('/register', async (req, res) => {
    try {
        let success = false;
        const { fname, lname, email, password } = req.body;
        if (!fname || !lname || !email || !password) {
            return res.status(200).json({ msg: 'Please enter all fields', reqBody: req.body, success });
        }
        else {
            const user = await User.findOne({ email });
            if (user && user.isVerified) {
                return res.status(200).json({ msg: 'User already exists', success, verified: true });
            }
            else if (user && !user.isVerified) {
                // if the user exists but email is not verified then send a verification link to the user's email address again
                const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: 3600 });
                const transporter = nodeMailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.NODEMAILER_EMAIL,
                        pass: process.env.NODEMAILER_PASSWORD
                    }
                });
                const mailOptions = {
                    from: 'support@hospitalo.com',
                    to: email,
                    subject: 'Email Verification',

                    html: ` <main
                        style="
                          backdrop-filter: blur(10px);
                          box-shadow: 0 0 10px #af5111;
                          padding: 10px;
                        "
                      >
                        <h1 style="color: green; text-align: center">Email Verification</h1>
                        <p style="color: magenta; font-weight: bold">
                          Please click on the link below to verify your email address and activate
                          your account
                        </p>
                        <a
                          href=${process.env.SITE_URL}/user/verify?token=${token}
                          target="_blank"
                          style="color: red; font-weight: bold; text-decoration: none"
                          >Verify Email Address</a
                        >
                        <ul
                          style="
                            color: blue;
                            width: 100%;
                            height: 100%;
                            padding: 4px;
                            gap: 14px;
                            text-align: left;
                            margin-left: 10px;
                            flex-wrap: wrap;
                            text-wrap: balance;
                            list-style-type: square;
                            list-style-position: calc(40px-60px);
                            list-style-image: url('https://img.icons8.com/ios-filled/14/right') !important;
                          "
                        >
                          <li>If you did not register with us then you can ignore this email</li>
                          <li>
                            if you have any query then you can contact us by replying to this
                            email we will try to resolve your query as soon as possible
                          </li>
                          <li>
                            if you have not registered with us then we will delete your email
                            address from our database within 1 hours
                          </li>
                        </ul>
                        <h3 style="color: green; text-align: center">Thank You</h3>
                        <h3 style="color: green; text-align: center">Hospitalo Team</h3>
                      </main>`
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err, 'error sending email');
                        return res.status(200).json({ msg: 'User registered successfully but email verification link could not be sent to the user\'s email address', success: false });
                    }
                    else {
                        console.log(info, date, 'info sending email');
                        return res.status(200).json({ msg: 'User registered successfully and email verification link sent to the user\'s email address', success: true });
                    }
                })
                return res.status(200).json({ msg: 'User already exists but email is not verified', success, verified: false });
            }
            else {
                bycrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bycrypt.hash(password, salt, async (err, hash) => {
                        if (err) throw err;
                        const newUser = await new User({
                            fname,
                            lname,
                            email,
                            password: hash,
                        });
                        await newUser.save();
                        const token = jwt.sign({ newUser }, process.env.JWT_SECRET, { expiresIn: 3600 });
                        await User.findOneAndUpdate({ email }, { verificationToken: token })
                        // now send a verification email to the user's email address
                        const transporter = nodeMailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.NODEMAILER_EMAIL,
                                pass: process.env.NODEMAILER_PASSWORD
                            }
                        });
                        const mailOptions = {
                            from: 'support@hospitalo.com',
                            to: email,
                            subject: 'Email Verification',

                            html: ` <main
                            style="
                              backdrop-filter: blur(10px);
                              box-shadow: 0 0 10px #af5111;
                              padding: 10px;
                            "
                          >
                            <h1 style="color: green; text-align: center">Email Verification</h1>
                            <p style="color: magenta; font-weight: bold">
                              Please click on the link below to verify your email address and activate
                              your account
                            </p>
                            <a
                              href=${process.env.SITE_URL}/user/verify?token=${token}
                              target="_blank"
                              style="color: red; font-weight: bold; text-decoration: none"
                              >Verify Email Address</a
                            >
                            <ul
                              style="
                                color: blue;
                                width: 100%;
                                height: 100%;
                                padding: 4px;
                                gap: 14px;
                                text-align: left;
                                margin-left: 10px;
                                flex-wrap: wrap;
                                text-wrap: balance;
                                list-style-type: square;
                                list-style-position: calc(40px-60px);
                                list-style-image: url('https://img.icons8.com/ios-filled/14/right') !important;
                              "
                            >
                              <li>If you did not register with us then you can ignore this email</li>
                              <li>
                                if you have any query then you can contact us by replying to this
                                email we will try to resolve your query as soon as possible
                              </li>
                              <li>
                                if you have not registered with us then we will delete your email
                                address from our database within 1 hours
                              </li>
                            </ul>
                            <h3 style="color: green; text-align: center">Thank You</h3>
                            <h3 style="color: green; text-align: center">Hospitalo Team</h3>
                          </main>`
                        };
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err, 'error sending email');
                                return res.status(200).json({ msg: 'User registered successfully but email verification link could not be sent to the user\'s email address', success: false });
                            }
                            else {
                                console.log(info, date, 'info sending email');
                                return res.status(200).json({ msg: 'User registered successfully and email verification link sent to the user\'s email address', success: true });
                            }
                        });
                        return res.status(200).json({ msg: 'User registered successfully and email verification link sent to the user\'s email address', success: true, verified: false });
                    });
                }
                );  // end of bycrypt
            }
        }


    } catch (error) {
        console.log(error, 'error');
    }
});


router.post('/login', async (req, res) => {
    try {
        let success = false;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({ msg: 'Please enter all fields', reqBody: req.body, success });
        }
        else {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(200).json({ msg: 'User does not exists', success });
            }
            else {
                bycrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: 3600 });
                        return res.status(200).json({ msg: 'User logged in successfully', token, user, success: true });
                    }
                    else {
                        return res.status(200).json({ msg: 'Invalid credentials', success });
                    }
                })
            }
        }
    } catch (error) {
        console.log(error, 'error');
    }
});


// get the specific user with authorization token in header



router.get('/logout', async (req, res) => {
    try {
        let bearerToken = undefined;
        let success = false;
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied', success }); // 401: Unauthorized
        } else {
            const parts = token.split(' ');
            const bearer = parts[0];
            bearerToken = parts[1];
        }

        if (!bearerToken) {
            return res.status(401).json({ msg: 'Invalid token, authorization denied', success }); // 401: Unauthorized
        } else {
            try {
                const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
                const user = await User.findById(decoded.user._id).select('-password');
                if (!user) {
                    return res.status(404).json({ msg: 'User not found', success });
                } else {
                    return res.status(200).json({ msg: 'User logged out successfully', success: true });
                }
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ msg: 'Token expired, please log in again', success }); // 401: Unauthorized
                } else {
                    console.log(error, 'error');
                    return res.status(500).json({ msg: 'Internal Server error', success: false });
                }
            }
        }
    } catch (error) {
        console.log(error, 'error');
        return res.status(500).json({ error: 'Internal Server error', success: false });
    }
});

router.put('/update', async (req, res) => {
    try {
        let success = false;
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'No token, authorization denied', success });
        }
        else {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.user._id).select('-password');
                if (!user) {
                    return res.status(404).json({ error: 'User not found', success });
                }
                else {
                    const { fname, lname, phone, address } = req.body;
                    if (!fname || !lname || !phone || !address) {
                        return res.status(400).json({ error: 'Please enter all fields', reqBody: req.body, success });
                    }
                    else {
                        user.fname = fname;
                        user.lname = lname;
                        user.phone = phone;
                        user.address = address;
                        await user.save();
                        return res.status(200).json({ msg: 'User updated successfully', user, success: true });
                    }
                }
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired, please log in again', success });
                } else if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Invalid token, please log in again', success });
                } else {
                    console.log(error, 'error');
                    return res.status(500).json({ error: 'Internal Server error', success: false });
                }
            }
        }
    } catch (error) {
        console.log(error, 'error');
        return res.status(500).json({ error: 'Internal Server error', success: false });
    }
});

router.post('/verify-captcha', async (req, res) => {

    try {
        let success = false;
        const { captchaToken } = req.body;
        const secretKey = process.env.REACT_APP_RECAPTCHA_SECRET_KEY
        if (!captchaToken || !secretKey) {
            return res.status(400).json({ error: 'Please enter all fields', reqBody: req.body, success });
        }
        else {
            const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
            const response = await fetch(url, { method: 'POST' });
            const data = await response.json();
            console.log(data, 'data');
            if (data.success) {
                return res.status(200).json({ msg: 'Captcha verified successfully', data, success: true });
            }
            else {
                return res.status(400).json({ error: 'Captcha verification failed', data, success });
            }
        }
    } catch (error) {

    }
});


module.exports = router;

// Path: backend/routes/users.js