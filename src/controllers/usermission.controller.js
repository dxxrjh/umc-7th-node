// userMission.controller.js
import { StatusCodes } from "http-status-codes";
import { startMission } from "../services/usermission.service.js";

export const handleStartMission = async (req, res, next) => {
    const { missionId } = req.body; // 요청 본문에서 missionId 가져오기

    if (!missionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "missionId가 필요합니다." });
    }

    try {
        const result = await startMission(missionId);
        res.status(StatusCodes.CREATED).json({ result });
    } catch (err) {
        next(err);
    }
};
