import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, FileText, CreditCard, CheckCircle2, XCircle, AlertCircle } from 'lucide-react-native';
import { fetchBillById } from '@/services/billService';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Colors from '@/constants/Colors';

export default function BillDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBill = async () => {
      try {
        setIsLoading(true);
        const billData = await fetchBillById(id as string);
        setBill(billData);
      } catch (err) {
        console.error('Error loading bill:', err);
        setError('Failed to load bill details');
      } finally {
        setIsLoading(false);
      }
    };

    loadBill();
  }, [id]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 size={24} color={Colors.paid} />;
      case 'pending':
        return <Clock size={24} color={Colors.pending} />;
      case 'overdue':
        return <AlertCircle size={24} color={Colors.overdue} />;
      default:
        return <XCircle size={24} color={Colors.gray[400]} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  }

  if (!bill) {
    return <ErrorMessage message="Bill not found" />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Colors.primary },
          headerTitleStyle: { color: '#fff', fontFamily: 'Inter-Bold' },
          headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
          title: 'Bill Details',
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{bill.title}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(bill.status) + '15' }
            ]}>
              {getStatusIcon(bill.status)}
              <Text style={[
                styles.statusText,
                { color: getStatusColor(bill.status) }
              ]}>
                {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Calendar size={20} color={Colors.gray[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Bill Date</Text>
              <Text style={styles.infoValue}>{formatDate(bill.billDate)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Clock size={20} color={Colors.gray[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Due Date</Text>
              <Text style={styles.infoValue}>{formatDate(bill.dueDate)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <FileText size={20} color={Colors.gray[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoValue}>{bill.description}</Text>
            </View>
          </View>

          {bill.status === 'paid' && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <CreditCard size={20} color={Colors.gray[500]} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Payment Method</Text>
                  <Text style={styles.infoValue}>{bill.paymentMethod}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <CheckCircle2 size={20} color={Colors.gray[500]} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Paid On</Text>
                  <Text style={styles.infoValue}>{formatDate(bill.paidDate)}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {bill.status !== 'paid' && (
          <TouchableOpacity 
            style={styles.payButton}
            onPress={() => router.push(`/bills/${id}/pay`)}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.text,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  payButton: {
    backgroundColor: Colors.primary,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  payButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
});