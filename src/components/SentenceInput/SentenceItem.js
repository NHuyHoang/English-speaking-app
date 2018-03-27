import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uiStyle from '../ui'

export default SentenceItem = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}><Text style={styles.contentTxt}>{props.content}</Text></View>
            <TouchableOpacity>
                <Icon size={20} name="delete"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: uiStyle.colors._light_gray,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    content: {
        width: "90%",
        justifyContent: 'flex-end'
    },
    contentTxt: {
        fontFamily: uiStyle.fonts.font,
        fontSize: 15,
        color: uiStyle.colors._dark_gray,
    }
})