FROM node:15.14.0-alpine

COPY package*.json /
RUN npm install
COPY /backend/ /backend/

WORKDIR /frontend
COPY package*.json /frontend/
RUN npm install
COPY /frontend/ /frontend/
RUN REACT_APP_ENV=demo npm run build

WORKDIR /
EXPOSE 5000
VOLUME /logs

CMD npm start