import { CreateProjectDTO } from "./projectDTO/CreateProjectDTO";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { AiService } from "src/ai/ai.service";

@Controller("project")
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private aiService: AiService,
  ) {}

  @Get()
  async getProjects() {
    return await this.projectService.getProjects();
  }

  @Get(":id")
  async getProject(@Param("id", ParseIntPipe) id: number) {
    console.log(id);
    return await this.projectService.getProject(id);
  }

  @Get("search/:name")
  async getProjectByName(@Param("name") name: string) {
    return this.projectService.getProjectByName(name);
  }

  @Get(":id")
  async getProjectById(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.getProjectById(id);
  }

  @Patch(":id")
  async updateProject(@Param("id", ParseIntPipe) id: number, @Body() updateDTO: CreateProjectDTO) {
    return this.projectService.updateProject(id, updateDTO);
  }

  @Post()
  async createProject(@Body() projectDTO: CreateProjectDTO) {
    return this.projectService.createProject(projectDTO);
  }

  @Post("generate")
  async generateAndSave(@Body() body: { description: string }) {
    const aiData = await this.aiService.generateProjectPlan(body.description);
    return aiData;
  }
  @Delete(":id")
  async deleteTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.projectService.deleteProject(id);
  }
}
