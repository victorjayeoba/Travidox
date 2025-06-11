import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import app from './firebase';

// Initialize Firestore
const db = getFirestore(app);

// User profile interface
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  xp: number;
  balance: number;
  level: number;
  completedCourses: number;
  enrolledCourses: string[];
  certificates: string[];
  bio: string;
  isVerified: boolean;
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
  lastCompletedCourse?: {
    courseId: string;
    courseName: string;
    completedAt: Timestamp;
  };
  achievements: string[];
  badges: string[];
}

/**
 * Create or update a user profile in Firestore
 */
export async function createOrUpdateUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      lastLoginAt: Timestamp.now(),
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      isVerified: user.emailVerified,
    });
    
    return userSnap.data() as UserProfile;
  } else {
    // Create new user
    const newUser: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
      xp: 0,
      balance: 0,
      level: 1,
      completedCourses: 0,
      enrolledCourses: [],
      certificates: [],
      bio: '',
      isVerified: user.emailVerified,
      preferences: {
        emailNotifications: true,
        darkMode: false,
        language: 'en',
      },
      achievements: [],
      badges: []
    };
    
    await setDoc(userRef, newUser);
    return newUser;
  }
}

/**
 * Get a user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update user XP and level
 */
export async function updateUserXP(userId: string, xpAmount: number): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return false;
    }
    
    const userData = userSnap.data() as UserProfile;
    const newXP = userData.xp + xpAmount;
    
    // Simple level calculation: level = 1 + (XP / 100)
    const newLevel = Math.floor(1 + (newXP / 100));
    const levelUp = newLevel > userData.level;
    
    // Always ensure balance matches XP
    await updateDoc(userRef, {
      xp: newXP,
      balance: newXP,
      level: newLevel,
      lastLoginAt: Timestamp.now()
    });
    
    return levelUp;
  } catch (error) {
    console.error('Error updating user XP:', error);
    return false;
  }
}

/**
 * Add a completed course to user profile
 */
export async function addCompletedCourse(
  userId: string, 
  courseId: string, 
  courseName: string
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return false;
    }
    
    await updateDoc(userRef, {
      completedCourses: increment(1),
      lastCompletedCourse: {
        courseId,
        courseName,
        completedAt: Timestamp.now()
      }
    });
    
    // Award XP for completing a course
    await updateUserXP(userId, 100);
    
    return true;
  } catch (error) {
    console.error('Error adding completed course:', error);
    return false;
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserProfile['preferences']>
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'preferences': preferences
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }
}

/**
 * Update user bio
 */
export async function updateUserBio(userId: string, bio: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      bio
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user bio:', error);
    return false;
  }
}

/**
 * Add a certificate to user profile
 */
export async function addCertificateToUser(
  userId: string,
  certificateId: string
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      certificates: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error('Error adding certificate to user:', error);
    return false;
  }
} 