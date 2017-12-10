const express = require('express');
const multer = require('multer');

let server = express();
let multerObj = multer({dest:'./www/upload'});

server.post('/upload', multerObj.any(), (req, res) => {
    console.log(req.files);
    res.send('ok');
});

server.listen(8080);
server.use(express.static('./www/'));
