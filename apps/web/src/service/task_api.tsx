import { api } from "./api";

export enum TaskState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface CreateTaskDTO {
  name: string;
  description: string;
  projectId?: number;
  parentId?: number;
  state?: TaskState;
}

export interface TaskResponse {
  id: number;
  name: string;
  description: string;
  projectId: number | null;
  parentId: number | null;
  state: TaskState;
}

const TaskAPI = {
  getAllTasks: async () => {
    const response = await api.get<TaskResponse[]>("/task");
    return response.data;
  },
  getTaskById: async (id: number) => {
    const response = await api.get<TaskResponse>(`/task/${id}`);
    return response.data;
  },
  createTask: async (taskData: CreateTaskDTO) => {
    const response = await api.post<TaskResponse>("/task", taskData);
    return response.data;
  },
  updateTask: async (id: number, taskData: Partial<CreateTaskDTO>) => {
    const response = await api.patch<TaskResponse>(`/task/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id: number) => {
    const response = await api.delete<TaskResponse>(`/task/${id}`);
    return response.data;
  },
};

export default TaskAPI;
