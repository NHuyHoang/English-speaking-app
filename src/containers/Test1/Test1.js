import React from 'react';
import { Text, View, StyleSheet, Button, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

import SentenceInput from '../../components/SentenceInput/SentenceInput';
import uiStyle from '../../components/ui';
import Timmer from '../../components/Timmer/Timmer';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import UtilComp from '../../components/UtilityComponent/UtilityComp';
import { tryGetLocalFile } from '../../../store/actions/index'

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
            onStart: false
        }
        this._width = Dimensions.get('window').width;
        this._height = Dimensions.get('window').height;
        this._screenHeight = 0;
        this.intervalId = null;
    }

    onSentencesCountDown = () => {
        this.intervalId = setInterval(() => this.setState(prevState => {
            return { timmer: prevState.timmer + 1 }
        }), 1000)
    }

    componentDidMount() {
        this.props.tryGetLocalFiles();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    onSetCountdown() {
        this.setState({ onCountDown: true })
    }

    onSetStart() {
        this.setState({ onCountDown: false, onStart: true }, () => {
            this.onSentencesCountDown()
        });
    }

    render() {
        return (
            <View style={styles.container} onLayout={(event) => {
                this._screenHeight = event.nativeEvent.layout.height;
            }}>
                <SentenceInput top={25} />
                <AnimatedCircularProgress
                    linecap="round"
                    style={{
                        position: 'absolute',
                        top: this._height * 0.2
                    }}
                    size={this._width * 0.5}
                    width={10}
                    fill={(100 / 5) * this.state.timmer}
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
                <Text style={styles.guidelineTxt}>Add some sentence to start</Text>
                <UtilComp style={styles.ultiComp} disabled={!this.state.onStart} onSetCountdown={this.onSetCountdown.bind(this)} />
                {this.state.onCountDown && !this.state.onStart ? <Timmer stop={this.onSetStart.bind(this)} screenHeight={this._screenHeight} /> : null}
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
        fontSize: uiStyle.fonts.title_size,
        color: 'white',
        fontFamily: uiStyle.fonts.font_medium,
        marginTop: _height * 0.55
    },
    ultiComp: {
        marginTop: 50
    }
})

const mapDispatchToProps = dispatch => {
    return {
        tryGetLocalFiles: () => dispatch(tryGetLocalFile())
    }
}

export default connect(null, mapDispatchToProps)(Test1);