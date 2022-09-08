FROM node:16-alpine AS development

ENV NODE_ENV=development
WORKDIR /app

COPY package*.json ./
RUN npm install glob rimraf
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./src ./src
RUN ls -a
RUN npm install --only=development
RUN npm install -g @nestjs/cli
RUN npm run build


#
# Create the base Stage
#
#FROM arm32v7/node:14-alpine AS base
FROM node:16-alpine AS baseProd
ENV NODE_ENV=production
WORKDIR /app
RUN ls -la
COPY package*.json ./
RUN npm install --only=production
COPY --from=development /app/dist .



#
# ---- Configurations ----
#
FROM baseProd AS configuration

RUN npm config set registry https://registry.npm.taobao.org 
RUN npm install -g pm2 && pm2 install pm2-logrotate && pm2 set pm2-logrotate:retain 10 && pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss && pm2 set pm2-logrotate:max_size 100M && pm2 set pm2-logrotate:rotateInterval 0 0 * * * && pm2 set pm2-logrotate:rotateModule true

#
# ---- Finalize ----
# 
FROM configuration AS finalize

COPY ecosystem.config.js /app

COPY ["./package.json", "./package-lock.json*", "./"]
RUN npm install --only=production
COPY --from=0 /app/dist /app

# remove unused dependencies
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/swagger-ui-dist/*.map
RUN rm -rf node_modules/couchbase/src/

CMD ["pm2-runtime", "ecosystem.config.js"]