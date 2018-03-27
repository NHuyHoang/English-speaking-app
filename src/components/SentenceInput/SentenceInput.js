import React from 'react';
import { Text, View, TextInput, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity ,Animated, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import uiStyle from '../ui';
import SentenceItem from './SentenceItem'

export default class SentenceInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            focusInput: false,
            sentencePanelAnim: new Animated.Value(0)
        }
    }

    focusInput() {
        this.setState({ focusInput: true }, () => {
            Animated.timing(this.state.sentencePanelAnim, {
                toValue: 1,
                duration: 500
            }).start()
        })
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
                    autoFocus={true}
                    underlineColorAndroid={uiStyle.colors._blue}
                    style={[this.props.style, styles.input]} />
            );
        }
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.sentencePanel, {}, {
                    height: this.state.sentencePanelAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 250]
                    }),
                    paddingBottom: this.state.sentencePanelAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 8]
                    }),
                }]}>
                    <FlatList
                        style={styles.flatList}
                        data={["item1", "item2", "item3", "item4", "item1", "item2", "item3", "item4", "item1", "item2", "item3", "item4", "item1", "item2", "item3", "item4", "item1", "item2", "item3", "item4", "item1", "item2", "item3", "item4"]}
                        keyExtractor={item => Math.random()}
                        renderItem={({ item }, i) => <SentenceItem content={item} />}
                    />
                    <TouchableOpacity style={styles.storageBtnContainer}>
                        <Icon size={20} name="sd-storage" color={uiStyle.colors._blue}/>
                        <Text style={styles.storageBtn}>Import</Text>
                    </TouchableOpacity>
                </Animated.View>
                <TouchableWithoutFeedback onPress={this.focusInput.bind(this)}>
                    <View style={styles.inputMainContainer}>
                        <View style={styles.inputContainer}>
                            {inputContent}
                        </View>
                        <View style={styles.iconContainer}>
                            <Icon size={30} name="keyboard" color="white" />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1,
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
        backgroundColor: uiStyle.colors._dark_gray,
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
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    storageBtn: {
        fontSize: 20,
        fontFamily: uiStyle.fonts.font_bold,
        color: uiStyle.colors._blue
    }
})