import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GlassCard } from '../components/GlassCard';
import { GradientHeader } from '../components/GradientHeader';
import { useTheme } from '../contexts/ThemeContext';
import { getInvoices, getCustomers, getProducts } from '../database/operations';

interface Stats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
}

export const Dashboard = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<Stats>({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  const loadData = async () => {
    try {
      const invoices = await getInvoices();
      const customers = await getCustomers();
      const products = await getProducts();

      let paid = 0;
      let pending = 0;
      let revenue = 0;

      invoices.forEach((inv: any) => {
        if (inv.status === 'paid') {
          paid++;
          revenue += inv.grand_total || 0;
        } else {
          pending++;
        }
      });

      setStats({
        totalInvoices: invoices.length,
        paidInvoices: paid,
        pendingInvoices: pending,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const StatCard = ({ title, value, color, icon }: any) => (
    <GlassCard style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.statRow}>
        <View>
          <Text style={[styles.statValue, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>
            {typeof value === 'number' && title.includes('Revenue') ? `₹${value.toFixed(0)}` : value}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>{title}</Text>
        </View>
        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
          <Text style={{ color: color, fontSize: 20 }}>{icon}</Text>
        </View>
      </View>
    </GlassCard>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f0e17' : '#f1f5f9' }]}>
      <GradientHeader title="Dashboard" subtitle="Welcome back! Here's your summary" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatCard title="Total Invoices" value={stats.totalInvoices} color="#7b2ffc" icon="📄" />
          <StatCard title="Revenue" value={stats.totalRevenue} color="#22c55e" icon="💰" />
          <StatCard title="Customers" value={stats.totalCustomers} color="#00d2ff" icon="👤" />
          <StatCard title="Products" value={stats.totalProducts} color="#f59e0b" icon="📦" />
        </View>

        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(123,47,252,0.2)' : '#7b2ffc10' }]}
              onPress={() => navigation.navigate('CreateInvoice')}
            >
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={[styles.actionText, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>New Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(0,210,255,0.2)' : '#00d2ff10' }]}
              onPress={() => navigation.navigate('Customers')}
            >
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={[styles.actionText, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Add Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(34,197,94,0.2)' : '#22c55e10' }]}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={[styles.actionText, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(245,158,11,0.2)' : '#f59e0b10' }]}
              onPress={() => navigation.navigate('Invoices')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={[styles.actionText, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -20,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    padding: 14,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
