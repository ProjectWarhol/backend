FROM node:16

WORKDIR /app

COPY package.json /app
RUN npm install -g npm@8.19.2
RUN npm install

COPY . /app
COPY wait-for-it.sh /app
RUN chmod +x ./wait-for-it.sh

ARG DEFAULT_NODE_ENV=development

ENV NODE_ENV $DEFAULT_NODE_ENV