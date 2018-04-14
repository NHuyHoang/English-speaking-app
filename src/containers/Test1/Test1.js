import React from 'react';
import { Text, View, StyleSheet, Button, TouchableWithoutFeedback, Dimensions, Easing, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import SentenceInput from '../../components/SentenceInput/SentenceInput';
import uiStyle from '../../components/ui';
import Timmer from '../../components/Timmer/Timmer';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import UtilComp from '../../components/UtilityComponent/UtilityComp';
import { tryGetLocalFile } from '../../../store/actions/index';
import NotiCompo from '../../hoc/noti';

class Test1 extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Test 1",
        headerRight: (
            <Icon size={20} style={{ marginRight: 20, color: "white" }} name="build" />
        ),
    })
    constructor(props) {
        super(props);
        this.state = {
            timmer: 0,
            onCountDown: false,
            onPause: false,
            onStart: false,
            displaySentence: null
        }
        this.popIndex = 0;
        this.preparedInput = [];
        this.timePerSentence = 5;
        this._width = Dimensions.get('window').width;
        this._height = Dimensions.get('window').height;
        this.sentencePanelAnim = new Animated.Value(0);
        this._screenHeight = 0;
        this.intervalId = null;
        this.onSetStart = this.onSetStartHandler.bind(this);
        this.onSetPause = this.onSetPauseHandler.bind(this);
        this.onSetCountdown = this.onSentencesCountDownHandler.bind(this);
        this.onSetResume = this.onSetResumeHandler.bind(this);
    }

    onSentencesCountDown = () => {
        Animated.spring(this.sentencePanelAnim, {
            toValue: 1,
            stiffness: 120,
            damping: 12,
            useNativeDriver: true
        }).start();
        this.intervalId = setInterval(() => {
            if (this.state.onPause) return;
            this.setState(prevState => {
                if (prevState.timmer === this.timePerSentence)
                    return { timmer: 0, displaySentence: this.preparedInput[this.popIndex++] }
                return { timmer: prevState.timmer + 1 }
            });
        }, 1001)
    }

    componentDidMount() {
        if (this.props.sentences.length === 0)
            this.props.tryGetLocalFiles();

    }

    componentDidUpdate() {
        if (this.preparedInput.length === 0) {
            this.preparedInput = this.shuffle([...this.props.sentences]);
        }

    }


    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    onSentencesCountDownHandler() {

        this.setState({ onCountDown: true })
    }

    onSetStartHandler() {
        this.setState({ displaySentence: this.preparedInput[this.popIndex++] });
        this.setState({ onCountDown: false, onStart: true }, () => {
            this.onSentencesCountDown();
        });
    }

    onSetPauseHandler() {
        this.setState({ onPause: true });
    }

    onSetResumeHandler(){
        this.setState({ onPause: false });
    }

    //shuffle senetences
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }



    render() {
        let sentencePanelTransform = {
            transform: [
                {
                    translateY: this.sentencePanelAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, _height * 0.6]
                    })
                }
            ]
        }
        return (
            <View style={styles.container} onLayout={(event) => {
                this._screenHeight = event.nativeEvent.layout.height;
            }}>
                <SentenceInput top={25} />
                <AnimatedCircularProgress
                    ref='circularProgress'
                    style={{
                        position: 'absolute',
                        top: this._height * 0.2
                    }}
                    size={this._width * 0.5}
                    width={10}
                    fill={(100 / this.timePerSentence) * this.state.timmer}
                    rotation={0}
                    tintColor={uiStyle.colors._blue}
                    //onAnimationComplete={}
                    backgroundColor="white" >
                    {() => (
                        <Text style={styles.timmerDisplay}>
                            {this.state.timmer < 10 ? "0" + this.state.timmer : this.state.timmer}
                        </Text>
                    )}
                </AnimatedCircularProgress>
                {this.state.onStart ? null : <Text style={styles.guidelineTxt}>Add some sentence to start</Text>}
                <Animated.View style={[styles.sentencePanel, sentencePanelTransform]}>
                    <Animated.View>
                        <Text style={styles.sentenceTxt}>{this.state.displaySentence}</Text>
                    </Animated.View>
                </Animated.View>
                <UtilComp
                    style={styles.ultiComp}
                    onSetCountdown={this.onSetCountdown}
                    onSetPause={this.onSetPause}
                    onSetResume={this.onSetResume} />
                {
                    this.state.onCountDown && !this.state.onStart ?
                        <Timmer stop={this.onSetStart} screenHeight={this._screenHeight} /> : null
                }
            </View>
        )
    }
}

const _height = Dimensions.get('window').height;
const _width = Dimensions.get('window').width;

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
    },
    sentenceInput: {
        top: 20
    },
    timmerDisplay: {
        color: 'white',
        fontSize: 50,
        fontFamily: uiStyle.fonts.font_bold
    },
    guidelineTxt: {
        position: "absolute",
        fontSize: uiStyle.fonts.title_size,
        color: 'white',
        fontFamily: uiStyle.fonts.font_medium,
        top: _height * 0.55
    },
    ultiComp: {
        marginTop: _height * 0.7
    },
    sentencePanel: {
        width: "90%",
        height: 60,
        borderRadius: 99,
        zIndex: 2,
        position: "absolute",
        top: -60,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        paddingLeft: 12,
        paddingRight: 12
    },
    sentenceTxt: {
        fontFamily: uiStyle.font_medium,
        fontSize: 16,
        textAlign: 'center'
    }
})

const mapStateToProps = state => {
    return {
        sentences: state.files.sentences
    }
}

const mapDispatchToProps = dispatch => {
    return {
        tryGetLocalFiles: () => dispatch(tryGetLocalFile())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test1);