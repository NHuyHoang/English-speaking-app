import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import uiStyle from '../ui'

export default class wave extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            waveAnim:new Animated.Value(0),
            waveAnimOpac: new Animated.Value(1)
        }
    }

    componentDidMount(){
        setTimeout(()=> this.animHandler(),this.props.delay)
    }

    animHandler = () => {
        Animated.parallel([
            Animated.timing(this.state.waveAnim,{
                toValue:1,
                timing:4000,
            }),
            Animated.timing(this.state.waveAnimOpac,{
                toValue:0,
                timing:4000,
            })
        ]).start(() => {
            Animated.timing(this.state.waveAnim,{
                toValue:0,
                timing:1,
            }).start(() => {
                this.setState({waveAnimOpac: new Animated.Value(1)},() =>{
                    this.animHandler()
                })
            })
        })
    }

    render() {
        return (
            <Animated.View style={[styles.container,this.props.style,{
                transform:[
                    {
                        scale:this.state.waveAnim.interpolate({
                            inputRange:[0,1],
                            outputRange:[1,this.props.radiusScale]
                        })
                    }
                ],
                opacity:this.state.waveAnimOpac.interpolate({
                    inputRange:[0,1],
                    outputRange:[0,0.7]
                })
            }]}>
                
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width:78,
        height:78,
        borderRadius:40,
        backgroundColor:uiStyle.colors._red
    }
})