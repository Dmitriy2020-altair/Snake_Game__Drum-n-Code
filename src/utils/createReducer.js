export default function createReducer(config) {
  const { name, initialState, reducers } = config;

  console.log('%c%s', 'color: lightgray; font: 16px Tahoma;', 'Action: ', { type: `${name}/initialization` });
  console.log(
    '%c%s',
    'color: lightgray; font: 16px Tahoma;',
    'State: ',
    { initialState },
  );

  const rootReducer = (state = initialState, action) => {
    const { type, payload = null } = action;

    console.log('%c%s', 'color: lightgray; font: 16px Tahoma;', 'Action: ', { type, payload });

    let copyOfState = { ...state };
    let mergedState;

    if (reducers[type]) {
      mergedState = reducers[type](copyOfState, payload);
    } else return state;

    console.log(
      '%c%s',
      'color: lightgray; font: 16px Tahoma;',
      'State changes: ',
      { prevState: state, nextState: mergedState ?? copyOfState },
    );

    return mergedState ?? copyOfState;
  };

  rootReducer.actions = {};

  for (const reducerName of Object.keys(reducers)) {
    rootReducer.actions[reducerName] = (payload) => ({ type: reducerName, payload });
  }

  rootReducer.initialState = initialState;

  return rootReducer;
}
