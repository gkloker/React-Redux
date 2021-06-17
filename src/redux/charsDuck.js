import axios from 'axios';
import ApolloClient, {gql} from 'apollo-boost';
import {
  updateDB,
  getFavorites
} from '../config/firebase';
import {
  GET_CHARACTERS,
  GET_CHARACTERS_SUCCESS,
  GET_CHARACTERS_ERROR,
  REMOVE_CHARACTER,
  ADD_FAVORITES,
  GET_FAVORITES,
  GET_FAVORITES_SUCCESS,
  GET_FAVORITES_ERROR,
  UPDATE_PAGE,
} from '../types';
import {getLocalStorage, saveLocalStorage} from "../common/helper";

// Constants
let initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
  nextPage: 1
}

let client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql"
})

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
    case ADD_FAVORITES:
      return {
        ...state,
        ...action.payload
      }
    case GET_FAVORITES:
      return {
        ...state,
        fetching: true
      }
    case GET_FAVORITES_SUCCESS:
      return {
        ...state,
        favorites: action.payload,
        fetching: false
      }
    case GET_FAVORITES_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload
      }
    case UPDATE_PAGE:
      return {
        ...state,
        nextPage: action.payload
      }
    default:
      return state
  }
}

// Action (action creator, thunk)
export let getCharactersAction = () => (dispatch, getState) => {
  let query = gql`
    query ($page:Int) {
      characters (page:$page) {
        info {
          pages
          next
          prev
        }
        results {
          name
          image
        }
      }
    }
  `;

  dispatch({
    type: GET_CHARACTERS
  });

  let {nextPage} = getState().characters;

  return client.query({
    query,
    variables:{page: nextPage}
  })
  .then(({data, error}) => {
    if (error) {
      dispatch({
        type: GET_CHARACTERS_ERROR,
        payload: error
      });

      return;
    }

    dispatch({
      type: GET_CHARACTERS_SUCCESS,
      payload: data.characters.results
    });

    dispatch({
      type: UPDATE_PAGE,
      payload: data.characters.info.next ? data.characters.info.next : 1
    });
  });
}

export let removeCharacterAction = () => (dispatch, getState) => {
  let { array } = getState().characters;
  array.shift();

  if (!array.length) {
    getCharactersAction()(dispatch, getState);
    return;
  }

  dispatch({
    type: REMOVE_CHARACTER,
    payload: [...array]
  });
}

export let addToFavoritesAction = () => (dispatch, getState) => {
  let {array, favorites} = getState().characters;
  let { uid } = getState().user
  let char = array.shift();

  favorites.push(char);

  updateDB(favorites, uid);

  dispatch({
    type: ADD_FAVORITES,
    payload: {
      array: [...array],
      favorites: [...favorites]
    }
  });
}

export let retreiveFavorites = () => (dispatch, getState) => {
  dispatch({
    type: GET_FAVORITES
  });

  let {uid} = getState().user

  return getFavorites(uid)
    .then(array => {
      dispatch({
        type: GET_FAVORITES_SUCCESS,
        payload: [...array]
      })
      saveLocalStorage(getState());
    })
    .catch(e => {
      console.log(e);
      dispatch({
        type: GET_FAVORITES_ERROR,
        payload: e.message
      })
    })
}