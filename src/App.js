import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import {AuthorizationRequest, AuthorizationServiceConfiguration, RedirectRequestHandler} from "@openid/appauth";

export default function App() {

  let authUri = 'https://accounts.google.com/o/oauth2/v2/auth';
  let tokenUri = 'https://oauth2.googleapis.com/token';
  let clientId = '242389526169-go0ks1io09t3eqk5j9u9nfo922e1q79o.apps.googleusercontent.com';
  let redirectUri = 'http://localhost:3000/callback';
  let scope = 'profile';

  let configuration = new AuthorizationServiceConfiguration({
    authorization_endpoint: authUri,
    token_endpoint: tokenUri
  });
  let authorizationHandler = new RedirectRequestHandler();

  // create a request
  let request = new AuthorizationRequest({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
    state: undefined,
    extras: {'prompt': 'consent', 'access_type': 'offline'}
  });

  const Routes = () => {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/callback" component={Callback} />
        <Route path="/" component={Home} />
      </Switch>
    )
  }

  const Home = props => {
    console.log('Home', props);
    return <h2>Home</h2>;
  }

  const Callback = props => {
    console.log('Callback', props);
    const params = new URLSearchParams(props.location.search);
    return (
      <React.Fragment>
        <h2>Callback</h2>
        <h4>Code: {params.get('code')}</h4>
        <h4>State: {params.get('state')}</h4>
        <h4>Scope: {params.get('scope')}</h4>
      </React.Fragment>
    );
  }

  const Login = props => {
    console.log("Login", props);
    authorizationHandler.performAuthorizationRequest(configuration, request);
    return null;
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


