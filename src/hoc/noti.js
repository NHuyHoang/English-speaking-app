import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default noti = (Comp) => {
    return class NotiComponent extends React.Component{
        render(){
            return(
                <View style={styles.container}>
                    <View style={styles.dimmer}/>
                    <Comp {...this.props}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    dimmer:{
        flex:1,
        top:0,
        height:0,
        backgroundColor:'black',
        position:'absolute',
    }
})