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


//음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
    console.log("로그 여기서부터 시작");
    console.log(prisma.preference);
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


//사용자 선호 카테고리 반환
export const getUserPreferenceById = async () => {
    try {
      const preferences = await prisma.preference.findMany({
        select: {
          id: true,
          user_id: true,
          category_id: true,
          CATEGORY: true,
        },
        where: { user_id: 10 },  // 하드코딩된 user_id
        orderBy: { category_id: "asc" },
      });
    
      return preferences;
    } catch (error) {
      console.error("Error in getUserPreferenceById:", error);
      throw error;
    }
  };
  