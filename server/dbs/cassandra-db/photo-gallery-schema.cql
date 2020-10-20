DROP KEYSPACE IF EXISTS gallery;
CREATE KEYSPACE gallery
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- general info about a restaurant/merchant
CREATE TABLE gallery.restaurants (
  -- restaurant info
  restaurant_uuid uuid,
  restaurant_name text, -- required
  site_url text, -- optional
  phone_number text, -- optional

  -- location info
  city text, -- required
  street text, -- optional
  state_or_province text, -- optional
  country text, -- optional
  zip text, -- optional
  PRIMARY KEY (restaurant_uuid) -- partition by restaurant id
) WITH comment = 'Q1. General info about a restaurant';

-- photos associated WITH a restaurant
CREATE TABLE gallery.photos_by_restaurant (
  restaurant_uuid uuid,

  -- photo info
  photo_uuid uuid, -- should be unique to photo
  photo_url text, -- url of photo
  upload_date text, -- optional, auto generated if not provided
  helpful_count smallint, -- photo helpful count
  not_helpful_count smallint, -- photo not helpful count
  caption text, -- photo caption

  -- user info
  user_uuid uuid,
  user_url text, -- profile of user that uploaded
  user_profile_image text,
  user_name text, -- user's full name
  user_elite_status boolean, -- whether user is elite
  user_review_count smallint, -- number of user's reviews
  user_friend_count smallint, -- number of user's friends
  user_photo_count smallint, -- number of user's photos
  PRIMARY KEY (restaurant_uuid, photo_uuid)
) WITH comment = 'Q2. Find photos by restaurant id'
AND CLUSTERING ORDER BY (photo_uuid ASC); -- cluster by photo id, partitioning on restaurant id

COPY gallery.restaurants (restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/cassandra/restaurants/restaurants_0.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.restaurants (restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/cassandra/restaurants/restaurants_1.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.restaurants (restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/cassandra/restaurants/restaurants_2.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.restaurants (restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/cassandra/restaurants/restaurants_3.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.restaurants (restaurant_uuid, restaurant_name, site_url, phone_number, city, street, state_or_province, country, zip) FROM '../generated/cassandra/restaurants/restaurants_4.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.photos_by_restaurant (restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/cassandra/photos/photos_0.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.photos_by_restaurant (restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/cassandra/photos/photos_1.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.photos_by_restaurant (restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/cassandra/photos/photos_2.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.photos_by_restaurant (restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/cassandra/photos/photos_3.csv' WITH HEADER=true AND DELIMITER=',';

COPY gallery.photos_by_restaurant (restaurant_uuid, photo_uuid, photo_url, upload_date, helpful_count, not_helpful_count, caption, user_uuid, user_url, user_profile_image, user_name, user_elite_status, user_review_count, user_friend_count, user_photo_count) FROM '../generated/cassandra/photos/photos_4.csv' WITH HEADER=true AND DELIMITER=',';