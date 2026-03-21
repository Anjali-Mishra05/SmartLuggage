// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';
import Colors from '../constants/colors';
import LogoIcon from '../components/LogoIcon';

export default function LoginScreen({ navigation, route }) {
  const [isLogin, setIsLogin] = useState(route.params?.showSignUp ? false : true);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async () => {
    if (mobile.trim() === '' || password.trim() === '') {
      Alert.alert('Validation', 'Please enter mobile number and password.');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          password: password,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        Alert.alert('Error', data.error || 'Login failed');
        setLoading(false);
        return;
      }

      setLoading(false);
      // Store token securely? For now just navigate
      // Maybe params.token navigation?
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard', params: { user: data.user, token: data.token } }],
      });
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Network error. Check backend URL.');
      console.error(err);
    }
  };

  const handleSignup = async () => {
    // Add logging to debug
    console.log('Signup clicked', { name, mobile, password, confirmPassword });

    if (name.trim() === '' || mobile.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      if (Platform.OS === 'web') {
        window.alert('Validation: Please fill all fields.');
      } else {
        Alert.alert('Validation', 'Please fill all fields.');
      }
      return;
    }
    if (password !== confirmPassword) {
      if (Platform.OS === 'web') {
        window.alert('Validation: Passwords do not match.');
      } else {
        Alert.alert('Validation', 'Passwords do not match.');
      }
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: name.trim(),
          mobile: mobile.trim(),
          password: password,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setLoading(false);
        if (Platform.OS === 'web') {
          window.alert(data.error || 'Signup failed');
        } else {
          Alert.alert('Error', data.error || 'Signup failed');
        }
        return;
      }

      setLoading(false);
      if (Platform.OS === 'web') {
        window.alert('Success: Account created! Now complete KYC verification.');
      } else {
        Alert.alert('Success', 'Account created! Now complete KYC verification.');
      }
      navigation.navigate('KYCForm', {
        agentName: data.user.fullName,
        agentPhone: data.user.mobile,
        userId: data.user.id,
        token: data.token,
      });
    } catch (err) {
      setLoading(false);
      if (Platform.OS === 'web') {
        window.alert('Error: Network error. Check backend URL.');
      } else {
        Alert.alert('Error', 'Network error. Check backend URL.');
      }
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <LogoIcon size={64} borderRadius={16} />
          <Text style={styles.headerTitle}>Smart Luggage</Text>
          <Text style={styles.headerSubtitle}>Agent Login</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          {/* Toggle Buttons */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {isLogin ? (
            // LOGIN FORM
            <>
              <Text style={styles.label}>Mobile Number / Agent ID</Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter your mobile number or agent ID"
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textPlaceholder}
              />
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.textPlaceholder}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.guestButton} 
                onPress={() => navigation.navigate('Guest')}
              >
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>

              <Text style={styles.guestNote}>
                Guest users can explore the app but must complete KYC to access tasks
              </Text>
            </>
          ) : (
            // SIGNUP FORM
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textPlaceholder}
              />
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textPlaceholder}
              />
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.textPlaceholder}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={Colors.textPlaceholder}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
                <Text style={styles.loginText}>Create Account</Text>
              </TouchableOpacity>

              <Text style={styles.signupNote}>
                After signup, complete KYC verification to start accepting deliveries.
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF5252',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: '#FF5252',
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textWhite,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textWhite,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: Colors.buttonPrimary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.textWhite,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  loginButton: {
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  loginText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'center',
    color: Colors.buttonPrimary,
    marginTop: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  guestButton: {
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  guestText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  guestNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  signupNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eyeIcon: {
    marginLeft: 10,
  },
});
