const express = require('express');
const router = express();
const path = require("path");

const delete1 = require('./router/delete')
const file = require('./router/file')
const index = require('./router/index')
const list = require('./router/list')
const main = require('./router/main')
const mark = require('./router/mark')
const memo = require('./router/memo')
const socket = require('./router/socket')

router.use('/delete', delete1);
router.use('/file', file);
router.use('/index', index);
router.use('/list', list);
router.use('/main', main);
router.use('/mark', mark);
router.use('/memo', memo);
router.use('/socket', socket);

router.get('/test', (req, res, next) =>{
  const server = require('./server');
  const io = require('socket.io')(server, {
    cors : {origin : '*'}
  });

  io.on('connect', socket => {
    console.log('connect user');
    socket.on('join', msg => {
        const name = socket.name = msg.name;
        const room = socket.room = msg.room;

        socket.join(room);
        io.to(room).emit('join', msg);
    });
    socket.on('chat', msg => {
      io.to(socket.room).emit('chat', msg);
    });
  });

});


router.use(express.static(path.join(__dirname, "public")));

module.exports = router;
