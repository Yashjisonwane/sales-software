import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuItem = ({ icon, label, sub, color, onPress, isLast = false }) => (
  <TouchableOpacity
    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconBg, { backgroundColor: `${color}15` || '#F7FAFC' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.menuTextContent}>
      <Text style={styles.menuLabel}>{label}</Text>
      {sub && <Text style={styles.menuSub}>{sub}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
  },
  menuSub: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
});

export default MenuItem;
