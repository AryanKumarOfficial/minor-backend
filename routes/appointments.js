const express = require('express');

const router = express.Router();
router.use(express.json());

const Appointment = require('../database/model/Appointment');

router.post('/fetch', async (req, res) => {
    try {
        const { id } = req.body ?? {};
        if (!id) {
            return res.status(400).json({ success: false, error: 'Invalid request' });
        }
        const appointments = await Appointment.find({ user: id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

router.post('/add', async (req, res) => {
    let success = false;
    try {
        if (!req.body) {
            return res.status(400).json({ success: false, error: 'Invalid request' });
        }
        const { fname, lname, phone, department, bedType, appointmentDate, address, id } = req.body;
        if (!fname || !lname || !phone || !department || !bedType || !appointmentDate || !address || !id) {
            return res.status(404).json({ success: false, error: 'Invalid request' });
        }
        const appointment = new Appointment({ fname, lname, phone, department, bedType, appointmentDate, address, user: id });
        await appointment.save();
        success = true;
        return res.status(201).json({ success, message: 'Appointment created successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: 'Something went wrong' });
    }
})

module.exports = router;