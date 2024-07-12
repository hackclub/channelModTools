/*
  Warnings:

  - Added the required column `readOnly` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "readOnly" BOOLEAN NOT NULL;
