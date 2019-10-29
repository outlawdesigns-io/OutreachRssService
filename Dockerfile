FROM node:carbon
RUN apt-get update
WORKDIR /usr/src/app/
ENV TZ=America/Chicago
COPY . .
RUN npm install
EXPOSE 8663
CMD ["node","index.js"]
