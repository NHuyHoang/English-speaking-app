import React from 'react';
import { StyleSheet, Dimensions, View, Text, Animated } from 'react-native';
import uiStyle from '../ui'

export default class Timmer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 3,
            inTervalRefreshId: null,
        }
        this.countdownAnim = new Animated.Value(0);
    }

    loopAnim(){
        Animated.sequence([
            Animated.timing(this.countdownAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver:true
            }),
            Animated.timing(this.countdownAnim, {
                toValue: 0,
                duration: 1100,
                useNativeDriver:true
            }),
            Animated.delay(300),
        ]).start(() => this.loopAnim())
    }

    componentDidMount() {
        let i = 3;
        setTimeout(()=> this.loopAnim(),1500);
        let inTervalRefreshId = setInterval(() => {
            if (i < 0) {
                clearInterval(inTervalRefreshId);
                this.props.stop();
            } else {
                this.setState({ counter: i-- })
            }
        }, 1500)
    }


    render() {
        let countdownAnim = { opacity: this.countdownAnim }
        return (
            <View style={[styles.container, { height: this.props.screenHeight }]}>
                <Animated.View style={countdownAnim}>
                    <Text style={[styles.couterTxt, { marginTop: this.props.screenHeight / 2 - 150 }]}>
                        {this.state.counter > 0 ? this.state.counter : "Start"}
                    </Text>
                </Animated.View>
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