-- CreateTable
CREATE TABLE "Playbook" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Playbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clause" (
    "id" SERIAL NOT NULL,
    "playbookId" INTEGER NOT NULL,
    "clause_type" TEXT NOT NULL,
    "clause_text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clause_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clause" ADD CONSTRAINT "Clause_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "Playbook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
