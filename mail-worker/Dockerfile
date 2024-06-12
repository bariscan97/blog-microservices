FROM node:12

WORKDIR /app1

COPY package*.json ./

RUN npm install\
        && npm install typescript -g
RUN tsc

COPY . .

EXPOSE 3001

CMD ["node", "dist/index.js"] 