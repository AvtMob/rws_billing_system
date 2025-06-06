import { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowRight, Bell, Calendar, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserBills } from '@/services/billService';
import { BillSummary } from '@/components/bills/BillSummary';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatCurrency } from '@/utils/formatters';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billsSummary, setBillsSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  });
  const [recentBills, setRecentBills] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const isAdmin = user?.role === 'admin';
  const displayName = user?.displayName || 'Resident';

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // For a real app, these would be separate API calls
        const userBills = await fetchUserBills(user?.uid);
        
        // Calculate summary
        const total = userBills.reduce((sum, bill) => sum + bill.amount, 0);
        const paid = userBills.filter(bill => bill.status === 'paid')
          .reduce((sum, bill) => sum + bill.amount, 0);
        const pending = userBills.filter(bill => bill.status === 'pending')
          .reduce((sum, bill) => sum + bill.amount, 0);
        const overdue = userBills.filter(bill => bill.status === 'overdue')
          .reduce((sum, bill) => sum + bill.amount, 0);
        
        setBillsSummary({ total, paid, pending, overdue });
        
        // Get recent bills
        const recent = [...userBills].sort((a, b) => 
          new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        ).slice(0, 3);
        setRecentBills(recent);
        
        // Mock notifications
        setNotifications([
          { id: '1', title: 'Bill Payment Due', message: 'Your water bill is due in 3 days', date: new Date(), type: 'reminder' },
          { id: '2', title: 'Maintenance Notice', message: 'Scheduled water supply maintenance on Sunday', date: new Date(Date.now() - 86400000), type: 'notice' }
        ]);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Failed to load data. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user?.uid]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, {displayName}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(billsSummary.pending + billsSummary.overdue)}</Text>
            <TouchableOpacity style={styles.viewButton} onPress={() => router.push('/bills')}>
              <Text style={styles.viewButtonText}>View Bills</Text>
              <ArrowRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bills</Text>
            <TouchableOpacity onPress={() => router.push('/bills')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentBills.length > 0 ? (
            recentBills.map((bill) => (
              <BillSummary
                key={bill.id}
                bill={bill}
                onPress={() => router.push(`/bills/${bill.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={24} color={Colors.gray[400]} />
              <Text style={styles.emptyText}>No recent bills</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Bell size={24} color={Colors.gray[400]} />
              <Text style={styles.emptyText}>No notifications</Text>
            </View>
          )}
        </View>
        
        {isAdmin && (
          <View style={styles.adminActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/bills/generate')}>
                <Text style={styles.actionButtonText}>Generate Bills</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/reports')}>
                <Text style={styles.actionButtonText}>View Reports</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {billsSummary.overdue > 0 && (
          <View style={styles.alertCard}>
            <AlertCircle size={24} color={Colors.error} />
            <Text style={styles.alertText}>
              You have {formatCurrency(billsSummary.overdue)} in overdue payments
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  header: {
    paddingTop: 60,
    paddingBottom: 80,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  date: {
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  balanceCard: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    color: Colors.gray[500],
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  balanceAmount: {
    color: Colors.text,
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginTop: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
  },
  viewButtonText: {
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 4,
  },
  content: {
    marginTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  seeAll: {
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    color: Colors.gray[500],
    marginTop: 8,
  },
  adminActions: {
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  alertCard: {
    backgroundColor: Colors.error + '10', // 10% opacity
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    color: Colors.error,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});