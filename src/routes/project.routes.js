import { Router } from "express";
import {
    getAllProjects,
    createProject,
    deleteProject,
    updateProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getAllProjects).post(createProject);

router.route("/:projectId").patch(updateProject).delete(deleteProject);

export default router;
