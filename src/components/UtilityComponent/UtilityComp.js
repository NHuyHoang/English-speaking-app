import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Button } from 'react-native';
import uiStyle from '../ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Wave from './wave'

class UtilityComp extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.backgroundGroup}>
                    <TouchableWithoutFeedback>
                        <View style={styles.stopBtnContainer}>
                            <Icon style={{ marginLeft: 15 }} size={45} name="stop" color={uiStyle.colors._dark_gray} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback >
                        <View style={styles.skipBtnContainer}>
                            <Icon style={{ marginRight: 15, marginLeft: "auto" }} size={45} name="skip-next" color={uiStyle.colors._dark_gray} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Wave style={styles.waveContainer} delay={0} radiusScale={1.7}/>
                <View style={styles.recordBtnContainer} >

                    <View style={styles.recordBtn} >
                        <Icon size={45} name="mic" color="white" />
                    </View>
                </View>
            </View>
        )
    }
}

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;
const elementWidth = _width * 0.7;
const recordSize = 78;
const buttonSize = (elementWidth - recordSize) / 2;
const bgGroupHeight = 70;

const styles = StyleSheet.create({
    container: {
        height: recordSize,
        width: elementWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    stopBtnContainer: {
        width: buttonSize,
        height: bgGroupHeight,
        borderTopLeftRadius: 35,
        borderBottomLeftRadius: 35,
        justifyContent: 'center'
    },
    skipBtnContainer: {
        width: buttonSize,
        height: bgGroupHeight,
        left: recordSize,
        borderTopRightRadius: 35,
        borderBottomRightRadius: 35,
        justifyContent: 'center'
    },
    recordBtnContainer: {
        minHeight: recordSize,
        minWidth: recordSize,

        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: buttonSize,
        elevation: 8,
    },
    recordBtn: {
        height: recordSize,
        width: recordSize,
        borderRadius: recordSize / 2,
        backgroundColor: uiStyle.colors._red,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    waveContainer: {
        /* minHeight: recordSize,
        minWidth: recordSize, */
        left: buttonSize,
        position: 'absolute',
        zIndex: 1,
        elevation: 7,
    },
    backgroundGroup: {
        height: bgGroupHeight,
        width: elementWidth,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 35,
        alignItems: 'center',
        elevation: 5
    }
})
export default UtilityComp;