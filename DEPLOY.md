# Deploy Guide — Ubuntu + ISPmanager

## Требования
- Ubuntu 20.04 / 22.04
- Node.js 20+ (LTS)
- PM2 (менеджер процессов)
- ISPmanager (для домена, SSL, nginx reverse proxy)

---

## 1. Установка Node.js на сервере

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # должно быть v20.x
npm -v
```

## 2. Установка PM2

```bash
sudo npm install -g pm2
```

## 3. Загрузка проекта на сервер

Вариант A — через Git:
```bash
git clone <your-repo-url> /var/www/techdoc
cd /var/www/techdoc
```

Вариант B — через scp/sftp (загрузить архив):
```bash
# На локальной машине:
scp -r . user@your-server:/var/www/techdoc
```

## 4. Установка зависимостей и сборка

```bash
cd /var/www/techdoc
npm install
npm run build
```

## 5. Права на data-папку (файловая БД)

Проект хранит данные в `data/requests.json` и `data/content.json`.  
Убедитесь, что папка доступна для записи:

```bash
chmod 755 /var/www/techdoc/data
chmod 644 /var/www/techdoc/data/*.json
```

## 6. Запуск через PM2

```bash
cd /var/www/techdoc
pm2 start npm --name "techdoc" -- start
pm2 save
pm2 startup   # автозапуск при перезагрузке сервера
```

Проверить статус:
```bash
pm2 status
pm2 logs techdoc
```

По умолчанию Next.js слушает порт **3000**.

## 7. Настройка Nginx в ISPmanager (reverse proxy)

В ISPmanager: **WWW-домены → ваш домен → Настройки → Дополнительные директивы nginx**

Добавить в конфиг домена:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## 8. SSL (HTTPS)

В ISPmanager: **WWW-домены → ваш домен → SSL-сертификат → Let's Encrypt**  
Выпустить сертификат — ISPmanager сделает всё автоматически.

## 9. Переменные окружения

Создать файл `.env.local` в корне проекта:

```bash
nano /var/www/techdoc/.env.local
```

Минимальное содержимое:
```
NODE_ENV=production
```

> Если в будущем добавите секреты (API ключи и т.д.) — добавляйте сюда, не в код.

## 10. Обновление сайта (деплой новой версии)

```bash
cd /var/www/techdoc
git pull origin master
npm install
npm run build
pm2 restart techdoc
```

---

## Проверка

- Сайт открывается по домену: `https://yourdomain.com`
- Админ-панель: `https://yourdomain.com/admin`
- Заявки сохраняются в `data/requests.json`

## Важно

- **БД не требуется** — данные хранятся в JSON-файлах на диске
- Делайте бэкапы папки `data/` — там все заявки клиентов
- `node_modules/` не заливать на сервер через scp — только через `npm install`
