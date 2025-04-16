const Appointment = require('../models/Appointment')
const Dentist = require('../models/Dentist')

exports.getAppointments = async (req, res, next) => {
    let query
    if (req.user.role !== 'admin') {
        query = Appointment.find({ user: req.user.id }).populate({
            path: 'dentist',
            select: 'name province tel'
        })
    } else {
        if (req.params.dentistId) {
            console.log(req.params.dentistId)
            query = Appointment.find({ dentist: req.params.dentistId }).populate({
                path: 'dentist',
                select: 'name province tel'
            })
        } else {
            query = Appointment.find().populate({
                path: 'dentist',
                select: 'name province tel'
            })
        }
    }
    try {
        const appointments = await query
        res.status(200).json({ success: true, count: appointments.length, data: appointments })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Cannot find Appointment' })
    }
}

exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'dentist',
            select: 'name province tel'
        })

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}` })
        }
        res.status(200).json({ success: true, data: appointment })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Cannot find Appointment' })
    }
}

exports.addAppointment = async (req, res, next) => {
    try {
        req.body.dentist = req.params.dentistId

        const dentist = await Dentist.findById(req.params.dentistId)

        if (!dentist) {
            return res.status(404).json({ success: false, message: `No dentist with the id of ${req.params.dentistId}` })
        }
        req.body.user = req.user.id
        const existedAppointment = await Appointment.find({ user: req.user.id })

        if (existedAppointment.length >= 1 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already made an appointment` })
        }

        const appointment = await Appointment.create(req.body)

        res.status(200).json({ success: true, data: appointment })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Cannot create Appointment' })
    }
}

exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id)

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}` })
        }

        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update appointment` })
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({ success: true, data: appointment })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Cannot update Appointment' })
    }
}

exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}` })
        }

        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this bootcamp` })
        }

        await appointment.deleteOne()

        res.status(200).json({ success: true, data: {} })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Cannot delete Appointment' })
    }
}