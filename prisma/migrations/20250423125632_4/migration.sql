-- AlterTable
CREATE SEQUENCE banner_id_seq;
ALTER TABLE "Banner" ALTER COLUMN "id" SET DEFAULT nextval('banner_id_seq');
ALTER SEQUENCE banner_id_seq OWNED BY "Banner"."id";
