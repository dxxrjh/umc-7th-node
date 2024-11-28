import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { prisma } from "./db.config.js";

dotenv.config();

export const googleStrategy = new GoogleStrategy (
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email","profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        return googleVerify(profile)
            .then((user)=>cb(null,user))
            .catch((err)=>cb(err));
    }
);

const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error(`profile.email was not found: ${profile}`);
    }
  
    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
      return { id: user.id, email: user.email, name: user.name };
    }
  
    const created = await prisma.user.create({
      data: {
        email,
        name: profile.displayName,
        gender: "추후 수정",
        birthday: new Date(1970, 0, 1),
        address: "추후 수정",
        phone_num: "추후 수정",
      },
    });
  
    return { id: created.id, email: created.email, name: created.name };
  };

  export const kakaoStrategy = new KakaoStrategy(
    {
      clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
      clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET, // 카카오는 Client Secret이 필수가 아님
      callbackURL: "http://localhost:3000/oauth2/callback/kakao",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await kakaoVerify(profile);
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  );
  
  const kakaoVerify = async (profile) => {
    const kakaoAccount = profile._json.kakao_account;
    const email = kakaoAccount?.email || null; // 이메일이 없을 경우 null로 설정
    const name = profile.displayName || profile.username || "카카오 사용자";
  
    if (!email) {
      console.warn("Email not provided by Kakao:", profile._json);
      // 이메일 대신 카카오 ID를 활용하여 사용자 생성
      const userId = `kakao_${profile.id}`;
  
      let user = await prisma.user.findFirst({ where: { email: userId } });
      if (!user) {
        // 새 사용자 생성
        user = await prisma.user.create({
          data: {
            email: userId, // 이메일 대신 고유한 카카오 ID 사용
            name,
            gender: "추후 수정",
            birthday: new Date(1970, 0, 1),
            address: "추후 수정",
            phone_num: "추후 수정",
          },
        });
      }
  
      return { id: user.id, email: user.email, name: user.name };
    }
  
    // 기존 사용자 찾기
    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      // 새 사용자 생성
      user = await prisma.user.create({
        data: {
          email,
          name,
          gender: "추후 수정",
          birthday: new Date(1970, 0, 1),
          address: "추후 수정",
          phone_num: "추후 수정",
        },
      });
    }
  
    return { id: user.id, email: user.email, name: user.name };
  };
  