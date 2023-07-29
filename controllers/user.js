import { errorResponse, successResponse } from "../helpers/responses.js"
import Tasks from "../models/task.js";
import Users from "../models/user.js"

export const getAllSubadmin = async (req, res) => {
    try {
        let subadmins = await Users.find({ type: "SUBADMIN" });
        successResponse(res, "Subadmin List", subadmins)
    } catch (err) {
        errorResponse(res, err?.message)
    }
}


export const getUserDetails = async (req, res) => {
    try {
        const { user_id } = req.query;
        const { id } = req.userData;
        let user = await Users.findById({ _id: user_id });
        if (!user) {
            errorResponse(res, "User Not Found");
        } else {
            let tasks = await Tasks.find({ user_id, subadmin_id: id });
            successResponse(res, "Subadmin List", { user, tasks })
        }
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        const { type } = req.userData;
        if (type !== "ADMIN") {
            errorResponse(res, "Not Allowed");
            return;
        }
        const subadmin = await Users.findByIdAndDelete(id);
        if (!subadmin) {
            errorResponse(res, "User not found");
            return;
        }
        successResponse(res, "User deleted successfully");
    } catch (err) {
        errorResponse(res, err?.message)
    }
}