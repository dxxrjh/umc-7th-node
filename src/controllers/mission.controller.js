import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { shopMission } from "../services/mission.service.js";

export const handleShopMission = async (req, res, next) => {
    console.log("미션 추가를 요청했습니다!");
    console.log("body: ", req.body);
    console.log("shopId: ", req.params.shopId); // shopId 로그 추가

    if (!req.params.shopId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "shopId가 필요합니다." });
    }

    const mission = await shopMission(req); // 변경: req를 shopMission에 전달
    console.log("Response Mission:", mission);
    res.status(StatusCodes.OK).json({ result: mission });
};