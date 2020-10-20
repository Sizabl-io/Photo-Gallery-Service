# Use the official image as a parent image.
FROM node:latest

# Set the working directory.
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Run the command inside your image filesystem.
RUN npm install

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 3001

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

ADD start.sh /
RUN chmod +x /start.sh

# Run the specified command within the container.
CMD ["/start.sh"]