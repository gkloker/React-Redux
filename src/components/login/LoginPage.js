import React from 'react';
import styles from './login.module.css';
import { connect } from 'react-redux';
import { doGoogleLoginAction } from '../../redux/userDuck';

function LoginPage({fetching, loggedIn, doGoogleLoginAction}) {
  function Login() {
    doGoogleLoginAction();
  }

  if(fetching) return <h2>Loading...</h2>
  return (
    <div className={styles.container}>
      {console.log("test", loggedIn)}
      {loggedIn ?
        <h1>Cierra tu sesión</h1>
      :
        <h1>Inicia Sesión con Google</h1>
      }
      {loggedIn ?
        <button>Cerrar Sesión</button>
      :
        <button onClick={Login}>Iniciar</button>
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

export default connect(mapStateToProps, { doGoogleLoginAction })(LoginPage);