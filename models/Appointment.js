const mongoose = require('mongoose')
const Dentist = require('./Dentist')

const AppointmentSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dentist: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dentist',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})
 
module.exports = mongoose.model('Appointment', AppointmentSchema)