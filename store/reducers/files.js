import { GET_LOCAL_FILES_FAILED, SAVE_SENTENCES, REMOVE_SENTENCES, ADD_SENTENCE } from '../actions/actionTypes';

const initateState = {
    sentences: []
}

const reducer = (state = initateState, action) => {
    switch (action.type) {
        case (SAVE_SENTENCES): {
            return {
                ...state,
                sentences: action.sentences
            };
        }
        case (REMOVE_SENTENCES): {
            return {
                ...state,
            };
        }
        case (ADD_SENTENCE): {
            state.sentences.unshift(action.sentence);
            let result = [...state.sentences];
            return {
                ...state,
                sentences:result
            };
        }
        case (GET_LOCAL_FILES_FAILED): {
            return state;
        }
        default: return state;
    }
}

export default reducer;