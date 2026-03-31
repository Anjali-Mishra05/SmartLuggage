// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, TouchableOpacity, 
//   TextInput, SafeAreaView, Platform, StatusBar
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Location from 'expo-location';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useCallback } from 'react';

// export default function PickupDetails() {
//   const router = useRouter();
//   const params = useLocalSearchParams(); 
  
//   const [pincode, setPincode] = useState('');
//   const [pickupAddress, setPickupAddress] = useState('Fetching location...');
//   const [pickupTime, setPickupTime] = useState(new Date());
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [additionalInfo, setAdditionalInfo] = useState('');

//   // ✅ SAME LOGIC AS HOMEPAGE
//   const getPickupLocation = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setPickupAddress("Permission denied");
//         return;
//       }

//       let loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//       });

//       let res = await Location.reverseGeocodeAsync(loc.coords);
//       let currentAddr = "Current location";

//       if (res.length > 0) {
//         currentAddr = `${res[0].name || ""}, ${res[0].street || ""}, ${res[0].city || ""}`;
//       }

//       const saved = await AsyncStorage.getItem("pickupDetails");

//       if (saved) {
//         const data = JSON.parse(saved);

//         if (data.userSelected) {
//           setPickupAddress(data.address);
//           return;
//         }
//       }

//       setPickupAddress(currentAddr);

//     } catch (e) {
//       console.log(e);
//       setPickupAddress("Error fetching location");
//     }
//   };

//   // ✅ INITIAL LOAD
//   useEffect(() => {
//     getPickupLocation();
//   }, []);

//   // ✅ WHEN USER COMES BACK FROM SEARCH
//  useFocusEffect(
//   useCallback(() => {
//     let isActive = true;

//     const loadPickup = async () => {
//       try {
//         const saved = await AsyncStorage.getItem("pickupDetails");
//         if (saved) {
//           const data = JSON.parse(saved);
//           if (data.userSelected && isActive) {
//             setPickupAddress(data.address);
//             await AsyncStorage.removeItem("pickupDetails");
//             return; // DO NOT fetch current location
//           }
//         }

//         // Only fetch current location if no user-selected address
//         if (isActive) await getPickupLocation();

//       } catch (e) {
//         console.log("Error loading pickup:", e);
//       }
//     };

//     loadPickup();

//     return () => { isActive = false }; // cancel if component unmounts
//   }, [])
// );

//   const handleConfirm = () => {
//     router.push({
//       pathname: '/(booking)/confirm',
//       params: { 
//         ...params,
//         pincode,
//         pickupAddress,
//         pickupTime: pickupTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
//         additionalInfo
//       }
//     });
//   };

//   const onChangeTime = (event, selectedTime) => {
//     setShowTimePicker(Platform.OS === 'ios');
//     if (selectedTime) setPickupTime(selectedTime);
//   };

//   return (
//     <SafeAreaView style={styles.container}>

//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.headerAction}>
//           <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Book Pickup</Text>
//         <View style={styles.headerAction} />
//       </View>

//       <KeyboardAwareScrollView
//         contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         enableOnAndroid={true}
//         extraScrollHeight={Platform.OS === 'android' ? 100 : 80}
//       >

//         {/* Stepper */}
//         <View style={styles.stepperRow}>
//           <View style={styles.stepItem}>
//             <View style={[styles.stepCircle, styles.stepCompleted]}>
//               <Ionicons name="checkmark" size={16} color="#FFF" />
//             </View>
//             <Text style={styles.stepLabelActive}>Flight Info</Text>
//           </View>
//           <View style={[styles.stepLine, { backgroundColor: '#10B981' }]} />
//           <View style={styles.stepItem}>
//             <View style={[styles.stepCircle, styles.stepCompleted]}>
//               <Ionicons name="checkmark" size={16} color="#FFF" />
//             </View>
//             <Text style={styles.stepLabelActive}>Luggage</Text>
//           </View>
//           <View style={[styles.stepLine, { backgroundColor: '#FF3B2F' }]} />
//           <View style={styles.stepItem}>
//             <View style={[styles.stepCircle, styles.stepCurrent]}>
//               <Text style={styles.stepNum}>3</Text>
//             </View>
//             <Text style={styles.stepLabelActive}>Pickup</Text>
//           </View>
//         </View>

