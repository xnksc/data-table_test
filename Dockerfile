# # Указываем базовый образ
# FROM node:18

# # Устанавливаем рабочий каталог
# WORKDIR /app

# # Копируем package.json и package-lock.json
# COPY package*.json ./

# # Устанавливаем зависимости
# RUN npm install

# # Копируем исходный код
# COPY . .

# # Собираем приложение Next.js
# RUN npm run build

# # Указываем команду для запуска приложения
# CMD ["npm", "start"]

# # Открываем порт 3000
# EXPOSE 3000


#  NEWW 

# FROM node:18 
# # as dependencies
# WORKDIR /app
# COPY package.json ./
# RUN npm install 

# # FROM node:18 as builder
# # WORKDIR /app
# COPY . .
# COPY --from=dependencies /app/node_modules ./node_modules
# RUN npm run build

# # FROM node:18 as runner
# # WORKDIR /app
# ENV NODE_ENV production

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules

# EXPOSE 3000
# CMD ["npm", "start"]

FROM node:latest
# Устанавливаем зависимости для сборки
RUN apk update && apk add --no-cache bash 
WORKDIR /app 
# Копируем файлы проекта
COPY package*.json ./ 
COPY . . 
# Устанавливаем зависимости
RUN npm install 
# Сборка Next.js приложения
RUN npm run build 
# Копируем CSV файл
COPY data.csv ./public/data.csv 
# Запускаем сервер Next.js
CMD ["npm", "run", "start"] 
