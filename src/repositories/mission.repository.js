import { prisma } from "../db.config.js"; // Prisma client 임포트

// Mission Data 삽입
export const addMission = async (data, req) => {
    const shopId = req.params.shopId;
    const { description, point, due_date } = data;

    // 가게 존재 여부 확인
    const shop = await prisma.shop.findUnique({
        where: { id: shopId },
    });

    // shop이 없을 경우
    if (!shop) {
        return null;
    }

    // 미션 삽입
    try {
        const mission = await prisma.mission.create({
            data: {
                shop_id: shopId,
                description,
                point,
                due_date,
            },
        });

        console.log("Adding mission with data:", data);
        return mission.id; // 새로 생성된 미션의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    }
};

// Mission 정보 얻기
export const getMission = async (missionId) => {
    try {
        const mission = await prisma.mission.findUnique({
            where: { id: missionId },
        });

        if (!mission) {
            return null; // 미션이 없는 경우
        }

        console.log("Retrieved mission:", mission);
        return mission;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    }
};


// 가게 미션 목록 조회
export const getAllShopMissions = async (shopId, cursor) => {
    console.log("Cursor:", cursor);
    const missions = await prisma.mission.findMany({
        select: {
            id: true,
            description: true,
            point: true,
            due_date: true,
            shop_id: true,
            SHOP: {
                select: {
                    name: true,  // 가게 이름 포함
                },
            },
        },
        where: {
            shop_id: shopId,
            id: cursor ? { gt: cursor } : undefined,
        },
        orderBy: { id: "asc" },
        take: 3,
    });
    return missions;
};
