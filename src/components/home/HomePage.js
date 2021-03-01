import React from 'react';
import Card from '../card/Card';
import styles from './home.module.css';
import { connect } from 'react-redux';
import { removeCharacterAction, addToFavoritesAction } from '../../redux/charsDuck';

function Home({chars, removeCharacterAction, addToFavoritesAction}) {

    function renderCharacter() {
        let char = chars[0];
        return (
            <Card
              rightClick={addFavorites}
              leftClick={nextCharacter}
              {...char}
            />
        )
    }

    function nextCharacter() {
      removeCharacterAction();
    }

    function addFavorites() {
      addToFavoritesAction();
    }

    return (
        <div className={styles.container}>
            <h2>Personajes de Rick y Morty</h2>
            <div>
                {renderCharacter()}
            </div>
        </div>
    )
}

// Trae lo que tenga Redux y lo pone en los props de este componente
function mapStateToProps(state) {
  return {
    chars: state.characters.array
  }
}

export default connect(mapStateToProps, { removeCharacterAction, addToFavoritesAction })(Home);