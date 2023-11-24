/*
  Warnings:

  - You are about to drop the column `exitHour` on the `Group` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "exitHour",
ADD COLUMN     "duration" INTEGER NOT NULL;
