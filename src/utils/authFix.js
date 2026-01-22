// src/utils/authFix.js - Simple Compatibility Fix
console.log('🔄 Running auth compatibility fix...');

// Fix 1: Copy authToken to token (and vice versa) for compatibility
const authToken = localStorage.getItem('authToken');
const token = localStorage.getItem('token');

if (authToken && !token) {
  localStorage.setItem('token', authToken);
  console.log('✅ Copied authToken to token for compatibility');
}

if (token && !authToken) {
  localStorage.setItem('authToken', token);
  console.log('✅ Copied token to authToken for compatibility');
}

// Fix 2: Check if user data needs fixing
try {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log('✅ User data is valid:', user.email);
  }
} catch (error) {
  console.error('❌ Invalid user data in localStorage');
  localStorage.removeItem('user');
}

console.log('✅ Auth compatibility fix complete');
console.log('Token status:', {
  hasAuthToken: !!localStorage.getItem('authToken'),
  hasToken: !!localStorage.getItem('token'),
  hasUser: !!localStorage.getItem('user')
});