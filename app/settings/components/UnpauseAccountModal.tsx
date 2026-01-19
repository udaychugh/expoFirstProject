import React from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { X, PlayCircle } from 'lucide-react-native';
import Clickable from '@/components/Clickable';

interface UnpauseAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onUnpause: () => void;
  loading: boolean;
}

export default function UnpauseAccountModal({
  visible,
  onClose,
  onUnpause,
  loading,
}: UnpauseAccountModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Unpause Account</Text>
            <Clickable onPress={onClose} disabled={loading}>
              <X color="#6B7280" size={24} />
            </Clickable>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <PlayCircle color="#10B981" size={48} />
            </View>
            <Text style={styles.warningTitle}>Welcome Back!</Text>
            <Text style={styles.warningText}>
              Are you sure you want to unpause your account? Your profile will
              be visible to other users again.
            </Text>

            <View style={styles.actions}>
              <Clickable
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Clickable>
              <Clickable
                style={[styles.button, styles.unpauseButton]}
                onPress={onUnpause}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.unpauseButtonText}>Unpause Account</Text>
                )}
              </Clickable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  unpauseButton: {
    backgroundColor: '#10B981',
  },
  unpauseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
