import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type PackageType = 'baby' | 'mother';
type PlanType = 'basic' | 'standard' | 'premium';

export default function PackagesScreen() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('baby');

  const babyPackages = [
    {
      id: 'baby-basic',
      type: 'basic' as PlanType,
      name: 'Basic Care',
      price: 6000,
      visits: '2 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Gentle oil massage',
        'Warm water bath',
        'Basic baby care guidance',
        'Progress tracking'
      ],
      popular: false
    },
    {
      id: 'baby-standard',
      type: 'standard' as PlanType,
      name: 'Standard Care',
      price: 10000,
      visits: '4 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Gentle oil massage',
        'Warm water bath',
        'Advanced baby care techniques',
        'Development exercises',
        'Progress tracking',
        'WhatsApp support'
      ],
      popular: true
    },
    {
      id: 'baby-premium',
      type: 'premium' as PlanType,
      name: 'Premium Care',
      price: 14000,
      visits: 'Daily visits',
      duration: '1-2 hours per visit',
      features: [
        'Gentle oil massage',
        'Warm water bath',
        'Expert baby care techniques',
        'Development exercises',
        'Sleep training support',
        'Nutrition guidance',
        'Progress tracking',
        '24/7 WhatsApp support'
      ],
      popular: false
    }
  ];

  const motherPackages = [
    {
      id: 'mother-basic',
      type: 'basic' as PlanType,
      name: 'Basic Postpartum Care',
      price: 5000,
      visits: '2 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Relaxing body massage',
        'Basic postpartum care',
        'Recovery guidance',
        'Progress tracking'
      ],
      popular: false
    },
    {
      id: 'mother-standard',
      type: 'standard' as PlanType,
      name: 'Standard Postpartum Care',
      price: 9000,
      visits: '4 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Therapeutic body massage',
        'Advanced postpartum care',
        'Recovery guidance',
        'Lactation support',
        'Progress tracking',
        'WhatsApp support'
      ],
      popular: true
    },
    {
      id: 'mother-premium',
      type: 'premium' as PlanType,
      name: 'Premium Postpartum Care',
      price: 12000,
      visits: 'Daily visits',
      duration: '1-2 hours per visit',
      features: [
        'Expert therapeutic massage',
        'Comprehensive postpartum care',
        'Recovery guidance',
        'Lactation support',
        'Nutrition planning',
        'Mental wellness support',
        'Progress tracking',
        '24/7 WhatsApp support'
      ],
      popular: false
    }
  ];

  const currentPackages = selectedPackage === 'baby' ? babyPackages : motherPackages;

  const handleSubscribe = (packageData: any) => {
    Alert.alert(
      'Subscribe to ' + packageData.name,
      `You are about to subscribe to ${packageData.name} for ₹${packageData.price}/month. This will redirect you to the payment page.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // Navigate to payment/signup page with package details
            router.push({
              pathname: '/customer-signup',
              params: {
                packageId: packageData.id,
                packageName: packageData.name,
                price: packageData.price.toString(),
                packageType: selectedPackage
              }
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Care Package</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Package Type Selector */}
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorTitle}>Select Care Type</Text>
          <View style={styles.selector}>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPackage === 'baby' && styles.selectorButtonActive
              ]}
              onPress={() => setSelectedPackage('baby')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedPackage === 'baby' && styles.selectorButtonTextActive
              ]}>Newborn Baby Care</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPackage === 'mother' && styles.selectorButtonActive
              ]}
              onPress={() => setSelectedPackage('mother')}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedPackage === 'mother' && styles.selectorButtonTextActive
              ]}>Postpartum Mother Care</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Packages */}
        <View style={styles.packagesContainer}>
          {currentPackages.map((pkg) => (
            <View key={pkg.id} style={[styles.packageCard, pkg.popular && styles.popularCard]}>
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              
              <Text style={styles.packageName}>{pkg.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{pkg.price.toLocaleString('en-IN')}</Text>
                <Text style={styles.priceUnit}>/month</Text>
              </View>
              
              <View style={styles.packageDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#4A90E2" />
                  <Text style={styles.detailText}>{pkg.visits}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color="#4A90E2" />
                  <Text style={styles.detailText}>{pkg.duration}</Text>
                </View>
              </View>
              
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>What's Included:</Text>
                {pkg.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity
                style={[styles.subscribeButton, pkg.popular && styles.subscribeButtonPopular]}
                onPress={() => handleSubscribe(pkg)}
              >
                <Text style={[styles.subscribeButtonText, pkg.popular && styles.subscribeButtonTextPopular]}>
                  Subscribe Now
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Important Notes</Text>
              <Text style={styles.infoText}>
                • All plans include professional care from trained specialists{"\n"}
                • Service areas: Bangalore & Dharwad, Karnataka{"\n"}
                • Payment via UPI or Bank transfer{"\n"}
                • Cancel anytime with 7 days notice
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  placeholder: {
    width: 34,
  },
  selectorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  selector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: '#4A90E2',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  selectorButtonTextActive: {
    color: 'white',
  },
  packagesContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  popularCard: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  priceUnit: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  packageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#34495e',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  subscribeButtonPopular: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  subscribeButtonTextPopular: {
    color: 'white',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});