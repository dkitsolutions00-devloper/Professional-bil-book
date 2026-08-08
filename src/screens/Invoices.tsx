import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { GradientHeader } from '../components/GradientHeader';
import { getInvoices, updateInvoiceStatus } from '../database/operations';

export const Invoices = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const [invoices, setInvoices] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadInvoices();
    }, [])
  );

  const loadInvoices = async () => {
    const data = await getInvoices();
    setInvoices(data);
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    await updateInvoiceStatus(id, newStatus);
    loadInvoices();
  };

  const renderItem = ({ item }: { item: any }) => (
    <GlassCard style={styles.invoiceCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.invoiceNumber, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>
            {item.invoice_number}
          </Text>
          <Text style={[styles.customerName, { color: isDark ? '#94a3b8' : '#64748b' }]}>
            {item.customer_name || 'Walk-in Customer'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'paid' ? '#22c55e20' : '#f59e0b20' }
          ]}
          onPress={() => handleStatusToggle(item.id, item.status)}
        >
          <Text style={{ color: item.status === 'paid' ? '#22c55e' : '#f59e0b' }}>
            {item.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={[styles.amount, { color: '#7b2ffc' }]}>
          ₹{item.grand_total?.toFixed(0) || 0}
        </Text>
        <Text style={[styles.date, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f0e17' : '#f1f5f9' }]}>
      <GradientHeader 
        title="Invoices" 
        subtitle="All your invoices"
        rightIcon={<Text style={{ fontSize: 20 }}>📄</Text>}
      />
      
      <FlatList
        data={invoices}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
            No invoices yet. Create your first one!
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 40 },
  invoiceCard: { marginBottom: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceNumber: { fontSize: 16, fontWeight: '600' },
  customerName: { fontSize: 14, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  amount: { fontSize: 20, fontWeight: 'bold' },
  date: { fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});
