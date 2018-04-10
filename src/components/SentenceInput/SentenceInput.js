import React from 'react';
import { Text, View, TextInput, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Animated, FlatList, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import fs from 'react-native-fs';
import { connect } from 'react-redux';
import uiStyle from '../ui';
import SentenceItem from './SentenceItem';
import { tryConvertFile, tryRemoveSentences, tryAddSentence } from '../../../store/actions'

class SentenceInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusInput: false,
            sentencePanelAnim: new Animated.Value(0)
        }
        this.txtInput = "";
        this.selectedSentences = [];
        this.onSelectedSentence = (content, isSelected) => this.onSelectedSentenceHandler(content, isSelected);
        this.onRemoveSentences = this.onRemoveSentencesHandler.bind(this);
        this.onChangeText = (text) => { this.txtInput = text };
        this.addSentence = this.addSentenceHandler.bind(this);
    }

    componentDidUpdate(){
        if(this.state.focusInput){
            this.refs.flatList.scrollToEnd()
        }
    }

    focusInput() {

        if (this.state.focusInput) {
            Animated.timing(this.state.sentencePanelAnim, {
                toValue: 0,
                duration: 200,
            }).start(() => this.setState({ focusInput: false }))


        }
        else {
            Animated.timing(this.state.sentencePanelAnim, {
                toValue: 1,
                duration: 200
            }).start(() => this.setState({ focusInput: true }))

        }

    }

    onSelectedSentenceHandler(content, isSelected) {
        if (isSelected) {
            this.selectedSentences.push(content);
        }
        else {
            this.selectedSentences = this.selectedSentences.filter(item => item !== content)
        }
    }

    onRemoveSentencesHandler() {
        this.props.removeSentences(this.selectedSentences);
        this.selectedSentences = [];
    }

    addSentenceHandler() {
        this.props.addSentence(this.txtInput)
    }

    importDoc() {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.plainText()],
        }, (error, res) => {
            if (!res) return;
            fs.readFile(res.uri, 'utf8')
                .then((files) => {
                    this.props.convertFile(files);
                    this.refs.flatList.scrollToEnd()
                })
                .catch((err) => {
                    console.log(err);
                });
        });

    }



    render() {
        let inputContent = (
            <View style={styles.altInputTxtContainer}>
                <View style={styles.altInputTxtContainer}><Text style={styles.altInputTxt}>Add sentence</Text></View>
            </View>
        );
        if (this.state.focusInput) {
            inputContent = (
                <TextInput
                    onSubmitEditing={this.addSentence}
                    onChangeText={this.onChangeText}
                    autoFocus={true}
                    underlineColorAndroid={uiStyle.colors._blue}
                    style={styles.input} />
            );
        }
        return (
            <View style={[styles.container, { top: this.props.top }]}>
                <Animated.View style={[styles.sentencePanel, {}, {
                    height: this.state.sentencePanelAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 250]
                    }),
                }]}>
                    <FlatList
                        ref="flatList"
                        style={styles.flatList}
                        data={this.props.localSentences}
                        keyExtractor={item => Math.random()}
                        renderItem={({ item }, i) => <SentenceItem content={item} onSelected={this.onSelectedSentence} />}
                    />
                    <View style={styles.storageBtnContainer}>
                        <TouchableOpacity onPress={this.importDoc.bind(this)} style={styles.btnContent}>
                            <Icon size={20} name="sd-storage" color={uiStyle.colors._gray} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onRemoveSentences} style={styles.btnContent}>
                            <Icon size={23} name="delete-forever" color={uiStyle.colors._gray} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <TouchableWithoutFeedback onPress={this.focusInput.bind(this)}>
                    <View style={styles.inputMainContainer}>
                        <View style={styles.inputContainer}>
                            {inputContent}
                        </View>
                        <TouchableOpacity onPress={this.focusInput.bind(this)} style={[styles.iconContainer, { backgroundColor: this.state.focusInput ? uiStyle.colors._blue : uiStyle.colors._dark_gray }]}>
                            {this.state.focusInput ? <Icon size={30} name="done" color="white" /> : <Icon size={30} name="keyboard" color="white" />}
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 2,
        minHeight: 80,
        width: Dimensions.get('window').width * 0.85,
        alignContent: 'center',
    },
    inputMainContainer: {
        borderRadius: 28,
        height: 50,
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
        position: 'absolute',
        left: Dimensions.get('window').width * 0.025
    },
    inputContainer: {
        width: Dimensions.get('window').width * 0.8 - 47,
        paddingLeft: 20,
        justifyContent: 'center',
    },
    input: {
        fontSize: 15,
        fontFamily: uiStyle.fonts.font_medium,
        color: uiStyle.colors._gray,
    },
    altInputTxtContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    altInputTxt: {
        fontSize: 20,
        fontFamily: uiStyle.fonts.font,
        color: uiStyle.colors._dark_gray
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sentencePanel: {
        height: 350,
        width: Dimensions.get('window').width * 0.8,
        backgroundColor: 'white',
        borderBottomEndRadius: 25,
        borderBottomLeftRadius: 25,
        marginTop: 25,
        paddingTop: 25,
        justifyContent: 'center',
        left: Dimensions.get('window').width * 0.025
    },
    flatList: {
        width: '100%',
        paddingLeft: 25,
        paddingRight: 25,
        alignContent: 'center',
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25
    },
    storageBtnContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    storageBtn: {
        fontSize: 20,
        fontFamily: uiStyle.fonts.font_bold,
        color: uiStyle.colors._blue
    }
})

const mapStateToProps = state => {
    return {
        localSentences: state.files.sentences
    }
}
const mapDispatchToProps = dispatch => {
    return {
        convertFile: (files) => dispatch(tryConvertFile(files)),
        removeSentences: (files) => dispatch(tryRemoveSentences(files)),
        addSentence: (sentence) => dispatch(tryAddSentence(sentence))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SentenceInput);