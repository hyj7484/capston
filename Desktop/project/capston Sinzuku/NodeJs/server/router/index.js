var express = require("express");
var router = express.Router();
var db = require("../database/mysql");


// 로그인
// req.query.mail : 메일 주소
// true : 첫 방문
// flase : 재방문

router.post("/login", function (req, res) {
  console.log(req)
    db.query(
        `SELECT * FROM userdata WHERE userMail=?`,
        [req.body.data.mail],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                if (results.length <= 0) {
                    // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                    console.log(results)
                    console.log("0");
                    res.json({
                        result: false,
                    });
                } else {
                    // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                    console.log(results);
                    res.json({
                        result: results,
                    });
                }
            }
        }
    );
});

// 정보 추가 기입
// req.query.data.id : 학번
// req.query.data.name : 이름
// req.query.data.type : 학생 or 교수
// req.query.data.mail : 메일
// req.query.data.phone : 전화번호
router.post("/addinfo", function (req, res) {
    const data = req.body.data;
    const userNum = Number(data.userNum),
        userName = data.userName,
        userType = data.userType,
        userMail = data.userMail,
        userPhone = data.userPhone;

    console.log(data);
    console.log(typeof userNum);

    db.query(
        `INSERT INTO userdata (userNum, userName, userType, userMail, userPhone) VALUES(?, ?, ?, ?, ?)`,
        [userNum, userName, userType, userMail, userPhone],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.json({
                    result: results,
                });
            }
        }
    );
});

module.exports = router;
