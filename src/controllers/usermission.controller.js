import { StatusCodes } from "http-status-codes";
import { startMission } from "../services/usermission.service.js";
import { completeMission } from "../services/usermission.service.js";

// 미션 도전 시작
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

// 미션 완료
export const handleCompleteMission = async (req, res) => {
    const { missionId } = req.body; // 요청 본문에서 missionId 가져오기

    if (!missionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "missionId가 필요합니다." });
    }

    try {
        // 미션 상태 업데이트
        const result = await completeMission(missionId);
        
        if (!result) {
            return res.status(404).json({ error: "미션을 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "미션이 완료되었습니다." });
    } catch (err) {
        res.status(500).json({ error: `서버 오류: ${err.message}` });
    }
};
