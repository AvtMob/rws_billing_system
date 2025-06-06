// Mock data for bills
const MOCK_BILLS = [
  {
    id: 'bill-001',
    title: 'Water Bill - April 2023',
    type: 'water',
    amount: 850.00,
    status: 'paid',
    dueDate: '2023-04-15',
    billDate: '2023-04-01',
    paidDate: '2023-04-10',
    paidAmount: 850.00,
    flatNumber: 'A-101',
    userId: 'resident123',
    description: 'Monthly water usage charges',
    paymentMethod: 'UPI',
    transactionId: 'txn_123456'
  },
  {
    id: 'bill-002',
    title: 'Maintenance - April 2023',
    type: 'maintenance',
    amount: 1200.00,
    status: 'paid',
    dueDate: '2023-04-15',
    billDate: '2023-04-01',
    paidDate: '2023-04-12',
    paidAmount: 1200.00,
    flatNumber: 'A-101',
    userId: 'resident123',
    description: 'Monthly maintenance charges',
    paymentMethod: 'Bank Transfer',
    transactionId: 'txn_789012'
  },
  {
    id: 'bill-003',
    title: 'Water Bill - May 2023',
    type: 'water',
    amount: 920.00,
    status: 'pending',
    dueDate: '2023-05-15',
    billDate: '2023-05-01',
    flatNumber: 'A-101',
    userId: 'resident123',
    description: 'Monthly water usage charges'
  },
  {
    id: 'bill-004',
    title: 'Maintenance - May 2023',
    type: 'maintenance',
    amount: 1200.00,
    status: 'pending',
    dueDate: '2023-05-15',
    billDate: '2023-05-01',
    flatNumber: 'A-101',
    userId: 'resident123',
    description: 'Monthly maintenance charges'
  },
  {
    id: 'bill-005',
    title: 'Special Repair Fund',
    type: 'other',
    amount: 5000.00,
    status: 'overdue',
    dueDate: '2023-03-31',
    billDate: '2023-03-01',
    flatNumber: 'A-101',
    userId: 'resident123',
    description: 'One-time charge for building repairs'
  },
];

// Get all bills for the logged-in user (resident) or all bills (admin)
export const fetchUserBills = async (userId: string | undefined) => {
  // In a real app, this would be a Firebase/API call
  return new Promise<any[]>((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      if (!userId) {
        // Admin user sees all bills
        resolve(MOCK_BILLS);
      } else {
        // Resident sees only their bills
        const userBills = MOCK_BILLS.filter(bill => bill.userId === userId);
        resolve(userBills);
      }
    }, 500);
  });
};

// Get a specific bill by ID
export const fetchBillById = async (billId: string) => {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      const bill = MOCK_BILLS.find(b => b.id === billId);
      if (bill) {
        resolve(bill);
      } else {
        reject(new Error('Bill not found'));
      }
    }, 300);
  });
};

// Mark a bill as paid
export const markBillAsPaid = async (billId: string, paymentDetails: any) => {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      const billIndex = MOCK_BILLS.findIndex(b => b.id === billId);
      if (billIndex >= 0) {
        const updatedBill = {
          ...MOCK_BILLS[billIndex],
          status: 'paid',
          paidDate: new Date().toISOString().split('T')[0],
          paidAmount: paymentDetails.amount,
          paymentMethod: paymentDetails.method,
          transactionId: paymentDetails.transactionId
        };
        
        // In a real app, this would update the database
        MOCK_BILLS[billIndex] = updatedBill;
        resolve(updatedBill);
      } else {
        reject(new Error('Bill not found'));
      }
    }, 500);
  });
};

// Generate bills (admin only)
export const generateBills = async (billData: any) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // In a real app, this would create new bills in the database
      console.log('Generating bills with data:', billData);
      
      // Mock response - would normally return newly created bills
      resolve([
        {
          id: `bill-${Date.now()}`,
          title: billData.title,
          type: billData.type,
          amount: billData.amount,
          status: 'pending',
          dueDate: billData.dueDate,
          billDate: new Date().toISOString().split('T')[0],
          flatNumber: billData.flatNumber || 'All',
          description: billData.description
        }
      ]);
    }, 800);
  });
};

// Get billing statistics (for admin dashboard)
export const getBillingStats = async () => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      const totalBilled = MOCK_BILLS.reduce((sum, bill) => sum + bill.amount, 0);
      const totalPaid = MOCK_BILLS
        .filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + bill.amount, 0);
      const totalPending = MOCK_BILLS
        .filter(bill => bill.status === 'pending')
        .reduce((sum, bill) => sum + bill.amount, 0);
      const totalOverdue = MOCK_BILLS
        .filter(bill => bill.status === 'overdue')
        .reduce((sum, bill) => sum + bill.amount, 0);
      
      resolve({
        totalBilled,
        totalPaid,
        totalPending,
        totalOverdue,
        paymentRate: (totalPaid / totalBilled) * 100,
        billCount: MOCK_BILLS.length,
        paidBillCount: MOCK_BILLS.filter(bill => bill.status === 'paid').length
      });
    }, 500);
  });
};