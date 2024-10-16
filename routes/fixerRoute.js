const express=require('express');

const router=express.Router();
const fixerController=require('../controller/fixerController.js');
router.put('/urls',fixerController);

module.exports=router;