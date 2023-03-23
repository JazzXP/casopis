FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build


FROM node:18-alpine
# ENV NODE_ENV=production 

WORKDIR /app

COPY --from=build /app/build .
COPY --from=build /app/server/server.js .
COPY package*.json ./
RUN npm ci --omit=dev
# RUN npm install

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 3000
CMD ["node","server.js"]