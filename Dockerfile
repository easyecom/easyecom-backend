FROM node:12-alpine

LABEL version="1.0" description="node image"

WORKDIR /usr/app

COPY package*.json ./

COPY . . 

RUN apk add --no-cache --update --virtual .gyp python make g++ 

EXPOSE 3777

CMD ["npm", "run", "dev"]