FROM node:slim

LABEL version="1.0" description="node image"

WORKDIR /usr/src/app

COPY package*.json ./

COPY . . 

EXPOSE 3777

CMD ["npm", "start"]