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

### Get photo matching id
  * GET `/api/photos/:id`

**Path Parameters:**
  * `id` - photo id

**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "photoId": "Number",
      "imageList": "String",
      "reviewList": "String",
      "userList": "Number",
      "helpfulList": "Number",
      "notHelpfulList": "Number",
    }
```

### Add a photo
  * POST `/api/photos`

**Success Status Code:** `201`

**Request Body**: Expects JSON with the following keys.

```json
    {
      "imageList": "String",
      "reviewList": "String",
      "userList": "Number",
      "helpfulList": "Number",
      "notHelpfulList": "Number",
    }
```


### Update photo info
  * PATCH `/api/photos/:id`

**Path Parameters:**
  * `id` - photo id

**Success Status Code:** `204`

**Request Body**: Expects JSON with any of the following keys (include only keys to be updated)

```json
    {
      "imageList": "String",
      "reviewList": "String",
      "userList": "Number",
      "helpfulList": "Number",
      "notHelpfulList": "Number",
    }
```

### Delete photo matching id
  * DELETE `/api/photo/:id`

**Path Parameters:**
  * `id` - photo id

**Success Status Code:** `204`

``` POST -> '/photos' : creates new record in database ```

``` GET -> '/photos' : returns all photos in database ```

``` GET -> '/photos/:id' : returns photo matching id in database ```

``` PATCH -> 'photos/:id : updates photo matching id in database if it exists ```

``` DELETE -> 'photos/:id: deletes photo matching id in database if it exists ```

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

