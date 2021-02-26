import axios from 'axios';
import {
  GET_CHARACTERS,
  GET_CHARACTERS_SUCCESS,
  GET_CHARACTERS_ERROR,
  REMOVE_CHARACTER,
} from '../types';
// require('dotenv').config({ path: '.env' });

// Constants
let initialData = {
  fetching: false,
  array: [],
  current: {}
}
let URL = "https://rickandmortyapi.com/api/character";

// Reducer
export default function reducer(state = initialData, action) {
  switch(action.type) {
    case GET_CHARACTERS:
      return {
        ...state,
        fetching: true
      }
    case GET_CHARACTERS_SUCCESS:
      return {
        ...state,
        array: action.payload,
        fetching: false
      }
    case GET_CHARACTERS_ERROR:
      return {
        ...state,
        error: action.payload,
        fetching: false
      }
    case REMOVE_CHARACTER:
      return {
        ...state,
        array: action.payload
      }
    default:
      return state
  }
}

// Action (action creator, thunk)
export let getCharactersAction = () => (dispatch, getState) => {
  dispatch({
    type: GET_CHARACTERS
  });
  return axios.get(URL)
    .then(res => {
      dispatch({
        type: GET_CHARACTERS_SUCCESS,
        payload: res.data.results
      })
    })
    .catch(error => {
      dispatch({
        type: GET_CHARACTERS_ERROR,
        payload: error.request.response
      });
    });
}

export let removeCharacterAction = () => (dispatch, getState) => {
  let { array } = getState().characters;
  array.shift();
  dispatch({
    type: REMOVE_CHARACTER,
    payload: [...array]
  });
}