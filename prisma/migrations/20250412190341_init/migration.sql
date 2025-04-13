-- CreateTable
CREATE TABLE "Column" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskIds" TEXT[],

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prerequisites" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "files" TEXT[],
    "urls" TEXT[],
    "reminders" TEXT[],
    "collaborators" TEXT[],

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
