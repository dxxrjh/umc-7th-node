import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (user) {
        return null;
    }

    const created = await prisma.user.create({ data: data });
    return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (req, foodCategoryId) => {
  const userId = req.user?.id || req.session?.userId;  // 세션에서 로그인된 userId 가져오기

  if (!userId) {
      throw new Error("로그인되지 않은 사용자입니다.");
  }

  try {
      await prisma.preference.create({
          data: {
              user_id: userId,
              category_id: foodCategoryId,
          },
      });
  } catch (error) {
      console.error('Error in setPreference:', error);
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferenceById = async (req) => {
  const userId = req.user?.id || req.session?.userId;  // 세션에서 로그인된 userId 가져오기

  if (!userId) {
      throw new Error("로그인되지 않은 사용자입니다.");
  }

  try {
      const preferences = await prisma.preference.findMany({
          select: {
              id: true,
              user_id: true,
              category_id: true,
              CATEGORY: true,
          },
          where: { user_id: userId },
          orderBy: { category_id: "asc" },
      });

      return preferences;
  } catch (error) {
      console.error("Error in getUserPreferenceById:", error);
      throw error;
  }
};
