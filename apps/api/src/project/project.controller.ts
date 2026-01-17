import { CreateProjectDTO } from "./projectDTO/CreateProjectDTO";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ProjectService } from "./project.service";

@Controller("project")
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async getProjects() {
    return this.projectService.getProjects();
  }

  @Get(":name")
  async getProjectByName(@Param("name") name: string) {
    return this.projectService.getProjectByName(name);
  }
  @Post()
  async createProject(@Body() projectDTO: CreateProjectDTO) {
    return this.projectService.createProject(projectDTO);
  }

  @Delete(":id")
  async deleteTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.deleteProject(id);
  }
}
