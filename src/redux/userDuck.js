import { loginWithGoogle, logoutGoolge } from '../config/firebase';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOG_OUT,
} from '../types/index';
import { retreiveFavorites } from './charsDuck';
import {
  saveLocalStorage,
  getLocalStorage,
  removeLocalStorage
} from "../common/helper";

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
    case LOG_OUT:
      return {
        ...initialData
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

      retreiveFavorites()(dispatch, getState);
    })
    .catch(e => {
      dispatch({
        type: LOGIN_ERROR,
        payload: e.message
      });
    });
}

export let logOutAction = () => (dispatch, getState) => {
  logoutGoolge();

  dispatch({
    type: LOG_OUT
  });
  removeLocalStorage('storage');
}

export let restoreSessionAction = () => dispatch => {
  let storage = JSON.parse(getLocalStorage('storage'));

  if (storage && storage.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: storage.user
    });
  }
}