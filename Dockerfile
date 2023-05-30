# Base image
FROM node:16-alpine
# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./


# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

ENV DATABASE_URL="mongodb+srv://cuonghm:vanha110100@cluster0.e74cvwr.mongodb.net/hoang-gia-hotel?retryWrites=true&w=majority"
ENV PORT=3002
ENV JWT_SECRET="~!hoang-gia-hotel"
ENV REDIS_HOST="redis-14656.c100.us-east-1-4.ec2.cloud.redislabs.com"
ENV REDIS_PORT=14656
ENV REDIS_PASSWORD="4OzHScn1uQ5MC2ZC3HjW0IUdaW6ZRmzk"
ENV MAIL_SERVICE_USER="cuonghamanhcuong12@gmail.com"
ENV MAIL_SERVICE_PASS="uohszegpljkaxbjt"

EXPOSE 8080


# Start the server using the production build
CMD [ "node", "dist/main.js" ]
