/*
  Warnings:

  - You are about to drop the column `channelID` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the `_ChannelToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_B_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "channelID",
ADD COLUMN     "allowlist" TEXT[];

-- DropTable
DROP TABLE "_ChannelToUser";
