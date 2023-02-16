FROM node:16

USER root

WORKDIR /usr/src/app
# COPY ca-certificate.crt ./
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]