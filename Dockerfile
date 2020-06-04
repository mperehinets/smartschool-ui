FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /dist/smartschool-ui /usr/share/nginx/html
