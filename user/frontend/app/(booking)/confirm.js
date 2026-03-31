import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, Platform, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function BookingSummary() {
  const router = useRouter();
  const params = useLocalSearchParams(); 

  // Destructure all data passed through the chain
  const { 
    // From flight.js
    airline = "Not selected", 
    flightNum = "N/A", 
    depCity = "", 
    arrCity = "",
    depTime = "",
    
    // From luggage.js
    bags = "0", 
    weight = "0 kg", 
    luggageTypes = "Not specified",

    // From pickup.js
    pickup = "Not provided", 
    landmark = "", 
    drop = "Not provided",
    type = "Other"
  } = params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={26} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.hero}>
          <View style={styles.iconWrapper}>
            <LinearGradient colors={['#FFF1F1', '#FFE4E4']} style={styles.iconCircle}>
              <Feather name="file-text" size={32} color="#FF5F5F" />
            </LinearGradient>
          </View>
          <Text style={styles.heroTitle}>Booking Summary</Text>
          <Text style={styles.heroSub}>Review your trip details below</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.tag}>SUMMARY</Text>
            <Text style={styles.idText}>#LB-88291</Text>
          </View>

          {/* DYNAMIC FLIGHT DETAILS */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBg}>
              <Feather name="send" size={16} color="#FF5F5F" />
            </View>
            <View style={styles.detailTexts}>
              <Text style={styles.detailLabel}>Flight</Text>
              <Text style={styles.detailMain}>{flightNum} • {airline}</Text>
              <Text style={styles.detailSub}>{depCity} to {arrCity} • {depTime}</Text>
            </View>
          </View>

          {/* DYNAMIC LUGGAGE DETAILS */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBg}>
              <Feather name="shopping-bag" size={16} color="#FF5F5F" />
            </View>
            <View style={styles.detailTexts}>
              <Text style={styles.detailLabel}>Luggage</Text>
              <Text style={styles.detailMain}>{bags} {parseInt(bags) === 1 ? 'Bag' : 'Bags'} ({luggageTypes})</Text>
              <Text style={styles.detailSub}>Max {weight} total</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconBg}>
              <Feather name="map-pin" size={16} color="#FF5F5F" />
            </View>
            <View style={styles.detailTexts}>
              <Text style={styles.detailLabel}>Pickup From ({type})</Text>
              <Text style={styles.detailMain}>{pickup}</Text>
              {landmark ? <Text style={styles.detailSub}>Near {landmark}</Text> : null}
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconBg}>
              <Feather name="navigation" size={16} color="#FF5F5F" />
            </View>
            <View style={styles.detailTexts}>
              <Text style={styles.detailLabel}>Drop Location</Text>
              <Text style={styles.detailMain}>{drop}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Total to Pay</Text>
          <Text style={styles.priceValue}>₹499.00</Text>
          <View style={styles.dotLine} />
          <Text style={styles.priceInfo}>EVERYTHING INCLUDED</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.payButton}>
          <LinearGradient 
            colors={['#FF6B6B', '#FF8E53']} 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 1}} 
            style={styles.gradientBtn}
          >
            <Text style={styles.payButtonText}>Proceed to Payment</Text>
            <Feather name="chevron-right" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modifyBtn} onPress={() => router.back()}>
          <Text style={styles.modifyText}>Modify Booking</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 45 : 20, 
    height: Platform.OS === 'android' ? 100 : 80,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1C1E', letterSpacing: -0.5 },
  scrollContent: { paddingHorizontal: 24 },
  hero: { alignItems: 'center', marginTop: 10, marginBottom: 25 },
  iconWrapper: { marginBottom: 12 },
  iconCircle: { width: 72, height: 72, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#1A1C1E', letterSpacing: -0.8 },
  heroSub: { fontSize: 15, color: '#8E8E93', marginTop: 4 },
  mainCard: { backgroundColor: '#FFF', borderRadius: 30, padding: 24, borderWidth: 1, borderColor: '#F2F2F7', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 4, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  tag: { fontSize: 11, fontWeight: '800', color: '#FF5F5F', letterSpacing: 1 },
  idText: { fontSize: 13, fontWeight: '600', color: '#AEAEB2' },
  detailRow: { flexDirection: 'row', marginBottom: 20 },
  detailIconBg: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFF5F5', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  detailTexts: { flex: 1 },
  detailLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '500', marginBottom: 2 },
  detailMain: { fontSize: 15, color: '#1A1C1E', fontWeight: '700' },
  detailSub: { fontSize: 13, color: '#C7C7CC', marginTop: 2 },
  priceCard: { backgroundColor: '#FAFAFC', borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 25, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#E5E5EA' },
  priceLabel: { fontSize: 14, color: '#8E8E93', fontWeight: '600' },
  priceValue: { fontSize: 38, fontWeight: '900', color: '#1C1C1E', marginVertical: 4 },
  dotLine: { width: 30, height: 2, backgroundColor: '#E5E5EA', marginVertical: 8 },
  priceInfo: { fontSize: 10, color: '#C7C7CC', fontWeight: '800' },
  payButton: { shadowColor: '#FF6B6B', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  gradientBtn: { height: 64, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  payButtonText: { color: '#FFF', fontSize: 18, fontWeight: '800', marginRight: 8 },
  modifyBtn: { alignSelf: 'center', marginTop: 15 },
  modifyText: { color: '#C7C7CC', fontWeight: '700', fontSize: 14 }
});