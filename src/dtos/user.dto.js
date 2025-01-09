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
  const preferFoods = preferences.map(
    (preference) => preference.CATEGORY.name
  );

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};