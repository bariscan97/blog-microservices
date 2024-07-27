FROM node:16-alpine as development

WORKDIR /src/app/user

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

WORKDIR /src/app/user

COPY package*.json .

RUN npm ci --only=production

COPY --from=development /api/user/dist ./dist

CMD ["node", "dist/index.js"]





  
    
    