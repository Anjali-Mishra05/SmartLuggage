// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Dimensions,
  Platform,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import Colors from '../constants/colors';

import { API_URL } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_WIDTH < 380;

export default function ProfileScreen({ navigation, route }) {
  const { agentData, token } = route.params || {};
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: agentData?.fullName || agentData?.full_name || '',
    email: agentData?.email || '',
    phone: agentData?.phone || agentData?.mobile || '',
    dateOfBirth: agentData?.dateOfBirth || agentData?.date_of_birth || '',
    idNumber: agentData?.idNumber || agentData?.id_number || '',
    streetAddress: agentData?.streetAddress || agentData?.street_address || '',
    city: agentData?.city || '',
    state: agentData?.state || '',
    postalCode: agentData?.postalCode || agentData?.postal_code || '',
    bankAccountNumber: agentData?.bankAccountNumber || agentData?.account_number || '',
    emergencyContactName: agentData?.emergencyContactName || agentData?.emergency_name || '',
    emergencyContactPhone: agentData?.emergencyContactPhone || agentData?.emergency_phone || '',
  });

  const fetchProfile = async () => {
    if (!token) {
        // Only alert if we really expected a token (e.g. not a pure preview)
        // But for this app, token is required.
        console.log('ProfileScreen: No token found in params');
        return;
    }

    setLoading(true);
    try {
      console.log('ProfileScreen: Fetching from', `${API_URL}/api/kyc`);
      const resp = await fetch(`${API_URL}/api/kyc`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await resp.json();
      
      if (resp.ok && data.kyc) {
        console.log('ProfileScreen: Loaded data', data.kyc);
        const kyc = data.kyc;
        setProfileData({
          fullName: kyc.full_name || kyc.fullName || '',
          email: kyc.email || '',
          phone: kyc.phone || kyc.mobile || '',
          dateOfBirth: kyc.date_of_birth || kyc.dateOfBirth || '',
          idNumber: kyc.id_number || kyc.idNumber || '',
          streetAddress: kyc.street_address || kyc.streetAddress || '',
          city: kyc.city || '',
          state: kyc.state || '',
          postalCode: kyc.postal_code || kyc.postalCode || '',
          bankAccountNumber: kyc.account_number || kyc.bankAccountNumber || '',
          emergencyContactName: kyc.emergency_name || kyc.emergencyContactName || '',
          emergencyContactPhone: kyc.emergency_phone || kyc.emergencyContactPhone || '',
        });
      } else {
         console.log('ProfileScreen: Fetch failed or no KYC data', resp.status, data);
      }
    } catch (err) {
      console.error('Error fetching profile in ProfileScreen:', err);
      Alert.alert('Error', 'Failed to refresh profile data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest profile data on mount
  useEffect(() => {
    fetchProfile();
  }, [token]);

  const onRefresh = React.useCallback(() => {
    fetchProfile();
  }, [token]);


  const doLogout = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Landing' }] })
    );
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) doLogout();
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: doLogout, style: 'destructive' },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.spacer} />
        </View>

      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData.fullName
                ? profileData.fullName.split(' ').map(n => n[0]).join('')
                : 'AG'}
            </Text>
          </View>
          <Text style={styles.agentName}>{profileData.fullName || 'Agent Name'}</Text>
          <Text style={styles.agentPhone}>{profileData.phone || 'Phone Number'}</Text>

          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('KYCForm', {
            token: token,
            agentName: profileData.fullName,
            agentPhone: profileData.phone,
            userId: agentData?.id
          })}>
            <Text style={styles.editProfileBtnText}>Complete Verification / Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{profileData.fullName || 'N/A'}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profileData.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profileData.phone || 'N/A'}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>{profileData.dateOfBirth || 'N/A'}</Text>
          </View>
        </View>

        {/* Identity Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identity Information</Text>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>ID Number</Text>
            <Text style={styles.value}>{profileData.idNumber || 'N/A'}</Text>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Street Address</Text>
            <Text style={styles.value}>{profileData.streetAddress || 'N/A'}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{profileData.city || 'N/A'}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>State</Text>
            <Text style={styles.value}>{profileData.state || 'N/A'}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Postal Code</Text>
            <Text style={styles.value}>{profileData.postalCode || 'N/A'}</Text>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bank Details</Text>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Account Number</Text>
            <Text style={styles.value}>
              {profileData.bankAccountNumber
                ? `****${profileData.bankAccountNumber.slice(-4)}`
                : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Contact Name</Text>
            <Text style={styles.value}>{profileData.emergencyContactName || 'N/A'}</Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <Text style={styles.value}>{profileData.emergencyContactPhone || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.spacerBottom} />
      </ScrollView>

      {/* Fixed Logout Button at bottom */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: IS_SMALL_DEVICE ? 12 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
    marginLeft: -4,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: IS_SMALL_DEVICE ? 20 : 24,
    color: Colors.textWhite,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: IS_SMALL_DEVICE ? 16 : 18,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  spacer: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: IS_SMALL_DEVICE ? 10 : 16,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: IS_SMALL_DEVICE ? 14 : 20,
  },
  avatar: {
    width: IS_SMALL_DEVICE ? 76 : 100,
    height: IS_SMALL_DEVICE ? 76 : 100,
    borderRadius: IS_SMALL_DEVICE ? 38 : 50,
    backgroundColor: Colors.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: {
    color: Colors.textWhite,
    fontSize: IS_SMALL_DEVICE ? 24 : 32,
    fontWeight: '700',
  },
  agentName: {
    fontSize: IS_SMALL_DEVICE ? 16 : 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  agentPhone: {
    fontSize: IS_SMALL_DEVICE ? 12 : 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  editProfileBtn: {
    backgroundColor: Colors.buttonPrimary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  editProfileBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: IS_SMALL_DEVICE ? 12 : 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: IS_SMALL_DEVICE ? 14 : 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: IS_SMALL_DEVICE ? 11 : 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: IS_SMALL_DEVICE ? 13 : 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  logoutContainer: {
    paddingHorizontal: IS_SMALL_DEVICE ? 10 : 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Platform.select({
      ios: {
        paddingBottom: 28,
      },
      android: {
        paddingBottom: 12,
      },
    }),
  },
  logoutButton: {
    backgroundColor: Colors.error,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 16,
  },
  spacerBottom: {
    height: 8,
  },
});
