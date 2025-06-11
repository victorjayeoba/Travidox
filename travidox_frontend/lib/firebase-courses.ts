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
  serverTimestamp,
  orderBy,
  limit,
  increment,
  arrayUnion,
  deleteDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from './firebase';
import { addCompletedCourse, addCertificateToUser, updateUserXP } from './firebase-user';

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Define the CourseProgress type for tracking user progress
export interface CourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: Timestamp;
  lastModuleId: string;
  lastContentId: string;
  completedModuleIds: string[];
  completedContentIds: string[];
  percentComplete: number;
  lastAccessedAt: Timestamp;
  completedAt?: Timestamp;
  certificateId?: string;
  certificateUrl?: string;
  notes?: string[];
  quizScores?: {
    quizId: string;
    score: number;
    totalQuestions: number;
    passedAt: Timestamp;
  }[];
  assignmentSubmissions?: {
    assignmentId: string;
    submissionUrl?: string;
    submissionText?: string;
    submittedAt: Timestamp;
    feedback?: string;
    grade?: number;
    gradedAt?: Timestamp;
  }[];
}

// Interface for quiz attempts
export interface QuizAttempt {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  quizId: string;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  passedAt?: Timestamp;
  createdAt: Timestamp;
}

// Interface for certification
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  issueDate: Timestamp;
  expiryDate?: Timestamp;
  certificateUrl: string;
  verificationCode: string;
  issuer?: string;
  brandedName?: string;
}

// Interface for user notes
export interface UserNote {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  contentId: string;
  text: string;
  timestamp: Timestamp;
  timeInVideo?: number;
}

// Interface for bookmarks
export interface Bookmark {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  contentId: string;
  title: string;
  timestamp: Timestamp;
  timeInVideo?: number;
}

// Interface for course reviews
export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  helpfulCount: number;
  replyFromInstructor?: {
    text: string;
    instructorId: string;
    instructorName: string;
    timestamp: Timestamp;
  };
}

/**
 * Fetches course progress for a specific user
 */
export async function fetchUserCourseProgress(userId: string): Promise<CourseProgress[]> {
  try {
    const q = query(
      collection(db, 'courseProgress'),
      where('userId', '==', userId),
      orderBy('lastAccessedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CourseProgress);
  } catch (error) {
    console.error('Error fetching user course progress:', error);
    return [];
  }
}

/**
 * Fetches course progress for a specific course
 */
export async function fetchCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
  try {
    const docRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CourseProgress;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return null;
  }
}

/**
 * Enrolls a user in a course
 */
export async function enrollInCourse(
  userId: string, 
  courseId: string,
  firstModuleId: string,
  firstContentId: string = ""
): Promise<boolean> {
  try {
    // Check if user is already enrolled
    const docRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // User is already enrolled, just update last accessed time
      await updateDoc(docRef, {
        lastAccessedAt: Timestamp.now()
      });
      return true;
    }
    
    // Create new enrollment with all required fields explicitly initialized
    const courseProgress: CourseProgress = {
      userId,
      courseId,
      enrolledAt: Timestamp.now(),
      lastAccessedAt: Timestamp.now(),
      lastModuleId: firstModuleId,
      lastContentId: firstContentId || "",
      completedModuleIds: [],
      completedContentIds: [],
      percentComplete: 0,
      notes: [],
      quizScores: [],
      assignmentSubmissions: []
    };
    
    await setDoc(docRef, courseProgress);
    
    // For demo purposes: Create a course document if it doesn't exist
    const courseDocRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseDocRef);
    
    // Get course title for user profile
    let courseTitle = "Course";
    
    if (!courseDoc.exists()) {
      // Create a basic course document for tracking
      await setDoc(courseDocRef, {
        id: courseId,
        title: courseTitle,
        enrollmentCount: 1,
        students: [userId],
        createdAt: serverTimestamp()
      });
    } else {
      // Update course enrollment count
      courseTitle = courseDoc.data().title || courseTitle;
      await updateDoc(courseDocRef, {
        enrollmentCount: increment(1),
        students: arrayUnion(userId)
      });
    }
    
    // Update user profile - add course to enrolled courses
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Add courseId to enrolledCourses array in user profile
      await updateDoc(userRef, {
        enrolledCourses: arrayUnion(courseId)
      });
      
      // Award XP for enrolling in a new course
      await updateUserXP(userId, 10);
    }
    
    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
}

