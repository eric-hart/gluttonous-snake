import { createStore, bindActionCreators, applyMiddleware } from 'redux';

import { composeWithDevTools } from 'redux-devtools-extension';

import snakeEatEggs from 'reducers/components/game/snakeEatEggs';

import { collisionDetection, selfEatingDetection } from 'middlewares/game/snakeEatEggs';

import snakeActionCreators from 'actions/game/snakeEatEggs/snake';

import eggsActionCreators from 'actions/game/snakeEatEggs/eggs';

import boundaryActionCreators from 'actions/game/snakeEatEggs/boundary';

import snakeEatEggsActionCreators from 'actions/game/snakeEatEggs/snakeEatEggs.js';

import Rtl from './Rtl';

import Eggs from './Eggs';

import Snake from './Snake';

/**
 * @class
 */
class SnakeEatEggs {
  /**
   * @constructor
   */
  constructor({ context=null, boundary=null, actions=null }) {
    this.actions = actions;
    this.context = context;

    this.initStore();
    this.initInstances();

    this.bindSubscribe();

    this.resizeBoundary(boundary);
  }

  resizeBoundary(boundary) {
    this.actions.resizeBoundary(boundary);
  }

  /**
   * @static
   * @method
   */
  initStore() {
    const middleware = [collisionDetection.bind(this), selfEatingDetection.bind(this)];
    const store = createStore(
      snakeEatEggs,
      composeWithDevTools(
        // other store enhancers if any
        applyMiddleware(...middleware),
      ),
    );
    const {
      dispatch,
    } = store;
    const {
      actions: outerActions,
    } = this;
    const innerActions = bindActionCreators({
      ...eggsActionCreators,
      ...snakeActionCreators,
      ...boundaryActionCreators,
      ...snakeEatEggsActionCreators,
    }, dispatch);
    this.actions = {
      ...outerActions,
      ...innerActions,
    };
    this.store = store;
  }

  bindSubscribe() {
    const {
      store,
      eggs,
      snake,
    } = this;
    store.subscribe(() => {
      const state = store.getState();
      eggs.mapStateToProps(state);
      snake.mapStateToProps(state);
    });
  }

  /**
   * @method
   */
  initInstances() {
    const {
      store: {
        dispatch,
      },
      context,
    } = this;

    let actions = bindActionCreators({
      ...snakeActionCreators,
    }, dispatch);
    this.snake = new Snake({ context, actions });

    actions = bindActionCreators({
      ...eggsActionCreators,
    }, dispatch);
    this.eggs = new Eggs({ context, actions });
  }

  /**
   * @method
   */
  draw() {
    const {
      eggs,
      snake,
    } = this;
    eggs.create();
    snake.move();
  }

  clear() {
    const {
      eggs,
      snake,
    } = this;
    eggs.clear();
    snake.destroy();
    this.actions.resetSnakeEatEggs();
  }
}

export default SnakeEatEggs;
