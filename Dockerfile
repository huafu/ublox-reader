FROM node:lts-alpine

# Create required directories
RUN mkdir -p /app /app-deps

# Copy package.json and package-lock.json
COPY ./package.json ./package-lock.json /app-deps/

# Install app dependencies
RUN cd /app-deps && npm install

# Copy app source code
COPY . /app

# Move node_modules to app directory
RUN mv /app-deps/node_modules /app/node_modules

# Set the working directory
WORKDIR /app

# Run the app
CMD ["npm", "start"]
