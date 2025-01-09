import { responseFromUser, responseFromMissions } from "../dtos/mission.dto.js";
import { NonExistingShopError } from "../errors.js";
import {
    addMission,
    getMission,
    getAllShopMissions
} from "../repositories/mission.repository.js";

export const shopMission = async (req) => {
    const body = req.body;
    const shopId = req.params.shopId; // shopId를 여기에 추가

    // 미션 추가
    const joinShopMission = await addMission(body, req); // req를 넘김

    // 미션이 성공적으로 추가되었는지 확인
    if (joinShopMission === null) {
        throw new NonExistingShopError("존재하지 않는 가게입니다.", data);
    }

    // 추가된 미션을 ID로 조회
    const mission = await getMission(joinShopMission);

    // 응답 반환
    return responseFromUser({ mission });
};


export const listShopMission = async(shopId, cursor) => {
    const missions=await getAllShopMissions(shopId, cursor);
    return responseFromMissions(missions);
};