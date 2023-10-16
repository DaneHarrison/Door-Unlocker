FROM node:latest
ENV NODE_ENV=production
WORKDIR /unlocker   

COPY ./src /unlocker
COPY ./package-lock.json /unlocker
COPY ./package.json /unlocker
COPY ./docker/.env /unlocker
RUN npm install --omit=dev

RUN cd /unlocker/presentation && npm install -g @angular/cli && ng build

CMD node index.js
EXPOSE 443