import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native'

class Test1 extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: { height: 40 }
    })
    render() {
        return (
            <View>
               <Button title="Back" onPress={() => this.props.navigation.navigate('Home')} />
            </View>
        )
    }
}

export default Test1;