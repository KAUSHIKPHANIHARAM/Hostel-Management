import { createContext, useState } from "react";
export const loginContextObj = createContext();
import React from 'react'

function LoginContext({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loginStatus, setLoginStatus] = useState(false)
    const [loginError, setLoginError] = useState(null);

    //user login
    function userLogin({ username, password }) {
        fetch(`http://localhost:5000/users?username=${username}&password=${password}`)
            .then(res => res.json())
            .then((formObj) => {
                //console.log(formObj)
                if (formObj.length === 0) {
                    setLoginError({ message: "UserName or password not correct" })
                }
                else {
                    setCurrentUser(formObj[0])
                    setLoginError(null);
                    setLoginStatus(true)
                }
            })
            .catch(err => {
                console.log("Err is: ", err)
            })
    }

    //user logout
    function userLogout() {
        setCurrentUser(null)
        setLoginError(null);
        setLoginStatus(false)
    }
    return (
        <div>
            <loginContextObj.Provider value={{ currentUser, setCurrentUser, loginStatus, loginError, userLogin, userLogout }}>
                {children}
            </loginContextObj.Provider>

        </div>
    )
}

export default LoginContext
