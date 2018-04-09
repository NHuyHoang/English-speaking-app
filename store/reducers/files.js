import { GET_LOCAL_FILES_FAILED, GET_LOCAL_FILES_SUCCESSFUL } from '../actions/actionTypes';

const initateState = {
    sentences:[]
}

const reducer = (state=initateState,action) => {
    switch(action.type){
        case(GET_LOCAL_FILES_SUCCESSFUL):{
            return {
                ...state,
               sentences:[...action.sentences]
            };
        }
        case(GET_LOCAL_FILES_FAILED):{
            return state;
        }
        default: return state;
    }
}

export default reducer;