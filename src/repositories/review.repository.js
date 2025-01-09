import { prisma } from "../db.config.js";

// Review Data 삽입
export const addReview = async (data, req) => {
    const shopId = req.params.shopId;
    const userId = req.user?.id || req.session?.userId;
    const { rate, content } = data;

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

// 사용자 리뷰 목록 조회
export const getAllUserReviews = async (userId, cursor) => {
    console.log("Cursor:", cursor);

    // 커서 값이 문자열로 들어올 수 있기 때문에 정수로 변환
    const cursorValue = cursor ? parseInt(cursor) : undefined;

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
            user_id: userId,
            id: cursorValue ? { gt: cursorValue } : undefined, // 커서가 있을 경우 id를 기준으로 페이지네이션
        },
        orderBy: { id: "asc" },  // 리뷰 id 기준 오름차순 정렬
        take: 3,  // 한 번에 3개의 리뷰만 가져옴
    });

    return reviews;
};
