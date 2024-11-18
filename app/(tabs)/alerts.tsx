import { StyleSheet, Text, View } from 'react-native';

export default function AlertsScreen() {
    return (
        <View style={styles.container}>
            <Text>Here will be displayed the alerts!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
    },
});
