import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { shopMission, listShopMission } from "../services/mission.service.js";

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

export const handleListShopMission = async (req, res, next) => {
    console.log("Cursor from request:", req.query.cursor);
    const cursorValue = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    console.log("Cursor passed to repository:", cursorValue);  // 레포지토리로 넘겨지는 값 확인
    try {
        const missions = await listShopMission(
            parseInt(req.params.shopId),
            cursorValue
          );

        if (!missions || !missions.data || missions.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No missions found for this shop',
            });
        }

        const missionsArray = Array.isArray(missions.data) ? missions.data : [missions.data];

        // BigInt 값과 다른 필드를 안전하게 처리
        const missionsWithStringifiedBigInt = missionsArray.map(mission => ({
            shop_name: mission.SHOP && mission.SHOP.name ? mission.SHOP.name : "No shop name",
            description: `${mission.description}`,
            point: `${mission.point}`,
        }));

        return res.status(200).json({
            data: missionsWithStringifiedBigInt,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch missions',
            error: error.message,
        });
    }
};