var express = require("express");
var router = express.Router();
var db = require("../database/mysql");

// router.use(bodyParser.urlencoded({ extended: false }));
// 과목 생성 코드
// %% 학기 수정 필요
// subName : 생성할 과목명
// userId : 등록 유저 ID
router.post("/createsub/:userId", function (req, res) {
    const subName = req.body.data.subName;
    db.query(
        `INSERT INTO classdata (className, classRanNum, classSemester, classOnline) VALUES(?, ?, ?, ?)`,
        [subName, 0, "2021-1학기", 0],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                db.query(`SELECT LAST_INSERT_ID() AS LastIndex`, function (error2, results2) {
                    if (error2) {
                        throw error2;
                    } else {
                        db.query(
                            `INSERT INTO usertoclass (userId, classId, includeClass) VALUES (?, ?, 1)`,
                            [req.params.userId, results2[0].LastIndex],
                            function (error3, results3) {
                                if (error3) {
                                    throw error3;
                                } else {
                                    // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                                    res.header("Access-Control-Allow-Origin", "*");
                                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                                    res.json({
                                        subName: subName,
                                        classRanNum: results2.LastIndex,
                                        classSemester: "2021-1학기",
                                        classOnLine: 0,
                                    });
                                }
                            }
                        );
                    }
                });
            }
        }
    );
});

