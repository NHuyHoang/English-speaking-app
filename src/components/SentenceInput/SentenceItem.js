import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uiStyle from '../ui'

export default class SentenceItem extends React.Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onToggleSelectHandler.bind(this);
        this.state = {
            selected: false
        }
    }

    onToggleSelectHandler() {
        this.setState(prev => ({ selected: !prev.selected }), () => {
            this.props.onSelected(this.props.content, this.state.selected);
        });
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.onSelect} >
                <View style={styles.content}><Text style={styles.contentTxt}>{this.props.content}</Text></View>
                {this.state.selected ? <Icon size={20} name="done" color="green" /> : null}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: uiStyle.colors._light_gray,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    content: {
        width: "90%",
        justifyContent: 'flex-end'
    },
    contentTxt: {
        fontFamily: uiStyle.fonts.font,
        fontSize: 15,
        color: uiStyle.colors._dark_gray,
    }
})