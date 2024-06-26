'use strict';

import { StateRadio } from '../lib/state-radio.js';
import _useStorage from '@kizz-js/use-local-storage';

// define states
let nums = [1, 2, 3];
let user = {
  name: 'js',
  age: 20,
};

// configure plugins
let localStorage = {
  name: 'localStorage',
  plugin: _useStorage,
  options: { encrypt: false },
  setter: {
    method: _useStorage.setState,
    options: { cache: true },
  },
  getter: {
    method: _useStorage.getState,
    options: {},
  },
  exposes: [{ name: 'onLocalChange', method: _useStorage.onChange }],
};

// Create a logging plugin
const logging = {
  name: 'loggingPlugin',
  setter: {
    method: (state, options) => {
      // Add a 'logEntry' key with a timestamp to the state
      console.log('do something with state via plugin');
      console.log('log:', state, 'options:', options);
      return [...state, 100];
    },
    options: { cry: 'meow meow!!' },
  },
  getter: {
    method: (state, options) => {
      // No special behavior for getting in this example
      return state;
    },
    options: {},
  },
  // No exposes in this example, as it's a simple logging plugin
};

// add plugins when initializing a new state radio
const { channels } = new StateRadio({
  // plugins: [localStorage],
  plugins: [logging],
});

// add channels to radio station
let numberChannel = channels.addChannel('numberChannel', nums);
let userChannel = channels.addChannel('userChannel', user);

// use a plugin on a channel and the channel usage remains the same
// numberChannel.usePlugin('localStorage');
numberChannel.usePlugin('loggingPlugin');

// execute methods exposed by plugin
// numberChannel.onLocalChange((e) =>
//   console.log('Local storage state has changed via plugin!')
// );

// update number channel
numberChannel.setState((oldState) => [...oldState, 4]);
console.log('Number Channel State:', numberChannel.getState());

// update user channel
userChannel.setState((user) => ({ ...user, name: 'Kizz' }));
console.log('User Channel State:', userChannel.getState());
console.log('channels log 1:', channels.getChannels());

// add channel, get channel and remove channel
channels.addChannel('uselessChannel', 'foobar!');
let uselessChannel = channels.getChannel('uselessChannel');
console.log('Useless Channel State:', uselessChannel.getState());
let newChannels = channels.removeChannel('uselessChannel');

console.log('channels log 2:', newChannels);

// subscriptions
let callback = (newState) =>
  console.log('Number channel changed to:', newState);
numberChannel.subscribe(callback);
numberChannel.setState((oldState) => [...oldState, 5]);
console.log('Number Channel State 2:', numberChannel.getState({ auto: false }));
// numberChannel.unSubscribe(callback);
numberChannel.setState((oldState) => [...oldState, 6]);
console.log('Number Channel State 3:', numberChannel.getState({ auto: false }));

// middlewares
const addOneToEach = async (state) => {
  console.log('Async Middleware 1 Operating..');
  // add 1 to each num in state
  let newNums = state.map((n) => n + 1);
  // Simulate an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return newNums;
};

const removeOddNums = async (state) => {
  console.log('Async Middleware 2 Operating..');
  // add 1 to each num in state
  let newNums = state.filter((n) => n % 2 === 0);
  // Simulate an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 500));
  return newNums;
};

numberChannel.addMiddleWares(addOneToEach, removeOddNums);

numberChannel
  .setStateAsync((oldState) => [...oldState, 7])
  .then((updatedState) => {
    console.log('Async state updated:', updatedState);
  })
  .catch((error) => {
    console.error('Error updating state:', error);
  });
