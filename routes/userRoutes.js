const express = require('express');
const router = express.Router();
const { createLogin, createLogout, createRegister, myProfile, authCheck } = require('../controller/userController');
const authenticateToken = require('../middleware/authenticateToken');


router.route('/register').post(createRegister);
router.route('/login').post(createLogin);
router.route('/logout').post(createLogout);
router.route('/myprofile').get(authenticateToken, myProfile);


module.exports = router;