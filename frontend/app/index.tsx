import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const benefits = [
    {
      icon: 'heart-outline',
      title: 'Promotes Healthy Skin',
      description: 'Oil massage keeps baby\'s skin soft, hydrated, and protected from rashes.'
    },
    {
      icon: 'fitness-outline',
      title: 'Strengthens Muscles & Bones',
      description: 'Improves blood circulation and supports healthy growth and development.'
    },
    {
      icon: 'moon-outline',
      title: 'Better Sleep for Baby & Parents',
      description: 'Babies who get gentle massage and bath sleep more peacefully at night.'
    },
    {
      icon: 'people-outline',
      title: 'Enhances Bonding',
      description: 'Skin-to-skin contact creates emotional connection between parent and child.'
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Boosts Immunity & Digestion',
      description: 'Massage stimulates nerve endings and metabolism, aiding overall health.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Bangalore',
      text: 'The care team at Vihaan Care Nest has been incredible. My baby sleeps so much better after their gentle massages!'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Dharwad',
      text: 'Professional, caring, and reliable. They\'ve made our postpartum journey so much easier.'
    },
    {
      name: 'Ananya Reddy',
      location: 'Bangalore',
      text: 'I was nervous about letting someone else care for my newborn, but their expertise gave me confidence.'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandName}>Vihaan Care Nest</Text>
          <Text style={styles.trustBadge}>✨ Trusted by 500+ Families in Bangalore & Dharwad</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Give your newborn the gift of gentle care!</Text>
          <Text style={styles.heroSubtitle}>
            A warm bath and soothing oil massage not only keeps their skin soft and muscles strong but also helps them sleep peacefully at night—so parents can enjoy a restful, uninterrupted night too.
          </Text>
          <Text style={styles.tagline}>"Happy Baby, Happy Parents!"</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/packages')}
            >
              <Text style={styles.primaryButtonText}>Start Your Care Journey</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/packages')}
            >
              <Text style={styles.secondaryButtonText}>View Packages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Professional Baby Care?</Text>
          <Text style={styles.sectionSubtitle}>
            Our specialized care services provide essential benefits for your newborn's health and development
          </Text>
          
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Ionicons name={benefit.icon as any} size={24} color="#4A90E2" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Access Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/packages')}
            >
              <Ionicons name="gift-outline" size={32} color="#4A90E2" />
              <Text style={styles.quickAccessText}>View Packages</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/team-login')}
            >
              <Ionicons name="people-outline" size={32} color="#4A90E2" />
              <Text style={styles.quickAccessText}>Team Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/customer-login')}
            >
              <Ionicons name="person-outline" size={32} color="#4A90E2" />
              <Text style={styles.quickAccessText}>Customer Portal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/admin-login')}
            >
              <Ionicons name="settings-outline" size={32} color="#4A90E2" />
              <Text style={styles.quickAccessText}>Admin Panel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Parents Say</Text>
          <Text style={styles.sectionSubtitle}>Real experiences from our happy families</Text>
          
          {testimonials.map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              <View style={styles.testimonialAuthor}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialLocation}>{testimonial.location}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.sectionSubtitle}>Have questions? We're here to help!</Text>
          
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={24} color="#4A90E2" />
              <View>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>+91 97405 17671</Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={24} color="#4A90E2" />
              <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>vishwanathmunjannavar1@gmail.com</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Founded by Vishwanath V M & Megha V M</Text>
          <Text style={styles.footerSubtext}>Currently serving Bangalore & Dharwad, Karnataka</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  trustBadge: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  benefitIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f8ff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  quickAccessCard: {
    width: (width - 55) / 2,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quickAccessText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  testimonialText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  testimonialLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  contactCard: {
    backgroundColor: 'white',
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 15,
  },
  contactValue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});