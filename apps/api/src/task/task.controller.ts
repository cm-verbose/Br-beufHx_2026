import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDTO } from "./taskDTO/CreateTaskDTO";

@Controller("task")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async createTask(@Body() taskDTO: CreateTaskDTO) {
    return this.taskService.createTask(taskDTO);
  }

  @Get()
  async getTasks() {
    return this.taskService.getTasks();
  }

  @Delete(":id")
  async deleteTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.deleteTask(id);
  }
}
