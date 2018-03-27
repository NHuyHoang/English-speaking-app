import React from 'react';
import { Text, View, StyleSheet, Button, TouchableWithoutFeedback, Animated, Dimensions, PanResponder } from 'react-native';
import uiStyle from '../../components/ui'

class Guideline extends React.Component {
    static navigationOptions = {
        header: null,
        title: 'Welcome',
    };

    constructor(props) {
        super(props);
        this.state = {
            focusTab1: true,
            primaryColor: uiStyle.colors._green,
            tabAnim: new Animated.Value(0),
            guideLinePanelAnim: new Animated.Value(0),
            startBtnAnim: new Animated.Value(0)
        };
        this.screenWidth = Dimensions.get('window').width;
        this.screenHeight = Dimensions.get('window').height;
        this.panRes = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                //alert('touched');
                Animated.timing(this.state.startBtnAnim, {
                    toValue: 1,
                    duration: 20
                }).start()
            },
            onPanResponderRelease: (evt, gestureState) => {
                Animated.timing(this.state.startBtnAnim, {
                    toValue: 0,
                    duration: 20
                }).start(() => {
                    props.navigation.navigate('Test1')
                })
            },
        })
    }

    onChangeFocus = (tab1Pressed) => {
        this.setState({
            focusTab1: tab1Pressed ? true : false,
        }, () => {
            if (!this.state.focusTab1) {
                Animated.parallel([
                    Animated.timing(this.state.tabAnim, {
                        toValue: 1,
                        duration: 500
                    }),
                    Animated.spring(this.state.guideLinePanelAnim, {
                        toValue: 1,
                        stiffness: 90,
                        damping: 12,
                        useNativeDriver:true
                    }),
                ]).start()
            }
            else {
                Animated.parallel([
                    Animated.timing(this.state.tabAnim, {
                        toValue: 0,
                        duration: 500
                    }),
                    Animated.spring(this.state.guideLinePanelAnim, {
                        toValue: 0,
                        stiffness: 90,
                        damping: 12,
                        useNativeDriver:true
                    }),
                ]).start()
            }
        });
    }
    render() {
        return (
            <View>
                <Animated.View
                    style={[styles.headerBar, {
                        backgroundColor: this.state.tabAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [uiStyle.colors._blue, uiStyle.colors._green]
                        })
                    }]}>
                    <Text style={styles.headerBarTitle}>App name</Text>
                </Animated.View>
                <View style={styles.mainContainer}>
                    <View style={styles.navbar}>
                        <TouchableWithoutFeedback
                            style={styles.navTab}
                            onPress={() => this.onChangeFocus(true)}>
                            <Animated.View style={[styles.tab1Content, {
                                elevation: this.state.tabAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [5, 0]
                                })
                            }]}>
                                <Text style={styles.tabTitleTxt}>Test 1</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            style={styles.navTab}
                            onPress={() => this.onChangeFocus(false)}>
                            <Animated.View style={[styles.tab2Content, {
                                elevation: this.state.tabAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 5]
                                })
                            }]}>
                                <Text style={styles.tabTitleTxt}>Test 2</Text>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                    <Animated.View style={[styles.guideLineContainer, {
                        backgroundColor: this.state.tabAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [uiStyle.colors._blue, uiStyle.colors._green]
                        })
                    }]}>
                        <Animated.View style={[styles.guideLinePanel, {
                            transform: [
                                {
                                    translateX: this.state.guideLinePanelAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -this.screenWidth]
                                    })
                                }
                            ]
                        }]}>
                            <View style={styles.guidelineTitleContainer}>
                                <Text style={[styles.guideLineTitle, { color: uiStyle.colors._blue }]}>Guideline</Text>
                            </View>
                            <View style={styles.guidelineContent}>
                                <Text style={styles.guidelineTxt}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at lacus risus. Morbi nec dui ac urna tincidunt finibus. Ut in nunc justo. Vestibulum auctor augue ac eros auctor dapibus. Integer non dolor id lectus venenatis consequat. Morbi pulvinar, erat at vestibulum condimentum, tortor eros tincidunt metus, a iaculis felis turpis sed erat. Nullam sed sagittis magna. Nulla ac scelerisque nibh. Nulla nec ultricies lorem. Nunc vehicula sollicitudin diam eu mattis.
                                </Text>
                            </View>
                        </Animated.View>
                        <Animated.View {...this.panRes.panHandlers} style={[styles.startBtn, {
                            elevation: this.state.startBtnAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [5, 0]
                            }),
                            backgroundColor: this.state.startBtnAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["white", "#E0E0E0"]
                            }),
                        }]}>
                            <View>
                                <Text style={{
                                    fontSize: uiStyle.fonts.title_size,
                                    fontFamily: uiStyle.fonts.font_bold,
                                    color: this.state.focusTab1 ? uiStyle.colors._blue : uiStyle.colors._green
                                }}>Let's start</Text>
                            </View>
                        </Animated.View>
                        <Animated.View style={[styles.guideLinePanel, {
                            transform: [
                                {
                                    translateX: this.state.guideLinePanelAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [this.screenWidth, 0]
                                    })
                                }
                            ]
                        }]}>
                            <View style={styles.guidelineTitleContainer}>
                                <Text style={[styles.guideLineTitle, { color: uiStyle.colors._green }]}>Guideline</Text>
                            </View>
                            <View style={styles.guidelineContent}>
                                <Text style={styles.guidelineTxt}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at lacus risus. Morbi nec dui ac urna tincidunt finibus. Ut in nunc justo. Vestibulum auctor augue ac eros auctor dapibus. Integer non dolor id lectus venenatis consequat. Morbi pulvinar, erat at vestibulum condimentum, tortor eros tincidunt metus, a iaculis felis turpis sed erat. Nullam sed sagittis magna. Nulla ac scelerisque nibh. Nulla nec ultricies lorem. Nunc vehicula sollicitudin diam eu mattis.
                                </Text>
                            </View>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerBar: {
        width: '100%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: uiStyle.colors._blue,
    },
    headerBarTitle: {
        fontFamily: uiStyle.fonts.font_bold,
        color: 'white',
        fontSize: 22
    },
    mainContainer: {
        height: "100%",
        backgroundColor: "white",
        elevation: 20
    },
    navbar: {
        height: 44,
        backgroundColor: uiStyle.colors._blue,
        flexDirection: 'row',
    },
    navTab: {
        width: "50%",
    },
    tab1Content: {
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "black",
        backgroundColor: uiStyle.colors._blue,
    },
    tab2Content: {
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        backgroundColor: uiStyle.colors._green,
    },
    tabTitleTxt: {
        fontSize: uiStyle.fonts.title_size,
        color: "white",
        fontFamily: uiStyle.fonts.font_medium
    },
    navTab: {
        backgroundColor: uiStyle.colors._green,
        width: "50%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    guideLineContainer: {
        flex: 1,
        backgroundColor: uiStyle.colors._blue,
        alignItems: 'center'
    },
    guideLinePanel: {
        width: Dimensions.get('window').width * 0.77,
        height: Dimensions.get('window').width * 0.77,
        backgroundColor: 'white',
        borderRadius: 18,
        marginTop: 50,
        elevation: 5,
        position: 'absolute'
    },
    guidelineTitleContainer: {
        width: '100%',
        height: '20%',
        borderBottomWidth: 1,
        borderColor: uiStyle.colors._smoke,
        justifyContent: 'center',
        alignItems: 'center'
    },
    guideLineTitle: {
        fontFamily: uiStyle.fonts.font_bold,
        fontSize: uiStyle.fonts.title_size,

    },
    guidelineContent: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 10,
        height: '80%',
        width: '100%',
        alignItems: 'center',
    },
    guideLineTxt: {
        fontSize: uiStyle.fonts.tiny_txt,
        fontFamily: uiStyle.fonts.font
    },
    startBtn: {
        marginTop: Dimensions.get('window').width * 0.77 + 50 + 30,
        width: Dimensions.get('window').width * 0.77,
        height: 50,
        borderRadius: 30,
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Guideline;