//         <View style={styles.infoBanner}>
//           <View style={styles.greenIconCircle}>
//             <Ionicons name="location" size={20} color="#FFF" />
//           </View>
//           <View style={styles.infoTextContainer}>
//             <Text style={styles.infoTitle}>Pickup Details</Text>
//             <Text style={styles.infoSub}>Almost done! Enter pickup info & preferred time</Text>
//           </View>
//         </View>

//         {/* ✅ SINGLE ADDRESS (SYNCED WITH HOMEPAGE) */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionLabel}>Pickup Location</Text>

//           <TouchableOpacity
//             style={styles.inputWrapper}
//             onPress={() =>
//               router.push({
//                 pathname: "/search_pickup",
//                 params: { address: pickupAddress },
//               })
//             }
//           >
//             <Ionicons name="location-sharp" size={20} color="#10B981" style={{ marginRight: 10 }} />
//             <Text style={{ flex: 1, color: "#1A1C1E" }} numberOfLines={2}>
//               {pickupAddress}
//             </Text>
//             <Ionicons name="chevron-forward" size={18} color="#999" />
//           </TouchableOpacity>
//         </View>

//         {/* Pincode */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionLabel}>Pincode</Text>
//           <View style={styles.inputWrapper}>
//             <TextInput
//               style={styles.singleInput}
//               placeholder="Enter area pincode"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="number-pad"
//               value={pincode}
//               onChangeText={setPincode}
//             />
//           </View>
//         </View>

//         {/* Pickup Time */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionLabel}>Pickup Time</Text>
//           <TouchableOpacity style={styles.timeSlotBtn} onPress={() => setShowTimePicker(true)}>
//             <Ionicons name="time-outline" size={20} color="#FF3B2F" />
//             <Text style={styles.timeSlotText}>
//               {pickupTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//             </Text>
//           </TouchableOpacity>
//           {showTimePicker && (
//             <DateTimePicker
//               value={pickupTime}
//               mode="time"
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               onChange={onChangeTime}
//             />
//           )}
//         </View>

//         {/* Additional Info */}
//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionLabel}>Additional Information (Optional)</Text>
//           <View style={[styles.inputWrapper, { marginTop: 6 }]}>
//             <TextInput
//               style={[styles.singleInput, { flex: 1 }]}
//               placeholder="Enter additional info..."
//               placeholderTextColor="#9CA3AF"
//               value={additionalInfo}
//               onChangeText={setAdditionalInfo}
//             />
//           </View>
//         </View>

//         <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
//           <LinearGradient 
//             colors={['#FF5F5F', '#FF8C00']} 
//             start={{x:0, y:0}} 
//             end={{x:1, y:0}} 
//             style={styles.gradient}
//           >
//             <Text style={styles.confirmBtnText}>Confirm Booking</Text>
//             <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{marginLeft: 8}} />
//           </LinearGradient>
//         </TouchableOpacity>

//       </KeyboardAwareScrollView>
//     </SafeAreaView>
//   );
// }

// // ✅ STYLES SAME (UNCHANGED)
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F9FAFB' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 15, alignItems: 'center' },
//   headerAction: { width: 40 },
//   headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1C1E' },
//   stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
//   stepItem: { alignItems: 'center' },
//   stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
//   stepCompleted: { backgroundColor: '#10B981' },
//   stepCurrent: { backgroundColor: '#FF3B2F' },
//   stepNum: { color: '#FFF', fontWeight: 'bold' },
//   stepLabelActive: { fontSize: 11, color: '#1A1C1E', marginTop: 4, fontWeight: '700' },
//   stepLine: { width: 40, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 8, marginTop: -15 },
//   infoBanner: { backgroundColor: '#EFFFF4', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#D1FAE5' },
//   greenIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
//   infoTextContainer: { marginLeft: 12, flex: 1 },
//   infoTitle: { fontWeight: '800', fontSize: 16, color: '#064E3B' },
//   infoSub: { fontSize: 12, color: '#065F46', marginTop: 2 },
//   sectionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 },
//   sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12, color: '#1A1C1E' },
//   inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 12 },
//   singleInput: { flex: 1, fontSize: 14, color: '#1A1C1E', padding: 8 },
//   timeSlotBtn: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', marginBottom: 10, flexDirection:'row', alignItems:'center' },
//   timeSlotText: { marginLeft: 8, fontSize: 14, color: '#1A1C1E' },
//   confirmBtn: { marginTop: 10, marginBottom: 20 },
//   gradient: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
//   confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
// });

