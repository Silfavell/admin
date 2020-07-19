FROM node:10

WORKDIR /usr/src/app

ENV REACT_APP_NODE_ENV=prod

COPY package*.json ./

RUN npm install serve -g

RUN npm install

COPY . .

EXPOSE 6767

RUN npm run build

CMD [ "npm", "start" ] 