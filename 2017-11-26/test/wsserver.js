const http = require('http');
const fs = require('fs');
const url = require('url');
const io = require('socket.io');

let server = http.createServer((req, res) => {
    const {pathname, query}=url.parse(req.url, true);

    fs.readFile(`./www/${pathname}`, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.write('Not found');
        }else{
            res.write(data);
        }    
        res.end();
    });
});

server.listen(8890);

let ioServer = io(server);
let aSock = {};
ioServer.on('connection', sock => {
    sock.on('login', name => {
        if (!aSock[`${sock.id}`]) {
            aSock[`${sock.id}`] = {
                id: sock.id,
                name,
            };
        }
    });
    sock.on('push', str => {
        console.log(aSock);
        Object.keys(aSock).forEach(id => {
            if (id == aSock.id) {
                return;
            }
            
            sock.to(id).emit('push_ret', str);
        });  
    });
    sock.on('disconnect', () => {
        delete aSock[`${sock.id}`];
    });
});