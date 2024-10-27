/*
  Warnings:

  - The primary key for the `SlowUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SlowUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SlowUsers" DROP CONSTRAINT "SlowUsers_pkey",
ADD COLUMN     "channel" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SlowUsers_pkey" PRIMARY KEY ("id");
