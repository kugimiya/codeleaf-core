import { toJS } from 'mobx';
import Store from './store/Store';

type Item = {
  id: number;
  name: string;
};

type Test = {
  value: number,
  arrayed: Item[];
};

class Tested extends Store<Test> {
  constructor() {
    super({
      value: 1,
      arrayed: [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
      ],
    });
  }
}

const tested = new Tested();

// eslint-disable-next-line no-console
console.log(toJS(tested.state));

tested.set('value', 2);
tested.setItem('arrayed', ({ id }) => id === 1, { name: 'test' });

// eslint-disable-next-line no-console
console.log(toJS(tested.state));
