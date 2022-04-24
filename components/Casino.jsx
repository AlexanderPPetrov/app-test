import { StyleSheet, Text, View } from 'react-native';
import { useRemoteConfigContext } from "../context/RemoteConfigContext";

export default function Casino() {
    const { loading, CASINO_ENABLED } = useRemoteConfigContext();
    if(loading) {
        return null
    }
    return (
        <View style={styles.container}>
            <Text>{CASINO_ENABLED ? 'Casino content visible' : 'No casino'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});