const express =require('express');
const router = express.Router();
const {sendcode, verifycode, register, login, verifyuser, paymentcheck, forgotpassword, paymodule, updateprofile} = require('../controllers/UserController');



router.post('/register',register);
router.post('/login', login);
router.put('/updateprofile',updateprofile);
router.put('/pay',paymodule);
router.put('/verifyuser/:id', verifyuser);
router.get('/passwordreset', forgotpassword);
router.get('/paymentcheck', paymentcheck);
router.post('/sendcode', sendcode);
router.post('/verifycode', verifycode);

module.exports = router;

