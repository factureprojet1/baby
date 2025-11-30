import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Baby, Droplet } from 'lucide-react-native';
import { useFeeding } from '@/context/FeedingContext';
import { FeedingTimer } from '@/components/FeedingTimer';
import { CountdownTimer } from '@/components/CountdownTimer';
import { BottleQuantityModal } from '@/components/BottleQuantityModal';
import { calculateBabyAge, formatBabyAge, formatTime, getNextSuggestedSide } from '@/utils/calculations';

export default function HomeScreen() {
  const { feedings, settings, activeSession, lastSide, nextFeedingTime, startFeeding, stopFeeding } = useFeeding();
  const [showBottleModal, setShowBottleModal] = useState(false);

  const babyAge = calculateBabyAge(settings.babyBirthDate);
  const lastFeeding = feedings[0];
  const suggestedSide = getNextSuggestedSide(lastSide);

  const handleStartFeeding = async (type: 'left' | 'right' | 'bottle') => {
    await startFeeding(type);
  };

  const handleStopFeeding = async () => {
    if (activeSession?.type === 'bottle') {
      setShowBottleModal(true);
    } else {
      await stopFeeding();
    }
  };

  const handleBottleQuantityConfirm = async (quantity: number) => {
    setShowBottleModal(false);
    await stopFeeding(quantity > 0 ? quantity : undefined);
  };

  const getFeedingTypeLabel = (type: 'left' | 'right' | 'bottle'): string => {
    if (type === 'left') return 'Left breast';
    if (type === 'right') return 'Right breast';
    return 'Bottle';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.babyInfo}>
          <Baby size={32} color="#A0D8B3" strokeWidth={2.5} />
          <View style={styles.babyDetails}>
            <Text style={styles.babyName}>{settings.babyName}</Text>
            <Text style={styles.babyAge}>{formatBabyAge(babyAge)}</Text>
          </View>
        </View>
      </View>

      {activeSession ? (
        <View style={styles.activeSession}>
          <Text style={styles.sessionTitle}>Current feeding</Text>
          <Text style={styles.sessionType}>{getFeedingTypeLabel(activeSession.type)}</Text>

          <View style={styles.timerContainer}>
            <FeedingTimer startTime={activeSession.startTime} />
          </View>

          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopFeeding}
          >
            <Text style={styles.stopButtonText}>Stop Feeding</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {lastFeeding && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Last Feeding</Text>
              <Text style={styles.infoValue}>
                {formatTime(new Date(lastFeeding.endTime))}
              </Text>
              <Text style={styles.infoSubtext}>
                {getFeedingTypeLabel(lastFeeding.type)} • {lastFeeding.durationMinutes} min
              </Text>
            </View>
          )}

          {nextFeedingTime && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Next Feeding</Text>
              <Text style={styles.infoValue}>
                {formatTime(nextFeedingTime)}
              </Text>
              <CountdownTimer targetTime={nextFeedingTime} />
            </View>
          )}

          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionLabel}>Suggested next</Text>
            <Text style={styles.suggestionValue}>
              {suggestedSide === 'left' ? 'Left breast' : 'Right breast'}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Text style={styles.buttonsTitle}>Start Feeding</Text>

            <TouchableOpacity
              style={[styles.feedingButton, styles.leftButton]}
              onPress={() => handleStartFeeding('left')}
            >
              <Text style={styles.feedingButtonText}>Left Breast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.feedingButton, styles.rightButton]}
              onPress={() => handleStartFeeding('right')}
            >
              <Text style={styles.feedingButtonText}>Right Breast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.feedingButton, styles.bottleButton]}
              onPress={() => handleStartFeeding('bottle')}
            >
              <Droplet size={28} color="#2D3748" strokeWidth={2.5} />
              <Text style={styles.feedingButtonText}>Bottle</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <BottleQuantityModal
        visible={showBottleModal}
        onConfirm={handleBottleQuantityConfirm}
        onCancel={() => setShowBottleModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  babyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
  },
  babyDetails: {
    marginLeft: 12,
  },
  babyName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  babyAge: {
    fontSize: 16,
    color: '#718096',
    marginTop: 2,
  },
  activeSession: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 18,
    color: '#718096',
    marginBottom: 8,
  },
  sessionType: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 32,
  },
  timerContainer: {
    marginVertical: 32,
  },
  stopButton: {
    backgroundColor: '#FC8181',
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 16,
    marginTop: 32,
    minWidth: 250,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2D3748',
  },
  infoSubtext: {
    fontSize: 16,
    color: '#A0AEC0',
    marginTop: 8,
  },
  suggestionCard: {
    backgroundColor: '#E6F7EF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A0D8B3',
  },
  suggestionLabel: {
    fontSize: 16,
    color: '#2F855A',
    marginBottom: 8,
  },
  suggestionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22543D',
  },
  buttonsContainer: {
    marginTop: 8,
  },
  buttonsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  feedingButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  leftButton: {
    backgroundColor: '#BEE3F8',
  },
  rightButton: {
    backgroundColor: '#FED7E2',
  },
  bottleButton: {
    backgroundColor: '#FAF089',
  },
  feedingButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
});
