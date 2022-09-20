FROM node:16

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app
COPY wait-for-it.sh /app
RUN chmod +x ./wait-for-it.sh


# Container
CMD ["npm", "start"]