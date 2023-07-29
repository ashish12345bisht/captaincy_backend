import sendMail from "../helpers/external.js";
import { errorResponse, successResponse } from "../helpers/responses.js";
import Users from "../models/user.js";
import { getHashPassword, getJwtToken, getRandomPassword, verifyPassword } from "../services/auth.js";

export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const emailExists = await Users.findOne({ email });
        if (emailExists) {
            errorResponse(res, "Email Already Exists");
        } else {
            let hashPass = await getHashPassword(password);
            let jwt = await getJwtToken(email, 1)
            const newUser = new Users({
                name,
                email,
                password: hashPass,
                status: "active",
                token: jwt,
                online_status: "offline",
                type: "TEAM_MEMBER"
            })
            newUser.save();
            successResponse(res, "Registered Successfully", newUser)
        }
    } catch (err) {
        errorResponse(res, err?.message)
    }
}


export const login = async (req, res) => {
    try {
        let { email, password, login_time } = req.body;
        const emailExists = await Users.findOne({ email });
        if (!emailExists) {
            errorResponse(res, "Email Does Not Exists");
        } else {
            let passwordMatch = await verifyPassword(password, emailExists?.password);
            if (!passwordMatch) {
                errorResponse(res, "Passwords dont match");
            } else {
                let jwt = await getJwtToken(email, emailExists?.id, emailExists?.type, login_time)
                emailExists.token = jwt;
                emailExists.save();
                let result = {
                    id: emailExists._id,
                    name: emailExists.name,
                    email: emailExists.email,
                    token: jwt,
                    online_status: "online",
                    type: emailExists.type
                }
                successResponse(res, "Login Successfull", result);
            }
        }
    } catch (err) {
        errorResponse(res, err?.message);
    }
}


export const newUser = async (req, res) => {
    try {
        let { name, email, type } = req.body;
        const emailExists = await Users.findOne({ email });
        if (emailExists) {
            errorResponse(res, "Email Already Exists");
        } else {
            let randomPassword = await getRandomPassword();
            let hashPass = await getHashPassword(randomPassword);
            let jwt = await getJwtToken(email, type, 1)
            const newUser = new Users({
                name,
                email,
                password: hashPass,
                status: "active",
                token: jwt,
                online_status: "offline",
                type: "SUBADMIN",
                team_id: type,

            })
            newUser.save();
            sendMail(email, randomPassword).catch(err => console.log(err));
            successResponse(res, "Registered Successfully", newUser)
        }
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const addSubadmin = async (req, res) => {
    try {
        let { name, email } = req.body;
        const emailExists = await Users.findOne({ email });
        const admin = await Users.findOne({ subadmin_id: "0" })
        if (emailExists) {
            errorResponse(res, "Email Already Exists");
        } else {
            let randomPassword = await getRandomPassword();
            let hashPass = await getHashPassword(randomPassword);
            // let jwt = await getJwtToken(email, type, 1);
            const newUser = new Users({
                name,
                email,
                password: hashPass,
                status: "active",
                token: "NULL",
                online_status: "offline",
                type: "SUBADMIN",
                subadmin_id: admin.id
            })
            newUser.save();
            sendMail(email, randomPassword).catch(err => console.log(err));
            successResponse(res, "New Sub Admin Created", newUser)
        }
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const changePassword = async (req, res) => {
    try {
        let { old_password, new_password } = req.body;
        let { id } = req.userData;

        const user = await Users.findById(id);

        if (!user) {
            return res.json({ status: 404, message: 'User not found' });
        }

        if (user.type === "ADMIN") {
            return res.json({ status: 400, message: 'Admin Password cannot be changed' });
        }

        const isPasswordValid = await verifyPassword(old_password, user.password);

        if (!isPasswordValid) {
            return res.json({ status: 400, message: 'Invalid old password' });
        }

        let hashedPassword = await getHashPassword(new_password);
        user.password = hashedPassword;
        await user.save();
        successResponse(res, "Password updated successfully");
    } catch (err) {
        errorResponse(res, err?.message)
    }
}