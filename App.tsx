import React from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Text, View } from 'react-native';
import { Constants } from './model/Constants';
import { tryParseJson } from './model/Utility';
import { Ceaseless } from './model/api-types/Ceaseless';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// TODO: fix types in inheritance 
export default class App extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = { 
            isLoadingComplete: false, 
            scripture: {
                verse: "Not yet loaded"
            }
        };
    }

    private async _getVerseOfTheDayAsync(): Promise<void> {
        const httpResponse = await fetch(Constants.CeaselessBaseUrl, { method: "GET" });
        const result = tryParseJson(await httpResponse.text()) as Ceaseless.IScripture;
        this.setState({ scripture: { verse: result.text, reference: result.citation } });
    }

    private async _loadResourcesAsync(): Promise<void> {
        await this._getVerseOfTheDayAsync();
    }

    private _handleFinishLoading(): void {
        this.setState({ isLoadingComplete: true });
    }

    private _handleError(error: any): void {
        console.log(error);
    }

    public render() {
        if (!this.state.isLoadingComplete) {
            return (
                <AppLoading
                    startAsync={() => this._loadResourcesAsync()}
                    onFinish={() => this._handleFinishLoading()}
                    onError={(error) => this._handleError(error)}
                />
            )
        }

        return (
            <View style={styles.container} >
                <Text>{this.state.scripture.verse}</Text>
            </View>
        );
    }
}