/**
 * Updates the last accessed content in a course
 */
export async function updateLastAccessed(
  userId: string,
  courseId: string,
  moduleId: string,
  contentId: string
): Promise<boolean> {
  try {
    const docRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error('User is not enrolled in this course');
      return false;
    }
    
    await updateDoc(docRef, {
      lastModuleId: moduleId,
      lastContentId: contentId,
      lastAccessedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating last accessed content:', error);
    return false;
  }
}

/**
 * Completes a specific content item in a module
 */
export async function completeContent(
  userId: string,
  courseId: string,
  moduleId: string,
  contentId: string,
  totalContents: number
): Promise<boolean> {
  try {
    const docRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error('User is not enrolled in this course');
      return false;
    }
    
    const data = docSnap.data() as CourseProgress;
    
    // Initialize completedContentIds as an empty array if it doesn't exist
    const existingCompletedContentIds = data.completedContentIds || [];
    
    // Skip if content is already completed
    if (existingCompletedContentIds.includes(contentId)) {
      return true;
    }
    
    // Add content to completed contents
    const completedContentIds = [...existingCompletedContentIds, contentId];
    
    // Calculate percentage complete based on all contents in course
    const percentComplete = Math.round((completedContentIds.length / totalContents) * 100);
    
    await updateDoc(docRef, {
      completedContentIds,
      percentComplete,
      lastAccessedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error completing content:', error);
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
    
    // Initialize completedModuleIds as an empty array if it doesn't exist
    const existingCompletedModuleIds = data.completedModuleIds || [];
    
    // Skip if module is already completed
    if (existingCompletedModuleIds.includes(moduleId)) {
      return true;
    }
    
    // Add module to completed modules
    const completedModuleIds = [...existingCompletedModuleIds, moduleId];
    
    // Calculate percentage complete based on modules
    const modulePercentComplete = Math.round((completedModuleIds.length / totalModules) * 100);
    
    // Update progress data with partial type
    const updateData: Partial<CourseProgress> = {
      completedModuleIds,
      percentComplete: Math.max(data.percentComplete || 0, modulePercentComplete),
      lastAccessedAt: Timestamp.now()
    };
    
    // If next module exists, update last module
    if (nextModuleId) {
      updateData.lastModuleId = nextModuleId;
    }
    
    // If all modules with content are completed, mark course as completed
    // For modules that have no content yet, we don't want to count them toward completion
    const courseRef = doc(db, 'courses', courseId);
    const courseSnapshot = await getDoc(courseRef);
    let modulesWithContent = totalModules;
    
    if (courseSnapshot.exists()) {
      const courseData = courseSnapshot.data();
      // Count only modules that have content
      if (courseData.modules) {
        const modulesWithContentArray = courseData.modules.filter((m: any) => m.content && m.content.length > 0);
        modulesWithContent = modulesWithContentArray.length;
      }
    }
    
    // Only mark as completed if we've completed all modules that have content
    if (completedModuleIds.length >= modulesWithContent) {
      updateData.completedAt = Timestamp.now();
      
      // Generate certificate
      const certificateId = await generateCertificate(userId, courseId);
      if (certificateId) {
        updateData.certificateId = certificateId;
        
        // For mock/demo data - ensure we return a valid certificate
        // In a production app, this would happen via a proper backend process
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        
        if (!userSnapshot.exists()) {
          // Create a dummy user if not exists (for demo purposes)
          await setDoc(userRef, {
            displayName: "Demo User",
            email: "demo@example.com",
            createdAt: serverTimestamp()
          });
        }
        
        // Create a certificate document if it doesn't exist yet
        const certificateRef = doc(db, 'certificates', certificateId);
        const certificateSnapshot = await getDoc(certificateRef);
        
        if (!certificateSnapshot.exists()) {
          // Get course name from courseId
          let courseName = "Course";
          const courseRef = doc(db, 'courses', courseId);
          const courseSnapshot = await getDoc(courseRef);
          
          if (courseSnapshot.exists()) {
            courseName = courseSnapshot.data().title;
          }
          
          // Get user name
          let userName = "Student";
          const updatedUserSnapshot = await getDoc(userRef);
          if (updatedUserSnapshot.exists() && updatedUserSnapshot.data().displayName) {
            userName = updatedUserSnapshot.data().displayName;
          }
          
          // Create a certificate with Travidox branding
          const certificateData: Certificate = {
            id: certificateId,
            userId,
            courseId,
            courseName,
            userName,
            issueDate: Timestamp.now(),
            certificateUrl: `/certificates/${certificateId}.pdf`,
            verificationCode: Math.random().toString(36).substring(2, 15),
            issuer: "Travidox Learning Platform",
            brandedName: "TRAVIDOX"
          };
          
          await setDoc(certificateRef, certificateData);
        }
      }
      
      // Get course name
      const courseRef = doc(db, 'courses', courseId);
      const courseSnapshot = await getDoc(courseRef);
      const courseName = courseSnapshot.exists() ? courseSnapshot.data().title : "Course";
      
      // Update user profile with completed course and add XP
      await addCompletedCourse(userId, courseId, courseName);
      
      // Add certificate to user profile
      if (certificateId) {
        await addCertificateToUser(userId, certificateId);
      }
      
      // Award XP for completing a course (this is in addition to the XP in addCompletedCourse)
      await updateUserXP(userId, 50);
    }
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error completing module:', error);
    return false;
  }
}

/**
 * Submits a quiz attempt
 */
export async function submitQuizAttempt(
  userId: string,
  courseId: string,
  moduleId: string,
  quizId: string,
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[],
  totalQuestions: number
): Promise<QuizAttempt> {
  try {
    const quizCollection = collection(db, 'quizAttempts');
    const attemptId = `${userId}_${quizId}_${Date.now()}`;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70; // 70% passing threshold
    
    const attemptData: QuizAttempt = {
      id: attemptId,
      userId,
      courseId,
      moduleId,
      quizId,
      answers,
      score,
      totalQuestions,
      createdAt: Timestamp.now()
    };
    
    if (passed) {
      attemptData.passedAt = Timestamp.now();
      
      // Update course progress with quiz score
      const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const progress = progressSnap.data() as CourseProgress;
        const quizScores = progress.quizScores || [];
        
        // Add or update quiz score
        const existingQuizIndex = quizScores.findIndex(q => q.quizId === quizId);
        
        if (existingQuizIndex >= 0) {
          quizScores[existingQuizIndex] = {
            quizId,
            score,
            totalQuestions,
            passedAt: Timestamp.now()
          };
        } else {
          quizScores.push({
            quizId,
            score,
            totalQuestions,
            passedAt: Timestamp.now()
          });
        }
        
        await updateDoc(progressRef, {
          quizScores
        });
        
        // Award XP for passing a quiz - amount based on score
        const xpAmount = Math.floor(score / 10) * 5; // 5 XP per 10% score
        await updateUserXP(userId, xpAmount);
      }
    }
    
    await setDoc(doc(quizCollection, attemptId), attemptData);
    return attemptData;
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw error;
  }
}

/**
 * Gets all quiz attempts for a quiz
 */
export async function getQuizAttempts(
  userId: string,
  quizId: string
): Promise<QuizAttempt[]> {
  try {
    const q = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', userId),
      where('quizId', '==', quizId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as QuizAttempt);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return [];
  }
}

/**
 * Submits an assignment
 */
export async function submitAssignment(
  userId: string,
  courseId: string,
  moduleId: string,
  assignmentId: string,
  submissionText?: string,
  submissionFile?: File
): Promise<boolean> {
  try {
    const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      console.error('User is not enrolled in this course');
      return false;
    }
    
    const progress = progressSnap.data() as CourseProgress;
    const submissions = progress.assignmentSubmissions || [];
    
    let submissionUrl = '';
    
    // Upload file if provided
    if (submissionFile) {
      const storageRef = ref(storage, `assignments/${userId}/${assignmentId}/${submissionFile.name}`);
      await uploadBytes(storageRef, submissionFile);
      submissionUrl = await getDownloadURL(storageRef);
    }
    
    // Prepare submission data
    const submission = {
      assignmentId,
      submissionText,
      submissionUrl,
      submittedAt: Timestamp.now()
    };
    
    // Check if assignment was already submitted
    const existingIndex = submissions.findIndex(s => s.assignmentId === assignmentId);
    
    if (existingIndex >= 0) {
      submissions[existingIndex] = { ...submissions[existingIndex], ...submission };
    } else {
      submissions.push(submission);
    }
    
    await updateDoc(progressRef, {
      assignmentSubmissions: submissions
    });
    
    // Award XP for submitting assignment (only for first submission)
    if (existingIndex < 0) {
      await updateUserXP(userId, 15);
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return false;
  }
}

/**
 * Adds a note to a course
 */
export async function addNote(
  userId: string,
  courseId: string,
  moduleId: string,
  contentId: string,
  text: string,
  timeInVideo?: number
): Promise<UserNote | null> {
  try {
    const notesCollection = collection(db, 'userNotes');
    const noteId = `${userId}_${contentId}_${Date.now()}`;
    
    const note: UserNote = {
      id: noteId,
      userId,
      courseId,
      moduleId,
      contentId,
      text,
      timestamp: Timestamp.now(),
      timeInVideo
    };
    
    await setDoc(doc(notesCollection, noteId), note);
    
    // Add note reference to course progress
    const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    await updateDoc(progressRef, {
      notes: arrayUnion(noteId)
    });
    
    return note;
  } catch (error) {
    console.error('Error adding note:', error);
    return null;
  }
}

/**
 * Gets all notes for a course
 */
export async function getCourseNotes(
  userId: string,
  courseId: string
): Promise<UserNote[]> {
  try {
    const q = query(
      collection(db, 'userNotes'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserNote);
  } catch (error) {
    console.error('Error fetching course notes:', error);
    return [];
  }
}

/**
 * Adds a bookmark
 */
export async function addBookmark(
  userId: string,
  courseId: string,
  moduleId: string,
  contentId: string,
  title: string,
  timeInVideo?: number
): Promise<Bookmark | null> {
  try {
    const bookmarksCollection = collection(db, 'bookmarks');
    const bookmarkId = `${userId}_${contentId}_${Date.now()}`;
    
    const bookmark: Bookmark = {
      id: bookmarkId,
      userId,
      courseId,
      moduleId,
      contentId,
      title,
      timestamp: Timestamp.now(),
      timeInVideo
    };
    
    await setDoc(doc(bookmarksCollection, bookmarkId), bookmark);
    return bookmark;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return null;
  }
}

/**
 * Gets all bookmarks for a course
 */
export async function getCourseBookmarks(
  userId: string,
  courseId: string
): Promise<Bookmark[]> {
  try {
    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Bookmark);
  } catch (error) {
    console.error('Error fetching course bookmarks:', error);
    return [];
  }
}

/**
 * Submits a course review
 */
export async function submitCourseReview(
  userId: string,
  userName: string,
  userAvatar: string | undefined,
  courseId: string,
  rating: number,
  comment: string
): Promise<CourseReview | null> {
  try {
    const reviewsCollection = collection(db, 'courseReviews');
    const reviewId = `${userId}_${courseId}`;
    
    const review: CourseReview = {
      id: reviewId,
      userId,
      userName,
      userAvatar,
      courseId,
      rating,
      comment,
      createdAt: Timestamp.now(),
      helpfulCount: 0
    };
    
    await setDoc(doc(reviewsCollection, reviewId), review);
    
    // Update course with new review data
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    
    if (courseDoc.exists()) {
      const courseData = courseDoc.data();
      const totalRatings = (courseData.totalRatings || 0) + 1;
      const totalRatingSum = (courseData.totalRatingSum || 0) + rating;
      const averageRating = totalRatingSum / totalRatings;
      
      await updateDoc(courseRef, {
        totalRatings,
        totalRatingSum,
        averageRating
      });
    }
    
    return review;
  } catch (error) {
    console.error('Error submitting course review:', error);
    return null;
  }
}

/**
 * Gets course reviews
 */
export async function getCourseReviews(
  courseId: string,
  limitCount: number = 10
): Promise<CourseReview[]> {
  try {
    const q = query(
      collection(db, 'courseReviews'),
      where('courseId', '==', courseId),
      orderBy('helpfulCount', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CourseReview);
  } catch (error) {
    console.error('Error fetching course reviews:', error);
    return [];
  }
}

/**
 * Marks a review as helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<boolean> {
  try {
    const reviewRef = doc(db, 'courseReviews', reviewId);
    
    await updateDoc(reviewRef, {
      helpfulCount: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return false;
  }
}

/**
 * Generates a certificate for a completed course
 */
export async function generateCertificate(
  userId: string,
  courseId: string
): Promise<string | null> {
  try {
    // Generate a unique certificate ID
    const certificateId = `${userId}_${courseId}_${Date.now()}`;
    
    // For our demo app, we'll handle the actual certificate creation
    // in the completeModule function to ensure we always have valid data
    
    // Update course progress with certificate info
    const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    await updateDoc(progressRef, {
      certificateId,
      certificateUrl: `/certificates/${certificateId}.pdf`
    });
    
    return certificateId;
  } catch (error) {
    console.error('Error generating certificate:', error);
    return null;
  }
}

/**
 * Gets a certificate by ID
 */
export async function getCertificate(certificateId: string): Promise<Certificate | null> {
  try {
    const certificateRef = doc(db, 'certificates', certificateId);
    const certificateDoc = await getDoc(certificateRef);
    
    if (certificateDoc.exists()) {
      return certificateDoc.data() as Certificate;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return null;
  }
}

/**
 * Gets all certificates for a user
 */
export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  try {
    const q = query(
      collection(db, 'certificates'),
      where('userId', '==', userId),
      orderBy('issueDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Certificate);
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    return [];
  }
}

/**
 * Verifies a certificate
 */
export async function verifyCertificate(verificationCode: string): Promise<Certificate | null> {
  try {
    const q = query(
      collection(db, 'certificates'),
      where('verificationCode', '==', verificationCode),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data() as Certificate;
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return null;
  }
}

/**
 * Gets enrolled course count
 */
export async function getEnrolledCourseCount(userId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'courseProgress'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error getting enrolled course count:', error);
    return 0;
  }
}

/**
 * Gets completed course count
 */
export async function getCompletedCourseCount(userId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'courseProgress'),
      where('userId', '==', userId),
      where('completedAt', '!=', null)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Error getting completed course count:', error);
    return 0;
  }
}

/**
 * Gets learning stats
 */
export async function getLearningStats(userId: string): Promise<{
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  certificatesEarned: number;
  totalHoursLearned: number;
}> {
  try {
    // Get all course progress
    const q = query(
      collection(db, 'courseProgress'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const progressData = snapshot.docs.map(doc => doc.data() as CourseProgress);
    
    // Calculate stats
    const enrolledCourses = progressData.length;
    const completedCourses = progressData.filter(p => p.completedAt).length;
    const inProgressCourses = enrolledCourses - completedCourses;
    
    // Get certificates
    const certificatesQuery = query(
      collection(db, 'certificates'),
      where('userId', '==', userId)
    );
    
    const certificatesSnapshot = await getDocs(certificatesQuery);
    const certificatesEarned = certificatesSnapshot.docs.length;
    
    // Calculate estimated hours learned (this could be more sophisticated)
    const totalHoursLearned = progressData.reduce((total, course) => {
      // Assume 1 hour per 10% completion as a rough estimate
      return total + (course.percentComplete / 10);
    }, 0);
    
    return {
      enrolledCourses,
      completedCourses,
      inProgressCourses,
      certificatesEarned,
      totalHoursLearned
    };
  } catch (error) {
    console.error('Error getting learning stats:', error);
    return {
      enrolledCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      certificatesEarned: 0,
      totalHoursLearned: 0
    };
  }
} 