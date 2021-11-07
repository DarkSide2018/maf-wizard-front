FROM node:14 as react-build
WORKDIR /app
COPY package*.json ./
COPY . .
ARG PORT
RUN npm install
RUN npm run build

# stage: 2 — the production environment
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
RUN echo $PORT

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=react-build /app/build/ /usr/share/nginx/html/

EXPOSE $PORT

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'