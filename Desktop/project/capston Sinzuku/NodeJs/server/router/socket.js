var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// var cors = require("cors");
var db = require("../database/mysql");
const express = require('express');
const app = express();

// view engine setup
// 엔진 템플릿 설정 구간
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware 설정 구간
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());

/*** Socket.IO 추가 *
**/

// app.io = require("socket.io")();
//
// var globalIoSocket;
// app.io.on("connection", function (socket) {
//     console.log("connected Socket.IO : " + socket.id);
//     globalIoSocket = socket;
//
//     // 방 참가
//     globalIoSocket.on("joinRoom", function (data) {
//         console.log("join Room Success : " + data.roomId);
//         globalIoSocket.join(data.roomId);
//         if (data.type == "student") {
//             db.query(
//                 "SELECT userName FROM userdata WHERE id=?",
//                 [data.id],
//                 function (error, results) {
//                     if (error) {
//                         throw error;
//                     } else {
//                         console.log(results);
//                         joinRoom(results[0].userName);
//                     }
//                 }
//             );
//         }
//     });
//
//     // 손 들기
//     // React에서 받아서 C#으로 전달
//     // 전원 손 내리기 는 stdId를 all로 전달
//     globalIoSocket.on("handsup", function (data) {
//         console.log("handsup");
//         console.log(data);
//         handsup();
//         console.log(typeof data.roomId);
//         app.io.sockets
//             .in(data.roomId)
//             .emit("handsup", { roomId: data.roomId, bool: data.bool, stdId: data.stdId });
//     });
//
//     // 학생의 요청
//     globalIoSocket.on("markerReq", function (data) {
//         console.log("markerReq");
//         console.log(data);
//         app.io.sockets
//             .in(data.roomId)
//             .emit("markerReq", { roomId: data.roomId, stdId: data.stdId });
//     });
//
//     // 교수님의 응답
//     globalIoSocket.on("markerRes", function (data) {
//         console.log("markerRes");
//         console.log(data);
//         app.io.sockets
//             .in(data.roomId)
//             .emit("markerRes", { roomId: data.roomId, stdId: data.stdId, time: data.time });
//     });
//
//     // 방 종료
//     globalIoSocket.on("endRoom", function (data) {
//         console.log("endRoom");
//         console.log(data);
//         app.io.sockets.in(data.roomId).emit("endRoom", { roomId: data.roomId });
//     });
//
//     // 마킹 시간 기록
//     // Ract 교수님 페이지에서 React 학생 페이지로
//     globalIoSocket.on("marked", function (data) {
//         db.query(
//             `INSERT INTO tag (tag, videoId) VALUES(?, ?)`,
//             [data.tag, data.videoId],
//             function (error, results) {
//                 if (error) {
//                     throw error;
//                 }
//             }
//         );
//     });
//
//     // force client disconnect from server
//     globalIoSocket.on("forceDisconnect", function () {
//         globalIoSocket.disconnect();
//     });
//
//     globalIoSocket.on("disconnect", function () {
//         console.log("user disconnected: " + globalIoSocket.name);
//     });
// });
//
// /*** TCP Socket 추가 ***/
// var net = require("net");
//
// var tcpServer = net.createServer();
// var globalTcpSocket;
//
// function joinRoom(userName) {
//     console.log("TCP socket server joinRoom");
//     console.log(userName);
//     globalTcpSocket.write("userName-");
//     globalTcpSocket.write(userName);
//     globalTcpSocket.end();
// }
//
// function handsup() {
//     console.log("TCP socket sever handsUp");
//     globalTcpSocket.write("hand");
//     globalTcpSocket.end();
// }
//
// tcpServer.on("connection", function (socket) {
//     globalTcpSocket = socket;
//     console.log("TCP socket server connected");
//     globalTcpSocket.setEncoding("utf-8");
//
//     globalTcpSocket.on("data", function (data) {
//         let msg = data.toString().trim();
//         console.log(data);
//         let arr = msg.split("-");
//         console.log(arr[0]);
//         console.log(arr[0].length);
//         console.log(typeof arr[0]);
//         console.log(arr[1]);
//         console.log(arr[1].length);
//         console.log(typeof arr[1]);
//         if (arr[0] == "list") {
//             db.query(
//                 `SELECT ud.userName FROM usertoclass AS utd JOIN userdata AS ud ON utd.userId=ud.id WHERE utd.classId=? AND utd.includeClass=1 AND ud.userType='student'`,
//                 [arr[1]],
//                 function (error, results) {
//                     if (error) {
//                         throw error;
//                     } else {
//                         let result = "";
//                         for (let i = 0; i < results.length; i++) {
//                             result += results[i].userName + "-";
//                         }
//                         console.log(result);
//                         globalTcpSocket.write("list-");
//                         globalTcpSocket.write(result);
//                         globalTcpSocket.end();
//                         db.query(
//                             `UPDATE classdata SET classOnline=1 WHERE id=?`,
//                             [arr[1]],
//                             function (error2, results2) {
//                                 if (error2) {
//                                     throw error2;
//                                 }
//                             }
//                         );
//                     }
//                 }
//             );
//         } else if (arr[0] === "handreset") {
//             console.log("handreset");
//             app.io.sockets
//                 .in(Number(arr[1]))
//                 .emit("handsup", { roomId: arr[1], bool: false, stdId: "all" });
//             globalTcpSocket.end();
//         } else if (arr[0] === "endroom") {
//             db.query(
//                 `UPDATE classdata SET classOnline=0 WHERE id=0`,
//                 [arr[1]],
//                 function (error, results) {
//                     throw error;
//                 }
//             );
//             console.log("endroom");
//             app.io.sockets.in(Number(arr[1])).emit("endRoom", { roomId: arr[1] });
//             globalTcpSocket.write("end");
//             globalTcpSocket.end();
//         }
//     });
//
//     globalTcpSocket.on("drain", function () {
//         console.log("Empty Socket");
//     });
//
//     globalTcpSocket.on("close", function () {
//         globalTcpSocket.write("Error Socket");
//     });
//
//     globalTcpSocket.on("timeout", function () {
//         globalTcpSocket.write("Timeout Socket");
//     });
// });

