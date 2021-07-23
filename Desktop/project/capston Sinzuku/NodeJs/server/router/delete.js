var express = require("express");
var router = express.Router();
var db = require("../database/mysql");

// router.use(bodyParser.urlencoded({ extended: false }));

// 나의 질문 삭제
// fileId : 파일 ID
router.post("/myquestion/:fileId", function (req, res, next) {
    db.query(`DELETE FROM allfiledata WHERE id=?`, [req.params.fileId], function (error, results) {
        if (error) {
            throw error;
        } else {2
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.json({
                result: true,
            });
        }
    });
});

// 수업 자료 삭제
// fileId : 파일 ID
router.post("/teachmeterial/:fileId", function (req, res, next) {
    db.query(`DELETE FROM allfiledata WHERE id=?`, [req.params.fileId], function (error, results) {
        if (error) {
            throw error;
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.json({
                result: true,
            });
        }
    });
});

// 영상 삭제
// fileId : 영상 ID
router.post("/video/:fileId", function (req, res, next) {
    db.query(`DELETE FROM allfiledata WHERE id=?`, [req.params.fileId], function (error, results) {
        if (error) {
            throw error;
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.json({
                result: true,
            });
        }
    });
});

router.post("/class/:classId", function (req, res, next) {
    console.log(req.params)
    db.query(`DELETE FROM classdata WHERE id=?`, [req.params.classId], function (error, results) {
        if (error) {
            throw error;
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.json({
                result: true,
            });
        }
    });
});

// 질문 전체 삭제
// classId : 과목 ID
router.post("/allquestion/:classId", function (req, res, next) {
    db.query(
        `DELETE FROM allfiledata WHERE registSubject=? AND fileType=2`,
        [req.params.classId],
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

// 소속된 학생 제거
// userId : 학생 ID
// classId : 과목 ID
router.post("/student/:userId/:classId", function (req, res, next) {
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
                    result: true,
                });
            }
        }
    );
});

module.exports = router;
