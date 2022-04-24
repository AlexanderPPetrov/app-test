import { StatusBar } from 'expo-status-bar';
import Casino from "./components/Casino";
import { RemoteConfigContextProvider } from "./context/RemoteConfigContextProvider";
import { StyleSheet, View } from "react-native";

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <RemoteConfigContextProvider>
                <Casino/>
            </RemoteConfigContextProvider>
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
