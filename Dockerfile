FROM node:16


WORKDIR /usr/src/app
COPY certs/ca-certificate.crt ./
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]