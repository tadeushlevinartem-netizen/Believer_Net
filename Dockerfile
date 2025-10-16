FROM node:18-alpine

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем код
COPY app.js .

# Запускаем приложение
CMD ["node", "app.js"]