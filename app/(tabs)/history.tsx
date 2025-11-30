import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Clock, Droplet } from 'lucide-react-native';
import { useFeeding } from '@/context/FeedingContext';
import { filterFeedingsByDate, calculateTotalFeedingTime, formatDateTime, formatDuration } from '@/utils/calculations';
import { Feeding } from '@/types/feeding';

type FilterType = 'today' | 'yesterday' | 'week';

export default function HistoryScreen() {
  const { feedings } = useFeeding();
  const [activeFilter, setActiveFilter] = useState<FilterType>('today');

  const filteredFeedings = filterFeedingsByDate(feedings, activeFilter);
  const totalMinutes = calculateTotalFeedingTime(filteredFeedings);

  const getFeedingTypeLabel = (type: 'left' | 'right' | 'bottle'): string => {
    if (type === 'left') return 'Left';
    if (type === 'right') return 'Right';
    return 'Bottle';
  };

  const getFeedingTypeColor = (type: 'left' | 'right' | 'bottle'): string => {
    if (type === 'left') return '#BEE3F8';
    if (type === 'right') return '#FED7E2';
    return '#FAF089';
  };

  const getFilterLabel = (filter: FilterType): string => {
    if (filter === 'today') return 'Today';
    if (filter === 'yesterday') return 'Yesterday';
    return 'Last 7 days';
  };

  const renderFeedingItem = (feeding: Feeding) => (
    <View key={feeding.id} style={styles.feedingItem}>
      <View style={[styles.feedingIndicator, { backgroundColor: getFeedingTypeColor(feeding.type) }]} />

      <View style={styles.feedingContent}>
        <View style={styles.feedingHeader}>
          <Text style={styles.feedingType}>{getFeedingTypeLabel(feeding.type)}</Text>
          <View style={styles.durationBadge}>
            <Clock size={16} color="#718096" />
            <Text style={styles.durationText}>{feeding.durationMinutes} min</Text>
          </View>
        </View>

        <Text style={styles.feedingTime}>{formatDateTime(new Date(feeding.endTime))}</Text>

        {feeding.quantityMl && (
          <View style={styles.quantityContainer}>
            <Droplet size={16} color="#4299E1" />
            <Text style={styles.quantityText}>{feeding.quantityMl} ml</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feeding History</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'today' && styles.filterButtonActive]}
          onPress={() => setActiveFilter('today')}
        >
          <Text style={[styles.filterText, activeFilter === 'today' && styles.filterTextActive]}>
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'yesterday' && styles.filterButtonActive]}
          onPress={() => setActiveFilter('yesterday')}
        >
          <Text style={[styles.filterText, activeFilter === 'yesterday' && styles.filterTextActive]}>
            Yesterday
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'week' && styles.filterButtonActive]}
          onPress={() => setActiveFilter('week')}
        >
          <Text style={[styles.filterText, activeFilter === 'week' && styles.filterTextActive]}>
            Last 7 days
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total feeding time {getFilterLabel(activeFilter).toLowerCase()}</Text>
        <Text style={styles.totalValue}>{formatDuration(totalMinutes)}</Text>
        <Text style={styles.totalCount}>{filteredFeedings.length} feeding{filteredFeedings.length !== 1 ? 's' : ''}</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredFeedings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No feedings recorded {getFilterLabel(activeFilter).toLowerCase()}</Text>
          </View>
        ) : (
          filteredFeedings.map(renderFeedingItem)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#A0D8B3',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  filterTextActive: {
    color: '#22543D',
  },
  totalCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 40,
    fontWeight: '700',
    color: '#2D3748',
  },
  totalCount: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  feedingItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  feedingIndicator: {
    width: 6,
  },
  feedingContent: {
    flex: 1,
    padding: 16,
  },
  feedingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedingType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7FAFC',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  feedingTime: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
});
