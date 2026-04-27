import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { showToast } from '../components/Toast';
import { nmcZones } from '../data/areas';
import { saveComplaint, getComplaints, generateComplaintId } from '../utils/storage';

const categories = [
  { id: 'water', label: 'Water Supply', icon: '💧' },
  { id: 'roads', label: 'Roads & Footpaths', icon: '🛣️' },
  { id: 'sanitation', label: 'Sanitation', icon: '🧹' },
  { id: 'streetlights', label: 'Street Lights', icon: '💡' },
  { id: 'drainage', label: 'Drainage & Sewage', icon: '🕳️' },
  { id: 'garbage', label: 'Garbage Collection', icon: '🗑️' },
  { id: 'encroachment', label: 'Encroachment', icon: '🚫' },
  { id: 'stray', label: 'Stray Animals', icon: '🐕' },
  { id: 'other', label: 'Other', icon: '📋' },
];

const mockStatuses = ['Filed', 'Under Review', 'In Progress', 'Resolved'];

export default function ComplaintsScreen() {
  const [activeSection, setActiveSection] = useState('file');
  const [category, setCategory] = useState('');
  const [zone, setZone] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [trackId, setTrackId] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successId, setSuccessId] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const complaints = await getComplaints();
    setMyComplaints(complaints);
  };

  const handleSubmit = async () => {
    if (!category) { showToast('Please select a category', 'error'); return; }
    if (!zone) { showToast('Please select a zone', 'error'); return; }
    if (!description.trim()) { showToast('Please enter a description', 'error'); return; }
    if (!name.trim()) { showToast('Please enter your name', 'error'); return; }
    if (!mobile || mobile.length < 10) { showToast('Please enter a valid mobile number', 'error'); return; }

    const complaintId = generateComplaintId();
    const complaint = {
      id: complaintId, category, zone, location, description,
      name, mobile, email,
      status: 'Filed',
      statusIndex: 0,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: new Date().toISOString(),
    };

    await saveComplaint(complaint);
    setSuccessId(complaintId);
    setShowSuccess(true);
    setCategory(''); setZone(''); setLocation(''); setDescription('');
    setName(''); setMobile(''); setEmail('');
    loadComplaints();
  };

  const handleTrack = () => {
    if (!trackId.trim()) { showToast('Please enter a complaint ID', 'error'); return; }
    const found = myComplaints.find(c => c.id.toLowerCase() === trackId.toLowerCase());
    if (found) {
      const randomStatus = Math.floor(Math.random() * 3);
      setTrackedComplaint({ ...found, statusIndex: randomStatus });
    } else {
      const randomStatus = Math.floor(Math.random() * 4);
      setTrackedComplaint({
        id: trackId, category: 'other', description: 'Complaint registered via NMC portal',
        status: mockStatuses[randomStatus], statusIndex: randomStatus,
        date: '25 Apr 2026', zone: 'Dharampeth Zone',
      });
    }
  };

  const renderFileSection = () => (
    <View>
      <Text style={styles.formTitle}>📝 File New Complaint</Text>
      <Text style={styles.formDesc}>Report civic issues to Nagpur Municipal Corporation</Text>

      <Text style={styles.inputLabel}>Category *</Text>
      <View style={styles.categoryGrid}>
        {categories.map(cat => (
          <TouchableOpacity key={cat.id} onPress={() => setCategory(cat.id)}
            style={[styles.catChip, category === cat.id && styles.catChipActive]}>
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={[styles.catText, category === cat.id && styles.catTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.inputLabel}>NMC Zone *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.zoneScroll}>
        {nmcZones.map(z => (
          <TouchableOpacity key={z.id} onPress={() => setZone(z.name)}
            style={[styles.zoneChip, zone === z.name && styles.zoneChipActive]}>
            <Text style={[styles.zoneText, zone === z.name && styles.zoneTextActive]}>{z.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.inputLabel}>Specific Location</Text>
      <TextInput style={styles.input} placeholder="Enter address or landmark"
        placeholderTextColor={Colors.textMuted} value={location} onChangeText={setLocation} />

      <Text style={styles.inputLabel}>Description *</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the issue in detail..."
        placeholderTextColor={Colors.textMuted} multiline numberOfLines={4} textAlignVertical="top"
        value={description} onChangeText={setDescription} />

      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>Your Details</Text>

      <Text style={styles.inputLabel}>Full Name *</Text>
      <TextInput style={styles.input} placeholder="Enter your name"
        placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />

      <Text style={styles.inputLabel}>Mobile Number *</Text>
      <View style={styles.phoneRow}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput style={styles.phoneInput} placeholder="10-digit number"
          placeholderTextColor={Colors.textMuted} keyboardType="phone-pad"
          maxLength={10} value={mobile} onChangeText={setMobile} />
      </View>

      <Text style={styles.inputLabel}>Email (Optional)</Text>
      <TextInput style={styles.input} placeholder="your@email.com"
        placeholderTextColor={Colors.textMuted} keyboardType="email-address"
        value={email} onChangeText={setEmail} />

      <GradientButton title="Submit Complaint" icon="📩" onPress={handleSubmit} style={{ marginTop: 12 }} />
    </View>
  );

  const renderTrackSection = () => (
    <View>
      <Text style={styles.formTitle}>🔍 Track Complaint</Text>
      <Text style={styles.formDesc}>Enter your complaint ID to check status</Text>

      <View style={styles.trackRow}>
        <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="e.g. NMC-2026-12345" placeholderTextColor={Colors.textMuted}
          value={trackId} onChangeText={setTrackId} autoCapitalize="characters" />
        <GradientButton title="Track" onPress={handleTrack} small style={{ marginLeft: 10 }} />
      </View>

      {trackedComplaint && (
        <GlassCard style={styles.trackResult}>
          <Text style={styles.trackIdText}>📋 {trackedComplaint.id}</Text>
          <View style={styles.timeline}>
            {mockStatuses.map((status, idx) => (
              <View key={status} style={styles.timelineItem}>
                <View style={[styles.timelineDot,
                  { backgroundColor: idx <= trackedComplaint.statusIndex ? Colors.accent : Colors.bgCardBorder }]} />
                {idx < mockStatuses.length - 1 && (
                  <View style={[styles.timelineLine,
                    { backgroundColor: idx < trackedComplaint.statusIndex ? Colors.accent : Colors.bgCardBorder }]} />
                )}
                <Text style={[styles.timelineText,
                  idx <= trackedComplaint.statusIndex && { color: Colors.textPrimary, fontWeight: '700' }]}>
                  {status}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.trackDetails}>
            <Text style={styles.trackDetail}>📅 Filed: {trackedComplaint.date}</Text>
            <Text style={styles.trackDetail}>📍 Zone: {trackedComplaint.zone}</Text>
          </View>
        </GlassCard>
      )}

      {/* My Complaints */}
      {myComplaints.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionLabel}>📂 My Complaints ({myComplaints.length})</Text>
          {myComplaints.map(c => (
            <GlassCard key={c.id} style={styles.complaintItem}>
              <View style={styles.complaintHeader}>
                <Text style={styles.complaintId}>{c.id}</Text>
                <View style={[styles.statusBadge,
                  { backgroundColor: c.status === 'Resolved' ? Colors.alertGreenBg : Colors.alertOrangeBg }]}>
                  <Text style={[styles.statusText,
                    { color: c.status === 'Resolved' ? Colors.alertGreen : Colors.alertOrange }]}>{c.status}</Text>
                </View>
              </View>
              <Text style={styles.complaintDesc} numberOfLines={2}>{c.description}</Text>
              <Text style={styles.complaintDate}>{c.date} • {c.zone}</Text>
            </GlassCard>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient colors={Colors.gradientDark} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.headerTitle}>📝 Complaint Portal</Text>
          <Text style={styles.headerSubtitle}>Nagpur Municipal Corporation</Text>

          {/* Section Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => setActiveSection('file')}
              style={[styles.toggleBtn, activeSection === 'file' && styles.toggleBtnActive]}>
              <Text style={[styles.toggleText, activeSection === 'file' && styles.toggleTextActive]}>
                File Complaint
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveSection('track')}
              style={[styles.toggleBtn, activeSection === 'track' && styles.toggleBtnActive]}>
              <Text style={[styles.toggleText, activeSection === 'track' && styles.toggleTextActive]}>
                Track Status
              </Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.formCard}>
            {activeSection === 'file' ? renderFileSection() : renderTrackSection()}
          </GlassCard>

          {/* NMC Contact */}
          <GlassCard style={styles.contactCard}>
            <Text style={styles.contactTitle}>📞 NMC Helpline</Text>
            <View style={styles.contactRow}>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={18} color={Colors.primary} />
                <Text style={styles.contactText}>155304</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="logo-whatsapp" size={18} color={Colors.alertGreen} />
                <Text style={styles.contactText}>8600004746</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={18} color={Colors.alertBlue} />
                <Text style={styles.contactText}>1800-120-8040</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalCard}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalTitle}>Complaint Filed!</Text>
            <Text style={styles.modalId}>{successId}</Text>
            <Text style={styles.modalDesc}>
              Your complaint has been registered. Track status using this ID.
            </Text>
            <GradientButton title="Done" onPress={() => setShowSuccess(false)} style={{ marginTop: 16 }} />
          </GlassCard>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 16 },
  toggleContainer: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.bgCardBorder, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  toggleTextActive: { color: Colors.primary },
  formCard: { padding: 20 },
  formTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  formDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, marginTop: 4 },
  input: { backgroundColor: Colors.bgInput, borderRadius: 12, borderWidth: 1, borderColor: Colors.bgCardBorder,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.textPrimary, marginBottom: 12 },
  textArea: { height: 100, paddingTop: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 10, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.bgCardBorder, gap: 6 },
  catChipActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  catIcon: { fontSize: 16 },
  catText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  catTextActive: { color: Colors.primary },
  zoneScroll: { marginBottom: 12 },
  zoneChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.bgCardBorder, marginRight: 8 },
  zoneChipActive: { backgroundColor: Colors.primary + '20', borderColor: Colors.primary },
  zoneText: { fontSize: 12, color: Colors.textSecondary },
  zoneTextActive: { color: Colors.primary, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.bgCardBorder, marginVertical: 16 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgInput, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.bgCardBorder, marginBottom: 12 },
  prefix: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, paddingLeft: 14, paddingRight: 8,
    borderRightWidth: 1, borderRightColor: Colors.bgCardBorder, paddingVertical: 12 },
  phoneInput: { flex: 1, paddingLeft: 12, fontSize: 14, color: Colors.textPrimary, paddingVertical: 12 },
  trackRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  trackResult: { marginTop: 8 },
  trackIdText: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 16 },
  timeline: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  timelineItem: { alignItems: 'center', flex: 1 },
  timelineDot: { width: 16, height: 16, borderRadius: 8, marginBottom: 6 },
  timelineLine: { position: 'absolute', top: 7, left: '60%', right: '-40%', height: 2 },
  timelineText: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  trackDetails: { gap: 4 },
  trackDetail: { fontSize: 13, color: Colors.textSecondary },
  complaintItem: {},
  complaintHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  complaintId: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700' },
  complaintDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  complaintDate: { fontSize: 11, color: Colors.textMuted },
  contactCard: { marginTop: 16 },
  contactTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between' },
  contactItem: { alignItems: 'center', gap: 6 },
  contactText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalCard: { width: '100%', alignItems: 'center', padding: 30, backgroundColor: Colors.bgDark, borderColor: Colors.primary + '40' },
  modalIcon: { fontSize: 50, marginBottom: 12 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  modalId: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginTop: 8 },
  modalDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
