FROM node:16

RUN mkdir /tmp/images/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1444

CMD ["node", "main.js"]