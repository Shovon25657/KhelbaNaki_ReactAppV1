import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const Profile = () => {
    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        bio: "A passionate developer who loves coding and exploring new technologies.",
        avatar: "https://via.placeholder.com/150",
        social: {
            twitter: "https://twitter.com/johndoe",
            linkedin: "https://linkedin.com/in/johndoe",
            github: "https://github.com/johndoe"
        }
    };

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    };

    return (
        <View style={styles.container}>
            <View style={styles.banner}></View>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.bio}>{user.bio}</Text>
            <View style={styles.socialLinks}>
                <TouchableOpacity onPress={() => openLink(user.social.twitter)}>
                    <Text style={styles.link}>Twitter</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink(user.social.linkedin)}>
                    <Text style={styles.link}>LinkedIn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink(user.social.github)}>
                    <Text style={styles.link}>GitHub</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        maxWidth: 400,
        margin: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    banner: {
        height: 100,
        backgroundColor: '#4CAF50',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%'
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: -75,
        borderWidth: 5,
        borderColor: '#fff'
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10
    },
    email: {
        fontSize: 16,
        color: '#555',
        marginVertical: 5
    },
    bio: {
        fontSize: 14,
        color: '#777',
        marginVertical: 10,
        textAlign: 'center'
    },
    socialLinks: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    link: {
        fontSize: 14,
        color: '#4CAF50',
        textDecorationLine: 'underline'
    }
});

export default Profile;