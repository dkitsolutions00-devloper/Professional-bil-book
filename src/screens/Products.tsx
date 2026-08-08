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
        rightIcon={<
