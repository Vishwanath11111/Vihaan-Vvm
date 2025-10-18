#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Vihaan Care Nest
Tests all API endpoints with realistic data scenarios
"""

import requests
import json
from datetime import datetime, timedelta
import uuid
import sys
import os

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('EXPO_PUBLIC_BACKEND_URL='):
                    return line.split('=')[1].strip()
    except:
        pass
    return "https://vihaancare.preview.emergentagent.com"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

print(f"Testing API at: {API_URL}")

class VihaaanCareAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_data = {}
        self.failed_tests = []
        self.passed_tests = []
        
    def log_result(self, test_name, success, message=""):
        if success:
            self.passed_tests.append(f"✅ {test_name}: {message}")
            print(f"✅ {test_name}: {message}")
        else:
            self.failed_tests.append(f"❌ {test_name}: {message}")
            print(f"❌ {test_name}: {message}")
    
    def test_api_health(self):
        """Test if API is running"""
        try:
            response = self.session.get(f"{API_URL}/")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "running":
                    self.log_result("API Health Check", True, "API is running")
                    return True
                else:
                    self.log_result("API Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("API Health Check", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_create_users(self):
        """Test user creation for all roles"""
        import time
        timestamp = str(int(time.time()))
        
        users_to_create = [
            {
                "name": "Priya Sharma",
                "email": f"priya.sharma.{timestamp}@gmail.com",
                "phone": f"+91-987654321{timestamp[-1]}",
                "password": "SecurePass123",
                "role": "customer",
                "address": "123 MG Road, Bangalore",
                "city": "Bangalore"
            },
            {
                "name": "Nurse Anjali",
                "email": f"anjali.nurse.{timestamp}@vihaancare.com",
                "phone": f"+91-987654322{timestamp[-1]}",
                "password": "NursePass456",
                "role": "team_member",
                "address": "456 Brigade Road, Bangalore",
                "city": "Bangalore"
            },
            {
                "name": "Admin Rajesh",
                "email": f"admin.{timestamp}@vihaancare.com",
                "phone": f"+91-987654323{timestamp[-1]}",
                "password": "AdminPass789",
                "role": "admin",
                "address": "789 Commercial Street, Bangalore",
                "city": "Bangalore"
            }
        ]
        
        for user_data in users_to_create:
            try:
                response = self.session.post(f"{API_URL}/users", json=user_data)
                if response.status_code == 200:
                    user = response.json()
                    self.test_data[f"{user_data['role']}_user"] = user
                    self.test_data[f"{user_data['role']}_credentials"] = {
                        "email": user_data["email"],
                        "password": user_data["password"]
                    }
                    self.log_result(f"Create {user_data['role']} user", True, f"Created user: {user['name']}")
                else:
                    self.log_result(f"Create {user_data['role']} user", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result(f"Create {user_data['role']} user", False, f"Error: {str(e)}")
    
    def test_user_login(self):
        """Test user login for all created users"""
        roles = ["customer", "team_member", "admin"]
        
        for role in roles:
            creds_key = f"{role}_credentials"
            if creds_key in self.test_data:
                creds = self.test_data[creds_key]
                try:
                    response = self.session.post(f"{API_URL}/users/login", json={
                        "email": creds["email"],
                        "password": creds["password"]
                    })
                    if response.status_code == 200:
                        data = response.json()
                        if "user" in data and data["user"]["role"] == role:
                            self.log_result(f"Login {role}", True, f"Successfully logged in as {role}")
                        else:
                            self.log_result(f"Login {role}", False, f"Invalid response structure: {data}")
                    else:
                        self.log_result(f"Login {role}", False, f"Status: {response.status_code}, Response: {response.text}")
                except Exception as e:
                    self.log_result(f"Login {role}", False, f"Error: {str(e)}")
            else:
                self.log_result(f"Login {role}", False, f"No credentials available for {role}")
    
    def test_get_user_details(self):
        """Test getting user details"""
        if "customer_user" in self.test_data:
            user_id = self.test_data["customer_user"]["id"]
            try:
                response = self.session.get(f"{API_URL}/users/{user_id}")
                if response.status_code == 200:
                    user = response.json()
                    if user["id"] == user_id:
                        self.log_result("Get User Details", True, f"Retrieved user: {user['name']}")
                    else:
                        self.log_result("Get User Details", False, f"User ID mismatch")
                else:
                    self.log_result("Get User Details", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("Get User Details", False, f"Error: {str(e)}")
        else:
            self.log_result("Get User Details", False, "No customer user available for testing")
    
    def test_create_packages(self):
        """Test creating baby care packages"""
        packages_to_create = [
            {
                "name": "Basic Baby Care",
                "package_type": "baby",
                "plan_type": "basic",
                "price": 5000,
                "visits_per_week": 2,
                "duration_hours": "2 hours",
                "features": ["Basic health checkup", "Feeding assistance", "Diaper change"],
                "is_popular": False
            },
            {
                "name": "Standard Baby Care",
                "package_type": "baby",
                "plan_type": "standard",
                "price": 8000,
                "visits_per_week": 3,
                "duration_hours": "3 hours",
                "features": ["Health monitoring", "Feeding assistance", "Bathing", "Play activities"],
                "is_popular": True
            },
            {
                "name": "Premium Baby Care",
                "package_type": "baby",
                "plan_type": "premium",
                "price": 12000,
                "visits_per_week": 5,
                "duration_hours": "4 hours",
                "features": ["24/7 support", "Health monitoring", "Development activities", "Nutrition planning"],
                "is_popular": False
            },
            {
                "name": "Basic Mother Care",
                "package_type": "mother",
                "plan_type": "basic",
                "price": 4000,
                "visits_per_week": 2,
                "duration_hours": "2 hours",
                "features": ["Postnatal checkup", "Breastfeeding support", "Basic nutrition advice"],
                "is_popular": False
            }
        ]
        
        for package_data in packages_to_create:
            try:
                response = self.session.post(f"{API_URL}/packages", json=package_data)
                if response.status_code == 200:
                    package = response.json()
                    self.test_data[f"package_{package_data['plan_type']}_{package_data['package_type']}"] = package
                    self.log_result(f"Create {package_data['plan_type']} {package_data['package_type']} package", True, f"Created: {package['name']}")
                else:
                    self.log_result(f"Create {package_data['plan_type']} {package_data['package_type']} package", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result(f"Create {package_data['plan_type']} {package_data['package_type']} package", False, f"Error: {str(e)}")
    
    def test_get_packages(self):
        """Test getting packages with and without filters"""
        try:
            # Test get all packages
            response = self.session.get(f"{API_URL}/packages")
            if response.status_code == 200:
                packages = response.json()
                if isinstance(packages, list) and len(packages) > 0:
                    self.log_result("Get All Packages", True, f"Retrieved {len(packages)} packages")
                else:
                    self.log_result("Get All Packages", False, f"No packages found or invalid response")
            else:
                self.log_result("Get All Packages", False, f"Status: {response.status_code}")
            
            # Test get baby packages only
            response = self.session.get(f"{API_URL}/packages?package_type=baby")
            if response.status_code == 200:
                baby_packages = response.json()
                if isinstance(baby_packages, list):
                    self.log_result("Get Baby Packages", True, f"Retrieved {len(baby_packages)} baby packages")
                else:
                    self.log_result("Get Baby Packages", False, f"Invalid response format")
            else:
                self.log_result("Get Baby Packages", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("Get Packages", False, f"Error: {str(e)}")
    
    def test_get_specific_package(self):
        """Test getting specific package by ID"""
        if "package_standard_baby" in self.test_data:
            package_id = self.test_data["package_standard_baby"]["id"]
            try:
                response = self.session.get(f"{API_URL}/packages/{package_id}")
                if response.status_code == 200:
                    package = response.json()
                    if package["id"] == package_id:
                        self.log_result("Get Specific Package", True, f"Retrieved package: {package['name']}")
                    else:
                        self.log_result("Get Specific Package", False, f"Package ID mismatch")
                else:
                    self.log_result("Get Specific Package", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("Get Specific Package", False, f"Error: {str(e)}")
        else:
            self.log_result("Get Specific Package", False, "No package available for testing")
    
    def test_create_subscription(self):
        """Test creating subscription"""
        if "customer_user" in self.test_data and "package_standard_baby" in self.test_data:
            subscription_data = {
                "customer_id": self.test_data["customer_user"]["id"],
                "package_id": self.test_data["package_standard_baby"]["id"],
                "start_date": datetime.utcnow().isoformat(),
                "duration_months": 3
            }
            
            try:
                response = self.session.post(f"{API_URL}/subscriptions", json=subscription_data)
                if response.status_code == 200:
                    subscription = response.json()
                    self.test_data["subscription"] = subscription
                    self.log_result("Create Subscription", True, f"Created subscription for 3 months")
                else:
                    self.log_result("Create Subscription", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("Create Subscription", False, f"Error: {str(e)}")
        else:
            self.log_result("Create Subscription", False, "Missing customer or package data")
    
    def test_get_customer_subscriptions(self):
        """Test getting customer subscriptions"""
        if "customer_user" in self.test_data:
            customer_id = self.test_data["customer_user"]["id"]
            try:
                response = self.session.get(f"{API_URL}/subscriptions/customer/{customer_id}")
                if response.status_code == 200:
                    subscriptions = response.json()
                    if isinstance(subscriptions, list):
                        self.log_result("Get Customer Subscriptions", True, f"Retrieved {len(subscriptions)} subscriptions")
                    else:
                        self.log_result("Get Customer Subscriptions", False, f"Invalid response format")
                else:
                    self.log_result("Get Customer Subscriptions", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("Get Customer Subscriptions", False, f"Error: {str(e)}")
        else:
            self.log_result("Get Customer Subscriptions", False, "No customer available for testing")
    
    def test_get_subscription_details(self):
        """Test getting subscription details"""
        if "subscription" in self.test_data:
            subscription_id = self.test_data["subscription"]["id"]
            try:
                response = self.session.get(f"{API_URL}/subscriptions/{subscription_id}")
                if response.status_code == 200:
                    subscription = response.json()
                    if subscription["id"] == subscription_id:
                        self.log_result("Get Subscription Details", True, f"Retrieved subscription details")
                    else:
                        self.log_result("Get Subscription Details", False, f"Subscription ID mismatch")
                else:
                    self.log_result("Get Subscription Details", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("Get Subscription Details", False, f"Error: {str(e)}")
        else:
            self.log_result("Get Subscription Details", False, "No subscription available for testing")
    
    def test_create_visit(self):
        """Test creating a visit"""
        if all(key in self.test_data for key in ["subscription", "team_member_user", "customer_user"]):
            visit_data = {
                "subscription_id": self.test_data["subscription"]["id"],
                "team_member_id": self.test_data["team_member_user"]["id"],
                "customer_id": self.test_data["customer_user"]["id"],
                "scheduled_date": (datetime.utcnow() + timedelta(days=1)).isoformat()
            }
            
            try:
                response = self.session.post(f"{API_URL}/visits", json=visit_data)
                if response.status_code == 200:
                    visit = response.json()
                    self.test_data["visit"] = visit
                    self.log_result("Create Visit", True, f"Created visit for tomorrow")
                else:
                    self.log_result("Create Visit", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("Create Visit", False, f"Error: {str(e)}")
        else:
            self.log_result("Create Visit", False, "Missing required data (subscription, team member, or customer)")
    
    def test_get_customer_visits(self):
        """Test getting customer visits"""
        if "customer_user" in self.test_data:
            customer_id = self.test_data["customer_user"]["id"]
            try:
                response = self.session.get(f"{API_URL}/visits/customer/{customer_id}")
                if response.status_code == 200:
                    visits = response.json()
                    if isinstance(visits, list):
                        self.log_result("Get Customer Visits", True, f"Retrieved {len(visits)} visits")
                    else:
                        self.log_result("Get Customer Visits", False, f"Invalid response format")
                else:
                    self.log_result("Get Customer Visits", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("Get Customer Visits", False, f"Error: {str(e)}")
        else:
            self.log_result("Get Customer Visits", False, "No customer available for testing")
    
    def test_get_team_member_visits(self):
        """Test getting team member visits"""
        if "team_member_user" in self.test_data:
            team_member_id = self.test_data["team_member_user"]["id"]
            try:
                response = self.session.get(f"{API_URL}/visits/team-member/{team_member_id}")
                if response.status_code == 200:
                    visits = response.json()
                    if isinstance(visits, list):
                        self.log_result("Get Team Member Visits", True, f"Retrieved {len(visits)} visits")
                    else:
                        self.log_result("Get Team Member Visits", False, f"Invalid response format")
                else:
                    self.log_result("Get Team Member Visits", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("Get Team Member Visits", False, f"Error: {str(e)}")
        else:
            self.log_result("Get Team Member Visits", False, "No team member available for testing")
    
    def test_log_visit(self):
        """Test logging a visit by team member"""
        if "visit" in self.test_data:
            visit_id = self.test_data["visit"]["id"]
            log_data = {
                "visit_id": visit_id,
                "start_time": datetime.utcnow().isoformat(),
                "end_time": (datetime.utcnow() + timedelta(hours=2)).isoformat(),
                "services_provided": ["Health checkup", "Feeding assistance", "Diaper change"],
                "notes": "Baby is healthy and active. Mother is recovering well."
            }
            
            try:
                response = self.session.put(f"{API_URL}/visits/{visit_id}/log", json=log_data)
                if response.status_code == 200:
                    result = response.json()
                    if "message" in result:
                        self.log_result("Log Visit", True, f"Visit logged successfully")
                    else:
                        self.log_result("Log Visit", False, f"Unexpected response: {result}")
                else:
                    self.log_result("Log Visit", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("Log Visit", False, f"Error: {str(e)}")
        else:
            self.log_result("Log Visit", False, "No visit available for testing")
    
    def test_rate_visit(self):
        """Test rating a visit by customer"""
        if "visit" in self.test_data:
            visit_id = self.test_data["visit"]["id"]
            rating_data = {
                "visit_id": visit_id,
                "rating": 5,
                "review": "Excellent service! The nurse was very professional and caring."
            }
            
            try:
                response = self.session.put(f"{API_URL}/visits/{visit_id}/rate", json=rating_data)
                if response.status_code == 200:
                    result = response.json()
                    if "message" in result:
                        self.log_result("Rate Visit", True, f"Visit rated successfully")
                    else:
                        self.log_result("Rate Visit", False, f"Unexpected response: {result}")
                else:
                    self.log_result("Rate Visit", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("Rate Visit", False, f"Error: {str(e)}")
        else:
            self.log_result("Rate Visit", False, "No visit available for testing")
    
    def test_team_member_performance(self):
        """Test getting team member performance data"""
        if "team_member_user" in self.test_data:
            team_member_id = self.test_data["team_member_user"]["id"]
            try:
                response = self.session.get(f"{API_URL}/team-members/{team_member_id}/performance")
                if response.status_code == 200:
                    performance = response.json()
                    if "team_member_id" in performance and "total_visits" in performance:
                        self.log_result("Get Team Member Performance", True, f"Performance data retrieved")
                    else:
                        self.log_result("Get Team Member Performance", False, f"Invalid response structure: {performance}")
                else:
                    self.log_result("Get Team Member Performance", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("Get Team Member Performance", False, f"Error: {str(e)}")
        else:
            self.log_result("Get Team Member Performance", False, "No team member available for testing")
    
    def test_admin_dashboard(self):
        """Test admin dashboard data"""
        try:
            response = self.session.get(f"{API_URL}/admin/dashboard")
            if response.status_code == 200:
                dashboard = response.json()
                required_fields = ["total_customers", "total_team_members", "active_subscriptions", "total_visits"]
                if all(field in dashboard for field in required_fields):
                    self.log_result("Admin Dashboard", True, f"Dashboard data retrieved with all required fields")
                else:
                    missing_fields = [field for field in required_fields if field not in dashboard]
                    self.log_result("Admin Dashboard", False, f"Missing fields: {missing_fields}")
            else:
                self.log_result("Admin Dashboard", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("Admin Dashboard", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 60)
        print("VIHAAN CARE NEST API TESTING")
        print("=" * 60)
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return
        
        # Run all tests in logical order
        self.test_create_users()
        self.test_user_login()
        self.test_get_user_details()
        self.test_create_packages()
        self.test_get_packages()
        self.test_get_specific_package()
        self.test_create_subscription()
        self.test_get_customer_subscriptions()
        self.test_get_subscription_details()
        self.test_create_visit()
        self.test_get_customer_visits()
        self.test_get_team_member_visits()
        self.test_log_visit()
        self.test_rate_visit()
        self.test_team_member_performance()
        self.test_admin_dashboard()
        
        # Print summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"✅ PASSED: {len(self.passed_tests)}")
        print(f"❌ FAILED: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print("\nFAILED TESTS:")
            for failure in self.failed_tests:
                print(failure)
        
        if self.passed_tests:
            print("\nPASSED TESTS:")
            for success in self.passed_tests:
                print(success)
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = VihaaanCareAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)