FROM node:16

ADD certs/ca-certificate.crt /usr/src/app/certs/ca-certificate.crt
RUN update-ca-certificates

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]