import { GET_TOKEN, SET_TOKEN } from './actionTypes';
import { AsyncStorage } from 'react-native';


export const setToken = (access_token, expiry_date) => {
    return {
        type: SET_TOKEN,
        access_token,
        expiry_date
    }
}

export const getToken = (authData) => {
    return {
        type: action.type,
    }
}

export const tryGetToken = () => {
    return dispatch => {
        const ggServiceAccountKey = {
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCV7CUTlzhGcpUl\nY9trMA7ud/hUJ6tRsybpWdGeLwi+BtAPuFhuVnQqhpvkf83WnFBJAAL3Uqn1v/zO\nAyFr5kkbhy9jXQSVZcMeNyG1c9Gf4Ygknf0AIS5EXgN1cPNV0tqposa0t2sTU59L\nlPoc3j8zHFrrVZtcBgeqhQSzUbKWecUBakeXHfpeW2Aez2m15OB6VL3bFi+ELRfZ\nIanrYztEtMH8vczziMJWinVpo4FWTI+l/e5HKPyiQ5BaFexfLDeTbYSTICCXnTlj\n78vwJ5gCiGOYBgwMkxHI7M3je58/8Bq8YOdB+w1AL5vZJly70QAuXKnq6zV6DeIM\niB2ltTt9AgMBAAECggEABowPenGKJZlvZficZmvs2wEmORaaZrD6LAqeGthW+2V0\nxJr6Uac433qNaEckiBC/eNClUIOtpGvD8IM2fG3MF4Wpzh8LyjJteO5TbIcoSmEg\n/uhfWhgY2yd34zMRjVft8KaJIu83n9pxBG33Fjembub4GXrdlAE3aHzynZodwHBz\ny5uzcCYUhZx2ryRgP7slzDhKj8C76mpX7FpS8LAbAzzP0ljGw7yuqLx5rkSSd5SO\nQ6HIRaVNeOnrEKZM2GLaeXwR97hdrH4dxv4BeLwdZudNB2dnDeUAGI0KMvtU1FWu\nPaTGkhkqchU0Sr6KnagNdDwJ9Cj/+2wtesB7ZmOcgQKBgQDER4WkKe1/tqDPTa0e\nWCiYNEuhd86QpzC0ZuE9e00KjJTJorDYsfHmPJu5BMs3ytY6PDTxlIMNBxf83TO8\nk6eEmKuqoICS4EUTe7ko34LlIuQCK2AgZnEYyBPgKnBqmGMox4MQ0R/g2bPnOl6Y\n0qPvD+s1+NMlX5+IPKwvNEnV0QKBgQDDidCv9nIS7FYtvm8YXwquTQEraT8QLi5y\n8q1BaY2KZ6MvWRpFm5+XGXkp/Zlt2NUpkSNWjgM4N/ABdT9vx0B2e4N3N0oYdmyE\nn2wV2ZSV+vNHmbD4l6Mi57NLGsNOcgPcA0QlnREmvixr0HBXqUAcAYHk/XVBQwaw\nfkk5JML57QKBgQCSodv1CF2lS4pXVHBAexvYmTjnJ9nptv1ryG/8vmCPwPZmrGPx\nfv54Qk8TqcEnrSDd4Jys3YYJ9YK2JYrBFo3PQT79+WoUT/dK1uM85b2j8Kzl8gGe\nMunK2a3/ibTx7WYm0OXZamGmWP1NgQ2qnbJapknRyFH1WbqUzL7VhPqkAQKBgHCm\naO+2zylPtqZL27zypDiebFoSHB66PFBEtsPEh6KA6mZQsu3/JgXqyv8B9u5tyQBV\neUJYNkqhD0gHwDApXl3j8m0wESPetc4B+kbsPsnY9Wb+iBHvajClw4k1NedvkAGk\ncBIrVsI3NWg3gUE/ZIu94pOF4ZNjhesQFicxopJRAoGAZiThF+LJxpKVqUw2fseo\n8q3svfBbWSI/nllFfs3p7ytzHN2g5y8RzUOjPFdovqY7zp/x+YowmScAh8z1ykIQ\nSpOpQy1BZdZimMUH6eTgcUf6tauhq68bIvtaSuj3on3/Fk+Pqzii8x7g7MwMhP0S\nKaNdoZoSFsPAlAmYyHSY6ko=\n-----END PRIVATE KEY-----\n",
            client_email: "starting-account-rxxn983u28p@english-speech-p-1521268430467.iam.gserviceaccount.com",
        }
        fetch('https://fast-tundra-15456.herokuapp.com/access-token', {
            method: 'POST',
            body: JSON.stringify(ggServiceAccountKey),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                dispatch(setStoredToken(result.access_token, result.expiry_date))
            })
            .catch(err => console.log(err));
    }
}

export const tryGetStoredToken = () => {
    return dispatch => {
        let accessToken = null;
        let expirtyDate = null;
        AsyncStorage.getItem("auth:access:token")
            .then(access_token => {
                accessToken = access_token;
                if (!access_token) {
                    dispatch(tryGetToken())
                }
                else {
                    AsyncStorage.getItem("auth:expiry:date")
                        .then(expiry_date => {
                            expirtyDate = expiry_date;
                            if (parseInt(expiry_date) < new Date().getTime())
                                dispatch(tryGetToken());
                            else {
                                dispatch(setToken(accessToken,expirtyDate))
                            }
                        })
                }
            })
    }
}

export const setStoredToken = (access_token, expiry_date) => {
    return dispatch => {
        console.log(expiry_date);
        AsyncStorage.setItem("auth:access:token", access_token);
        AsyncStorage.setItem("auth:expiry:date", expiry_date.toString());
        dispatch(setToken(access_token, expiry_date));
    }

}


