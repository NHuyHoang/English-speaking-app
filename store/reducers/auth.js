import { SET_TOKEN } from '../actions/actionTypes'
const initateState = {
    api_uri: "https://speech.googleapis.com/v1/speech:recognize",
    access_token: null,
    expiry_date: null,
}

const reducer = (state=initateState,action) => {
    switch(action.type){
        case(SET_TOKEN):{
            return {
                ...state,
                access_token:action.access_token,
                expiry_date:action.expiry_date
            };
        }
        default: return state;
    }
}

export default reducer;