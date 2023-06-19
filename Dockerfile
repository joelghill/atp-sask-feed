FROM node:18-alpine

ENV NODE_ENV=production
# Attmptig to fix "Error: self-signed certificate in certificate chain"
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

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