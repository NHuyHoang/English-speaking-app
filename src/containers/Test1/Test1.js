import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import SentenceInput from '../../components/SentenceInput/SentenceInput';
import uiStyle from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons'

class Test1 extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Test 1",
        headerRight: (
            <Icon size={20} style={{ marginRight: 20, color: "white" }} name="build" />
        ),
    })
    render() {
        return (
            <View style={styles.container}>
                <SentenceInput style={styles.input} />

                <View style={{ marginTop:75}}><Text>Some component</Text></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: uiStyle.colors._blue,
        alignItems: 'center',
        flex: 1,
    },
    inputContainer: {
        width: "100%",
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'red'
    }
})

export default Test1;