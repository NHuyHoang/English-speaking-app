import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import uiStyle from '../ui'

export default class Timmer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 3,
            inTervalRefreshId: null,
        }
    }

    componentDidMount() {
        let i = 3;
        let inTervalRefreshId = setInterval(() => {
            if (i < 0) {
                clearInterval(inTervalRefreshId);
            } else {
                this.setState({counter:i--})
            }
        }, 1000)
    }


    render() {
        return (
            <View style={[styles.container, { height: this.props.screenHeight }]}>
                <Text style={[styles.couterTxt, { marginTop: this.props.screenHeight / 2 - 150 }]}>{this.state.counter}</Text>
                <Text style={styles.remainTxt}>seconds remaining</Text>
            </View>
        )
    }
}

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: _width,
        position: 'absolute',
        elevation: 9,
        backgroundColor: 'black',
        opacity: 0.85,
        alignItems: 'center',
    },
    couterTxt: {
        fontFamily: uiStyle.fonts.font_bold,
        fontSize: 130,
        color: 'white'
    },
    remainTxt: {
        fontFamily: uiStyle.fonts.font_bold,
        fontSize: 20,
        color: 'white'
    },

})