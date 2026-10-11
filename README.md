# Cleanova

Одностраничный сайт клининговой компании Cleanova (Москва): услуги и цены, преимущества, этапы работы, отзывы, вопросы, контакты и форма заявки.

Превью: https://cfvbhgc.github.io/cleanova/

Стек: Vite, React 19, TypeScript, Tailwind CSS 4, Motion. Страница заранее рендерится в HTML при сборке, поэтому видна до загрузки JavaScript.

## Установка и запуск

Нужен Node.js 20 или новее.

```bash
npm i            # установить зависимости
npm run dev      # локальный сервер, http://localhost:5173/cleanova/
npm run build    # сборка в папку dist
npm run preview  # посмотреть собранную версию
```

Содержимое `dist` можно выложить на любой статический хостинг.
Сайт собран под адрес `/cleanova/`. Для своего домена поменяйте `base` в `vite.config.ts` на `/`, а пути `/cleanova/` в `index.html` и `public/site.webmanifest` на `/`.

## Где править контент

Все тексты лежат в `src/content.ts`:

- `company`: телефон, почта, Telegram, адрес, часы работы, реквизиты. Сейчас там заглушки.
- `services`: пять услуг с ценами, описаниями и фото. Кнопка «Заказать» на карточке открывает форму с этой услугой.
- `hero`, `intro`, `rest`, `advantages`, `steps`, `faq`: тексты блоков.
- `reviews`: отзывы. Сейчас там три карточки-шаблона и флаг `reviewsAreTemplates = true`.
  Замените шаблоны настоящими отзывами и поставьте флаг в `false`. Пустой массив скрывает блок вместе с пунктом меню.

Помимо `content.ts` контакты встречаются ещё в двух местах, их стоит обновить вместе:

- `index.html`: title, description, Open Graph и разметка schema.org (телефон, адрес);
- `public/privacy.html`: оператор персональных данных и его реквизиты.

## Фото

Фото с Pexels, готовые webp и avif лежат в `public/img`. Чтобы заменить фото, положите исходник в `.cache/photos/<id>.jpg`
(или PNG без фона в `.cache/cutouts/` для кресла и предметов), поправьте список в `scripts/images.mjs` и запустите `npm run images`.

## Заявки

Форма проверяет имя, телефон, услугу и согласие, не даёт отправить заявку дважды и отсеивает ботов скрытым полем.
Отправку делает `submitLead()` в `src/lib/lead.ts`: POST с JSON на адрес из переменной `VITE_LEAD_ENDPOINT`.

- Переменная не задана: демо-режим, форма показывает успешную отправку, данные никуда не уходят.
- Переменная задана: заявка уходит на этот адрес.

```bash
echo "VITE_LEAD_ENDPOINT=https://ваш-обработчик" > .env.local
npm run build
```

Как подключить Telegram (готовый Cloudflare Worker) или CRM (amoCRM, Bitrix24), написано в `integrations/README.md`.

## Публикация на GitHub Pages

Workflow `.github/workflows/deploy.yml` собирает и публикует сайт при каждом push в `main`.
Адрес обработчика заявок берётся из переменной репозитория `VITE_LEAD_ENDPOINT` (Settings → Secrets and variables → Actions → Variables).
