FROM node:12.1.0-alpine

WORKDIR /usr/src/app
COPY . .
RUN apk add --no-cache python build-base \
  && npm install \
  && npm install -g nodemon \
  && rm -rf /var/cache/apk/* && apk del .build-deps
CMD ["npm", "run", "start:dev"]