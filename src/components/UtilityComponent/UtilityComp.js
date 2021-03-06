import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    Button,
    PanResponder,
    Animated
} from 'react-native';
import uiStyle from '../ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Wave from './wave'

class UtilityComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnState: "mic",
        }
        this.recoredBtnColorHandler = new Animated.Value(0);
        this._panReponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderGrant: (e, gesture) => {
                this.recoredBtnColorHandler.setValue(1)
            },
            onPanResponderRelease: (e, gesture) => {
                this.recoredBtnColorHandler.setValue(0);
                switch (this.state.btnState) {
                    case ("mic"): {
                        this.setState({ btnState: "pause" });
                        this.props.onSetCountdown();
                    } break;
                    case ("pause"): {
                        this.props.onPause(() => this.setState({ btnState: "play-arrow" }))
                    } break;
                    case ("play-arrow"): {
                        this.setState({ btnState: "pause" });
                        this.props.onSetResume();
                    } break;
                }

            }
        })

    }

    componentWillReceiveProps(props) {

        /*   if (props.onPause && props.onStart && !props.onResume) {
              this.setState({ btnState: "play-arrow" })
          }
          if (props.onStart && !props.onPause && !props.onResume) {
              this.setState({ btnState: "pause" })
          } */
    }



    render() {
        let recordAnim = {
            backgroundColor: this.recoredBtnColorHandler.interpolate({
                inputRange: [0, 1],
                outputRange: [uiStyle.colors._red, '#B43636']
            })

        }
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={[styles.backgroundGroup, , { opacity: this.state.btnState === "mic" ? 0.5 : 1 }]}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', true)} >
                        <View style={styles.stopBtnContainer}>
                            <Icon style={{ marginLeft: 15 }} size={45} name="stop" color={uiStyle.colors._dark_gray} />
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        onPress={this.props.onSkip}
                        background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', true)} >
                        <View style={styles.skipBtnContainer}>
                            <Icon style={{ marginRight: 15, marginLeft: "auto" }} size={45} name="skip-next" color={uiStyle.colors._dark_gray} />
                        </View>
                    </TouchableNativeFeedback>
                </View>
                {
                    this.state.btnState === "mic"
                        ? <Wave style={styles.waveContainer}
                            stop={!this.state.btnState === "mic"} delay={0}
                            radiusScale={1.7} />
                        : null
                }
                <View {...this._panReponder.panHandlers} style={styles.recordBtnContainer} >
                    <Animated.View style={[styles.recordBtn, recordAnim]} >
                        <Icon size={45} name={this.state.btnState} color="white" />
                    </Animated.View>
                </View>

            </View>
        )
    }
}

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;
const elementWidth = _width * 0.7;
const recordSize = 78;
const buttonSize = (elementWidth - recordSize) / 2;
const bgGroupHeight = 70;

const styles = StyleSheet.create({
    container: {
        marginTop: 'auto',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    stopBtnContainer: {
        width: buttonSize,
        height: bgGroupHeight,
        borderTopLeftRadius: 35,
        borderBottomLeftRadius: 35,
        justifyContent: 'center'
    },
    skipBtnContainer: {
        width: buttonSize,
        height: bgGroupHeight,
        left: recordSize,
        borderTopRightRadius: 35,
        borderBottomRightRadius: 35,
        justifyContent: 'center',
    },
    recordBtnContainer: {
        minHeight: recordSize,
        minWidth: recordSize,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: buttonSize,
        elevation: 8,
    },
    recordBtn: {
        height: recordSize,
        width: recordSize,
        borderRadius: recordSize / 2,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    waveContainer: {
        /* minHeight: recordSize,
        minWidth: recordSize, */
        left: buttonSize,
        position: 'absolute',
    },
    backgroundGroup: {
        height: bgGroupHeight,
        width: elementWidth,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 35,
        alignItems: 'center',
        elevation: 5
    }
})
export default UtilityComp;