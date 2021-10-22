const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../config/ db');
const app = require('../app');
const Contact = require('../model/contact');
const User = require('../model/user');
const { newContact, newUserForRouteContact } = require('./data/data')

describe('Test route contacts', () => {
    let user, token;
    
    beforeAll(async () => {
        await db
        await User.deleteOne({ email: newUserForRouteContact.email })
        user = await User.create(newUserForRouteContact)
        const SECRET_KEY = process.env.JWT_SECRET_KEY
        const issueToken = (payload, secret) => jwt.sign(payload, secret)
        token = issueToken({ id: user.id }, SECRET_KEY)
        await User.updateOne({ _id: user.id }, { token })
    })

    afterAll(async () => {
        const mongo = await db
        await User.deleteOne({ email: newUserForRouteContact.email })
        await mongo.disconnect()
    })

    beforeEach(async () => {
        await Contact.deleteMany({})
    })

    describe('Testing get all contacts', () => {
        it('Get all contacts success should return 200 status', async () => {
            const response = await request(app)
                .get('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
            expect(response.body.data.contacts).toBeInstanceOf(Array)
        })
    })

    describe('Testing get contact by id', () => {
        it('Get contact by ID success should return 200 status', async () => {
            const contact = await Contact.create({ ...newContact, owner: user.id })
            const response = await request(app)
                .get(`/api/contacts/${contact.id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
            expect(response.body.data.contact).toBeDefined()
            expect(response.body.data.contact).toHaveProperty('id')
            expect(response.body.data.contact).toHaveProperty('name')
            expect(response.body.data.contact).toHaveProperty('email')
            expect(response.body.data.contact).toHaveProperty('phone')
        })
        it('Contact not found should return 404 status', async () => {
            const response = await request(app)
                .get('/api/contacts/615dc6a550447ade6fe5935e')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(404)
            expect(response.body).toBeDefined()
            expect(response.body).toHaveProperty('status')
            expect(response.body).toHaveProperty('code')
        })
    })

    describe('Testing create new contact', () => {
        it('Add contact success should return 201 status', async () => {
            const response = await request(app)
                .post('/api/contacts')
                .set('Authorization', `Bearer ${token}`)
                .send(newContact)
                .set('Accept', 'application/json')

            expect(response.status).toEqual(201)
            expect(response.body).toBeDefined();
        })
    })

    describe('Testing remove contact', () => {
        it('Remove contact success should return 200 status', async () => {
            const contact = await Contact.create({ ...newContact, owner: user.id })
            const response = await request(app)
                .delete(`/api/contacts/${contact.id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
        })
        it('Should return 404 status with wrong id', async () => {
            const response = await request(app)
                .delete('/api/contacts/615dc6a770447ade6fe5935e')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(404)
            expect(response.body).toBeDefined()
            expect(response.body).toHaveProperty('status')
            expect(response.body).toHaveProperty('code')
        })
    })

    describe('Testing update contact', () => {
        it('Update contact success should return 200 status', async () => {
            const contact = await Contact.create({ ...newContact, owner: user.id })
            const response = await request(app)
                .patch(`/api/contacts/${contact.id}/favorite`)
                .set('Authorization', `Bearer ${token}`)
                .set("Accept", "application/json")
                .send({ favorite: true })
            
            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
            expect(response.body.data.contact.favorite).toBe(true)
                
        })
        it('Should return 404 status with wrong id', async () => {
            const response = await request(app)
                .patch('/api/contacts/609c3eb1fb21d16fb0da3876/favorite')
                .set('Authorization', `Bearer ${token}`)
                .set("Accept", "application/json")
                .send({ favorite: true })

            expect(response.status).toEqual(404)
            expect(response.body).toBeDefined()
        })
    })
})