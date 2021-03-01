import React from 'react';
import styles from './login.module.css';
import { connect } from 'react-redux';
import { doGoogleLoginAction, logOutAction } from '../../redux/userDuck';

function LoginPage({
  fetching,
  loggedIn,
  doGoogleLoginAction,
  logOutAction}) {
  function login() {
    doGoogleLoginAction();
  }

  function logOut() {
    logOutAction();
  }

  if(fetching) return <h2>Loading...</h2>
  return (
    <div className={styles.container}>
      {loggedIn ?
        <h1>Cierra tu sesión</h1>
      :
        <h1>Inicia Sesión con Google</h1>
      }
      {loggedIn ?
        <button onClick={logOut}>Cerrar Sesión</button>
      :
        <button onClick={login}>Iniciar</button>
      }
    </div>
  )
}

function mapStateToProps({ user: { fetching, loggedIn } }) {
  return {
    fetching,
    loggedIn
  }
}

export default connect(mapStateToProps, { doGoogleLoginAction, logOutAction })(LoginPage);