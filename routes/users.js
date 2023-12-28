require('dotenv').config();
const express = require('express');
const User = require('../database/model/User');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.send(`<h1 style="color:green;text-align:center;margin-top:25rem;font-size:3rem;">User route is working properly</h1>`);
});

router.post('/register', async (req, res) => {
    try {
        let success = false;
        const { fname, lname, email, password } = req.body;
        if (!fname || !lname || !email || !password) {
            return res.status(200).json({ msg: 'Please enter all fields', reqBody: req.body, success });
        }
        else {
            const user = await User.findOne({ email });
            if (user) {
                return res.status(200).json({ msg: 'User already exists', success });
            }
            else {
                bycrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bycrypt.hash(password, salt, async (err, hash) => {
                        if (err) throw err;
                        const newUser = new User({
                            fname,
                            lname,
                            email,
                            password: hash
                        });
                        await newUser.save();
                        return res.status(200).json({ msg: 'User registered successfully', newUser, success: true });
                    }
                    )
                }
                )
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

router.get('/get', async (req, res) => {
    try {
        let success = false;
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied', success });
        }
        else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.user._id).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found', success });
            }
            else {
                return res.status(200).json({ msg: 'User found', user, success: true });
            }
        }
    } catch (error) {
        console.log(error, 'error');
        return res.status(500).json({ error: 'Internal Server error', success: false });
    }
});


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
                    console.log(req.body, 'req.body');
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


module.exports = router;

// Path: backend/routes/users.js