import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  TextInput, SafeAreaView, Platform, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PickupDetails() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [pincode, setPincode] = useState('');
  const [pickupAddress, setPickupAddress] = useState(''); // Initially empty
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // ✅ Load pickup address from homepage/AsyncStorage
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPickup = async () => {
        try {
          // First, check if there's a pickupDetails object with address
          const saved = await AsyncStorage.getItem("pickupDetails");
          if (saved && isActive) {
            const data = JSON.parse(saved);
            if (data.address) {
              setPickupAddress(data.address);
            }
          }
          
          // Also check for a stored location from homepage
          const storedLocation = await AsyncStorage.getItem("homepageLocation");
          if (storedLocation && isActive) {
            setPickupAddress(storedLocation);
          }
        } catch (e) {
          console.log("Error loading pickup address:", e);
          if (isActive) setPickupAddress("Unable to fetch location");
        }
      };

      loadPickup();

      return () => { isActive = false };
    }, [])
  );

  const handleConfirm = () => {
    router.push({
      pathname: '/(booking)/confirm',
      params: { 
        ...params,
        pincode,
        pickupAddress,
        pickupTime: pickupTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        additionalInfo
      }
    });
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setPickupTime(selectedTime);
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerAction}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Pickup</Text>
        <View style={styles.headerAction} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'android' ? 100 : 80}
      >

        {/* Stepper */}
        <View style={styles.stepperRow}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
            <Text style={styles.stepLabelActive}>Flight Info</Text>
          </View>
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
            <Text style={styles.infoSub}>Almost done! Enter pickup info & preferred time</Text>
          </View>
        </View>

        {/* Pickup Address */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Pickup Location</Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() =>
              router.push({
                pathname: "/search_pickup",
                params: { address: pickupAddress },
              })
            }
          >
            <Ionicons name="location-sharp" size={20} color="#10B981" style={{ marginRight: 10 }} />
            <Text style={{ flex: 1, color: "#1A1C1E" }} numberOfLines={2}>
              {pickupAddress || "Select pickup address"}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Pincode */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Pincode</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.singleInput}
              placeholder="Enter area pincode"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
        </View>

        {/* Pickup Time */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Pickup Time</Text>
          <TouchableOpacity style={styles.timeSlotBtn} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={20} color="#FF3B2F" />
            <Text style={styles.timeSlotText}>
              {pickupTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={pickupTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
            />
          )}
        </View>

        {/* Additional Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Additional Information (Optional)</Text>
          <View style={[styles.inputWrapper, { marginTop: 6 }]}>
            <TextInput
              style={[styles.singleInput, { flex: 1 }]}
              placeholder="Enter additional info..."
              placeholderTextColor="#9CA3AF"
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
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

      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// ✅ STYLES (UNCHANGED)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 15, alignItems: 'center' },
  headerAction: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1C1E' },
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
  sectionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12, color: '#1A1C1E' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 12 },
  singleInput: { flex: 1, fontSize: 14, color: '#1A1C1E', padding: 8 },
  timeSlotBtn: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', marginBottom: 10, flexDirection:'row', alignItems:'center' },
  timeSlotText: { marginLeft: 8, fontSize: 14, color: '#1A1C1E' },
  confirmBtn: { marginTop: 10, marginBottom: 20 },
  gradient: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});