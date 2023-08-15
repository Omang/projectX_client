const express =require('express');
const router = express.Router();
const {register, login, verifyuser, paymentcheck, forgotpassword, paymodule, updateprofile} = require('../controllers/UserController');



router.post('/register',register);
router.post('/login', login);
router.put('/updateprofile',updateprofile);
router.put('/pay',paymodule);
router.put('/verifyuser/:id', verifyuser);
router.get('/passwordreset', forgotpassword);
router.get('/paymentcheck', paymentcheck);

module.exports = router;

