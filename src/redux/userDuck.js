import { loginWithGoogle } from '../config/firebase';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR
} from '../types/index';

// Constants
let initialData = {
  loggedIn: false,
  fetching: false,
}

// Reducer
export default function reducer(state = initialData, action) {
  switch(action.type) {
    case LOGIN:
      return {
        ...state,
        fetching: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        ...action.payload,
        loggedIn: true
      }
    case LOGIN_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    default:
      return state
  }
}

// Action (action creator)
export let doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({
    type: LOGIN
  })
  return loginWithGoogle()
    .then(user => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          uid: user.displayName,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }
      });
      saveLocalStorage(getState());
    })
    .catch(e => {
      dispatch({
        type: LOGIN_ERROR,
        payload: e.message
      });
    });
}

export let restoreSessionAction = () => dispatch => {
  let storage = localStorage.getItem("storage");
  storage = JSON.parse(storage);
  if (storage && storage.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: storage.user
    })
  }
}

// Aux function
function saveLocalStorage(storage) {
  localStorage.storage = JSON.stringify(storage);
}