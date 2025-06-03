# Usar imagen ligera de nginx para servir archivos estáticos
FROM nginx:alpine

# Eliminar la configuración por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos del juego al directorio de nginx
COPY . /usr/share/nginx/html/

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]