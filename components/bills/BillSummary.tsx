import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency, formatStatus } from '@/utils/formatters';
import Colors from '@/constants/Colors';

interface BillSummaryProps {
  bill: {
    id: string;
    title: string;
    type: string;
    amount: number;
    status: string;
  };
  onPress: () => void;
}

export function BillSummary({ bill, onPress }: BillSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return Colors.paid;
      case 'pending':
        return Colors.pending;
      case 'overdue':
        return Colors.overdue;
      default:
        return Colors.gray[400];
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{bill.title}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(bill.status) + '15' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: getStatusColor(bill.status) }
            ]}>
              {formatStatus(bill.status)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});