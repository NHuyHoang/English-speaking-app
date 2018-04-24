import React from 'react';
import { Text, View, StyleSheet, Button, TouchableWithoutFeedback, Dimensions, Easing, Animated, NetInfo } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import voice from 'react-native-voice'

import uiStyle from '../../components/ui';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { SentenceInput, Timmer, UtilComp, Notification, Header } from '../../components'
import { tryGetLocalFile } from '../../../store/actions/index';

class Test1 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            timmer: 0,
            onCountDown: false,
            onPause: false,
            onStart: false,
            onShowResult: false,
            displaySentence: null,
            result: "",
            indexColor: uiStyle.colors._blue
        }
        this.popIndex = 0;
        this.preparedInput = [];
        this.timePerSentence = 5;
        this._width = Dimensions.get('window').width;
        this._height = Dimensions.get('window').height;
        this.sentencePanelPos = this._height * 0.65;
        this.sentencePanelAnim = new Animated.Value(0);
        this.resultPanelAnim = new Animated.Value(0);
        this._screenHeight = 0;
        this.intervalId = null;
        this.resultTimmerAnim = new Animated.Value(1);
        voice.onSpeechResults = this.onSpeechResults.bind(this);
        voice.onSpeechError = this.onSpeechError.bind(this);
        //voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    }

    onSentencesCountDown = () => {
        //Sentence panel and result panel parallel slide from top
        Animated.parallel([
            Animated.spring(this.sentencePanelAnim, {
                toValue: this.sentencePanelPos,
                stiffness: 140,
                damping: 12,
                useNativeDriver: true
            }),
            //show the result panel
            Animated.spring(this.resultPanelAnim, {
                toValue: this.sentencePanelPos + 65,
                stiffness: 160,
                damping: 12,
                useNativeDriver: true
            })
        ]).start()
        this.intervalId = setInterval(() => {
            if (this.state.onPause) return;
            if (this.testFinhished()) {
                clearInterval(this.intervalId);
                this.onFinishHandler();
                voice.destroy();
                return;
            }
            this.setState(prevState => {
                if (prevState.timmer === this.timePerSentence) {
                    voice.stop();
                    return {
                        onPause: true,
                    }
                }
                if (this.state.timmer === 0) {
                    voice.start("en-US");
                }
                return { timmer: prevState.timmer + 1 }
            });
        }, 1000)

    }

    onSkipSentence = () => {
        const reloadSec = this.state.timmer * 150;
        const alreadyPause = this.state.onPause;
        this.setState({ onPause: true }, () => {
            this.setState({ timmer: 0 }, () => {
                setTimeout(() => {
                    this.setState({ onPause: alreadyPause, displaySentence: this.preparedInput[this.popIndex++] })
                }, 500)
            })
        })
    }

    onFinishHandler = () => {
        Animated.parallel([
            Animated.timing(this.sentencePanelAnim, {
                toValue: this._height + 70,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(this.resultPanelAnim, {
                toValue: this._height + 70,
                duration: 300,
                useNativeDriver: true
            }),
        ]).start(() => this.setState({ onStart: false }));
    }

    componentDidMount() {
        if (this.props.sentences.length === 0)
            this.props.tryGetLocalFiles();
    }

    componentDidUpdate() {
    }


    componentWillUnmount() {
        clearInterval(this.intervalId);
        voice.removeAllListeners();
        voice.destroy();
    }

    onSentencesCountDownHandler = () => {

        this.setState({ onCountDown: true })
    }

    onSetStartHandler = () => {
        this.preparedInput = this.shuffle([...this.props.sentences]);
        this.setState({ displaySentence: this.preparedInput[this.popIndex++] });
        this.setState({ onCountDown: false, onStart: true, }, () => {
            this.onSentencesCountDown();
        });
    }

    onBackScreen = () => {
        this.props.navigation.goBack(null)
    }

    onSetPauseHandler = (callback) => {
        if (this.state.onPause) return;
        this.setState({ onPause: true, indexColor: uiStyle.colors._red }, callback());
    }

    onSetResumeHandler = () => {
        this.setState({ onPause: false, indexColor: uiStyle.colors._blue });
    }

    testFinhished = () => {
        return this.popIndex === this.preparedInput.length + 1;
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

    onSpeechResults(e) {

        setTimeout(() => {
            this.setState({ result: e.value[0], onShowResult: true }, () => {
                setTimeout(() => {
                    Animated.timing(this.resultTimmerAnim, {
                        toValue: 0,
                        duration: 3000,
                    }).start(() => {
                        setTimeout(() => {
                            this.setState({
                                timmer: 0,
                                onShowResult: false,
                                result: "",
                                displaySentence: ""
                            }, () => {
                                setTimeout(() => this.setState({
                                    onPause: false,
                                    displaySentence: this.preparedInput[this.popIndex++],
                                }, () => this.resultTimmerAnim = new Animated.Value(1)), 1000)
                            })
                        }, 200);
                    })
                }, 200);
            })
        }, (this.timePerSentence - this.state.timmer) * 1000 + 200)

    }

    onSpeechEnd(e) {
        console.log('speech end');
        setTimeout(() => {
            Animated.timing(this.resultTimmerAnim, {
                toValue: 0,
                duration: 3000,
            }).start()
            setTimeout(() => {
                this.setState({
                    timmer: 0,
                    displaySentence: "",
                    onShowResult: false,
                    result: "",
                }, () => {
                    setTimeout(() => this.setState({
                        onPause: false,
                        displaySentence: this.preparedInput[this.popIndex++],
                    }), 1000)
                })
            }, 3000);
        }, this.state.timePerSentence - this.state.timmer)
    }

    onSpeechError(e) {
        console.log('err')
        if (e.error.message === "6/No speech input") {
            setTimeout(() => {
                this.setState({
                    timmer: 0,
                    onShowResult: false,
                    displaySentence: "",
                    result: "",
                }, () => {
                    setTimeout(() => this.setState({
                        onPause: false,
                        displaySentence: this.preparedInput[this.popIndex++],
                    }, ), 1000)
                })
            }, 500)
        }
    }

    onShowResultHandler(callback) {

    }

    render() {
        let sentencePanelTransform = {
            transform: [{ translateY: this.sentencePanelAnim }]
        }
        let resultPanelTransform = {
            transform: [{ translateY: this.resultPanelAnim }]
        }
        return (
            <View
                style={[styles.container, {
                    backgroundColor: this.state.indexColor,
                }]} onLayout={(event) => {
                    this._screenHeight = event.nativeEvent.layout.height;
                }}>
                <Header bgColor={this.state.indexColor} onBack={() => this.onBackScreen()} />
                <SentenceInput top={62} disabled={this.state.onStart} />
                <AnimatedCircularProgress
                    ref='circularProgress'
                    style={{
                        position: 'absolute',
                        top: this._height * 0.39 - ((this._width * 0.5) / 2)
                    }}
                    size={this._width * 0.5}
                    width={10}
                    fill={(100 / this.timePerSentence) * this.state.timmer}
                    rotation={0}
                    tintColor={this.state.indexColor}
                    //onAnimationComplete={}
                    backgroundColor="white" >
                    {() => (
                        <Text style={styles.timmerDisplay}>
                            {this.state.timmer}
                        </Text>
                    )}
                </AnimatedCircularProgress>
                <Animated.View style={[styles.sentencePanel, sentencePanelTransform]}>
                    <Animated.View>
                        <Text style={styles.sentenceTxt}>
                            {this.state.displaySentence}
                        </Text>
                    </Animated.View>
                </Animated.View>
                <Animated.View style={[styles.resultPanel, resultPanelTransform]}>
                    {
                        this.state.result === "" ?
                            <Icon name="hearing" size={25} /> :
                            <Text style={styles.resultTxt}>
                                {this.state.result}
                            </Text>
                    }
                    {
                        this.state.onShowResult && <Animated.View style={[styles.resultTimmer, {
                            transform: [{ scaleX: this.resultTimmerAnim }]
                        }]} />
                    }
                </Animated.View>
                <UtilComp
                    style={styles.ultiComp}
                    onSetCountdown={this.onSentencesCountDownHandler}
                    onPause={this.onSetPauseHandler}
                    onSkip={this.onSkipSentence}
                    onSetResume={this.onSetResumeHandler} />
                {
                    this.state.onCountDown && !this.state.onStart ?
                        <Timmer stop={this.onSetStartHandler} screenHeight={this._screenHeight} /> : null
                }
                <Notification />
            </View>
        )
    }
}

const _height = Dimensions.get('window').height;
const _width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
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
        fontSize: 80,
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
        zIndex: 3,
        position: "absolute",
        top: -60,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        paddingLeft: 12,
        paddingRight: 12,
    },
    resultPanel: {
        width: "80%",
        height: 45,
        borderRadius: 99,
        zIndex: 2,
        position: "absolute",
        top: -60,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        paddingLeft: 12,
        paddingRight: 12,
        flexDirection: 'row'
    },
    sentenceTxt: {
        fontFamily: uiStyle.fonts.font_bold,
        fontSize: 16,
        textAlign: 'center'
    },
    resultTxt: {
        fontFamily: uiStyle.fonts.font_bold,
        fontSize: 14,
        textAlign: 'center'
    },
    resultTimmer: {
        backgroundColor: uiStyle.colors._dark_gray,
        position: 'absolute',
        height: 4,
        borderRadius: 3,
        width: '90%',
        bottom: 0
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