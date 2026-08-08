import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { GradientHeader } from '../components/GradientHeader';
import { getCustomers, getProducts, createInvoice } from '../database/operations';

export const CreateInvoice = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<Array<{ productId: number; quantity: number; price: number }>>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const customersData = await getCustomers();
    const productsData = await getProducts();
    setCustomers(customersData);
    setProducts(productsData);
  };

  const addItem = (product: any) => {
    setSelectedItems([...selectedItems, { productId: product.id, quantity: 1, price: product.price }]);
    setShowProductDropdown(false);
  };

  const removeItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const updateQuantity = (index: number, quantity: string) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = parseInt(quantity) || 1;
    setSelectedItems(newItems);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedItems.forEach(item => {
      total += item.quantity * item.price;
    });
    const cgst = total * 0.09;
    const sgst = total * 0.09;
    return { total, cgst, sgst, grandTotal: total + cgst + sgst };
  };

  const handleCreateInvoice = async () => {
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer');
      return;
    }
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    try {
      await createInvoice(selectedCustomer, selectedItems);
      Alert.alert('Success', 'Invoice created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create invoice');
    }
  };

  const { total, cgst, sgst, grandTotal } = calculateTotal();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f0e17' : '#f1f5f9' }]}>
      <GradientHeader title="Create Invoice" subtitle="Generate a new invoice" />
      
      <ScrollView style={styles.content}>
        {/* Customer Selection */}
        <GlassCard style={styles.section}>
          <Text style={[styles.label, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Customer</Text>
          <TouchableOpacity 
            style={[styles.dropdown, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}
            onPress={() => setShowCustomerDropdown(!showCustomerDropdown)}
          >
            <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
              {selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.name : 'Select Customer'}
            </Text>
            <Text style={{ color: isDark ? '#94a3b8' : '#64748b' }}>▼</Text>
          </TouchableOpacity>
          {showCustomerDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
              {customers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCustomer(customer.id);
                    setShowCustomerDropdown(false);
                  }}
                >
                  <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{customer.name}</Text>
                  <Text style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}>{customer.phone}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </GlassCard>

        {/* Add Items */}
        <GlassCard style={styles.section}>
          <Text style={[styles.label, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Items</Text>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: isDark ? '#7b2ffc20' : '#7b2ffc10' }]}
            onPress={() => setShowProductDropdown(!showProductDropdown)}
          >
            <Text style={{ color: '#7b2ffc', fontSize: 16 }}>+ Add Item</Text>
          </TouchableOpacity>
          
          {showProductDropdown && (
            <View style={[styles.dropdownList, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.dropdownItem}
                  onPress={() => addItem(product)}
                >
                  <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{product.name}</Text>
                  <Text style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}>₹{product.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedItems.map((item, index) => {
            const product = products.find(p => p.id === item.productId);
            return (
              <View key={index} style={[styles.itemRow, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }]}>
                <View style={styles.itemInfo}>
                  <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: '500' }}>{product?.name}</Text>
                  <Text style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}>₹{item.price}</Text>
                </View>
                <View style={styles.itemControls}>
                  <TextInput
                    style={[styles.qtyInput, { 
                      color: isDark ? '#e2e8f0' : '#1e293b', 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                    }]}
                    value={String(item.quantity)}
                    onChangeText={(text) => updateQuantity(index, text)}
                    keyboardType="numeric"
                  />
                  <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b', marginLeft: 12 }}>
                    ₹{(item.quantity * item.price).toFixed(0)}
                  </Text>
                  <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeBtn}>
                    <Text style={{ color: '#ef4444' }}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </GlassCard>

        {/* Summary */}
        <GlassCard style={styles.section}>
          <Text style={[styles.label, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Total</Text>
            <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>₹{total.toFixed(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ color: isDark ? '#94a3b8' : '#64748b' }}>CGST (9%)</Text>
            <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>₹{cgst.toFixed(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ color: isDark ? '#94a3b8' : '#64748b' }}>SGST (9%)</Text>
            <Text style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>₹{sgst.toFixed(0)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#e2e8f0' : '#1e293b' }}>Grand Total</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#7b2ffc' }}>₹{grandTotal.toFixed(0)}</Text>
          </View>
        </GlassCard>

        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: '#7b2ffc' }]}
          onPress={handleCreateInvoice}
        >
          <Text style={styles.submitBtnText}>Generate Invoice</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  dropdown: { padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownList: { marginTop: 8, borderRadius: 12, overflow: 'hidden', elevation: 4 },
  dropdownItem: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  addButton: { padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  itemRow: { paddingVertical: 12, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemControls: { flexDirection: 'row', alignItems: 'center' },
  qtyInput: { width: 50, padding: 8, borderRadius: 8, borderWidth: 1, textAlign: 'center' },
  removeBtn: { padding: 8, marginLeft: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  submitBtn: { padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 40 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
