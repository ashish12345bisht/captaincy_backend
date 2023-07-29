import { errorResponse, successResponse } from "../helpers/responses.js";
import Tasks from "../models/task.js";

export const addTask = async (req, res) => {
    try {
        const { team_id, user_id, name, description } = req.body;
        const { id } = req.userData;
        const nameExists = await Tasks.findOne({ name });
        if (nameExists) {
            errorResponse(res, "Name Already Exists");
        } else {
            const newTask = new Tasks({
                name,
                description,
                status: "pending",
                team_id,
                user_id,
                subadmin_id: id
            })
            newTask.save();
            successResponse(res, "Task Created Successfully", newTask)
        }
    } catch (err) {
        errorResponse(res, err?.message)
    }
}


export const getAllTasks = async (req, res) => {
    try {
        const { id } = req.userData;
        const allTasks = await Tasks.find({ user_id: id });
        successResponse(res, "Task List", allTasks)
    } catch (err) {
        errorResponse(res, err?.message)
    }
}


export const updateTaskStatus = async (req, res) => {
    try {
        const { status, task_id } = req.body;
        const task = await Tasks.findById({ _id: task_id });
        task.status = status;
        await task.save();
        successResponse(res, "Task List")
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

