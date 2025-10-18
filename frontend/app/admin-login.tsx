import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AdminLoginScreen() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const EXPO_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
      const response = await fetch(`${EXPO_BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const result = await response.json();

      if (response.ok && result.user.role === 'admin') {
        Alert.alert(
          'Welcome Admin!',
          `Hello ${result.user.name}, access granted to admin dashboard.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                router.push({
                  pathname: '/admin-dashboard',
                  params: { adminId: result.user.id, adminName: result.user.name }
                });
              }
            }
          ]
        );
      } else if (response.ok && result.user.role !== 'admin') {
        Alert.alert('Access Denied', 'This login is only for administrators. Please use the correct login page.');
      } else {
        Alert.alert('Error', result.detail || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={60} color="#e74c3c" />
            </View>
            <Text style={styles.welcomeTitle}>Admin Access</Text>
            <Text style={styles.welcomeSubtitle}>
              Secure administrator login for Vihaan Care Nest management system.
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Administrator Login</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Admin Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter admin email"
                value={loginData.email}
                onChangeText={(text) => setLoginData({...loginData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter admin password"
                value={loginData.password}
                onChangeText={(text) => setLoginData({...loginData, password: text})}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Admin Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Admin Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Admin Dashboard Features:</Text>
            
            <View style={styles.featureItem}>
              <Ionicons name="analytics-outline" size={20} color="#e74c3c" />
              <Text style={styles.featureText}>Business Analytics & Reports</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="people-outline" size={20} color="#e74c3c" />
              <Text style={styles.featureText}>Team Member Management</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="person-outline" size={20} color="#e74c3c" />
              <Text style={styles.featureText}>Customer Management</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="calendar-outline" size={20} color="#e74c3c" />
              <Text style={styles.featureText}>Visit Scheduling & Assignment</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="card-outline" size={20} color="#e74c3c" />
              <Text style={styles.featureText}>Subscription & Payment Tracking</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="settings-outline" size={20} color="#e74c3c" />
              <Text style={styles.featureText}>System Configuration</Text>
            </View>
          </View>

          {/* Security Notice */}
          <View style={styles.securitySection}>
            <View style={styles.securityIcon}>
              <Ionicons name="lock-closed" size={24} color="#f39c12" />
            </View>
            <Text style={styles.securityTitle}>Security Notice</Text>
            <Text style={styles.securityText}>
              This is a restricted area. Only authorized administrators should access this panel. 
              All activities are logged and monitored for security purposes.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fdf2f2',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  loginButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
  featuresSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#34495e',
  },
  securitySection: {
    backgroundColor: '#fff9e6',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f39c12',
  },
  securityIcon: {
    marginBottom: 10,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f39c12',
    marginBottom: 10,
  },
  securityText: {
    fontSize: 14,
    color: '#8e6a00',
    textAlign: 'center',
    lineHeight: 20,
  },
});