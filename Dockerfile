FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app


EXPOSE 5432
EXPOSE 3000

# Container
CMD ["npm", "start"]