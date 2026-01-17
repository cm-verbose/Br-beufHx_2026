-- CreateEnum
CREATE TYPE "CategoryProject" AS ENUM ('DEVOIR', 'EXAM', 'PROJET');

-- CreateEnum
CREATE TYPE "TaskState" AS ENUM ('IN_PROGRESS', 'FINISHED', 'NOT_STARTED');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "estimatedEndDate" TIMESTAMP(3) NOT NULL,
    "category" "CategoryProject" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state" "TaskState" NOT NULL DEFAULT 'NOT_STARTED',
    "projectId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
