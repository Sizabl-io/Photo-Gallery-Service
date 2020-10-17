# Project Name

> Project description

## Related Projects

  - https://github.com/Glity/photo-gallery
  - https://github.com/Glity/reviews
  - https://github.com/Glity/Calendar-reservation
  - https://github.com/Glity/people-also-viewed

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

Endpoints:

## Server API

</br>

## *Restaurant API*

</br>

### Get restaurant information matching id
  * GET `/api/restaurants/:id`

**Path Parameters:**
  * `id` - restaurant id

**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "gallery_id": "Number",
      "restaurant_name": "String",
      "city": "String",
      "street": "String",
      "state_or_province": "Number",
      "country": "String",
      "zip": "String",
      "site_url": "String",
      "phone_number": "String",
    }
```

</br>

## *Gallery API*

</br>


### Get a gallery matching id
  * GET `/api/galleries/:id`

**Path Parameters:**
  * `id` - gallery id

**Success Status Code:** `200`

**Returns:** Array of JSON photo objects

```json
    {
      "photo_url": "String",
      "upload_date": "String",
      "helpfulCount": "Number",
      "notHelpfulCount": "Number",
      "caption": "String",
      "user_url": "String",
      "user_name": "String",
      "user_review_count": "Number",
      "user_friend_count": "Number",
      "user_photo_count": "Number",
    }
```

</br>

## *Photo API*

</br>

### Get a photo matching id
  * GET `/api/photos/:id`

**Path Parameters:**
  * `id` - photo id

**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "photo_url": "String",
      "upload_date": "String",
      "helpfulCount": "Number",
      "notHelpfulCount": "Number",
      "caption": "String",
      "user_url": "String",
      "user_name": "String",
      "user_review_count": "Number",
      "user_friend_count": "Number",
      "user_photo_count": "Number",
    }
```

### Add a photo
  * POST `/api/photos`

**Success Status Code:** `201`

**Request Body**: Expects JSON with the following keys.

```json
    {
      "restaurant_id": "Number", // restaurant to associate photo with
      "gallery_id": "Number", // gallery to associate photo with
      "user_id": "Number", // id user that posted the photo
      "photo_url": "String", // required
      "upload_date": "String", // required
      "caption": "String", // optional
    }
```


### Update individual photo info
  * PATCH `/api/photos/:id`

**Path Parameters:**
  * `id` - photo id

**Success Status Code:** `204`

**Request Body**: Expects JSON with any of the following keys (include only keys to be updated)

```json
    {
      "helpfulCount": "Number",
      "notHelpfulCount": "Number",
      "photo_url": "String",
      "caption": "String",
    }
```

### Delete photo matching id
  * DELETE `/api/photos/:id`

**Path Parameters:**
  * `id` - photo id

**Success Status Code:** `204`

</br>

## *User API*

</br>

### Get all photos posted by a user
  * GET `/api/users/photos/:id`

**Path Parameters:**
  * `id` - user id

**Success Status Code:** `200`

**Returns:** Array of JSON photo objects

```json
    {
      "photo_url": "String",
      "upload_date": "String",
      "helpfulCount": "Number",
      "notHelpfulCount": "Number",
      "caption": "String",
      "user_url": "String",
      "user_name": "String",
      "user_review_count": "Number",
      "user_friend_count": "Number",
      "user_photo_count": "Number",
    }
```

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

