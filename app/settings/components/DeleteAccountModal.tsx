import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { X, AlertTriangle, Check } from 'lucide-react-native';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: (reason: string) => void;
  loading: boolean;
}

const REASONS = [
  'I met someone',
  'Not satisfied with the service',
  'I want to take a break',
  'Other',
];

export default function DeleteAccountModal({
  visible,
  onClose,
  onDelete,
  loading,
}: DeleteAccountModalProps) {
  const [step, setStep] = useState(0); // 0: Warning, 1: Reason
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState('');

  const handleClose = () => {
    setStep(0);
    setSelectedReason('');
    setOtherReason('');
    onClose();
  };

  const handleNext = () => {
    setStep(1);
  };

  const calculateFinalReason = () => {
    if (selectedReason === 'Other') {
      return otherReason;
    }
    return selectedReason;
  };

  const handleConfirm = () => {
    const reason = calculateFinalReason();
    if (reason.trim()) {
      onDelete(reason);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 0 ? 'Delete Account' : 'We are sorry to see you go'}
            </Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>

          {step === 0 ? (
            /* Step 0: Warning */
            <View style={styles.content}>
              <View style={styles.warningIconContainer}>
                <AlertTriangle color="#DC2626" size={48} />
              </View>
              <Text style={styles.warningTitle}>Are you sure?</Text>
              <Text style={styles.warningText}>
                This action cannot be undone. All your data, matches, and
                messages will be permanently deleted.
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleNext}
                >
                  <Text style={styles.deleteButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Step 1: Reason Selection */
            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Please tell us why you are leaving:
              </Text>

              <View style={styles.reasonsList}>
                {REASONS.map((reason) => (
                  <Pressable
                    key={reason}
                    style={styles.reasonOption}
                    onPress={() => setSelectedReason(reason)}
                    disabled={loading}
                  >
                    <View style={styles.radioContainer}>
                      <View
                        style={[
                          styles.radioOuter,
                          selectedReason === reason &&
                            styles.radioOuterSelected,
                        ]}
                      >
                        {selectedReason === reason && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </Pressable>
                ))}
              </View>

              {selectedReason === 'Other' && (
                <TextInput
                  style={styles.input}
                  placeholder="Please specify..."
                  value={otherReason}
                  onChangeText={setOtherReason}
                  multiline
                  editable={!loading}
                />
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setStep(0)}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.deleteButton,
                    (!selectedReason ||
                      (selectedReason === 'Other' && !otherReason.trim())) &&
                      styles.disabledButton,
                  ]}
                  onPress={handleConfirm}
                  disabled={
                    loading ||
                    !selectedReason ||
                    (selectedReason === 'Other' && !otherReason.trim())
                  }
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    alignItems: 'stretch',
  },
  warningIconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
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
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
  },
  reasonsList: {
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioContainer: {
    marginRight: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#E11D48',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E11D48',
  },
  reasonText: {
    fontSize: 16,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
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
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
