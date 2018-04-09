import { GET_LOCAL_FILES_FAILED, GET_LOCAL_FILES_SUCCESSFUL } from "./actionTypes";
import { AsyncStorage } from 'react-native'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import fs from 'react-native-fs';

const getLocalFilesSuccesful = (sentences) => {
    return {
        sentences,
        type: GET_LOCAL_FILES_SUCCESSFUL
    }
}

const getLocalFilesFailed = () => {
    return {
        type: GET_LOCAL_FILES_FAILED
    }
}


export const tryGetLocalFile = () => {
    return dispatch => {
        console.log(
            'dispatched'
        )
        //AsyncStorage.setItem("senetences:files","good morning@@good after noon")
        AsyncStorage.getItem("senetences:files")
            .then(files => {
                if(files === null )dispatch(getLocalFilesFailed())
                else dispatch(getLocalFilesSuccesful(convertFileToArray(files)))
            })
        //.then(() => dispatch(getLocalFilesSuccesful()))

    }
}

const convertFileToArray = (files) => {
    return arr = files.split("@@")// "senetences@@files" --> ["sentences", "files"]
}