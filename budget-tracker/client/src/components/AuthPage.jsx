import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const AuthPage = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);

    return isLogin ? (
        <Login setUser={setUser} toggle={() => setIsLogin(false)} />
    ) : (
        <SignUp setUser={setUser} toggle={() => setIsLogin(true)} />
    );
};

export default AuthPage;
