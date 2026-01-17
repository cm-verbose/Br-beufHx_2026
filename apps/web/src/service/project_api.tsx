import { api } from "./api";

export enum CategoryProject {
  PROJET = "PROJET",
  DEVOIR = "DEVOIR",
  EXAM = "EXAM",
}
export enum Status {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface Task {
  id?: number;
  name: string;
  description: string;
  projectId?: number;
  state?: Status;
  children?: Task[];
}

export interface ProjectDTO {
  title: string;
  category: CategoryProject;
  estimatedEndDate: string;
  Tasks?: Task[];
}

export interface ProjectResponse extends ProjectDTO {
  id: number;
  createdDate: string;
}

const ProjectAPI = {
  updateTaskStatus: async (taskId: number, status: Status) => {
    const response = await api.patch(`/task/${taskId}/status`, {
      state: status,
    });
    return response.data;
  },

  getAllProjects: async () => {
    const response = await api.get<ProjectResponse[]>("/project");
    return response.data;
  },

  getProjectById: async (id: number) => {
    const response = await api.get<ProjectResponse>(`/project/${id}`);
    return response.data;
  },

  createManualProject: async (projectData: ProjectDTO) => {
    const response = await api.post<ProjectResponse>("/project", projectData);
    return response.data;
  },

  generateAIPlan: async (description: string) => {
    const response = await api.post<ProjectDTO>("/project/generate", { description });
    return response.data;
  },

  saveAIProject: async (projectData: ProjectDTO) => {
    const response = await api.post<ProjectResponse>("/project/save-project", projectData);
    return response.data;
  },

  updateProject: async (id: number, projectData: Partial<ProjectDTO>) => {
    const response = await api.patch<ProjectResponse>(`/project/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id: number) => {
    const response = await api.delete<ProjectResponse>(`/project/${id}`);
    return response.data;
  },
};

export default ProjectAPI;
