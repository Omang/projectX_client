const express = require('express');

const router = express.Router();
const {runtest, AiCall, gptschool, gptpublic, gptarticle, gptdaller, gptcontacts} = require('../controllers/AiController.js');

router.get('/', AiCall);
router.post('/school', gptschool);
router.post('/public', gptpublic);
router.post('/article', gptarticle);
router.post('/pictures', gptdaller);
router.post('/phonebook', gptcontacts);
router.post('/runtest', runtest);



module.exports = router;