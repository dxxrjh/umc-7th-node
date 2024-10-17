export const bodyToUser=(body) => {
    const birthday=new Date(body.birthday);

    return{
        name: body.name,
        gender: body.gender,
        birthday,
        address: body.address || "",
        email: body.email,
        phone_num: body.phone_num,
        preferences: body.preferences
    }
}

export const responseFromUser = ({ user, preferences }) => {
    return {
      name: user.name,
      gender: user.gender,
      birthday: user.birthday,
      address: user.address,
      email: user.email,
      phone_num: user.phone_num,
      preferences: preferences.map((preference) => ({
        id: preference.id,
        name: preference.name,
      })),
    };
  };