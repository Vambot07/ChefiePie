import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '~/context/AuthContext';
import SuccessModal from '~/components/modal/SuccessModal';


const ForgotPasswordScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const { resetPassword } = useAuth();

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'success' | 'error'>('success');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const showModal = (type: 'success' | 'error', title: string, message: string) => {
        setModalType(type);
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (modalType === 'success') {
            navigation.goBack();
        }
    };

    const handleResetPassword = async () => {
        // TODO: Implement password reset logic
        if (!email.trim()) {
            showModal('error', 'Error', 'Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showModal('error', 'Error', 'Please enter a valid email address');
            return;
        }

        console.log('Reset password for: ', email);

        const result = await resetPassword(email);
        if (result.success) {
            showModal('success', 'Success', result.msg || 'Reset link sent');
        } else {
            showModal('error', 'Error', result.msg || 'Failed to send reset link');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.content}>
                <Image
                    source={require('../../../assets/ChefiePieLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we'll send you instructions to reset your password.
                </Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleResetPassword}
                    >
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Success/Error Modal */}
            <SuccessModal
                visible={modalVisible}
                title={modalTitle}
                message={modalMessage}
                onClose={handleModalClose}
                icon={modalType === 'success' ? 'checkmark-circle' : 'alert-circle'}
                iconColor={modalType === 'success' ? '#22C55E' : '#EF4444'}
                iconBgColor={modalType === 'success' ? '#DCFCE7' : '#FEE2E2'}
                buttonText={modalType === 'success' ? 'Back to Sign In' : 'Try Again'}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4E0', // secondary color
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
        lineHeight: 22,
    },
    form: {
        width: '100%',
        gap: 15,
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        width: '100%',
    },
    button: {
        backgroundColor: '#FF6B6B',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

export default ForgotPasswordScreen;