FROM node:18-alpine

ARG FEEDGEN_PORT=3000

# Environment variables
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./

COPY .yarn ./.yarn

RUN yarn install
COPY . /app/
RUN yarn build
ENTRYPOINT ["yarn", "start"]
EXPOSE $FEEDGEN_PORT