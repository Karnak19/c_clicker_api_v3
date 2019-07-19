FROM node:lts-alpine

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 80

CMD npm start