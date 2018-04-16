import React from 'react';
import { StyleSheet, View, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default Header = (props) => {
    return (
        <View style={[styles.container, { backgroundColor: props.bgColor }]} >
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.5)', true)}
                onPress={props.onBack} >
                <View style={styles.iconBtn}>
                    <Icon name='chevron-left' color="white" size={32} />
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.5)', true)}
                onPress={props.onConfig}>
                <View style={styles.iconBtn}>
                    <Icon name='build' color="white" size={20} />
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 42,
        paddingLeft: 8,
        paddingRight: 8,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    iconBtn: {
        height: '100%',
        width: 62,
        justifyContent: 'center',
        alignItems: 'center'
    }
})