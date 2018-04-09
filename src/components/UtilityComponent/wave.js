import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import uiStyle from '../ui'

export default class wave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waveAnim: new Animated.Value(0),
            waveAnimOpac: new Animated.Value(1)
        }
    }

    componentDidMount() {
        if (!this.props.stop)
            setTimeout(() => this.animHandler(), this.props.delay)
    }

    componentWillUnmount() {

    }

    animHandler = () => {
        if (!this.props.stop) {
            Animated.parallel([
                Animated.timing(this.state.waveAnim, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.waveAnimOpac, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: true
                })
            ]).start(() => {
                if (!this.props.stop) {
                    this.setState({
                        waveAnimOpac: new Animated.Value(1),
                        waveAnim: new Animated.Value(0)
                    }, () => {
                        this.animHandler()
                    })
                }
            })
        }
    }

    render() {
        return (
            <Animated.View style={[styles.container, this.props.style, {
                transform: [
                    {
                        scale: this.state.waveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, this.props.radiusScale],
                        })
                    }
                ],
                opacity: this.state.waveAnimOpac.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.7]
                })
            }]}>

            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 78,
        height: 78,
        borderRadius: 40,
        backgroundColor: uiStyle.colors._red
    }
})