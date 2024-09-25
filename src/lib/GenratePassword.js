export const genratePassword = (length) => {
    // genrate random password
    const charset = "a1b!c2d3efg4hi5jk6lmn7opqr8stu9vw0xy@zAB&CD%EF#GH$IJK%LMNO(PQRST\]UVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;

} 