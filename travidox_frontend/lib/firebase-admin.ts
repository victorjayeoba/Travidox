// This is a placeholder file to avoid import errors
// In a real production app, Firebase Admin SDK would be used in a server environment
// For this demo, we'll simulate token verification on the client side

export const auth = {
  verifyIdToken: async (token: string) => {
    // In a real app, this would verify the token on the server
    // For now, we'll just return a mock user ID
    return {
      uid: "demo-user-id",
      email: "demo@example.com"
    };
  }
};

export const firestore = {
  // Mock firestore methods if needed
};

export default {
  auth,
  firestore
};
