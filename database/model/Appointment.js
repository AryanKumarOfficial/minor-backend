const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: String,
        required: true,
        trim: true,
    },
    bedType: {
        type: String,
        required: true,
        trim: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true,
    }

);

const Appointment = mongoose.model('Appointment', AppointmentSchema) || mongoose.models.Appointment;
module.exports = Appointment;