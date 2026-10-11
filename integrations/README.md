# Куда отправлять заявки

Форма на сайте вызывает `submitLead()` из `src/lib/lead.ts`. Функция отправляет POST с JSON на адрес из переменной `VITE_LEAD_ENDPOINT`:

```json
{
  "name": "Анна",
  "phone": "+7 (916) 123-45-67",
  "service": "Генеральная уборка",
  "consent": true,
  "page": "https://cfvbhgc.github.io/cleanova/"
}
```

Сервер должен ответить статусом 2xx. Любой другой ответ или обрыв сети форма покажет как ошибку и предложит позвонить.
Если `VITE_LEAD_ENDPOINT` не задан, сайт работает в демо-режиме: заявка никуда не уходит, форма показывает успех.

Токены ботов и ключи CRM нельзя класть во фронтенд: всё, что начинается с `VITE_`, попадает в открытый JS.
Поэтому между сайтом и Telegram или CRM стоит маленький серверный обработчик.

## Telegram через Cloudflare Worker

Готовый обработчик лежит в `telegram-worker/`.

1. Создайте бота у [@BotFather](https://t.me/BotFather) и сохраните токен.
2. Добавьте бота в рабочий чат или напишите ему сами. Узнайте `chat_id`: откройте
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates` после любого сообщения в чате.
3. Впишите `TELEGRAM_CHAT_ID` и адреса сайта в `ALLOWED_ORIGIN` в `telegram-worker/wrangler.toml`.
4. Задеплойте воркер (нужен бесплатный аккаунт Cloudflare):

   ```bash
   cd integrations/telegram-worker
   npx wrangler login
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler deploy
   ```

   Wrangler выведет адрес вида `https://cleanova-leads.<аккаунт>.workers.dev`.
5. Укажите его сайту и пересоберите:

   ```bash
   echo "VITE_LEAD_ENDPOINT=https://cleanova-leads.<аккаунт>.workers.dev" > .env.local
   npm run build
   ```

   Для GitHub Actions добавьте переменную репозитория `VITE_LEAD_ENDPOINT`
   (Settings → Secrets and variables → Actions → Variables), workflow её уже читает.

Воркер проверяет origin, размер запроса, имя, телефон из 11 цифр и согласие, экранирует HTML и пересылает заявку одним сообщением.

## CRM по вебхуку

Схема та же: сайт шлёт JSON на ваш обработчик, обработчик создаёт сделку или лид в CRM.
Проще всего взять `telegram-worker/worker.js` и заменить запрос к Telegram на запрос к CRM.
Ключи CRM храните в секретах воркера (`npx wrangler secret put ...`).

### Bitrix24

1. В Битрикс24: Разработчикам → Другое → Входящий вебхук. Права: CRM.
2. Получите адрес вида `https://<портал>.bitrix24.ru/rest/<id>/<ключ>/` и сохраните его секретом `BITRIX_WEBHOOK`.
3. В воркере вместо отправки в Telegram:

   ```js
   await fetch(`${env.BITRIX_WEBHOOK}crm.lead.add.json`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       fields: {
         TITLE: `Заявка с сайта: ${service}`,
         NAME: name,
         PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
         SOURCE_ID: 'WEB',
         COMMENTS: lead.page,
       },
     }),
   })
   ```

### amoCRM

1. Создайте внешнюю интеграцию в amoCRM и получите долгосрочный токен.
2. Сохраните секреты `AMO_DOMAIN` (например `cleanova.amocrm.ru`) и `AMO_TOKEN`.
3. Создайте сделку с контактом одним запросом:

   ```js
   await fetch(`https://${env.AMO_DOMAIN}/api/v4/leads/complex`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.AMO_TOKEN}` },
     body: JSON.stringify([
       {
         name: `Заявка с сайта: ${service}`,
         _embedded: {
           contacts: [
             {
               first_name: name,
               custom_fields_values: [{ field_code: 'PHONE', values: [{ value: phone, enum_code: 'WORK' }] }],
             },
           ],
         },
       },
     ]),
   })
   ```

Если в CRM уже есть свой приёмник веб-форм (в Битрикс24 это CRM-формы, в amoCRM «Сайт» в источниках), можно указать его адрес
прямо в `VITE_LEAD_ENDPOINT`, но только если он принимает JSON и CORS-запросы с вашего домена. Обычно надёжнее оставить воркер посередине.
