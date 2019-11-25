import React, { useState, useEffect } from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {
  AuthorizationRequest,
  AuthorizationServiceConfiguration,
  BaseTokenRequestHandler, FetchRequestor,
  GRANT_TYPE_AUTHORIZATION_CODE,
  GRANT_TYPE_REFRESH_TOKEN,
  RedirectRequestHandler,
  TokenRequest
} from "@openid/appauth";

export default function App() {

  const authUri = 'https://accounts.google.com/o/oauth2/v2/auth';
  const tokenUri = 'https://oauth2.googleapis.com/token';
  const clientId = '242389526169-go0ks1io09t3eqk5j9u9nfo922e1q79o.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:3000/callback';
  const scope = 'profile';

  const configuration = new AuthorizationServiceConfiguration({
    authorization_endpoint: authUri,
    token_endpoint: tokenUri
  });
  const authorizationHandler = new RedirectRequestHandler();
  const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());

  const authRequest = new AuthorizationRequest({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    state: undefined,
    extras: {'prompt': 'consent', 'access_type': 'offline'}
  });

  let tokenResponse = null;


  const Routes = () => {
    return (
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/callback" component={Callback}/>
        <Route path="/" component={Home}/>
      </Switch>
    )
  }

  const Home = props => {
    console.log('Home', props);
    return <h2>Home</h2>;
  }

  const Login = props => {
    console.log("Login", props);
    authorizationHandler.performAuthorizationRequest(configuration, authRequest);
    return null;
  }

  const Callback = props => {
    console.log('Callback', props);
    const params = new URLSearchParams(props.location.search);
    const code = params.get('code');

    useEffect(() => {
      console.log('performTokenRequest', code);

      const tokenRequest = new TokenRequest({
        client_id: clientId,
        redirect_uri: redirectUri,
        grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
        code: code,
        refresh_token: undefined,
        extras: {}
      });
      //
      // const refreshRequest = new TokenRequest({
      //   client_id: clientId,
      //   redirect_uri: redirectUri,
      //   grant_type: GRANT_TYPE_REFRESH_TOKEN,
      //   code: undefined,
      //   refresh_token: tokenResponse.refreshToken,
      //   extras: undefined
      // });

      // returns an error from google about missing client_secret, but at least it's making the call
      tokenHandler.performTokenRequest(configuration, tokenRequest)
        .then(response => {
          tokenResponse = response;
          console.log('TokenResponse', tokenResponse);
        }, []);
    });

    return (
      <React.Fragment>
        <h2>Callback</h2>
        <h4>Code: {code}</h4>
        <h4>State: {params.get('state')}</h4>
        <h4>Scope: {params.get('scope')}</h4>
      </React.Fragment>
    );
  }

  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/Login">Login</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <Routes/>
    </BrowserRouter>
  );
}
