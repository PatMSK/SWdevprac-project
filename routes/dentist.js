const express = require('express')
const router = express.Router()
const {getDentists, getDentist, createDentist, updateDentist, deleteDentist} = require('../controllers/dentists')
const appointmentsRouter = require('./appointments')

const { protect, authorize } = require('../middleware/auth')

router.use('/:dentistId/appointments', appointmentsRouter)

router.route('/')
    .get(getDentists)
    .post(protect, authorize('admin'), createDentist)

router.route('/:id')
    .get(getDentist)
    .put(protect, authorize('admin'),updateDentist)
    .delete(protect, authorize('admin'),deleteDentist)

module.exports = router

/**
 * @swagger
 * components:
 *   schemas:
 *     Dentist:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           descruiption: The auto-generated id of the dentist
 *           example: 67ed1b13c72c1a15127e2326
 *         ลำดับ:
 *           type: string
 *           description: Ordinal number
 *         name:
 *           type: string
 *           description: Dentist name
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         district:
 *           type: string
 *           description: District
 *         province:
 *           type: string
 *           description: Province
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code
 *         tel:
 *           type: string
 *           description: telephone number
 *         region:
 *           type: string
 *           description: Region
 *       example:
 *         id: 67ed1b13c72c1a15127e2326
 *         ลำดับ: 127
 *         name: Happy Dentist
 *         address: 121 ถใสุขุมวิท
 *         district: บางนา
 *         province: กรุงเทพ
 *         postalcode: 10110
 *         tel: 02-2167000
 *         region: Bangkok
 */

/**
 * @swagger
 * tags:
 *   name: Dentists
 *   description: The dentists managing API
 */

/**
 * @swagger
 * /dentists:
 *   get:
 *     summary: Returns the list of all the dentists
 *     tags: [Dentists]
 *     responses:
 *       200:
 *         description: The list of the dentists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dentist'
 */

/**
 * @swagger
 * /dentists/{id}:
 *   get:
 *     summary: Get the dentist by id
 *     tags: [Dentists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dentist id
 *     responses:
 *       200:
 *         description: The dentist description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dentist'
 *       404:
 *         description: The dentist was not found
 */

/**
 * @swagger
 * /dentists:
 *   post:
 *     summary: Create a new dentist
 *     tags: [Dentists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dentist'
 *     responses:
 *       201:
 *         description: The dentist was successful created
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Dentist'
 *       404:
 *         description: Some server error
 */

/**
 * @swagger
 * /dentists/{id}:
 *   put:
 *     summary: Update the dentist by id
 *     tags: [Dentists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dentist id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dentist'
 *     responses:
 *       200:
 *         description: The dentist was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dentist'
 *       404:
 *         description: The dentist was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /dentists/{id}:
 *   delete:
 *     summary: Remove the dentist by id
 *     tags: [Dentists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dentist id
 *     responses:
 *       200:
 *         description: The dentist was deleted
 *       404:
 *         description: The dentist was not found
 */