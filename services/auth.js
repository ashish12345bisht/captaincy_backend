import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getHashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
        const hash = await bcrypt.hash(password, salt);
        return hash
    } catch (err) {
        console.log(err)
    }
}

export const verifyPassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}

export const getJwtToken = async (email, id = "random", type = "TEAM_MEMBER", time) => {
    return await jwt.sign({ email, id, type }, 'captaincy', { expiresIn: `${time || "1"}h` });
}

export const getRandomPassword = async () => {
    return await Math.random().toString(36).slice(-8);
}