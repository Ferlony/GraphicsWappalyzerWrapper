FROM node:18-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROME_BIN /usr/bin/chromium-browser
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN apk update
RUN apk add --no-cache \
	nodejs \
	npm \
  udev \
  chromium \
  ttf-freefont \
  python3 \
  make \
  build-base \
  git

RUN mkdir /app && chown node /app
WORKDIR /app
COPY ./app.js /app/
COPY ./*.json /app/
COPY ./resources/ /app/resources/

RUN npm install

RUN /usr/bin/chromium-browser --version

ENTRYPOINT ["node", "app.js"]
