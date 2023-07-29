import { Router } from "express";
import { addTeamMembers, createTeam, deleteTeam, deleteTeamMember, editTeam, getAllTeams, getAllUsers, getTeamDetails, getTeamMembers, getUsers } from "../controllers/team.js";
import { newUser } from "../controllers/auth.js";
import authMiddleware from "../middleware/authentication.js";
import { deleteUser, getAllSubadmin, getUserDetails } from "../controllers/user.js";
import { addTask, getAllTasks, updateTaskStatus } from "../controllers/tasks.js";
const router = Router();

router.post("/addTeam", authMiddleware, createTeam);
router.post("/editTeam", authMiddleware, editTeam);
router.post("/getTeamDetails", authMiddleware, getTeamDetails);
router.post("/deleteTeam", authMiddleware, deleteTeam);
router.post("/add-user", authMiddleware, newUser);
router.get("/getAllTeams", authMiddleware, getAllTeams)
router.get("/getUsers", authMiddleware, getUsers)
router.get("/getAllUsers", authMiddleware, getAllUsers)
router.post("/addTeamMembers", authMiddleware, addTeamMembers)
router.get('/getTeamMembers', authMiddleware, getTeamMembers)
router.post("/deleteTeamMember", authMiddleware, deleteTeamMember)
router.get("/getAllSubadmin", authMiddleware, getAllSubadmin)
router.get("/getUserDetails", authMiddleware, getUserDetails)
router.post("/addTask", authMiddleware, addTask)
router.get("/getAllTasks", authMiddleware, getAllTasks)
router.post("/updateTaskStatus", authMiddleware, updateTaskStatus)
router.post("/deleteUser", authMiddleware, deleteUser)







// export default Router;
export { router as homeRoute }