module.exports = (server) => {
  var globalIoSocket;
  app.io = require('socket.io')(server, {
    cors : {origin : '*'}
  });

  app.io.on('connection', socket => {
    console.log('user socket io connect');
    globalIoSocket = socket;

    globalIoSocket.on('joinRoom', (data) => {
      console.log(`join room success : ${data.roomId}`);
      const room = socket.room = data.roomId;
      globalIoSocket.join(room);
      if (data.type == "student") {
          db.query(
              "SELECT userName FROM userdata WHERE id=?",
              [data.id],
              function (error, results) {
                  if (error) {
                      throw error;
                  } else {
                      console.log(results);
                      joinRoom(results[0].userName);
                  }
              }
          );
      }
    });

    globalIoSocket.on('handsup', (data) => {
        console.log('handsUp');
        handsup();        // TCP 쪽 함수 ?
        app.io.sockets.in(data.roomId).emit('handsup', {roomdId : data.roomId, bool : data.bool, stdId : data.stdId });
    });

    globalIoSocket.on("markerReq", function (data) {
        console.log("markerReq");
        app.io.sockets
            .in(data.roomId)
            .emit("markerReq", { roomId: data.roomId, stdId: data.stdId });
    });

    globalIoSocket.on("markerRes", function (data) {
        console.log("markerRes");
        console.log(data);
        app.io.sockets
            .in(data.roomId)
            .emit("markerRes", { roomId: data.roomId, stdId: data.stdId, time: data.time });
    });


    globalIoSocket.on("endRoom", function (data) {
        console.log("endRoom");
        console.log(data);
        app.io.sockets.in(data.roomId).emit("endRoom", { roomId: data.roomId });
    });

    globalIoSocket.on("marked", function (data) {
        db.query(
            `INSERT INTO tag (tag, videoId) VALUES(?, ?)`,
            [data.tag, data.videoId],
            function (error, results) {
                if (error) {
                    throw error;
                }
            }
        );
    });

    // force client disconnect from server
    globalIoSocket.on("forceDisconnect", function () {
        globalIoSocket.disconnect();
    });

    globalIoSocket.on("disconnect", function () {
        console.log("user disconnected: " + globalIoSocket.name);
    });
  });
  /*** TCP Socket 추가 ***/
  var net = require("net");

  var tcpServer = net.createServer();
  var globalTcpSocket;

  function joinRoom(userName) {
      /*
          예외 처리할 것 to 정원
      */
      console.log("TCP socket server joinRoom");
      console.log(userName);
      globalTcpSocket.write("userName-");
      globalTcpSocket.write(userName);
      globalTcpSocket.end();
  }

  function handsup() {
      console.log("TCP socket sever handsUp");
      globalTcpSocket.write("hand");
      globalTcpSocket.end();
  }

  tcpServer.on("connection", function (socket) {
      globalTcpSocket = socket;
      console.log("TCP socket server connected");
      globalTcpSocket.setEncoding("utf-8");

      globalTcpSocket.on("data", function (data) {
          let msg = data.toString().trim();
          console.log(data);
          let arr = msg.split("-");
          console.log(arr[0]);
          console.log(arr[0].length);
          console.log(typeof arr[0]);
          console.log(arr[1]);
          console.log(arr[1].length);
          console.log(typeof arr[1]);
          if (arr[0] == "list") {
              db.query(
                  `SELECT ud.userName FROM usertoclass AS utd JOIN userdata AS ud ON utd.userId=ud.id WHERE utd.classId=? AND utd.includeClass=1 AND ud.userType='student'`,
                  [arr[1]],
                  function (error, results) {
                      if (error) {
                          throw error;
                      } else {
                          let result = "";
                          for (let i = 0; i < results.length; i++) {
                              result += results[i].userName + "-";
                          }
                          console.log(result);
                          globalTcpSocket.write("list-");
                          globalTcpSocket.write(result);
                          globalTcpSocket.end();
                          db.query(
                              `UPDATE classdata SET classOnline=1 WHERE id=?`,
                              [arr[1]],
                              function (error2, results2) {
                                  if (error2) {
                                      throw error2;
                                  }
                              }
                          );
                      }
                  }
              );
          } else if (arr[0] === "handreset") {
              console.log("handreset");
              app.io.sockets
                  .in(Number(arr[1]))
                  .emit("handsup", { roomId: arr[1], bool: false, stdId: "all" });
              globalTcpSocket.end();
          } else if (arr[0] === "endroom") {
            console.log(arr);
              db.query(
                  `UPDATE classdata SET classOnline=0 WHERE id=?`,
                  [arr[1]],
                  function (error, results) {
                      if ( error) throw error;
                  }
              );
              console.log("endroom");
              app.io.sockets.in(Number(arr[1])).emit("endRoom", { roomId: arr[1] });
              globalTcpSocket.write("end");
              globalTcpSocket.end();
          }
      });

      // globalTcpSocket.on("drain", function () {
      //     console.log("Empty Socket");
      // });
      //
      // globalTcpSocket.on("close", function () {
      //     globalTcpSocket.write("Error Socket");
      // });
      //
      // globalTcpSocket.on("timeout", function () {
      //     globalTcpSocket.write("Timeout Socket");
      // });
  });

  tcpServer.listen('3001', ()=>{
    console.log('Listen to port 3001');
  });
}

// module.exports = app;
