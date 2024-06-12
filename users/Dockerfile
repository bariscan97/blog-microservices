FROM node:16-alpine as development

WORKDIR /api/user

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=development /api/user/dist ./dist

CMD ["node", "dist/index.js"]





  
    
    