DROP DATABASE IF EXISTS gallery;
CREATE DATABASE gallery;

\c gallery
SET search_path TO public;

DROP TABLE IF EXISTS imports;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS restaurants;

-- restaurants table
CREATE TABLE "restaurants" (
  "restaurant_id" SERIAL PRIMARY KEY,
  -- general restaurant info
  "restaurant_name" varchar(100) NOT NULL,
  "site_url" varchar(255),
  "phone_number" varchar(30),

  -- location info
  "city" varchar(100) NOT NULL,
  "street" varchar(100),
  "state_or_province" varchar(30),
  "country" varchar(20) NOT NULL,
  "zip" varchar(15)
);

-- users who uploaded photos
CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "user_url" varchar(255) NOT NULL, -- url of user's profile (potentially scale this down)
  "user_name" varchar(100) NOT NULL, -- user's full name (scale this down)
  "user_review_count" smallint DEFAULT 0, -- number of user's reviews
  "user_friend_count" smallint DEFAULT 0, -- number of user's friends
  "user_photo_count" smallint DEFAULT 0, -- number of user's photos
  "user_elite_status" boolean DEFAULT false, -- whether user is elite
  "user_profile_image" varchar(255)
);

-- photos table grouped by gallery id
CREATE TABLE "photos" (
  "photo_id" SERIAL PRIMARY KEY,
  "restaurant_id" int REFERENCES restaurants(restaurant_id) NOT NULL,
  "user_id" int REFERENCES users(user_id) NOT NULL,
  "helpful_count" int DEFAULT 0, -- helpful rating of photo
  "not_helpful_count" int DEFAULT 0, -- not helpful rating of photo
  "photo_url" varchar(255) NOT NULL, -- (potentially scale this down)
  "caption" text,
  "upload_date" text
);

CREATE TABLE "imports" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "user_url" text, -- url of user's profile (potentially scale this down)
  "user_name" text, -- user's full name (scale this down)
  "user_review_count" int, -- number of user's reviews
  "user_friend_count" int, -- number of user's friends
  "user_photo_count" int, -- number of user's photos
  "user_elite_status" boolean, -- whether user is elite
  "user_profile_image" text,
  "photo_id" int,
  "restaurant_id" int,
  "helpful_count" int, -- helpful rating of photo
  "not_helpful_count" int, -- not helpful rating of photo
  "photo_url" text, -- (potentially scale this down)
  "caption" text,
  "upload_date" text
);

-- restaurant info chunk #1
\copy restaurants(restaurant_id, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/restaurants/restaurants_0.csv' CSV HEADER DELIMITER ','

-- restaurant info chunk #2
\copy restaurants(restaurant_id, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/restaurants/restaurants_1.csv' CSV HEADER DELIMITER ','

-- \copy restaurants(restaurant_id, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/restaurants/restaurants_2.csv' CSV HEADER DELIMITER ','

-- \copy restaurants(restaurant_id, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/restaurants/restaurants_3.csv' CSV HEADER DELIMITER ','

-- \copy restaurants(restaurant_id, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/restaurants/restaurants_4.csv' CSV HEADER DELIMITER ','

-- photo/users chunk #1
\copy imports(restaurant_id, photo_id, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_id, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/photos/photos_0.csv' CSV HEADER DELIMITER ','

INSERT INTO users SELECT user_id, user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image FROM imports ON CONFLICT DO NOTHING;

INSERT INTO photos SELECT photo_id, restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date FROM imports;

TRUNCATE imports;

-- photo/users chunk #2
\copy imports(restaurant_id, photo_id, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_id, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/photos/photos_1.csv' CSV HEADER DELIMITER ','

INSERT INTO users SELECT user_id, user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image FROM imports ON CONFLICT DO NOTHING;

INSERT INTO photos SELECT photo_id, restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date FROM imports;

TRUNCATE imports;

-- -- photo/users chunk #3
-- \copy imports(restaurant_id, photo_id, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_id, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/photos/photos_2.csv' CSV HEADER DELIMITER ','

-- INSERT INTO users SELECT user_id, user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image FROM imports ON CONFLICT DO NOTHING;

-- INSERT INTO photos SELECT photo_id, restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date FROM imports;

-- TRUNCATE imports;

-- -- photo/users chunk #4
-- \copy imports(restaurant_id, photo_id, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_id, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/photos/photos_3.csv' CSV HEADER DELIMITER ','

-- INSERT INTO users SELECT user_id, user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image FROM imports ON CONFLICT DO NOTHING;

-- INSERT INTO photos SELECT photo_id, restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date FROM imports;

-- TRUNCATE imports;

-- -- photo/users chunk #5
-- \copy imports(restaurant_id, photo_id, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_id, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/photos/photos_4.csv' CSV HEADER DELIMITER ','

-- INSERT INTO users SELECT user_id, user_url, user_name, user_review_count, user_friend_count, user_photo_count, user_elite_status, user_profile_image FROM imports ON CONFLICT DO NOTHING;

-- INSERT INTO photos SELECT photo_id, restaurant_id, user_id, helpful_count, not_helpful_count, photo_url, caption, upload_date FROM imports;

-- TRUNCATE imports;

-- DROP TABLE imports;