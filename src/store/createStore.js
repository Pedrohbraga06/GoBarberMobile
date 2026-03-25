import { createStore, compose, applyMiddleware } from 'redux';

// Ensure __DEV__ is defined
if (typeof __DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV === 'development';
}

export default (reducers, middlewares) => {
  const enhancer =
    __DEV__ === true
      ? compose(applyMiddleware(...middlewares), console.tron.createEnhancer())
      : compose(applyMiddleware(...middlewares));
  return createStore(reducers, enhancer);
};
