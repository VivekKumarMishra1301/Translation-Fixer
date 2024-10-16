const express=require('express');

const router=express.Router();
const blogMapper = require('../controller/blogMapper.js');
router.post('/url',blogMapper);

module.exports=router;