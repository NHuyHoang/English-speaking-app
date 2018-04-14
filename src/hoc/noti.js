import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default noti = (Comp,navOpt) => {
    return class NotiComponent extends React.Component{
        render(){
            return(
                <View style={styles.container}>
                    <Comp {...this.props}/>
                    <View style={styles.dimmer}/>
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
        height:'100%',
        width:'100%',
        top:0,
        opacity:0.5,
        backgroundColor:'black',
        position:'absolute',
        zIndex:1,
    }
})