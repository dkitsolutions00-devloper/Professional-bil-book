import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { GradientHeader } from '../components/GradientHeader';
import { getCustomers, addCustomer } from '../database/operations';

export const Customers = () => {
  const { isDark } = useTheme();
  const [customers, setCustomers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const handleAddCustomer = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    try {
      await addCustomer(name, phone, email, address);
      Alert.alert('Success', 'Customer added successfully!');
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setShowForm(false);
      loadCustomers();
    } catch (error) {
      Alert.alert('Error', 'Failed to add customer');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <GlassCard style={styles.customerCard}>
      <View style={styles.customerHeader}>
        <Text style={[styles.customerName, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>
          {item.name}
        </Text>
        <Text style={[styles.phone, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          📱 {item.phone || 'N/A'}
        </Text>
      </View>
      {item.email && (
        <Text style={[styles.email, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          ✉️ {item.email}
        </Text>
      )}
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f0e17' : '#f1f5f9' }]}>
      <GradientHeader 
        title="Customers" 
        subtitle="Manage your customers"
        rightIcon={<Text style={{ fontSize: 20 }}>👤</Text>}
      />
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: '#7b2ffc' }]}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addBtnText}>{showForm ? '✕ Close' : '+ Add Customer'}</Text>
        </TouchableOpacity>

        {showForm && (
          <GlassCard style={styles.formCard}>
            <TextInput
              style={[styles.input, { 
                color: isDark ? '#e2e8f0' : '#1e293b', 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
              }]}
              placeholder="Customer Name *"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { 
                color: isDark ? '#e2e8f0' : '#1e293b', 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
              }]}
              placeholder="Phone Number"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, { 
                color: isDark ? '#e2e8f0' : '#1e293b', 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
              }]}
              placeholder="Email"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, styles.textArea, { 
                color: isDark ? '#e2e8f0' : '#1e293b', 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
              }]}
              placeholder="Address"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: '#22c55e' }]}
              onPress={handleAddCustomer}
            >
              <Text style={styles.submitBtnText}>Save Customer</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        <FlatList
          data={customers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              No customers yet. Add your first one!
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  addBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  formCard: { marginBottom: 16, padding: 16 },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10, fontSize: 15 },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  submitBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  listContent: { paddingBottom: 40 },
  customerCard: { marginBottom: 12, padding: 16 },
  customerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerName: { fontSize: 16, fontWeight: '600' },
  phone: { fontSize: 14 },
  email: { fontSize: 14, marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});
