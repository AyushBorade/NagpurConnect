import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { showToast } from '../components/Toast';
import { civicAlerts, alertCategories } from '../data/alerts';
import { nagpurAreas } from '../data/areas';
import { saveSubscription } from '../utils/storage';

export default function AlertsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [phone, setPhone] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Alerts refreshed!', 'info');
    }, 1500);
  };

  const filteredAlerts = civicAlerts.filter((alert) => {
    const categoryMatch =
      selectedCategory === 'all' || alert.category === selectedCategory;
    const areaMatch =
      selectedArea === 'all' || alert.area === selectedArea || alert.area === 'all';
    return categoryMatch && areaMatch;
  });

  const handleSubscribe = async () => {
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid mobile number', 'error');
      return;
    }
    const area = nagpurAreas.find((a) => a.id === selectedArea);
    await saveSubscription({
      phone,
      area: area?.name || 'All Areas',
      type: 'civic',
      date: new Date().toISOString(),
    });
    showToast(
      `Civic alerts enabled for ${area?.name || 'All Areas'}! You'll receive SMS notifications 📱`,
      'success'
    );
    setPhone('');
    setShowSubscribe(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return Colors.alertRed;
      case 'important': return Colors.alertOrange;
      default: return Colors.alertBlue;
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'urgent': return Colors.alertRedBg;
      case 'important': return Colors.alertOrangeBg;
      default: return Colors.alertBlueBg;
    }
  };

  return (
    <LinearGradient colors={Colors.gradientDark} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>📢 Civic Alerts</Text>
              <Text style={styles.headerSubtitle}>
                Power cuts, water supply & civic news
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowSubscribe(!showSubscribe)}
              style={styles.bellButton}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* SMS Subscribe Card */}
        {showSubscribe && (
          <GlassCard style={styles.subscribeCard}>
            <Text style={styles.subscribeTitle}>📲 Get SMS Alerts</Text>
            <Text style={styles.subscribeDesc}>
              Receive area-specific civic alerts directly on your phone. Get notified before power cuts, water disruptions, and more!
            </Text>
            <View style={styles.phoneInput}>
              <Text style={styles.phonePrefix}>+91</Text>
              <TextInput
                style={styles.phoneField}
                placeholder="Enter mobile number"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <GradientButton
              title="Subscribe"
              icon="✅"
              onPress={handleSubscribe}
              small
            />
          </GlassCard>
        )}

        {/* Area Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>📍 Filter by Area</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {nagpurAreas.slice(0, 15).map((area) => (
              <TouchableOpacity
                key={area.id}
                onPress={() => setSelectedArea(area.id)}
                style={[
                  styles.filterChip,
                  selectedArea === area.id && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedArea === area.id && styles.filterChipTextActive,
                  ]}
                >
                  {area.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          {alertCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alert Count */}
        <Text style={styles.resultCount}>
          {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} found
        </Text>

        {/* Alert Feed */}
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <Animated.View
              key={alert.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <GlassCard
                style={[
                  styles.alertCard,
                  {
                    borderLeftWidth: 4,
                    borderLeftColor: getPriorityColor(alert.priority),
                  },
                ]}
              >
                {/* Alert Header */}
                <View style={styles.alertHeader}>
                  <Text style={styles.alertEmoji}>{alert.icon}</Text>
                  <View style={styles.alertTitleContainer}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <View style={styles.alertBadges}>
                      <View
                        style={[
                          styles.priorityBadge,
                          { backgroundColor: getPriorityBg(alert.priority) },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityText,
                            { color: getPriorityColor(alert.priority) },
                          ]}
                        >
                          {alert.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Alert Body */}
                <Text style={styles.alertDesc}>{alert.description}</Text>

                {/* Alert Details */}
                <View style={styles.alertDetails}>
                  <View style={styles.alertDetailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.alertDetailText}>{alert.date}</Text>
                  </View>
                  <View style={styles.alertDetailRow}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.alertDetailText}>{alert.time}</Text>
                  </View>
                  <View style={styles.alertDetailRow}>
                    <Ionicons
                      name="hourglass-outline"
                      size={14}
                      color={Colors.textMuted}
                    />
                    <Text style={styles.alertDetailText}>
                      Duration: {alert.duration}
                    </Text>
                  </View>
                </View>

                {/* Alert Footer */}
                <View style={styles.alertFooter}>
                  <Text style={styles.alertSource}>
                    Source: {alert.source}
                  </Text>
                  <Text style={styles.alertPosted}>{alert.postedAt}</Text>
                </View>
              </GlassCard>
            </Animated.View>
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No alerts found</Text>
            <Text style={styles.emptySubtext}>
              Try changing the area or category filter
            </Text>
          </GlassCard>
        )}

        {/* Pull to Refresh hint */}
        <View style={styles.refreshHint}>
          <Ionicons name="arrow-down" size={14} color={Colors.textMuted} />
          <Text style={styles.refreshHintText}>
            Pull down to refresh alerts
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 16 },
  header: { marginBottom: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Subscribe
  subscribeCard: { padding: 16, marginBottom: 16 },
  subscribeTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  subscribeDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 12 },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    marginBottom: 12,
  },
  phonePrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingLeft: 14,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: Colors.bgCardBorder,
    paddingVertical: 12,
  },
  phoneField: {
    flex: 1,
    paddingLeft: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },

  // Filters
  filterSection: { marginBottom: 12 },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  filterScroll: { marginBottom: 4 },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  filterChipText: { fontSize: 12, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primary, fontWeight: '700' },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    gap: 4,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  categoryIcon: { fontSize: 14 },
  categoryText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  categoryTextActive: { color: Colors.primary },

  resultCount: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 12,
    fontWeight: '500',
  },

  // Alert Card
  alertCard: {},
  alertHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  alertEmoji: { fontSize: 22, marginRight: 10, marginTop: 2 },
  alertTitleContainer: { flex: 1 },
  alertTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  alertBadges: { flexDirection: 'row' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  alertDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 10 },
  alertDetails: { gap: 4, marginBottom: 10 },
  alertDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  alertDetailText: { fontSize: 12, color: Colors.textMuted },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.bgCardBorder,
  },
  alertSource: { fontSize: 11, color: Colors.textMuted },
  alertPosted: { fontSize: 11, color: Colors.textMuted },

  // Empty state
  emptyCard: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  emptySubtext: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },

  // Refresh hint
  refreshHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  refreshHintText: { fontSize: 12, color: Colors.textMuted },
});
