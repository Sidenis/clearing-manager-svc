FROM node:12.4-alpine
WORKDIR /app
COPY ./ /app
RUN npm install
ENV PORT=3000

EXPOSE 3000
ENTRYPOINT npm run start