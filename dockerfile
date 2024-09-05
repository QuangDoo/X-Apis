# Use an official Node.js runtime as a parent image
FROM node:lastest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that the application will run on (e.g., 4000)
EXPOSE 4000

# Set environment variable for the port (optional, depends on how your app is configured)
ENV PORT 4000

# Start the Node.js application
CMD [ "npm", "start" ]
