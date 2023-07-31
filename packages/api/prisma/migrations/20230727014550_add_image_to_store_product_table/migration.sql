/*
  Warnings:

  - Added the required column `imageUrl` to the `store_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_products" ADD COLUMN     "imageUrl" TEXT NOT NULL;
