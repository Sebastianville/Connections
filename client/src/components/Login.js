import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import React, { useContext, useState } from "react";
import { UserContext } from "./userContext"
import {  Button, Logo, Wrapper, Divider } from './StyledComponents';



function Login() {
    const { login } = useContext(UserContext); 
    const [showLogin, setShowLogin] = useState(true);
  
    return (
      <Wrapper>
        <Logo>ConnectingBuddy</Logo>
        {showLogin ? (
          <>
            <LoginForm onLogin={login} />
            <Divider />
            <p>
              Don't have an account? &nbsp;
              <Button onClick={() => setShowLogin(false)}>
                Sign Up
              </Button>
            </p>
          </>
        ) : (
          <>
            <SignUpForm onLogin={login} />
            <Divider />
            <p>
              Already have an account? &nbsp;
              <Button onClick={() => setShowLogin(true)}>
                Log In
              </Button>
            </p>
          </>
        )}
      </Wrapper>
    );
  }

  export default Login;