FROM node:12.18.1-alpine

LABEL version="1.0" description="node image"

WORKDIR /usr/app

COPY package*.json ./

COPY . . 

EXPOSE 3777

CMD ["npm", "run", "dev"]