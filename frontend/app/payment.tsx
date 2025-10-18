import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUPIPayment = () => {
    Alert.alert(
      'UPI Payment',
      'You will be redirected to your UPI app to complete the payment.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // In a real app, you would integrate with UPI payment gateway
            // For now, we'll simulate the process
            const upiLink = `upi://pay?pa=vishwanathmunjannavar1@okaxis&pn=Vihaan Care Nest&am=${params.price}&cu=INR&tn=Subscription Payment for ${params.packageName}`;
            
            Linking.openURL(upiLink).catch(() => {
              Alert.alert(
                'UPI App Not Found',
                'Please install a UPI app like GPay, PhonePe, or Paytm to make the payment.',
                [
                  { text: 'OK' },
                  { text: 'Continue with Bank Transfer', onPress: handleBankTransfer }
                ]
              );
            });
          }
        }
      ]
    );
  };

  const handleBankTransfer = () => {
    Alert.alert(
      'Bank Transfer Details',
      'Please transfer ₹' + params.price + ' to the following account:\n\nAccount Name: Vihaan Care Nest\nAccount Number: 1234567890\nIFSC: AXIS0001234\nBank: Axis Bank\n\nAfter transfer, please call +91 97405 17671 with transaction details.',
      [
        { text: 'Copy Details', onPress: () => Alert.alert('Details copied to clipboard') },
        { text: 'Call Now', onPress: () => Linking.openURL('tel:+919740517671') }
      ]
    );
  };

  const createSubscription = async () => {
    setIsProcessing(true);
    try {
      const EXPO_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
      const response = await fetch(`${EXPO_BACKEND_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: params.customerId,
          package_id: params.packageId,
          start_date: new Date().toISOString(),
          duration_months: 1
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Subscription Created!',
          'Your subscription has been created successfully. Our team will contact you within 24 hours to schedule your first visit.',
          [
            {
              text: 'Go to Dashboard',
              onPress: () => {
                router.push({
                  pathname: '/customer-dashboard',
                  params: { customerId: params.customerId }
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.detail || 'Failed to create subscription');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirmation = () => {
    Alert.alert(
      'Payment Confirmation',
      'Have you completed the payment?',
      [
        { text: 'Not Yet', style: 'cancel' },
        { 
          text: 'Yes, I have paid', 
          onPress: createSubscription
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
        <Text style={styles.headerTitle}>Complete Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Package</Text>
            <Text style={styles.summaryValue}>{params.packageName}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>1 Month</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Type</Text>
            <Text style={styles.summaryValue}>
              {params.packageType === 'baby' ? 'Newborn Baby Care' : 'Postpartum Mother Care'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{params.price}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>
          
          <TouchableOpacity style={styles.paymentCard} onPress={handleUPIPayment}>
            <View style={styles.paymentIcon}>
              <Ionicons name="phone-portrait-outline" size={32} color="#4A90E2" />
            </View>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentTitle}>UPI Payment</Text>
              <Text style={styles.paymentDescription}>
                Pay instantly using GPay, PhonePe, Paytm, or any UPI app
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.paymentCard} onPress={handleBankTransfer}>
            <View style={styles.paymentIcon}>
              <Ionicons name="card-outline" size={32} color="#4A90E2" />
            </View>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentTitle}>Bank Transfer</Text>
              <Text style={styles.paymentDescription}>
                Transfer money directly to our bank account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        </View>

        {/* Payment Confirmation Button */}
        <View style={styles.confirmSection}>
          <TouchableOpacity
            style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
            onPress={handlePaymentConfirmation}
            disabled={isProcessing}
          >
            <Text style={styles.confirmButtonText}>
              {isProcessing ? 'Creating Subscription...' : 'I have completed the payment'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.confirmNote}>
            Click this button after completing your payment to activate your subscription.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactText}>
            For any payment issues, contact us:
          </Text>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('tel:+919740517671')}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.contactButtonText}>Call: +91 97405 17671</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('mailto:vishwanathmunjannavar1@gmail.com')}
          >
            <Ionicons name="mail" size={20} color="white" />
            <Text style={styles.contactButtonText}>Email Support</Text>
          </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  paymentSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  paymentCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f8ff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  confirmSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmNote: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});