FROM node:latest

WORKDIR /usr/app

COPY server/ server/
RUN cd server/ && npm install && npm install -D nodemon

COPY client/ client/
RUN cd client/ && npm install && npm run build && npm run post-build
RUN rm -rf client/

EXPOSE 5000

WORKDIR /usr/app/server/
CMD ["npm", "run", "dev"]