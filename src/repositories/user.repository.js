import { pool } from "../db.config.js";

//User Data 삽입
export const addUser = async(data) => {
    const conn=await pool.getConnection();

    try{
        const [confirm]=await pool.query(
            'SELECT EXISTS(SELECT 1 FROM USER WHERE email = ?) as isExistEmail;', data.email
        );

        if(confirm[0].isExistEmail){
            return null;
        }

        const [result]=await pool.query(
            'INSERT INTO USER (name, gender, birthday, address, email, phone_num) VALUES(?,?,?,?,?,?);',
            [
                data.name,
                data.gender,
                data.birthday,
                data.address,
                data.email,
                data.phone_num,
            ]
        );
        return result.insertId;
    } catch(err){
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally{
        conn.release();
    }
};

//사용자 정보 얻기
export const getUser=async(userId) => {
    const conn=await pool.getConnection();
    
    try{
        const[user]=await pool.query('SELECT * FROM USER WHERE id= ?;', userId);
        console.log(user);
    
        if(user.length==0){
            return null;
        }

        return user;
    } catch(err){
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

//음식 선호 카테고리 매핑
export const setPreference=async(userId, foodCategoryId) => {
    const conn=await pool.getConnection();

    try{
        await pool.query(
            `INSERT INTO PREFERENCE(category_id, user_id) VALUES(?,?);`,
            [foodCategoryId,userId]
        );
        return;
    } catch(err){
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

//사용자 선호 카테고리 반환
export const getUserPreferenceById=async(userId) => {
    const conn=await pool.getConnection();
    
    try{
        const [preferences] = await pool.query(
            `SELECT pf.id, pf.category_id, pf.user_id, ct.name 
             FROM PREFERENCE pf 
             JOIN CATEGORY ct ON pf.category_id = ct.id 
             WHERE pf.user_id = ? 
             ORDER BY pf.category_id ASC;`,
            [userId]
        );
        
        return preferences;
    } catch(err){
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        )
    } finally {
        conn.release();
    }
};
