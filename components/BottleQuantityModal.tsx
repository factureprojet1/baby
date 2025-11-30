import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

interface BottleQuantityModalProps {
  visible: boolean;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export function BottleQuantityModal({ visible, onConfirm, onCancel }: BottleQuantityModalProps) {
  const [quantity, setQuantity] = useState('');

  const handleConfirm = () => {
    const value = parseInt(quantity, 10);
    if (!isNaN(value) && value > 0) {
      onConfirm(value);
      setQuantity('');
    }
  };

  const handleSkip = () => {
    onConfirm(0);
    setQuantity('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Bottle Quantity</Text>
          <Text style={styles.subtitle}>How much did the baby drink?</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="120"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              autoFocus
            />
            <Text style={styles.unit}>ml</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  input: {
    fontSize: 48,
    fontWeight: '600',
    color: '#2D3748',
    borderBottomWidth: 3,
    borderBottomColor: '#A0D8B3',
    minWidth: 100,
    textAlign: 'center',
    paddingVertical: 8,
  },
  unit: {
    fontSize: 32,
    fontWeight: '600',
    color: '#718096',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#E2E8F0',
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
  },
  confirmButton: {
    backgroundColor: '#A0D8B3',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
});
