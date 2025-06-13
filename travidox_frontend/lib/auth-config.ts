export const authConfig = {
  // Token storage
  tokenStorageKey: 'travidox_auth_token',
  
  // Password reset settings
  passwordReset: {
    // Rate limiting: minimum time between reset requests (in milliseconds)
    rateLimitInterval: 60000, // 1 minute
    
    // Password strength requirements
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    
    // Reset link expiration time (Firebase default is 1 hour)
    linkExpirationTime: '1 hour',
    
    // Maximum attempts before temporary lockout
    maxAttempts: 5,
    lockoutDuration: 900000, // 15 minutes in milliseconds
  },
  
  // Authentication flow settings
  redirectUrls: {
    afterLogin: '/dashboard',
    afterSignup: '/dashboard',
    afterLogout: '/',
    afterPasswordReset: '/login',
  },
  
  // Social auth settings
  googleAuth: {
    scopes: ['email', 'profile'],
  },
  
  // Session settings
  session: {
    timeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    refreshThreshold: 60 * 60 * 1000, // 1 hour before expiration
  },
  
  // Error messages
  errorMessages: {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/expired-action-code': 'This reset link has expired. Please request a new one.',
    'auth/invalid-action-code': 'This reset link is invalid. Please request a new one.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    default: 'An unexpected error occurred. Please try again.',
  },
}

// Helper function to get user-friendly error message
export function getAuthErrorMessage(errorCode: string): string {
  return authConfig.errorMessages[errorCode as keyof typeof authConfig.errorMessages] || 
         authConfig.errorMessages.default
}

// Helper function to validate password strength
export function validatePasswordStrength(password: string): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = []
  const { passwordRequirements } = authConfig.passwordReset
  
  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`)
  }
  
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper function to check rate limiting
export function canMakeRequest(lastRequestTime: number | null): boolean {
  if (!lastRequestTime) return true
  
  const now = Date.now()
  const timeDiff = now - lastRequestTime
  return timeDiff >= authConfig.passwordReset.rateLimitInterval
}

// Helper function to get time until next request allowed
export function getTimeUntilNextRequest(lastRequestTime: number | null): number {
  if (!lastRequestTime) return 0
  
  const now = Date.now()
  const timeDiff = now - lastRequestTime
  return Math.max(0, Math.ceil((authConfig.passwordReset.rateLimitInterval - timeDiff) / 1000))
} 