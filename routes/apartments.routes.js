const Router = require("express")
const Apartment = require("../models/Apartment")
const { check, validationResult } = require("express-validator")
const { default: mongoose } = require("mongoose")
const router = new Router()

// get all apartments, you have oportunity to sort of filter apartments with query params
router.get('/apartments',
    async (req, res) => {
        try {
            const { price, rooms } = req.query
            const query = {}
            const sort = {}
            if (price === 'asc') sort.price = 1
            if (price === 'desc') sort.price = -1
            if (typeof Number(rooms) === "number" && rooms > 0) query.rooms = Number(rooms)

            const apartments = await Apartment.find(query).sort(sort)
            return res.json(apartments)
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
)

// get specific apartment by id
router.get('/apartments/:id',
    async (req, res) => {
        try {
            const apartment = await Apartment.findOne({ id: req.params.id })

            if (!apartment) {
                return res.status(400).json({ message: `Apartment with id: ${req.params.id} not found` })
            }

            return res.json(apartment)
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
)

// save new apartment to DB
router.post('/apartments',
    [
        check('name', 'The value of the name field is not valid. Length < 99').isString().isLength({ min: 0, max: 99 }),
        check('description', 'The value of the description field is not valid. Length < 999').isString().isLength({ min: 0, max: 999 }),
        check('price', 'Price must be only integer!').isInt({ min: 1 }),
        check('rooms', 'Rooms must be only integer more than 0!').isInt({ min: 1 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Uncorrect request', errors })
            }

            const { rooms, name, price, description } = req.body
            const apartment = new Apartment({
                id: new mongoose.Types.ObjectId().toHexString(),
                rooms, name, price, description
            })
            const result = await apartment.save()

            return res.json({ message: 'Apartment was created', apartment: result })
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
)

// update existing apartment by id
router.put('/apartments/:id',
    [
        check('name', 'The value of the name field is not valid. Length < 99').isString().isLength({ min: 0, max: 99 }),
        check('description', 'The value of the description field is not valid. Length < 999').isString().isLength({ min: 0, max: 999 }),
        check('price', 'Price must be only integer!').isInt({ min: 1 }),
        check('rooms', 'Rooms must be only integer more than 0!').isInt({ min: 1 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Uncorrect request', errors })
            }

            const { rooms, name, price, description } = req.body
            const apartment = await Apartment.findOneAndUpdate({ id: req.params.id },
                { rooms, name, price, description },
                { new: true })

            if (!apartment) {
                return res.status(400).json({ message: `Apartment with id: ${req.params.id} not found` })
            }

            return res.json({ message: 'The apartment is updated', apartment })
        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
)

// delete existing apartment by id
router.delete('/apartments/:id',
    async (req, res) => {
        try {
            const apartment = await Apartment.findOne({ id: req.params.id })

            if (!apartment) {
                return res.status(400).json({ message: `Apartment with id: ${req.params.id} not found` })
            }

            await apartment.deleteOne()
            return res.json({ message: `Apartment with id: ${req.params.id} was deleted` })

        } catch (e) {
            res.status(400).json({ message: e.message })
        }
    }
)

module.exports = router