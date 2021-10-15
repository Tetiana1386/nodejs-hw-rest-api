const jwt = require('jsonwebtoken');
const Users = require('../repository/users');
const { HttpCode, Subscription} = require('../helpers/constants');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
    const {email} = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
        return res.status(HttpCode.CONFLICT).json({
            status: 'Error',
            code: HttpCode.CONFLICT,
            message: 'Email is already exist',
        })
    }
    try {
        const newUser = await Users.create(req.body);
        return res.status(HttpCode.CREATED).json({
            status: 'Success',
            code: HttpCode.CREATED,
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                subscription: newUser.subscription,
            },
        })
    } catch (error) {
        next(error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user.isValidPassword(password);
    if (!user || !isValidPassword) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'Error',
            code: HttpCode.UNAUTHORIZED,
            message: 'Invalid credentials',
        });
    };
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
        status: 'Success',
        code: HttpCode.OK,
        date: {
            token,
        },
    });
};

const logout = async (req, res) => {
    const id = req.user._id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({ test: 'test' });
};

const current = async (req, res, next) => {
    try {
        const tokenVerification = req.user.token;
        const { id } = jwt.verify(tokenVerification, SECRET_KEY);
        const { name, email, subscription } = await Users.findById(id);
        return res.status(HttpCode.OK).json({
            status: 'Success',
            code: HttpCode.OK,
            user: {
                id,
                name,
                email,
                subscription,
            },
        });
    } catch (error) {
        next(error);
    };
};

const updateSubscription = async (req, res, next) => {
    try {
        const tokenVerification = req.user.token;
        const { id } = jwt.verify(tokenVerification, SECRET_KEY);
        const user = await Users.updateSubscription(id, req.body)
        if (user) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                user: {
                    id: user.id,
                    email: user.email,
                    subscription: user.subscription,
                },
            })
        } else {
            return res.status(HttpCode.NOT_FOUND).json({
                status: 'error',
                code: HttpCode.NOT_FOUND,
                data: 'Not found',
            });
        };
    } catch (e) {
        next(e);
    };
};

const onlyStarter = async (_req, res) => {
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
            message: `Only ${Subscription.STARTER}`,
        },
    });
};

const onlyPro = async (_req, res) => {
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
            message: `Only ${Subscription.PRO}`,
        },
    });
};

const onlyBusiness = async (_req, res) => {
    return res.json({
        status: 'Success',
        code: HttpCode.OK,
        data: {
            message: `Only ${Subscription.BUSINESS}`,
        },
    });
};

module.exports = {
    signup,
    login,
    logout,
    current,
    updateSubscription,
    onlyStarter,
    onlyPro,
    onlyBusiness,
};