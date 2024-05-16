import {jwtDecode} from "jwt-decode";

export const isAuth = () => {
    return !!localStorage.getItem('authToken');
}

export const isAdmin = () =>{
    const token = localStorage.getItem('authToken')
    if (token) {
        const decoded = jwtDecode(token)
        return (decoded.is_admin == true)
    }
}

export const getID = () =>{
    const token = localStorage.getItem('authToken')
    if (token) {
        const decoded = jwtDecode(token)
        return decoded.id
    }
}

export const createUser = async (data) =>{
    console.log(data)
    const config = {
        method:'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'login': data.login,
            'name': data.name,
            'surname': data.surname,
            'thirdname': data.thirdName,
            'dateOfBirth': data.dateOfBirth,
            'password':data.password
        })
    }
    try {
        const response = await fetch("http://localhost:8001/api/v1/auth", config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
        }

        return response.status;
    } catch (error) {
        console.error('Fetch error:', error);
        return 500;
    }
}

export const loginUser = async (data) =>{
    console.log(data)
    const config = {
        method:'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'password': data.password,
            'username': data.login
        })
    }
    try {
        const response = await fetch("http://localhost:8001/api/v1/auth/token", config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error(`HTTP status ${response.status}`);
        }
        return await response.json(); // Return the parsed JSON body
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }

}