FROM node:16

WORKDIR /usr/src/app

RUN mkdir /images

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1444

CMD ["node", "main.js"]