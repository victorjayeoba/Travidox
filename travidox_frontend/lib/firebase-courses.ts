import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import app from './firebase';

// Initialize Firestore
const db = getFirestore(app);

// Define the CourseProgress type for tracking user progress
export interface CourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: Timestamp;
  lastModuleId: string;
  completedModuleIds: string[];
  percentComplete: number;
  completedAt?: Timestamp;
}

/**
 * Fetches course progress for a specific user
 */
export async function fetchUserCourseProgress(userId: string): Promise<CourseProgress[]> {
  try {
    const q = query(
      collection(db, 'courseProgress'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CourseProgress);
  } catch (error) {
    console.error('Error fetching user course progress:', error);
    return [];
  }
}

/**
 * Enrolls a user in a course
 */
export async function enrollInCourse(
  userId: string, 
  courseId: string,
  firstModuleId: string
): Promise<boolean> {
  try {
    // Check if user is already enrolled
    const docRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // User is already enrolled
      return true;
    }
    
    // Create new enrollment
    const courseProgress: CourseProgress = {
      userId,
      courseId,
      enrolledAt: Timestamp.now(),
      lastModuleId: firstModuleId,
      completedModuleIds: [],
      percentComplete: 0,
    };
    
    await setDoc(docRef, courseProgress);
    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
}

/**
 * Completes a module in a course
 */
export async function completeModule(
  userId: string,
  courseId: string,
  moduleId: string,
  nextModuleId: string | null,
  totalModules: number
): Promise<boolean> {
  try {
    const docRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error('User is not enrolled in this course');
      return false;
    }
    
    const data = docSnap.data() as CourseProgress;
    
    // Skip if module is already completed
    if (data.completedModuleIds.includes(moduleId)) {
      return true;
    }
    
    // Add module to completed modules
    const completedModuleIds = [...data.completedModuleIds, moduleId];
    
    // Calculate percentage complete
    const percentComplete = Math.round((completedModuleIds.length / totalModules) * 100);
    
    // Update progress data with partial type
    const updateData: Partial<CourseProgress> = {
      completedModuleIds,
      percentComplete,
    };
    
    // If next module exists, update last module
    if (nextModuleId) {
      updateData.lastModuleId = nextModuleId;
    }
    
    // If all modules are completed, mark course as completed
    if (completedModuleIds.length >= totalModules) {
      updateData.completedAt = Timestamp.now();
    }
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error completing module:', error);
    return false;
  }
} 