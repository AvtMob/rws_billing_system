import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserBills } from '@/services/billService';
import { BillCard } from '@/components/bills/BillCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { FilterSheet } from '@/components/bills/FilterSheet';
import { formatCurrency } from '@/utils/formatters';
import Colors from '@/constants/Colors';

export default function BillsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all',
  });
  
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    const loadBills = async () => {
      try {
        setIsLoading(true);
        const fetchedBills = await fetchUserBills(user?.uid);
        setBills(fetchedBills);
        setFilteredBills(fetchedBills);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading bills:', err);
        setError('Failed to load bills. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadBills();
  }, [user?.uid]);
  
  useEffect(() => {
    // Filter bills based on search query and active filters
    let result = [...bills];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(bill => 
        bill.title.toLowerCase().includes(query) || 
        bill.id.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (activeFilters.status !== 'all') {
      result = result.filter(bill => bill.status === activeFilters.status);
    }
    
    // Apply type filter
    if (activeFilters.type !== 'all') {
      result = result.filter(bill => bill.type === activeFilters.type);
    }
    
    // Apply date range filter
    if (activeFilters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (activeFilters.dateRange) {
        case 'lastMonth':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;
        case 'last3Months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case 'last6Months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      result = result.filter(bill => new Date(bill.billDate) >= startDate);
    }
    
    setFilteredBills(result);
  }, [bills, searchQuery, activeFilters]);
  
  const onApplyFilters = (filters) => {
    setActiveFilters(filters);
    setFilterVisible(false);
  };
  
  const getTotalAmount = () => {
    return filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: true,
        headerTitle: 'Bills',
        headerStyle: { backgroundColor: Colors.primary },
        headerTitleStyle: { color: '#fff', fontFamily: 'Inter-Bold' },
        headerTintColor: '#fff',
        headerShadowVisible: false,
      }} />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bills..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon={() => <Search size={20} color={Colors.gray[400]} />} />}
          mode="outlined"
          outlineColor={Colors.gray[200]}
          activeOutlineColor={Colors.primary}
          theme={{ roundness: 8 }}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text style={styles.summaryValue}>{formatCurrency(getTotalAmount())}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Bills Count</Text>
          <Text style={styles.summaryValue}>{filteredBills.length}</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredBills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BillCard
            bill={item}
            onPress={() => router.push(`/bills/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bills found</Text>
            <Text style={styles.emptySubtext}>Try changing your filters or search query</Text>
          </View>
        }
      />
      
      {isAdmin && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => router.push('/bills/generate')}>
          <Text style={styles.floatingButtonText}>Generate Bills</Text>
        </TouchableOpacity>
      )}
      
      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={onApplyFilters}
        initialFilters={activeFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 14,
    height: 46,
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
  },
  summaryValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 8,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});