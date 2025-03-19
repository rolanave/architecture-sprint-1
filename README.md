# Task 1. Overview 
Project Mesto is used to show possibility of splitting solid frontend to several microfrontends

## Stack Overview
`Webpack Module Federation` framework is used for microfrontends isolation and routing requests between microfrontends and backend. Reason why Webpack Module Federation is selected:
- simplified configuration in comparison with SingleSPA
- allows to reuse common code (e.g. PopupWithForm component can be shared bw MFs) that allows to reduce bundle size and avoid code duplication
- no requirements to use different js frameworks for the test project. React can be used for all MFs
- single repository can be used for all MFs
- allows to migrate from solid/monolith to microfronted solution without changing CI/CD.

## Initial requirements

Project has to support:
1. user management such as register new user, login and logout
2. user profile management such as update avatar and edit profile
3. place management such as view places, add new place, delete place, like place

## Solution description

### Separation to Microfrontends (MFs)

It is suggested to split solid frontent vertically to several microfrontends to support isolation between:

1. `Auth` - responsible for user registration and login to system (it can also be split to login and registration but they are looked too small)

2. `User` - responsible to show and update user avatar and profile for registered user

3. `Places` - responsible to add new place, show places, remove or like place for registered user

since each of them looks independent, may be supported by separate team and with own JS framework. Morever backend is already support the following independent services (controllers):
- `signup` and `signing` that can be used by `Auth` mf
- `users` that can be used by `User` mf
- `cards` that can be used by `Places` mf

As a result such transformation can be made transparently for backend with using BFF like approach.

### MF Interactions

With suggested separation as above the following interactions are expected between MFs:
- onLoggedIn - from Auth towards both Users and Places, that triggers
    - loading and showing Avatar and Profile on User MF 
    - loading and showing list of place cards on Place MF

- onLoggedOut - from Auth towards both Users and Places, that hides these MFs

## Project structure

1. `host` application that includes the following components
    - `App` - which is assembly point for the site and runs Auth MF (Login and Register) 
    - `Main` -  main body for page as soon as user Logged in and point that runs Places and User MFs
    - `Header` - header for page
    - `Footer` - footer for page 
2. `auth-microfrontend` MF app that includes:
    - `Login` - implemets login function (public)
    - `Register` - implements register function (public)
    - `InfoTooltip` - Info Popup (internal)
3. `user-microfrontend` MF app that includes:
    - `UserControl` implements logic of showing and updating users' avatar and profile (public)
    - `EditAvatarPopup` popup to update avatar (internal)
    - `EditProfilePopup` popup to update profile (internal)
4. `places-microfrontend` MF app that includes:
    - `PlacesControl` implements logic of showing and updating places (public)
    - `AddPlace` implements logic of adding new place (public)
        (it was separted from PlacesControl since on the initial FE it is part
        of profile section) 
    - `Card` represent single place item (internal)
    - `AddPlacePopup` popup to add new place (internal)
5. `mesto-common-comp` Library that includes shared components and controls used by different MFs:
    - `PopupWithForm` - generic popup form

# Task 2. Разделение на микросервисы
## Описание решения

После изучения исходной диаграммы можно предположить, что решение представляет собой торговую площадку на которой
 можно организовать:
- продажу товаров 
- поставку набора услуг
- закупку товаров

Кроме того решение поддерживает генерацию отчетов, систему аппеляций для аукционов или заказов и систему поддержки
 пользователей. 

Пользователь такой системы может быть:
- Поставщиком товара (товаров)
- Исполнителем услуг
- Заказчиком, который хочет заказать товары и/или услуги
- Продавцом, который хочет продать уникальный товар через аукцион

Также есть специальные виды пользователей: Администратор и Служба поддержки.

## Микросервисы

С точки зрения доменной области можно выделить следующий набор
основных функций/сервисов:

- `управление пользователем`
          Отвечает за жизненный цикл профиля пользователя (регистрацию и изменение) и аутентификацию

- `управление услугами`
          Отвечает за добавление и изменение услуги предоставляемой или нужной пользователю

- `управление товарами`
          Отвечает за добавление и изменение товаров пользователя на продажу или покупку

- `управление заказами`
          Отвечает за создание (в том числе и наполнения товарами и услугами), 
          изменение, модерацию (валидацию), опубликование.

          Жизненный цикл заказа:
          1) создан
          2) ожидает оплаты  (после подтверждения)
          3) размещен (после оплаты)
          4) ожидает отмены оплаты (в случае отмены)

- `управление аукционами` 
          Создание аукциона на покупку или продажу на базе заказа. Подача заявок на аукцион
         и инициацию платежа в обеспечение заявки на покупку (ставки)

          Жизненный цикл заявки на покупку (ставки):
          1) создана
          2) ожидает резервации  (после подтверждения)
          3) активна (после оплаты, если ставка в топе)
          4) ожидает отмены оплаты (ставка перебита)
          5) отменена (после отмены резервации)
          6) ожидает оплаты (ставка выиграла)
          7) подтверждена (после подтверждения оплаты зарезервированной выигравшей ставки)

Кроме того еще можно выделить несколько нефункциональных компонент:
- `сервис оплаты` 
           Сервис отвечает за проведение транзакций с платежными операциями, запрос оплаты/отмены оплаты
           Сервис слушает нотификации на изменение статуса заказа и ставки. В случае смены статуса
           на Ожидание платежа/резервации/отмены платежа инициирует платеж/резервацию или
           отмену платежа. 
           Сервис использует Заказ.ID и Пользователь.ID как уникальный ключ для дедупликации нотификаций

- `сервис аппеляций` 
           Сервис отвечает за заведение апелляций по аукционам

- `сервис поддержки`
           Сервис отвечает за поддержку по разным вопросам

- `сервис генерации отчетов`
            Сервис поддерживает периодические и непериодические генерации отчетов (по заказам, продажам)
            Настройка отчетов не представлена на схеме.

- `сервис нотификаций`  
            Сервис который отвечает за формирование нотификаций. Пользователь и Администратор могут подписываться 
            на события, чтобы получать детали. Например публикация нового заказа или появление заявки на поддержку. 
            Он использует данные пользователя (язык, заданные контакты для нотификаций, шаблоны нотификаций) для генерации
            нотификаций пользователю. Сервис интегрируется с внешними системами (SMTP, SMS-GW, внутренние очереди). 
            Интеграция не представлена на схеме. Микросервисы посылают нотфикации через брокер сообщений (такой как kafka)

