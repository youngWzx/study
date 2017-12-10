const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req, res) => {
    const {pathname, query}=url.parse(req.url, true);
    if (pathname=='/upload_base64') {
        let str = '';
        req.on('data', data => {
            str=str+data;
        });
        req.on('end', () => {
            str = decodeURIComponent(str);
            str = str.replace(/data:[a-z\-]+(\/[a-z\-]+)?;base64,/i, '');
            console.log(str);
            fs.writeFile(`./www/upload/${Math.random()}`, str, 'base64', err => {
                if (err) {
                    res.writeHead(500);
                    res.write('服务器繁忙');                   
                } else {
                    res.write('ok');
                }
                res.end();
            });
        });
    } else{
        fs.readFile(`./www/${pathname}`, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('Not found');
            }else{
                res.write(data);
            }    
            res.end();
        });
    }
});

server.listen(8890);