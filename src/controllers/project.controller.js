import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../utils/helpers.js";

const getAllProjects = asyncHandler(async (req, res) => {
    const createdBy = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const projectAggregate = Project.aggregate([
        {
            $match: {
                createdBy,
            },
        },
        {
            $sort: {
                updatedAt: -1,
            },
        },
    ]);

    const projects = await Project.aggregatePaginate(
        projectAggregate,
        getMongoosePaginationOptions({
            page,
            limit,
            customLabels: {
                totalDocs: "totalProjects",
                docs: "projects",
            },
        })
    );

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
    const createdBy = req.user._id;

    let { title, description } = req.body;
    title = title?.trim();
    description = description?.trim();

    if (!title || !description) {
        throw new ApiError(400, "All fields is required");
    }

    const project = await Project.create({ title, description, createdBy });

    if (!project) {
        throw new ApiError(500, "Something went wrong while creating project");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, project, "Create project successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    let { title, description } = req.body;
    title = title?.trim();
    description = description?.trim();

    if (!title || !description) {
        throw new ApiError(400, "All fields is required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(401, "Project does not exist");
    }

    if (project.createdBy.toString() !== userId.toString()) {
        throw new ApiError(401, "Unauthorized request");
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $set: { title, description },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedProject, "Update project successfully")
        );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(401, "Project does not exist");
    }

    if (project.createdBy.toString() !== userId.toString()) {
        throw new ApiError(401, "Unauthorized request");
    }

    await Project.findByIdAndDelete(projectId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

export { getAllProjects, createProject, updateProject, deleteProject };
