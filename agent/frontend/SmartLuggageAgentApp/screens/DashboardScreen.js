// screens/DashboardScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

import { API_URL } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_WIDTH < 380;

const mockTasks = [
  {
    id: 1,
    agentName: 'Rajesh Kumar',
    agentId: 'TK001234',
    type: 'Pickup',
    pickupLocation: '123 MG Road, Bengaluru, Karnataka 560001',
    dropLocation: 'Airport Terminal 2, Bengaluru',
    timeSlot: '10:00 AM - 11:00 AM',
    luggage: 2,
    status: 'assigned',
    phoneNumber: '+91-9876543210',
  },
  {
    id: 2,
    agentName: 'Priya Sharma',
    agentId: 'TK001235',
    type: 'Delivery',
    pickupLocation: 'Airport Terminal 1, Kolkata',
    dropLocation: '45 Park Street, Kolkata, West Bengal 700016',
    timeSlot: '2:00 PM - 3:00 PM',
    luggage: 1,
    status: 'assigned',
    phoneNumber: '+91-9876543211',
  },
  {
    id: 5,
    agentName: 'Amit Patel',
    agentId: 'TK001239',
    type: 'Pickup',
    pickupLocation: 'Andheri West, Mumbai, Maharashtra',
    dropLocation: 'CSMI Airport Terminal 2, Mumbai',
    timeSlot: '8:00 AM - 9:00 AM',
    luggage: 3,
    status: 'assigned',
    phoneNumber: '+91-9876543214',
  },
  {
    id: 6,
    agentName: 'Sara Khan',
    agentId: 'TK001240',
    type: 'Delivery',
    pickupLocation: 'Chennai International Airport',
    dropLocation: 'T Nagar, Chennai, Tamil Nadu',
    timeSlot: '4:00 PM - 5:00 PM',
    luggage: 2,
    status: 'assigned',
    phoneNumber: '+91-9876543215',
  },
  {
    id: 7,
    agentName: 'Rahul Deshmukh',
    agentId: 'TK001241',
    type: 'Pickup',
    pickupLocation: 'Koregaon Park, Pune, Maharashtra',
    dropLocation: 'Pune Airport',
    timeSlot: '12:00 PM - 1:00 PM',
    luggage: 1,
    status: 'assigned',
    phoneNumber: '+91-9876543216',
  },
  {
    id: 8,
    agentName: 'Anjali Gupta',
    agentId: 'TK001242',
    type: 'Delivery',
    pickupLocation: 'Sardar Vallabhbhai Patel Airport, Ahmedabad',
    dropLocation: 'Satellite, Ahmedabad, Gujarat',
    timeSlot: '6:00 PM - 7:00 PM',
    luggage: 2,
    status: 'assigned',
    phoneNumber: '+91-9876543217',
  },
  {
    id: 9,
    agentName: 'Ravi Singh',
    agentId: 'TK001243',
    type: 'Pickup',
    pickupLocation: 'Malviya Nagar, Jaipur, Rajasthan',
    dropLocation: 'Jaipur International Airport',
    timeSlot: '7:00 AM - 8:00 AM',
    luggage: 2,
    status: 'assigned',
    phoneNumber: '+91-9876543218',
  },
  {
    id: 10,
    agentName: 'Zara Ali',
    agentId: 'TK001244',
    type: 'Delivery',
    pickupLocation: 'Chaudhary Charan Singh Airport, Lucknow',
    dropLocation: 'Gomti Nagar, Lucknow, Uttar Pradesh',
    timeSlot: '1:00 PM - 2:00 PM',
    luggage: 1,
    status: 'assigned',
    phoneNumber: '+91-9876543219',
  },
  {
    id: 11,
    agentName: 'Manpreet Kaur',
    agentId: 'TK001245',
    type: 'Pickup',
    pickupLocation: 'Sector 17, Chandigarh',
    dropLocation: 'Chandigarh Airport',
    timeSlot: '9:30 AM - 10:30 AM',
    luggage: 2,
    status: 'assigned',
    phoneNumber: '+91-9876543220',
  },
  {
    id: 12,
    agentName: 'Arjun Nair',
    agentId: 'TK001246',
    type: 'Delivery',
    pickupLocation: 'Cochin International Airport',
    dropLocation: 'Fort Kochi, Kochi, Kerala',
    timeSlot: '3:30 PM - 4:30 PM',
    luggage: 3,
    status: 'assigned',
    phoneNumber: '+91-9876543221',
  },
  {
    id: 3,
    agentName: 'Neha Reddy',
    agentId: 'TK001237',
    type: 'Delivery',
    pickupLocation: 'Hyderabad Airport',
    dropLocation: '12 Banjara Hills, Hyderabad, Telangana 500034',
    timeSlot: '11:00 AM - 12:00 PM',
    luggage: 2,
    status: 'in-progress',
    weight: 15,
    phoneNumber: '+91-9876543212',
  },
  {
    id: 4,
    agentName: 'Vikram Singh',
    agentId: 'TK001238',
    type: 'Pickup',
    pickupLocation: '34 Connaught Place, New Delhi 110001',
    dropLocation: 'IGI Airport Terminal 3, New Delhi',
    timeSlot: '9:00 AM - 10:00 AM',
    luggage: 1,
    weight: 8,
    status: 'completed',
    phoneNumber: '+91-9876543213',
  },
];

