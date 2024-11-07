import { prisma } from "../db.config.js";

// Review Data 삽입
export const addReview = async (data, req) => {
    const shopId = req.params.shopId;
    const userId = 10; // 하드코딩된 user_id
    const { rate, content } = data; // userId를 제거하고, rate와 content만 가져옴

    try {
        // 가게 존재 여부 확인
        const shop = await prisma.shop.findUnique({
            where: { id: shopId }
        });

        // shop이 없을 경우
        if (!shop) {
            return null;
        }

        // 리뷰 삽입
        const createdReview = await prisma.review.create({
            data: {
                user_id: userId,
                shop_id: shopId,
                rate,
                content
            }
        });

        console.log("Adding review with data:", data);

        return createdReview.id; // 새로 생성된 리뷰의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    }
};

// Review 정보 얻기
export const getReview = async (reviewId) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            return null; // 리뷰가 없는 경우
        }

        console.log("Retrieved review:", review);

        return review;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
        );
    }
};

// 가게 리뷰 목록 조회
export const getAllShopReviews = async (shopId, cursor) => {
    console.log("Cursor:", cursor);
    const reviews = await prisma.review.findMany({
        select: {
            id: true,
            rate: true,
            content: true,
            shop_id: true,
            user_id: true,
            SHOP: {
                select: {
                    name: true,  // 가게 이름 포함
                },
            },
            USER: {
                select: {
                    name: true,  // 유저 이름 포함
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
    return reviews;
};
