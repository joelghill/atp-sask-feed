FROM node:18-alpine

# Environment variables
ENV NODE_ENV=production
ENV FEEDGEN_PORT=${FEEDGEN_PORT}

# Change this to use a different bind address
ENV FEEDGEN_LISTENHOST=${FEEDGEN_LISTENHOST}

# Don't change unless you're working in a different environment than the primary Bluesky network
ENV FEEDGEN_SUBSCRIPTION_ENDPOINT=${FEEDGEN_SUBSCRIPTION_ENDPOINT}

# Set this to the hostname that you intend to run the service at
ENV FEEDGEN_HOSTNAME=${FEEDGEN_HOSTNAME}

# Set this to the DID of the account you'll use to publish the feed
# You can find your accounts DID by going to
# https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${YOUR_HANDLE}
ENV FEEDGEN_PUBLISHER_DID=${FEEDGEN_PUBLISHER_DID}

# Only use this if you want a service did different from did:web
# FEEDGEN_SERVICE_DID="did:plc:abcde..."

# Delay between reconnect attempts to the firehose subscription endpoint (in milliseconds)
ENV FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY=${FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY}

# Set to postgres to use postgres, or leave blank to use sqlite
ENV FEEDGEN_DB_TYPE=${FEEDGEN_DB_TYPE}

# Set to something like db.sqlite to store persistently. Only use this if you're using sqlite
ENV FEEDGEN_SQLITE_LOCATION=${FEEDGEN_SQLITE_LOCATION}

# Only use these if you're using postgres
ENV FEEDGEN_DB_URL=${FEEDGEN_DB_URL}
# Ignored if URL is set
ENV FEEDGEN_DB_HOST=${FEEDGEN_DB_HOST}
ENV FEEDGEN_DB_PORT=${FEEDGEN_DB_PORT}
ENV FEEDGEN_DB_USERNAME=${FEEDGEN_DB_USERNAME}
ENV FEEDGEN_DB_PASSWORD=${FEEDGEN_DB_PASSWORD}
ENV FEEDGEN_DB_NAME=${FEEDGEN_DB_NAME}

# Admin settings
ENV FEEDGEN_ADMIN_DID=${FEEDGEN_ADMIN_DID}


WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./

COPY .yarn ./.yarn

RUN yarn install
COPY . /app/
RUN yarn build
ENTRYPOINT ["yarn", "start"]
EXPOSE ${FEEDGEN_PORT}