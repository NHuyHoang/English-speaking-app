import React from 'react';
import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { StyleSheet, View, Text, Button, Platform, PermissionsAndroid, ActivityIndicator, NetInfo } from 'react-native';
import fs from 'react-native-fs';
import { connect } from 'react-redux';

import fetchResult from '../services/GSpeech.service';
import { tryGetStoredToken } from '../../store/actions/index'


class RecordSection extends React.Component {
    state = {
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/test.amr',
        hasPermission: undefined,
        filePath: null,
        fetchingResult: false,
        result: null,
        connectState: true,
    }

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 16000,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "amr",
            /* AudioEncodingBitRate: 16000 */
        });
    }

    componentWillMount(){
        this.props.getAccessToken();
    }

    componentDidMount() {
        this._checkPermission().then((hasPermission) => {
            this.setState({ hasPermission });

            if (!hasPermission) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({ currentTime: Math.floor(data.currentTime) });
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL);
                }
            };
        });
        NetInfo.isConnected.addEventListener('connectionChange', (connected) => {
            if (connected) {
                this.props.getAccessToken();
                this.setState({ connectState: true })
            }
            else this.setState({ connectState: false })
        });
    }

    _checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': 'Microphone Permission',
            'message': 'AudioExample needs access to your microphone so you can record audio.'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                console.log('Permission result:', result);
                return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
            });
    }

    _finishRecording(didSucceed, filePath) {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }

    async _resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({ paused: false });
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {

        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({ stoppedRecording: true, recording: false, paused: false });

        try {
            const filePath = await AudioRecorder.stopRecording();
            console.log('stop recoding');
            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            this.setState({ filePath: filePath });
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _play() {
        console.log('played');
        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    async _record() {
        console.log('start recoding');
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({ recording: true, paused: false });

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _file = () => {
        fs.readFile(this.state.audioPath, 'base64')
            .then((success) => {
                this.setState({ fetchingResult: true });
                let config = {
                    api_uri: this.props.api_uri,
                    access_token: this.props.access_token
                }
                fetchResult(config, success, 'noob')
                    .then(result => {
                        this.setState({ result, fetchingResult: false })
                    })
                    .catch(err => this.setState({ result: "Something went wrong!!!" }))
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        let resultTxt = null;
        if (this.state.result) {
            resultTxt = this.state.result.map((res, i) => {
                return <Text key={i} style={styles.resultTxt}>{res}</Text>
            })
        }
        return (
            <View style={styles.container}>
                <Text style={styles.counter}>{this.state.currentTime}</Text>
                <Text>second</Text>
                {this.state.fetchingResult ? <ActivityIndicator /> : resultTxt}
                <View style={styles.btnContainer}>
                    <Button
                        color={this.state.recording ? "#F44336": "#006064"}
                        title={this.state.recording ? 'Stop' : 'Record'}
                        onPress={this.state.recording ? this._stop.bind(this) : this._record.bind(this)} />
                </View>
                <View style={styles.btnContainer}>
                    <Button color="#0097A7" disabled={this.state.recording} title='Play' onPress={this._play.bind(this)} />
                </View>
                <View style={styles.btnContainer}>
                    <Button color="#00BCD4" disabled={this.state.recording || !this.state.connectState || !this.props.access_token} title='Result' onPress={this._file} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnContainer: {
        width: '80%',
        marginBottom: 10,
        marginTop: 10
    },
    ctrContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    counter: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#464747'
    },
    resultTxt: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#464747'
    }
})

const mapStateToProps = state => {
    return {
        access_token: state.auth.access_token,
        api_uri: state.auth.api_uri
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAccessToken: () => dispatch(tryGetStoredToken())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordSection);