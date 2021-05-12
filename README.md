# @codeleaf-sdk/core
[![npm version](https://badge.fury.io/js/%40codeleaf-sdk%2Fcore.svg)](https://badge.fury.io/js/%40codeleaf-sdk%2Fcore)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@codeleaf-sdk/core@2.1.3?label=gzipped)

_Очень простое управление микро-архитектурой приложения_

---

## Полезные ссылки
[Wiki](https://github.com/codeleaf-sdk/core/wiki) <br />
[Обсуждение](https://github.com/codeleaf-sdk/core/discussions)

---

## Описание
Эта библиотека предназначенна для помощи в создании React-приложений с чем-то похожим на архитектуру. За основу взят [MobX](https://mobx.js.org). Библиотека позволяет организовать поток данных через инъекцию зависимостей (как в NestJS), а так же более приятно управлять состоянием.

---

## Установка
```sh
yarn add @codeleaf-sdk/core

# required dependencies
yarn add mobx mobx-react-lite react
```

---

## Пример инициализации хранилища
```typescript
type Item = {
  id: number;
  name: string;
}

type Test = {
  value: number,
  arrayed: Item[];
}

class Tested extends Store<Test> {
  constructor() {
    super({
      value: 1,
      arrayed: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ],
    });
  }
}
```

## Пример изменения поля `value`
```typescript
const test = new Tested();
test.set('value', 2);

// Да, вот так просто!
```

## Пример изменения элемента массива
```typescript
const test = new Tested();
test.setItem('arrayed', ({ id }) => id === 1, { name: 'test' });

// Не то, чтобы это очевидная конструкция
// Но очень полезная!
```

## Пример инициализации модуля с зависимостями
```typescript
const { Store, Service } = CreatePageModule<PageStore, PageService>({
  store: [
    PageStore,
    [
      { target: FetchStore, args: [] },    /* controls data's fetch state */
      { target: TogglersStore, args: [] }, /* controls view mode */
      { target: TogglersStore, args: [] }, /* controls visibility */
    ],
  service: [PageService, null /* no dependencies */],
});
```
