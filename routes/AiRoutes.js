const express = require('express');

const router = express.Router();
const {AiCall, gptschool, gptpublic, gptarticle, gptdaller} = require('../controllers/AiController.js');

router.get('/', AiCall);
router.post('/school', gptschool);
router.post('/public', gptpublic);
router.post('/article', gptarticle);
router.post('/pictures', gptdaller);


module.exports = router;