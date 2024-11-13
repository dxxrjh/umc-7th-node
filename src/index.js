import cors from "cors";
import dotenv from "dotenv";
import express from 'express'; // -> ES Module
import {handleUserSignUp} from "./controllers/user.controller.js";
import { handleUserReview, handleListShopReview, handleListUserReview } from "./controllers/review.controller.js";
import { handleListShopMission, handleShopMission } from "./controllers/mission.controller.js";
import { handleCompleteMission, handleStartMission } from "./controllers/usermission.controller.js";

dotenv.config();

const app = express()
const port = process.env.PORT;

/* 공통 응답을 사용할 수 있는 헬퍼 함수 등록 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});


app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post("/users",handleUserSignUp);
app.post("/shop/:shopId/review",handleUserReview);
app.get("/users/reviews",handleListUserReview);
app.get("/shop/:shopId/reviews",handleListShopReview);
app.post("/shop/:shopId/mission",handleShopMission);
app.get("/shop/:shopId/missions",handleListShopMission);
app.post("/users/mission",handleStartMission);
app.patch("/users/mission/complete", handleCompleteMission);

/* 전역 오류를 처리하기 위한 미들웨어 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})