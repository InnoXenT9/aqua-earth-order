export const getFirebaseErrorMessage = (error: any): string => {
  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'The password is too weak.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
};