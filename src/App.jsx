import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";

function App() {
    const [users, setUsers] = useState([])
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [errorCode, setErrorCode] = useState(null);

    const getAllUsers = () => {
        axios.get("http://localhost:8989/all")
            .then((response) => {
                setUsers(response.data.userList)
            })
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    const errorCodeMessage = () => {
        if (errorCode == 3000) {
            return "First name is required";
        } else if (errorCode == 3001) {
            return "Last name is required";
        }
        return "";
    }

    return (
        <>
            {
                errorCode != null &&
                <>
                    Something went wrong
                    <div>
                        {errorCodeMessage()}
                    </div>
                </>
            }

            <div>
                <div>
                    <input placeholder={"Enter first name"} value={firstName} onChange={(event) => {
                        setFirstName(event.target.value)
                    }}/>
                    <input placeholder={"Enter last name"} value={lastName} onChange={(event) => {
                        setLastName(event.target.value)
                    }}/>
                    <button
                        disabled={firstName.length == 0 || lastName.length == 0 || buttonDisabled}
                        onClick={() => {
                            setButtonDisabled(true);
                            axios.get("http://localhost:8989/create-user?first=" + firstName + "" +
                                "&last=" + lastName + "&phone=1234567")
                                .then((response) => {
                                    setButtonDisabled(false)
                                    if (response.data.success) {
                                        getAllUsers();
                                        setFirstName("");
                                        setLastName("")
                                    } else {
                                        setErrorCode(response.data.errorCode);
                                    }

                                })
                        }}>
                        Add
                    </button>
                </div>
                {
                    users.map(item => {
                        return (
                            <div>
                                {item.firstName}
                            </div>
                        )
                    })
                }

            </div>
        </>
    )
}

export default App
