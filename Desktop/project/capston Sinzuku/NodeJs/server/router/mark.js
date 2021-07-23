var express = require("express");
var router = express.Router();
var db = require("../database/mysql");
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));

// 영상 마킹 찍기
// videoId : 영상 ID
// userId : 등록 유저 ID
// tag : 태그 정보
router.post("/insert/:videoId/:stdId", function (req, res, next) {
    const tag = req.body.data.tag;
    db.query(
        `INSERT INTO tag (tag, videoId, stdId) VALUES (?, ?, ?)`,
        [tag, req.params.videoId, req.params.stdId],
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

// 마킹 가져오기
// videoId : 비디오 ID
// userId : 유저 ID
router.post("/get/:videoId/:stdId", function (req, res, next) {
    db.query(
        `SELECT * FROM tag WHERE videoId=? AND stdId=?`,
        [req.params.videoId, req.params.stdId],
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

// 마킹 수정
// markId : 마킹 ID
router.post("/update/:markId", function (req, res, nxet) {
    const mark = req.body.data.mark;

    db.query(
        `UPDATE tag SET tag=? WHERE id=?`,
        [mark, req.params.markId],
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

// 마킹 삭제
// markId : 마킹 ID
router.post("/delete/:markId", function (req, res, next) {
    db.query(`DELETE FROM tag WHERE id=?`, [req.params.markId], function (error, results) {
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

module.exports = router;
