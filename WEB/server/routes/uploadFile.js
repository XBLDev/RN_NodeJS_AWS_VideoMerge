
const express = require('express');

const router = new express.Router();

router.post('/upload', (req, res) => {
    console.log('/uploadFile/upload called');

    res.status(200).json({
        message: '/uploadFile/upload called',
    });  

})

module.exports = router;