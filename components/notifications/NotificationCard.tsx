import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Info, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    message: string;
    date: Date;
    type: string;
  };
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'reminder':
        return <Clock size={20} color={Colors.pending} />;
      case 'notice':
        return <Info size={20} color={Colors.primary} />;
      default:
        return <Bell size={20} color={Colors.gray[500]} />;
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 
        ? 'Just now' 
        : `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.date}>{formatDate(notification.date)}</Text>
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
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
  },
});