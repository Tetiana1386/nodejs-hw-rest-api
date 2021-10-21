const request = require('supertest')
const fs = require('fs/promises')
require('dotenv').config()

const db = require('../config/ db')
const app = require('../app')

const User = require('../model/user')

const { newUserForRouteUser } = require('./data/data')

jest.mock('cloudinary');

describe('Testing route users', () => {
    let token;
    
    beforeAll(async () => {
        await db
        await User.deleteOne({ email: newUserForRouteUser.email })
    })

    afterAll(async () => {
        const mongo = await db
        await User.deleteOne({ email: newUserForRouteUser.email })
        await mongo.disconnect()
    })

    describe('Testing user registration', () => {
        it('Registration success should return 201 status', async () => {
            const response = await request(app)
                .post('/api/users/signup')
                .send(newUserForRouteUser)
                .set('Accept', 'application/json')

            expect(response.status).toEqual(201)
            expect(response.body).toBeDefined()
        })

        it('User exist return status 409', async () => {
            const response = await request(app)
                .post('/api/users/signup')
                .send(newUserForRouteUser)
                .set('Accept', 'application/json')

            expect(response.status).toEqual(409)
            expect(response.body).toBeDefined()
        })
    })

    describe('Testing user authorization', () => {
        it('Login user', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send(newUserForRouteUser)
                .set('Accept', 'application/json')

            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
            token = response.body.date.token
        })
    })

    describe('Testing user avatar upload', () => {
        it('Upload avatar for user', async () => {
            const buffer = await fs.readFile('./test/data/default-avatar.jpg');
            const response = await request(app)
                .patch('/api/users/avatars')
                .set('Authorization', `Bearer ${token}`)
                .attach('avatar', buffer, 'default-avatar.jpg')

            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
        })
    })

    describe('Testing update subscription', () => {
        it('Update subscription success should return 200 status', async () => {
            const response = await request(app)
                .patch('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({ subscription: 'pro' });

            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
        })
    })

    describe('Testing get current user data by token', () => {
        it('Current user success should return 200 status', async () => {
            const response = await request(app)
                .get('/api/users/current')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(200)
            expect(response.body).toBeDefined()
        })
    })

    describe('Testing user logout', () => {
        it('Logout success should return 204 status', async () => {
            const response = await request(app)
                .post('/api/users/logout')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(204)
        })
        it('Logout unauthorized error should return 401 status', async () => {
            const wrongToken = '3456';
            const response = await request(app)
                .post('/api/users/logout')
                .set('Authorization', `Bearer ${wrongToken}`)

            expect(response.status).toEqual(401)
        })
    })
})