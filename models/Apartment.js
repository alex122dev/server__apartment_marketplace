const { Schema, model } = require("mongoose")


const Apartment = new Schema({
    id: { type: String, required: true, unique: true },
    rooms: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
})

Apartment.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = model('Apartment', Apartment)