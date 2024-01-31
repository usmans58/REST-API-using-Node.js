FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY dist ./dist
COPY MOCK_DATA.json ./

# COPY . .
EXPOSE 8000

CMD ["sh", "-c", "cd dist && node typescript.js"]
# CMD ["/bin/sh"]
