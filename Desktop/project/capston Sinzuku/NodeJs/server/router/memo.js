var express = require("express");
var router = express.Router();
var db = require("../database/mysql");
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));

// 메모 작성
// videoId : 비디오 ID
// userId : 유저 ID
router.post("/write/:videoId/:stdId", function (req, res, next) {
    let content = req.body.data.content;

    db.query(
        `SELECT * FROM memo WHERE videoId=? AND stdId=?`,
        [req.params.videoId, req.params.stdId],
        function (error, results) {
            if (error) {
                throw error;
            } else {
                if (results.length > 0) {
                    db.query(
                        `UPDATE memo set content=? WHERE videoId=? AND stdId=?`,
                        [content, req.params.videoId, req.params.videoId],
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
                } else {
                    db.query(
                        `INSERT INTO memo (content, videoId, stdId) VALUES (?, ?, ?)`,
                        [content, req.params.videoId, req.params.stdId],
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
                        }
                    );
                }
            }
        }
    );
});

// 메모 가져오기
// vidoeId : 비디오 ID
// userId : 유저 ID
router.post("/get/:videoId/:stdId", function (req, res, next) {
    db.query(
        `SELECT * FROM memo WHERE videoId=? AND stdId=?`,
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


module.exports = router;
