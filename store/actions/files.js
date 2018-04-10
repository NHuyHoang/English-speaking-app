import { GET_LOCAL_FILES_FAILED, SAVE_SENTENCES, REMOVE_SENTENCES, ADD_SENTENCE } from "./actionTypes";
import { AsyncStorage } from 'react-native'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import fs from 'react-native-fs';
const SEPERATOR = "@@";
const SENTENCES_FILE = "sentences:files";

const saveSentences = (sentences) => {
    return {
        sentences,
        type: SAVE_SENTENCES
    }
}

const addSentence = (sentence) => {
    return {
        sentence,
        type:ADD_SENTENCE
    }
}

const removeSentences = () => {
    return {
        type: REMOVE_SENTENCES
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
        //AsyncStorage.setItem(SENTENCES_FILE,"good morning@@good afternoon")
        AsyncStorage.getItem(SENTENCES_FILE)
            .then(files => {
                if (files === null) dispatch(getLocalFilesFailed())
                else dispatch(saveSentences(convertFileToArray(files)))
            })
    }
}

export const tryConvertFile = (filesConvert) => {
    return dispatch => {
        let sentences = filesConvert.split("\n");
        sentences = sentences.map(sentence => sentence.trim());
        AsyncStorage.getItem(SENTENCES_FILE)
            .then(files => {
                let save;
                //prevent adding duplicate sentences
                let localFiles = convertFileToArray(files)
                sentences = filesFilter(localFiles, sentences);
                if (sentences.length === 0) return;
                let data = sentences.join(SEPERATOR);
                if (!files) save = data;
                else {
                    save = files.concat(SEPERATOR, data);
                }
                sentences = sentences.concat(localFiles)
                dispatch(saveSentences(sentences));
                AsyncStorage.setItem(SENTENCES_FILE, save);
            })
    }
}

export const tryRemoveSentences = (removeFiles) => {
    return dispatch => {
        AsyncStorage.getItem(SENTENCES_FILE)
            .then(files=> {
                if(!files) return;
                let localFiles = convertFileToArray(files);
                let result = localFiles.filter(item => removeFiles.indexOf(item) === -1);
                AsyncStorage.setItem(SENTENCES_FILE,result.join(SEPERATOR));
                dispatch(removeSentences());
                dispatch(saveSentences(result));
            })
    }
}

export const tryAddSentence = (sentence) => {
    return dispatch => {
        AsyncStorage.getItem(SENTENCES_FILE)
            .then(files=> {
                if(!files) return;
                sentence = sentence.trim();
                AsyncStorage.setItem(SENTENCES_FILE,files.concat("@@",sentence));
                dispatch(addSentence(sentence));
            })
    }
}
const convertFileToArray = (files) => {
    if(!files) return [];
    return arr = files.split(SEPERATOR)// "senetences@@files" --> ["sentences", "files"]
}



const filesFilter = (oldFile, newFile) => {
    console.log(oldFile,newFile);
    return newFile.filter(item => oldFile.indexOf(item) === -1)
}