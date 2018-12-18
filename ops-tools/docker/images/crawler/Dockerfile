FROM node:8-alpine

RUN npm i -g @adonisjs/cli

COPY ./docker-entrypoint.sh /entrypoint.sh

ARG DEV_MOD

RUN mkdir -p /var/www/app
WORKDIR /var/www/app

EXPOSE 3333

ENTRYPOINT ["/entrypoint.sh", "${DEV_MOD}"]


