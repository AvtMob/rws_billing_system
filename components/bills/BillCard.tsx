import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DropletIcon, WrenchIcon, BoltIcon, FileIcon } from 'lucide-react-native';
import { formatCurrency, formatDate, formatStatus } from '@/utils/formatters';
import Colors from '@/constants/Colors';

interface BillCardProps {
  bill: {
    id: string;
    title: string;
    type: string;
    amount: number;
    status: string;
    dueDate: string;
    billDate: string;
  };
  onPress: () => void;
}

export function BillCard({ bill, onPress }: BillCardProps) {
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
  
  const getBillTypeIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <DropletIcon size={18} color={Colors.water} />;
      case 'maintenance':
        return <WrenchIcon size={18} color={Colors.maintenance} />;
      case 'electricity':
        return <BoltIcon size={18} color={Colors.electricity} />;
      default:
        return <FileIcon size={18} color={Colors.other} />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.typeContainer}>
          {getBillTypeIcon(bill.type)}
          <Text style={styles.type}>{bill.type.charAt(0).toUpperCase() + bill.type.slice(1)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
            {formatStatus(bill.status)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.title}>{bill.title}</Text>
      
      <View style={styles.infoRow}>
        <View style={styles.dateInfo}>
          <Text style={styles.infoLabel}>Bill Date</Text>
          <Text style={styles.infoValue}>{formatDate(bill.billDate)}</Text>
        </View>
        <View style={styles.dateInfo}>
          <Text style={styles.infoLabel}>Due Date</Text>
          <Text style={styles.infoValue}>{formatDate(bill.dueDate)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
        <Text style={styles.viewDetails}>View Details</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[600],
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateInfo: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    paddingTop: 12,
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  viewDetails: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
});