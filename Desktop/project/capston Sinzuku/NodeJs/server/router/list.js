var express = require("express");
var router = express.Router();
var db = require("../database/mysql");

// router.use(bodyParser.urlencoded({ extended: false }));

// 과목 리스트
// userID : 유저 ID
router.post("/subject/:userId", function (req, res, next) {
    db.query(
        `SELECT * FROM classdata WHERE id = ANY (SELECT classId FROM usertoclass WHERE userId=? AND includeClass=1)`,
        [req.params.userId],
        function (error, results) {
            if (error) {
                res.send(error);
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.json({
                    result: results,
                });
            }
        }
    );
});

// 학생 리스트
// classID : 과목 ID
router.post("/student/:classId", function (req, res) {
    db.query(
        `SELECT user.id, user.userNum, user.userName, user.userType, user.userMail, user.userPhone, con.includeClass
        FROM usertoclass AS con JOIN userdata AS user ON user.id = con.userId
        WHERE con.classId=? AND user.userType='student'`,
        [req.params.classId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    result: results,
                });
            }
        }
    );
});

// 과목 질문 리스트
// classId : 과목 ID
router.post("/question/:classId", function (req, res, next) {
    db.query(
        `SELECT * FROM allfiledata AS af JOIN question AS qs ON af.id = qs.id WHERE af.fileType=2 AND af.registSubject=?`,
        [req.params.classId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    result: results,
                });
            }
        }
    );
});

// 영상 리스트
// classId : 과목 ID
router.post("/video/:classId/:userId", function (req, res, next) {
    db.query(
        `SELECT * FROM allfiledata AS af JOIN video AS vi ON af.id = vi.videoId WHERE af.fileType=3 AND af.registSubject=? and vi.stdId = ?`,
        [req.params.classId, req.params.userId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    result: results,
                });
            }
        }
    );
});

// 수업 자료 리스트
// classId : 과목 ID
router.post("/teachingmeterial/:classId", function (req, res, next) {
    db.query(
        `SELECT * FROM allfiledata AS af JOIN teachingmeterial AS tm ON af.id = tm.id WHERE af.fileType=1 AND af.registSubject=?`,
        [req.params.classId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    result: results,
                });
            }
        }
    );
});

// 나의 질문 리스트
// userId : 유저 ID
router.post("/myquestion/:userId", function (req, res, next) {
    db.query(
        `SELECT * FROM allfiledata AS af JOIN question AS qs ON af.id = qs.id WHERE af.fileType=2 AND af.registPeople=?`,
        [req.params.userId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                // 서로 다른 서버에서 Ajax 요청할 수 있도록 header 설정
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.json({
                    result: results,
                });
            }
        }
    );
});

module.exports = router;
