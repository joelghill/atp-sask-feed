FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./

COPY .yarn ./.yarn

RUN yarn install
COPY . /app/
RUN yarn build
CMD ["yarn", "start"]
EXPOSE 3000 