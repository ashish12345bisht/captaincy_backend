import mongoose from "mongoose";
import { errorResponse, successResponse } from "../helpers/responses.js";
import TeamMembers from "../models/team-member.js";
import Teams from "../models/team.js";
import Users from "../models/user.js";


export const createTeam = async (req, res) => {
    try {
        let { name } = req.body;
        const { id } = req.userData;
        const team = await Teams.findOne({ name });
        if (team) {
            errorResponse(res, "Team Name Already Exists");
        } else {
            const newTeam = new Teams({
                name,
                subadmin_id: id,
                status: "active"
            })
            newTeam.save();
            successResponse(res, "Team Created Successfully", newTeam)
        }
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const editTeam = async (req, res) => {
    try {
        const { name, id } = req.body;
        const team = await Teams.findById(id);
        if (!team) {
            errorResponse(res, "Team not found");
            return;
        }
        const existingTeam = await Teams.findOne({ name });
        if (existingTeam && existingTeam._id.toString() !== id) {
            errorResponse(res, "Team name already exists");
            return;
        }
        team.name = name;
        await team.save();
        successResponse(res, "Team updated successfully", team);
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const getTeamDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const team = await Teams.findById(id);
        if (!team) {
            errorResponse(res, "Team not found");
            return;
        }
        const teamMembers = await TeamMembers.find({ team_id: id });
        let teamIds = teamMembers?.map((item) => (item?.user_id))
        const users = await Users.find({ _id: { $in: teamIds } }).select("name email");
        let result = {
            id: team._id,
            name: team.name,
            teamMembers: users || []
        }
        successResponse(res, "Team details retrieved successfully", result);
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.body;
        const team = await Teams.findByIdAndDelete(id);
        if (!team) {
            errorResponse(res, "Team not found");
            return;
        }
        successResponse(res, "Team deleted successfully");
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const getAllTeams = async (req, res) => {
    try {
        const { skip, limit, search } = req.query;
        const { id } = req.userData
        const skipDocuments = (skip) * limit;
        let result = await Teams.aggregate([
            {
                $match: {
                    name: {
                        $regex: search,
                        $options: 'i'
                    },
                    status: "active",
                    subadmin_id: id
                }
            },
            {
                $facet: {
                    data: [
                        { $skip: skipDocuments },
                        { $limit: parseInt(limit) }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ])

        const data = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;

        // Construct the response object
        let result2 = {
            result: data,
            totalCount: totalCount
        };

        successResponse(res, "Team List", result2)
    } catch (err) {
        errorResponse(res, err?.message)
    }
}


export const getUsers = async (req, res) => {
    try {
        const { skip, limit, search } = req.query;
        const skipDocuments = (skip) * limit;
        let result = await Users.aggregate([
            {
                $match: {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            },
            {
                $facet: {
                    data: [
                        { $skip: skipDocuments },
                        { $limit: parseInt(limit) }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ])
        const data = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;
        let result2 = {
            result: data,
            totalCount: totalCount
        }
        successResponse(res, "User List", result2)
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const { id } = req.body;
        let result = await Users.find({ id, type: "TEAM_MEMBER" }).select('name email')
        successResponse(res, "User List", result)
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const addTeamMembers = async (req, res) => {
    try {
        const { team_id, users } = req.body;
        const { id } = req.userData;
        const teamData = {
            team_id,
            users
        };
        const teamUsersArray = teamData.users.map((user_id) => ({
            team_id: teamData.team_id,
            user_id,
            subadmin_id: id
        }));

        const result = await TeamMembers.insertMany(teamUsersArray);
        successResponse(res, "Users added to Team", result)
    } catch (err) {
        if (err?.code === 11000) {
            successResponse(res, "Users added to Team", {})
        } else {
            errorResponse(res, err?.message)
        }
    }
}

export const getTeamMembers = async (req, res) => {
    try {
        const { skip, limit, search, id } = req.query;
        const skipDocuments = (skip) * limit;
        let result = await Users.aggregate([
            {
                $match: {
                    team_id: id,
                    name: { $regex: search, $options: "i" }
                }
            },
            {
                $facet: {
                    data: [
                        { $skip: skipDocuments },
                        { $limit: parseInt(limit) }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ])
        const data = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;
        let result2 = {
            result: data,
            totalCount: totalCount
        }
        successResponse(res, "User List", result2)
    } catch (err) {
        errorResponse(res, err?.message)
    }
}

export const deleteTeamMember = async (req, res) => {
    try {
        const { team_id, user_id } = req.body;
        const result = await TeamMembers.deleteOne({ team_id, user_id });
        if (result.deletedCount === 1) {
            successResponse(res, "Team member Removed Successfully.", result)
        } else {
            errorResponse(res, "Team member not found.")
        }

    } catch (err) {
        errorResponse(res, err?.message)
    }
}