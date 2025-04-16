const mongoose = require('mongoose')

const DentistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    yearsOfExperience: {
        type: Number,
        required: [true, 'Please add years of experience'],
        min: [0, 'Years of experience cannot be less than 0']
    },
    expertise: {
        type: String,
        required: [true, 'Please add expertise'],
        enum: ['General', 'Orthodontics', 'Periodontics', 'Pediatric', 'Oral Surgery', 'Endodontics', 'Prosthodontics', 'Cosmetic']
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

DentistSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'dentist',
    justOne: false
})

module.exports = mongoose.model('Dentist', DentistSchema)