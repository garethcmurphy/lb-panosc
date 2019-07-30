FROM node:12.7.0-alpine
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
EXPOSE 3000
CMD ["node","server/server.js"]


