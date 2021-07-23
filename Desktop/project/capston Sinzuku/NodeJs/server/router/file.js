var express = require("express");
var router = express.Router();
var db = require("../database/mysql");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
const multer = require("multer");

var getDownloadFilename = require("./downloadFile").getDownloadFilename;
// npm install --save multer
// npm install mime
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const url = `${__dirname.split("/").reduce((prev, element, index) => {
              if(element !== "router")
                prev += `/${element}`
              return prev
            })}/public/images`
            cb(null, url);
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}__${file.originalname}`);
        },
    }),
}); //dest : 저장 위치 (root에서 시작된다)

const videoUpload = multer({
  storage: multer.diskStorage({
      destination: function (req, file, cb) {
          const url = `${__dirname.split("/").reduce((prev, element, index) => {
            if(element !== "router")
              prev += `/${element}`
            return prev
          })}/public/images`
          cb(null, url);
      },
      filename: function (req, file, cb) {
          cb(null, `${file.originalname}`);
      },
  }),
});

// router.use(bodyParser.urlencoded({ extended: false }));

// 파일 추가
// userId : 유저 ID
// fileType : 파일 종류
// subjectId : 과목 ID
// fileName : 파일 제목
// 파일 추가
// userId : 유저 ID
// fileType : 파일 종류
// subjectId : 과목 ID
// fileName : 파일 제목
router.post("/add/:userId/:fileType/:classId/", upload.array("file"), function (req, res, next) {
  // 용도가 무엇이야
  // fileType = 1 : 수업 자료실, 2 : 질문, 3 : 영상
  // userId => userId
  // classId = classId
  // fileName => fileName

    // file form data
    const registPeople = Number(req.params.userId);
    const registSubject = Number(req.params.classId);
    const fileType = req.params.fileType;

    const fileName = fileType == 2 ? req.body.data.fileName : req.files[0].originalname ;
    // 질문시 추가 데이터 입력 받기




    db.query(
        `INSERT INTO allfiledata (fileName, registPeople, registSubject, uploadDate, fileType) VALUES (?, ?, ?, now(), ?)`,
        [fileName, registPeople, registSubject, fileType],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                db.query(`SELECT LAST_INSERT_ID() AS LastIndex`, function (error2, results2) {
                    if (error2) {
                        throw error2;
                    } else {

                        if(fileType == 1) {
                            db.query(
                                `UPDATE allfiledata SET fileName=?, uploadDate=now(), fileType=1 WHERE id=?`,
                                [req.files[0].filename, results2[0].LastIndex],
                                function (error, results3) {
                                    if (error) {
                                        throw error;
                                    } else {
                                        db.query(
                                            `INSERT INTO teachingmeterial VALUES (?, 0)`,
                                            [results2[0].LastIndex],
                                            function (error2, results4) {
                                                if (error2) {
                                                    throw error2;
                                                } else {
                                                    res.header("Access-Control-Allow-Origin", "*");
                                                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                                                    res.json({
                                                        result: true,
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        } else if(fileType == 2) {
                          const questionContent = req.body.data.questionContent || "";
                          const questionTitle   = req.body.data.questionTitle   || "";
                            db.query(
                                `UPDATE allfiledata SET fileName=?, uploadDate=now(), fileType=2 WHERE id=?`,
                                [questionTitle, results2[0].LastIndex],
                                function (error, results3) {
                                    if (error) {
                                        throw error;
                                    } else {
                                        db.query(
                                            `INSERT INTO question VALUES (?, ?, 0)`,
                                            [results2[0].LastIndex, questionContent],
                                            function (error2, results4) {
                                                if (error2) {
                                                    throw error2;
                                                } else {
                                                    res.header("Access-Control-Allow-Origin", "*");
                                                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                                                    res.json({
                                                        result: true,
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        } else if(fileType == 3) {
                          db.query(
                            `UPDATE allfiledata SET fileName=?, uploadDate=now(), fileType=3 WHERE id=?`,
                            [req.files[0].filename, results2[0].LastIndex],
                            function (error, results) {
                              if (error) {
                                throw error;
                              } else {
                                db.query(
                                  `SELECT * FROM usertoclass WHERE classid=? and includeClass=1`[registSubject],
                                  function (error2, results2) {
                                    if (error2) {
                                      throw error2;
                                    } else {
                                      for (let i = 0; i < results2.length; i++) {
                                        db.query(
                                          `INSERT INTO video (favorite, videoId, stdId) VALUES (0, ?, ?)`
                                        ),
                                        [results2[0].LastIndex, results2[i].userId],
                                        function (error3, results3) {
                                          if (error3) {
                                            throw error3;
                                          } else {
                                            res.header("Access-Control-Allow-Origin", "*");
                                            res.header("Access-Control-Allow-Headers", "X-Requested-With");
                                            res.json({
                                              result: true,
                                            });
                                          }
                                        };
                        }
                    }
                }
            );
        }
    }
);
                        }
                        // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                        // res.header("Access-Control-Allow-Origin", "*");
                        // res.header("Access-Control-Allow-Headers", "X-Requested-With");
                        // res.json({
                        //     fileId: results2[0].LastIndex,
                        //     questionWho: req.params.userId,
                        // });
                    }
                });
            }
        }
    );
});

router.post("/get/:classId", function (req, res, next) {
    db.query(
        `SELECT * FROM allfiledata WHERE registSubject=? AND fileType=3 ORDER BY uploadDate DESC LIMIT 1`,
        [req.params.classId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    result: results,
                });
            }
        }
    );
});

// 파일 업로드 FORM
router.get("/uploadform/:fileType/:fileId", function (req, res, next) {
    res.send(
        `<form action="../../${req.params.fileType}/${req.params.fileId}" method="post" enctype="multipart/form-data">
        <div>
            <label for="file">Choose file to upload</label>
        </div>
        <div>
            <input type="file" id="file" name="file" multiple>
        </div>
        <div>
            <button>Submit</button>
        </div>
    </form>
    `
    );
});

// 수업 자료 파일 업로드
// fileId : 파일 ID
router.post("/uploadteachingmeterial/:fileId", upload.array("file"), function (req, res, next) {
    db.query(
        `UPDATE allfiledata SET fileName=?, uploadDate=now(), fileType=1 WHERE id=?`,
        [req.files[0].filename, Number(req.params.fileId)],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                db.query(
                    `INSERT INTO teachingmeterial VALUES (?, 0)`,
                    [Number(req.params.fileId)],
                    function (error2, results2) {
                        if (error2) {
                            throw error2;
                        } else {
                            res.header("Access-Control-Allow-Origin", "*");
                            res.header("Access-Control-Allow-Headers", "X-Requested-With");
                            res.json({
                                result: true,
                            });
                        }
                    }
                );
            }
        }
    );
});

// 질문 파일 업로드
// fileId : 파일 ID
router.post("/uploadquestion/:fileId", function (req, res, next) {
    const questionTitle = req.body.data.questionTitle;
    const questionContent = req.body.data.questionContent;

    db.query(
        `UPDATE allfiledata SET fileName=?, uploadDate=now(), fileType=2 WHERE id=?`,
        [questionTitle, Number(req.params.fileId)],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                db.query(
                    `INSERT INTO question VALUES (?, ?, 0)`,
                    [Number(req.params.fileId), questionContent],
                    function (error2, results2) {
                        if (error2) {
                            throw error2;
                        } else {
                            res.header("Access-Control-Allow-Origin", "*");
                            res.header("Access-Control-Allow-Headers", "X-Requested-With");
                            res.json({
                                result: true,
                            });
                        }
                    }
                );
            }
        }
    );
});

router.post("/uploadvideo/:fileId/:classId", videoUpload.array("file"), function (req, res, next) {
    db.query(
        `UPDATE allfiledata SET fileName=?, uploadDate=now(), fileType=3 WHERE id=?`,
        [req.files[0].filename, req.params.fileId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    result: true,
                });
            }
        }
    );
});

// 영상 파일 업로드
// fileID : 파일 ID
// router.post("/uploadvideo/:fileId/:classId", videoUpload.array("file"), function (req, res, next) {
//   db.query(
//     `UPDATE allfiledata SET fileName=?, uploadDate=now(), fileType=3 WHERE id=?`,
//     [req.files[0].filename, req.params.fileId],
//     function (error, results) {
//         if (error) {
//             throw error;
//         } else {
//             db.query(
//                 `SELECT * FROM usertoclass WHERE classId=? and includeClass=1`,
//                 [req.params.classId],
//                 function (error2, results2) {
//                     if (error2) {
//                         throw error2;
//                     } else {
//                         for (let i = 0; i < results2.length; i++) {
//                             db.query(
//                                 `INSERT INTO video (favorite, videoId, stdId) VALUES (0, ?, ?)`,
//                                 [req.params.fileId, results2[i].userId],
//                                 function (error3, results3) {
//                                     if (error3) {
//                                         throw error3;
//                                     } else {
//                                         // res.header("Access-Control-Allow-Origin", "*");
//                                         // res.header(
//                                         //     "Access-Control-Allow-Headers",
//                                         //     "X-Requested-With"
//                                         // );
//                                         // res.json({
//                                         //     result: true,
//                                         // });
//                                     }
//                                 }
//                             );
//                         }
//                     }
//                 }
//             );
//         }
//     }
//   );
// });

router.post("/uploadvideoNODB/:fileId", videoUpload.array("file"), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json({
        result: true,
    });
});

// 영상 파일 소제목 설정
// fileId : 파일 ID
// subTitle : 소제목
router.post("/setsubtitle/:fileId", function (req, res, next) {
    const subTitle = req.body.data.subTitle;

    db.query(
        `UPDATE allfiledata SET subTitle=? WHERE id=?`,
        [subTitle, Number(req.params.fileId)],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                res.json({
                    result: true,
                });
            }
        }
    );
});

// 파일 다운로드
// filePath : 파일 경로
router.get("/download/:fileName", function (req, res, next) {

  const url = `${__dirname.split("/").reduce((prev, element, index) => {
    if(element !== "router")
      prev += `/${element}`
    return prev
  })}/public/images/`;

  const upload_folder = url;

    const file = upload_folder + req.params.fileName; // ex) /upload/files/sample.txt
    console.log(file);
    try {
        if (fs.existsSync(file)) {
            // 파일이 존재하는지 체크
            var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
            var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴

            res.setHeader(
                "Content-disposition",
                "attachment; filename=" + getDownloadFilename(req, filename)
            ); // 다운받아질 파일명 설정
            res.setHeader("Content-type", mimetype); // 파일 형식 지정
            // res.setHeader("Content-disposition", "attachment; filename=" + filename); // 다운받아질 파일명 설정
            // res.setHeader("Content-type", mimetype + " charset=UTF-8"); // 파일 형식 지정

            var filestream = fs.createReadStream(file);
            filestream.pipe(res).on("finish", () => {
                console.log("download complete");
            });
        } else {
            res.send("해당 파일이 없습니다.");
            return;
        }
    } catch (e) {
        // 에러 발생시
        console.log(e);
        res.send("파일을 다운로드하는 중에 에러가 발생하였습니다.");
        return;
    }
});

// 영상 재생 Form
// fileName : 파일 이름
router.get("/gethtmlform/:fileName", function (req, res, next) {
    res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>Movie Player</title>
        </head>
        <body>
            <h1>Movie Player</h1>
            <video width="320" height="240" controls>
                <source src="../getvideo/${req.params.fileName}" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </body>
    </html>
    `);
});

// 비디오 재생 스트림
// fileName : 파일 이름
router.get("/getvideo/:fileName", function (req, res, next) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const path = `${__dirname.split("/").reduce((prev, element, index) => {
      if(element !== "router")
        prev += `/${element}`
      return prev
    })}/public/images`
    const videoPath = `${path}/${req.params.fileName}`;
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });

    videoStream.pipe(res);
});

module.exports = router;
