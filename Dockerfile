FROM node:16

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app
COPY wait-for-it.sh /app

EXPOSE 5432
EXPOSE 3000

# Container
CMD ["npm", "start"]