const express = require('express');
const router = express.Router();
const { signup,
    login,
    logout,
    current,
    updateSubscription,
    onlyStarter,
    onlyPro,
    onlyBusiness,
    uploadAvatar,
    verifyUser,
    repeatEmailVerifyUser,} = require('../../controllers/users');
const { validateCreateUser, validateLogin, validateUpdateSubscription } = require('../../services/validationUsers');
const guard = require('../../helpers/guard');
const { Subscription } = require('../../helpers/constants');
const role = require('../../helpers/role');
const loginLimit = require('../../helpers/rate-limit-login');
const upload = require('../../helpers/uploads');
const wrapError = require('../../helpers/errorHandler');


router.patch('/', guard, validateUpdateSubscription, wrapError(updateSubscription));
router.post('/signup', validateCreateUser, wrapError(signup));
router.post('/login', validateLogin, loginLimit, wrapError(login));
router.post('/logout', guard, wrapError(logout));
router.get('/current', guard, wrapError(current));
router.get('/starter', guard, role(Subscription.STARTER), wrapError(onlyStarter));
router.get('/pro', guard, role(Subscription.PRO), wrapError(onlyPro));
router.get('/business', guard, role(Subscription.BUSINESS), wrapError(onlyBusiness));
router.patch('/', guard, wrapError(updateSubscription));

router.patch('/avatars', guard, upload.single('avatar'), wrapError(uploadAvatar));

router.get('/verify/:verificationToken', wrapError(verifyUser));
router.post('/verify', wrapError(repeatEmailVerifyUser));

module.exports = router;