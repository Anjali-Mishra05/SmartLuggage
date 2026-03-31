import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, SafeAreaView, Platform, StatusBar, 
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PickupDetails() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [pickupType, setPickupType] = useState('Home');
  const [pickupAddress, setPickupAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [dropAddress, setDropAddress] = useState('');

  const pickupTypes = [
    { id: 'Home', icon: 'home-outline' },
    { id: 'Office', icon: 'business-outline' },
    { id: 'Other', icon: 'location-outline' },
  ];

  const handleConfirm = () => {
  router.push({
    // Added (booking) to the path to match your folder structure
    pathname: '/(booking)/confirm',
    params: { 
      ...params,            
      pickup: pickupAddress,
      landmark: landmark,
      drop: dropAddress,
      type: pickupType
    }
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerAction}>
            <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Pickup</Text>
          <View style={styles.headerAction} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Stepper */}
          <View style={styles.stepperRow}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <Text style={styles.stepLabelActive}>Flight Info</Text>
            </View>
            
            {/* FIXED LINE BELOW: Changed div to View */}
            <View style={[styles.stepLine, { backgroundColor: '#10B981' }]} />
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <Text style={styles.stepLabelActive}>Luggage</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: '#FF3B2F' }]} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCurrent]}>
                <Text style={styles.stepNum}>3</Text>
              </View>
              <Text style={styles.stepLabelActive}>Pickup</Text>
            </View>
          </View>

          <View style={styles.infoBanner}>
            <View style={styles.greenIconCircle}>
              <Ionicons name="location" size={20} color="#FFF" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Pickup Details</Text>
              <Text style={styles.infoSub}>Almost done! Just need your pickup and drop locations</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Pickup Type</Text>
            <View style={styles.typeRow}>
              {pickupTypes.map((type) => (
                <TouchableOpacity 
                  key={type.id}
                  onPress={() => setPickupType(type.id)}
                  style={[styles.typeBtn, pickupType === type.id && styles.typeBtnActive]}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={24} 
                    color={pickupType === type.id ? '#FF3B2F' : '#4B5563'} 
                  />
                  <Text style={[styles.typeText, pickupType === type.id && styles.typeTextActive]}>
                    {type.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Pickup Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-sharp" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textArea}
                placeholder="Enter complete pickup address"
                placeholderTextColor="#9CA3AF"
                multiline
                value={pickupAddress}
                onChangeText={setPickupAddress}
                blurOnSubmit={false}
              />
            </View>
            <View style={[styles.inputWrapper, { marginTop: 12 }]}>
              <TextInput
                style={styles.singleInput}
                placeholder="Landmark (optional)"
                placeholderTextColor="#9CA3AF"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Drop Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="navigate-circle" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textArea}
                placeholder="Enter drop location address"
                placeholderTextColor="#9CA3AF"
                multiline
                value={dropAddress}
                onChangeText={setDropAddress}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <LinearGradient 
              colors={['#FF5F5F', '#FF8C00']} 
              start={{x:0, y:0}} 
              end={{x:1, y:0}} 
              style={styles.gradient}
            >
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{marginLeft: 8}} />
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 100 }} /> 
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, 
    paddingBottom: 15, 
    alignItems: 'center' 
  },
  headerAction: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1C1E' },
  scrollContent: { paddingHorizontal: 20 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCompleted: { backgroundColor: '#10B981' },
  stepCurrent: { backgroundColor: '#FF3B2F' },
  stepNum: { color: '#FFF', fontWeight: 'bold' },
  stepLabelActive: { fontSize: 11, color: '#1A1C1E', marginTop: 4, fontWeight: '700' },
  stepLine: { width: 40, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 8, marginTop: -15 },
  infoBanner: { backgroundColor: '#EFFFF4', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#D1FAE5' },
  greenIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  infoTextContainer: { marginLeft: 12, flex: 1 },
  infoTitle: { fontWeight: '800', fontSize: 16, color: '#064E3B' },
  infoSub: { fontSize: 12, color: '#065F46', marginTop: 2 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12, color: '#1A1C1E' },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  typeBtn: { width: '31%', height: 80, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  typeBtnActive: { borderColor: '#FF3B2F', backgroundColor: '#FFF9F9' },
  typeText: { fontSize: 13, color: '#4B5563', fontWeight: '600', marginTop: 8 },
  typeTextActive: { color: '#FF3B2F' },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 12 },
  inputIcon: { marginTop: 2, marginRight: 8 },
  textArea: { flex: 1, fontSize: 14, color: '#1A1C1E', minHeight: 60, textAlignVertical: 'top' },
  singleInput: { flex: 1, fontSize: 14, color: '#1A1C1E' },
  confirmBtn: { marginTop: 10, marginBottom: 20 },
  gradient: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});