export default function DashboardScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('Assigned');
  const [fullAgentData, setFullAgentData] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  
  // Get token and basic user info from login params
  const { token, user } = route.params || {};

  // Fetch KYC details on mount
  React.useEffect(() => {
    if (!token) {
        console.log('Dashboard: No token available');
        return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Dashboard: Fetching KYC profile...');
        const resp = await fetch(`${API_URL}/api/kyc`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (resp.ok) {
          const data = await resp.json();
          console.log('Dashboard: Fetched KYC Data:', data);
          // The backend returns { kyc: {...}, files: [...] }
          // We only need the nested kyc object for profile display
          if (data.kyc) {
             setFullAgentData(data.kyc);
          }
        } else {
            console.log('Dashboard: Failed to fetch profile', resp.status);
        }
      } catch (err) {
        console.log('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [token]);

  // Merge fullAgentData if available, into display data (or use user param)
  // Ensure we prioritize the freshly fetched data
  const displayData = fullAgentData || user || {};

  const handleAcceptTask = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: 'in-progress' } : task
      )
    );
    // Optionally switch tab to show the progress
    setActiveTab('In Progress');
  };

  const handleDeclineTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'Assigned') return task.status === 'assigned';
    if (activeTab === 'In Progress') return task.status === 'in-progress';
    if (activeTab === 'Completed') return task.status === 'completed';
    return true;
  });

  const getTaskCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile', { agentData: displayData, token: token })}
            style={styles.profileButton}
          >
            <Text style={styles.profileButtonText}>👤 Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getTaskCount('assigned')}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getTaskCount('in-progress')}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getTaskCount('completed')}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['Assigned', 'In Progress', 'Completed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate('TaskDetails', { task })}
              onAccept={() => handleAcceptTask(task.id)}
              onDecline={() => handleDeclineTask(task.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks in this category</Text>
          </View>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

function TaskCard({ task, onPress, onAccept, onDecline }) {
  const getTypeColor = (type) => {
    return type === 'Pickup' ? '#7C3AED' : '#10B981';
  };

  return (
    <TouchableOpacity style={styles.taskCard} onPress={onPress}>
      {/* Agent Avatar & Info */}
      <View style={styles.agentSection}>
        <View style={[styles.avatar, { backgroundColor: getTypeColor(task.type) }]}>
          <Text style={styles.avatarText}>
            {task.agentName.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{task.agentName}</Text>
          <Text style={styles.agentId}>{task.agentId}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(task.type) }]}>
          <Text style={styles.typeText}>{task.type}</Text>
        </View>
      </View>

      {/* Location Info */}
      <View style={styles.locationSection}>
        <View style={styles.locationItem}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {task.pickupLocation}
          </Text>
        </View>
        <View style={styles.locationItem}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {task.dropLocation}
          </Text>
        </View>
      </View>

      {/* Time & Luggage */}
      <View style={styles.bottomSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🕐</Text>
          <Text style={styles.infoText}>{task.timeSlot}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🧳</Text>
          <Text style={styles.infoText}>{task.luggage} bags</Text>
        </View>
      </View>

      {/* Status Badge */}
      {task.status === 'in-progress' && task.weight && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>✓ Weight updated: {task.weight} kg</Text>
        </View>
      )}

      {task.status === 'completed' && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>✓ OTP Verified</Text>
        </View>
      )}

      {/* Actions */}
      {task.status === 'assigned' ? (
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAccept}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton]}
            onPress={onDecline}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.viewTaskButton} onPress={onPress}>
          <Text style={styles.viewTaskText}>View Task</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
    paddingBottom: 20,
    paddingHorizontal: IS_SMALL_DEVICE ? 12 : 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: IS_SMALL_DEVICE ? 18 : 20,
    fontWeight: '700',
    color: Colors.textWhite,
    flex: 1,
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  profileButtonText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textWhite,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.buttonPrimary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.buttonPrimary,
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  taskCard: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  agentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: Colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  agentId: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: Colors.textWhite,
    fontSize: 11,
    fontWeight: '600',
  },
  locationSection: {
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottomSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '500',
  },
  viewTaskButton: {
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewTaskText: {
    color: Colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: Colors.buttonPrimary,
  },
  declineButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  acceptButtonText: {
    color: Colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  declineButtonText: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
