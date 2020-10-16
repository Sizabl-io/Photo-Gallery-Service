DROP KEYSPACE IF EXISTS gallery;
CREATE KEYSPACE gallery
WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

-- general info about a service/merchant
CREATE TABLE gallery.service (
  -- service info
  service_id int PRIMARY KEY,
  site_url text, -- optional
  service_name text, -- required
  phone_number text, -- optional
) WITH comment = 'Q1. Find info about a service';

-- gallery associated with a service
CREATE TABLE gallery.gallery_by_service (
  -- service info
  service_id int,

  -- gallery info
  gallery_id int, -- required, should be unique to service
  PRIMARY KEY (gallery_id, service_id)
) WITH comment = 'Q2. Find galleries by service id';

-- service associated with a gallery
CREATE TABLE gallery.service_by_gallery (
  -- gallery info
  gallery_id int,

  -- service info
  service_id int,
  site_url text, -- optional
  service_name text, -- required
  phone_number text, -- optional
  PRIMARY KEY (service_id, gallery_id)
) WITH comment = 'Q3. Find services by gallery id';

-- photos associated with a gallery
CREATE TABLE gallery.photos_by_gallery (
  -- gallery info
  gallery_id int,

  -- photo info
  photo_id int, -- should be unique to photo
  photo_url text, -- url of photo
  upload_date timestamp, -- optional, auto generated if not provided
  helpfulCount int, -- photo not helpful rating
  notHelpfulCount int, -- photo helpful rating
  caption text, -- photo caption
  PRIMARY KEY (photo_id, gallery_id)
) WITH comment = 'Q4. Find photos by gallery id'
AND CLUSTERING ORDER BY (gallery_id ASC); -- cluster photos with same gallery id


-- user associated with a photo id
CREATE TABLE gallery.user_by_photo (
  -- photo info
  photo_id int,

  -- user info
  user_id int,
  user_url text, -- profile of user that uploaded
  user_name text, -- username
  user_elite_status boolean, -- whether user is elite
  user_review_count int, -- number of user's reviews
  user_friend_count int, -- number of user's friends
  user_photo_count int, -- number of user's photos
  PRIMARY KEY (user_id, photo_id)
) WITH comment = 'Q5. Find user by photo id';

-- photos associated with a user id
CREATE TABLE gallery.photos_by_user (
  -- user info
  user_id int,

  -- photo info
  photo_id int, -- should be unique to photo
  photo_url text, -- url of photo
  upload_date timestamp, -- optional, auto generated if not provided
  helpfulCount int, -- photo not helpful rating
  notHelpfulCount int, -- photo helpful rating
  caption text, -- photo caption
  PRIMARY KEY (photo_id, user_id)
) WITH comment = 'Q6. Find photos by user id';

-- general information about a location
CREATE TABLE gallery.location_by_service (
  -- service info
  service_id int PRIMARY KEY,

  -- location info
  location_id int,
  city text, -- required
  street text, -- optional
  state_or_province text, -- optional
  country text, -- optional
  zip text, -- optional
) WITH comment = 'Q7. Find info about a location associated with a service';

-- services associated with a location
CREATE TABLE gallery.service_by_location (
    -- location info
  location_id int,
  city text, -- required
  street text, -- optional
  state_or_province text, -- optional
  country text, -- optional
  zip text, -- optional

  -- service info
  service_id int, -- required
  site_url text, -- optional
  service_name text, -- required
  phone_number text, -- optional
  PRIMARY KEY (service_id, city, state_or_province, country, zip)
) WITH comment = 'Q8. Find services by location information'
AND CLUSTERING ORDER BY (city ASC, state_or_province ASC, country ASC, zip ASC); -- cluster services in same city