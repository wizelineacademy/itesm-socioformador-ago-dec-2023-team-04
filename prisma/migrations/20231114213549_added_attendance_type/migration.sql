/*
  Warnings:

  - You are about to drop the `_GroupToStudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('ON_TIME', 'LATE', 'JUSTIFICATED_ABSENCE');

-- DropForeignKey
ALTER TABLE "_GroupToStudent" DROP CONSTRAINT "_GroupToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToStudent" DROP CONSTRAINT "_GroupToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "type" "AttendanceType" NOT NULL;

-- DropTable
DROP TABLE "_GroupToStudent";

-- CreateTable
CREATE TABLE "StudentInGroup" (
    "studentId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "joinedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentInGroup_pkey" PRIMARY KEY ("studentId","groupId")
);

-- AddForeignKey
ALTER TABLE "StudentInGroup" ADD CONSTRAINT "StudentInGroup_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentInGroup" ADD CONSTRAINT "StudentInGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
