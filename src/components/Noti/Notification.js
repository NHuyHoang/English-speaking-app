import React from 'react';
import { View, Text, StyleSheet, NetInfo } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uiStyle from '../ui'

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: true
        }

    }
    
    componentWillMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('init' + isConnected)
            this.setState({ connected: isConnected });
        });
    }

    componentDidMount() {
        //NetInfo.addEventListener('connectionChange', this.connectionHandler);
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.connectionHandler
        );
    }

    componentWillUnmount(){
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.connectionHandler
        );
    }


    connectionHandler = (connected) => {
        this.setState({ connected: connected });
    }


    render() {
        let notiComponent = !true ? (
            <View style={styles.container}>
                <Icon name="perm-scan-wifi" size={80} color="white" />
                <Text style={styles.notiTxt}>Connection is needed</Text>
            </View>
        ) : null
        return notiComponent
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 99,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notiTxt: {
        color: 'white',
        fontFamily: 'sans-serif-thin',
        fontSize: 30,
    }
})