import { fromJS } from 'immutable';

import { currentTime } from 'helpers/common';

const initialState = fromJS({
  id: currentTime(),
});

export default function eggs(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
