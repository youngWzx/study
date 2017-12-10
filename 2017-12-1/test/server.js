const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req, res)=>{
    const { pathname, query } = url.parse(req.url, true);

    fs.readFile(`./www/${pathname}`, (err, data)=>{
        if (err) {
            res.writeHead(404);
            res.write('Not found');
        } else {
            res.write(data);
        }
        res.end();
    })
})

server.listen(8080);