FROM node:lts-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app
# Bundle app source
COPY . /app

# Install app dependencies
RUN npm install

# Run the app
CMD ["npm", "start"]
