import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
    addUser,
    getUser,
    getUserPreferenceById,
    setPreference
} from "../repositories/user.repository.js";

export const userSignUp=async(data)=>{
    const joinUserId=await addUser({
        name: data.name,
        gender: data.gender,
        birthday: data.birthday,
        address: data.address || "",
        email: data.email,
        phone_num: data.phone_num
    });
    
    if(joinUserId===null){
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

    for(const preference of data.preferences){
        await setPreference(joinUserId, preference);
    }

    const user=await getUser(joinUserId);
    const preferences=await getUserPreferenceById(joinUserId);

    return responseFromUser({ user, preferences });
}