// 과목 신청 ( 학생 )
router.post("/request/:userId/:classId", function (req, res, next) {
    db.query(
        `INSERT INTO usertoclass (userId, classId, includeClass) VALUES (?, ?, 0)`,
        [req.params.userId, req.params.classId],
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

// 과목 이름 변경
// ClassId : 과목 ID
router.post("/updateclassname/:classId", function (req, res, next) {
    db.query(
        "UPDATE classdata SET className=? WHERE id=?",
        [req.body.data.newClassName, req.params.classId],
        function (error, result) {
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

// 유저 정보 수정
// userId : 유저 ID
router.post("/modifyuser/:userId", function (req, res, next) {
    db.query(
        "UPDATE userdata SET userName=?, userMail=?, userPhone=? WHERE id=?",
        [req.body.data.name, req.body.data.mail, req.body.data.phone, req.params.userId],
        function (error, result) {
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

// 과목 가입 수락
// userId : 유저 ID
// classId : 과목 ID
// accept : 수락 여부 ( 1 : 수락, 2 : 거절)
router.post("/accept/:userId/:classId/:accept", function (req, res, next) {
    if (req.params.accept === "1") {
        db.query(
            `UPDATE usertoclass SET includeClass=1 WHERE userId=? AND classId=?`,
            [req.params.userId, req.params.classId],
            function (error, results) {
                if (error) {
                    throw error;
                } else {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                    res.json({
                        result: "accept",
                    });
                }
            }
        );
    } else {
        db.query(
            `DELETE FROM usertoclass WHERE userId=? AND classId=?`,
            [req.params.userId, req.params.classId],
            function (error, results) {
                if (error) {
                    throw error;
                } else {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                    res.json({
                        result: "refuse",
                    });
                }
            }
        );
    }
});

// 유저 정보 표시
// userId : 학생 ID
router.post("/userinfo/:userId", function (req, res, next) {
    db.query(
        `SELECT userNum, userName, userMail, userPhone FROM userdata WHERE id=?`,
        [req.params.userId],
        function (error, results) {
            if (error) {
                res.send(error);
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    userNum: results[0].userNum,
                    userName: results[0].userName,
                    userMail: results[0].userMail,
                    userPhone: results[0].userPhone,
                });
            }
        }
    );
});

// 질문 읽음 표시
router.post("/readquestion/:questionId", function (req, res, next) {
    db.query(
        `UPDATE question SET question.check = 1 WHERE id=?`,
        [req.params.questionId],
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

// 룸 넘버 설정
// classNum : 과목 ID
// roomNum : 룸 넘버
router.post("/insertVideo/:classNum", (req, res, next) => {
    const userId = req.body.userId;
    console.log(userId);

    db.query(
        `INSERT INTO allfiledata (fileName, registPeople, registSubject, uploadDate, fileType) VALUES ("", ?, ?, now(), 3)`,
        [userId, req.params.classNum],
        function (error2, results2) {
            if (error2) {
                throw error2;
            } else {
                db.query(
                    `SELECT * FROM allfiledata WHERE registSubject=? AND fileType=3`,
                    [req.params.classNum],
                    function (error3, results3) {
                        if (error3) {
                            throw error3;
                        } else {
                            db.query(
                                `SELECT * FROM usertoclass WHERE classId=? and includeClass=1`,
                                [req.params.classNum],
                                function (error4, results4) {
                                    if (error4) {
                                        throw error4;
                                    } else {
                                        for (let i = 0; i < results4.length; i++) {
                                            db.query(
                                                `INSERT INTO video (favorite, videoId, stdId) VALUES (0, ?, ?)`,
                                                [
                                                    results3[results3.length - 1].id,
                                                    results4[i].userId,
                                                ]
                                            );
                                        }
                                        res.header("Access-Control-Allow-Origin", "*");
                                        res.header(
                                            "Access-Control-Allow-Headers",
                                            "X-Requested-With"
                                        );
                                        res.json({
                                            videoId: results3[results.langth - 1].id,
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});
//
// router.post('/insertVideo/:classNum', (req, res, next) => {
//   const userId = req.body.userId;
//   db.query(
//       `INSERT INTO allfiledata (fileName, registPeople, registSubject, uploadDate, fileType) VALUES ("", ?, ?, now(), 3)`,
//       [userId ,req.params.classNum],
//       function (error2, results2) {
//           if (error2) {
//               throw error2;
//           } else {
//               db.query(
//                   `SELECT LAST_INSERT_ID() AS LastIndex`,
//                   function (error3, results3) {
//                       if (error3) {
//                           throw error3;
//                       } else {
//                           res.header("Access-Control-Allow-Origin", "*");
//                           res.header("Access-Control-Allow-Headers", "X-Requested-With");
//                           res.json({
//                               videoId: results3[0].LastIndex,
//                           });
//                       }
//                   }
//               );
//           }
//       }
//   );
// });

router.post("/updateroom/:classNum", function (req, res, next) {
    let roomNum = req.body.data.roomNum;

    db.query(
    `UPDATE classdata SET classRanNum=? WHERE id=?`,
    [roomNum, req.params.classNum],
    function (error, results) {
        if (error) {
            throw error;
        } else {
          res.json(true);
        }
    }
  );
});

// 룸 넘버 출력
// classNum : 룸 넘버
router.get("/getroom/:classNum", function (req, res, next) {
  console.log(req.params)
  // req.params.classNum = 3;
    db.query(
        `SELECT classRanNum FROM classdata WHERE id=?`,
        [req.params.classNum],
        function (error, results) {
          console.log(results)
            if (error) {
                throw error;
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    classRanNum: results[0].classRanNum,
                });
            }
        }
    );
});

// videoId,
router.post("/favorite/:videoId/:data", function (req, res, next) {
    const dataSet = req.params.data == 1 ? 0 : 1;
    db.query(
        `UPDATE video SET favorite=? WHERE id=?`,
        [dataSet, req.params.videoId],
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

router.post("/subtitle/:videoId", function (req, res, next) {
    subName = req.body.data.subName;
    db.query(
        `UPDATE video SET subName=? WHERE id=?`,
        [subName, req.params.videoId],
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


router.post("/lastvideoid/:classId", function (req, res, next) {
    db.query(
        `SELECT * FROM allfiledata WHERE registSubject=? and fileType = 3`,
        [req.params.classId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    videoId: results[results.length - 1].id,
                });
            }
        }
    );
});

module.exports = router;
