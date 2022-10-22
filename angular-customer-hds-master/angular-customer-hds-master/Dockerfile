
FROM nginx:latest

COPY dist/angular-customer-hds /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["/bin/bash", "-c", \
"echo API_URL=[$API_URL], && \
sed -i s#MY_APP_API_URL#$API_URL#g /usr/share/nginx/html/main.*.js && \
echo API_AUTH_URL=[$API_AUTH_URL], && \
sed -i s#MY_APP_API_AUTH_URL#$API_AUTH_URL#g /usr/share/nginx/html/main.*.js && \
nginx -g 'daemon off;'"]

ENTRYPOINT ["sh", "/docker-entrypoint.sh"]


