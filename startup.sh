#!/bin/bash

echo "=== Configurando Nginx para archivos grandes ==="

mkdir -p /home/site/nginx

cat > /home/site/nginx/default.conf <<'EOF'
client_max_body_size 2500M;
client_body_timeout 600s;
EOF

cp /home/site/nginx/default.conf /etc/nginx/conf.d/custom.conf

nginx -s reload 2>&1 || service nginx reload 2>&1 || echo "Nginx reload failed"

echo "=== Nginx configurado ==="

/opt/startup/init_container.sh