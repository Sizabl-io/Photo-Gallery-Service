DROP DATABASE IF EXISTS gallery;
CREATE DATABASE gallery;

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS merchants;
DROP TABLE IF EXISTS services;

CREATE TABLE "services" (
  "id" SERIAL PRIMARY KEY,
  "merchant_id" int UNIQUE NOT NULL,
  "gallery_id" int UNIQUE,
  "service_name" varchar(255) NOT NULL,
  "location_id" int UNIQUE NOT NULL
);

CREATE TABLE "merchants" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "site_url" varchar(255),
  "phone_number" varchar(11)
);

CREATE TABLE "locations" (
  "id" int PRIMARY KEY NOT NULL,
  "address_id" int UNIQUE NOT NULL
);

CREATE TABLE "addresses" (
  "id" SERIAL PRIMARY KEY,
  "street" int NOT NULL,
  "city" varchar(255) NOT NULL,
  "state" varchar(255),
  "country_code" int NOT NULL,
  "zip" varchar(255) NOT NULL
);

CREATE TABLE "photos" (
  "id" SERIAL PRIMARY KEY,
  "gallery_id" int NOT NULL,
  "url" varchar(255) UNIQUE,
  "merchant_id" int NOT NULL,
  "created_at" time DEFAULT (now())
);

ALTER TABLE "addresses" ADD FOREIGN KEY ("id") REFERENCES "locations" ("address_id");

ALTER TABLE "locations" ADD FOREIGN KEY ("id") REFERENCES "services" ("location_id");

ALTER TABLE "merchants" ADD FOREIGN KEY ("id") REFERENCES "services" ("merchant_id");

ALTER TABLE "photos" ADD FOREIGN KEY ("gallery_id") REFERENCES "services" ("gallery_id");
