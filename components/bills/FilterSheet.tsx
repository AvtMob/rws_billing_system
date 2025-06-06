import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface FilterOption {
  value: string;
  label: string;
}

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

const typeOptions: FilterOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'water', label: 'Water' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'other', label: 'Other' },
];

const dateRangeOptions: FilterOption[] = [
  { value: 'all', label: 'All Time' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'last6Months', label: 'Last 6 Months' },
  { value: 'thisYear', label: 'This Year' },
];

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: {
    status: string;
    type: string;
    dateRange: string;
  };
}

export function FilterSheet({ 
  visible, 
  onClose, 
  onApply, 
  initialFilters 
}: FilterSheetProps) {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (category: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({
      status: 'all',
      type: 'all',
      dateRange: 'all'
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Bills</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.gray[500]} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.optionsContainer}>
                {statusOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.status === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleFilterChange('status', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.status === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Bill Type</Text>
              <View style={styles.optionsContainer}>
                {typeOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.type === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleFilterChange('type', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.type === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.optionsContainer}>
                {dateRangeOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.dateRange === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleFilterChange('dateRange', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.dateRange === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    minHeight: '60%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: '70%',
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  selectedOption: {
    backgroundColor: Colors.primary + '15', // 15% opacity
    borderColor: Colors.primary,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
  },
  selectedOptionText: {
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    width: '30%',
    alignItems: 'center',
  },
  resetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '65%',
    alignItems: 'center',
  },
  applyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fff',
  },
});