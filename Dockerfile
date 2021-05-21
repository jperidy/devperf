FROM node:15.14.0-alpine

COPY package*.json /
RUN npm install
COPY /backend/ /backend/

COPY /frontend/ /frontend/
WORKDIR /frontend
RUN npm install
RUN REACT_APP_ENV=demo npm run build

WORKDIR /
EXPOSE 5000
VOLUME /logs

CMD npm start