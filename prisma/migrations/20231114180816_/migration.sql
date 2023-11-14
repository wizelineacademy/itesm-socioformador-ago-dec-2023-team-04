/*
  Warnings:

  - Added the required column `enabledFriday` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enabledMonday` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enabledSaturday` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enabledSunday` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enabledThursday` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enabledTuesday` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enabledWednesday` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "enabledFriday" BOOLEAN NOT NULL,
ADD COLUMN     "enabledMonday" BOOLEAN NOT NULL,
ADD COLUMN     "enabledSaturday" BOOLEAN NOT NULL,
ADD COLUMN     "enabledSunday" BOOLEAN NOT NULL,
ADD COLUMN     "enabledThursday" BOOLEAN NOT NULL,
ADD COLUMN     "enabledTuesday" BOOLEAN NOT NULL,
ADD COLUMN     "enabledWednesday" BOOLEAN NOT NULL;
