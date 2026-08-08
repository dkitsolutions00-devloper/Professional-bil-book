import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { GradientHeader } from '../components/GradientHeader';
import { getProducts, addProduct } from '../database/operations';

export const Products = () => {
  const { isDark } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [quantity, setQuantity] = useState('0');
  const [hsnCode, setHsnCode] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleAddProduct = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Name and Price are required');
      return;
    }
    try {
      await addProduct(name, parseFloat(price), parseFloat(gstRate), parseInt(quantity), hsnCode);
      Alert.alert('Success', 'Product added successfully!');
      setName('');
      setPrice('');
      setGstRate('18');
      setQuantity('0');
      setHsnCode('');
      setShowForm(false);
      loadProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <GlassCard style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={[styles.productName, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: '#7b2ffc' }]}>
          ₹{item.price}
        </Text>
      </View>
      <View style={styles.productDetails}>
        <Text style={[styles.detailText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          GST: {item.gst_rate}% | HSN: {item.hsn_code || 'N/A'}
        </Text>
        <Text style={[styles.detailText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          Qty: {item.quantity}
        </Text>
      </View>
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f0e17' : '#f1f5f9' }]}>
      <GradientHeader 
        title="Products" 
        subtitle="Manage your inventory"
        rightIcon={<Text style={{ fontSize: 20 }}>📦</Text>}
      />
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: '#7b2ffc' }]}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addBtnText}>{showForm ? '✕ Close' : '+ Add Product'}</Text>
        </TouchableOpacity>

        {showForm && (
          <GlassCard style={styles.formCard}>
            <TextInput
              style={[styles.input, { 
                color: isDark ? '#e2e8f0' : '#1e293b', 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
              }]}
              placeholder="Product Name *"
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
              placeholder="Price *"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.rowInput, styles.halfInput, { 
                  color: isDark ? '#e2e8f0' : '#1e293b', 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                }]}
                placeholder="GST %"
                placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
                value={gstRate}
                onChangeText={setGstRate}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.rowInput, styles.halfInput, { 
                  color: isDark ? '#e2e8f0' : '#1e293b', 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                }]}
                placeholder="Quantity"
                placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={[styles.input, { 
                color: isDark ? '#e2e8f0' : '#1e293b', 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
              }]}
              placeholder="HSN Code"
              placeholderTextColor={isDark ? '#94a3b8' : '#94a3b8'}
              value={hsnCode}
              onChangeText={setHsnCode}
            />
            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: '#22c55e' }]}
              onPress={handleAddProduct}
            >
              <Text style={styles.submitBtnText}>Save Product</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              No products yet. Add your first one!
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
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  rowInput: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10, fontSize: 15 },
  halfInput: { width: '48%' },
  submitBtn: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  listContent: { paddingBottom: 40 },
  productCard: { marginBottom: 12, padding: 16 },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 16, fontWeight: '600' },
  productPrice: { fontSize: 18, fontWeight: 'bold' },
  productDetails: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  detailText: { fontSize: 13 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
}); 
