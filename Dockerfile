FROM node:16-alpine

ENV BLITZ_WEB_PORT 3000

RUN apk update
RUN apk add git

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "ssr"]

EXPOSE ${BLITZ_WEB_PORT}
