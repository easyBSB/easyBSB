FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY . .

RUN npm install --production=false

RUN npm run package:server

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/dist/apps/server ./

RUN npm install

EXPOSE 3333

RUN mkdir -p /data/
ENV DATABASE_FILE=/data/easybsb.sqlite
ENV EASYBSB_PORT=80

CMD ["node", "main"]