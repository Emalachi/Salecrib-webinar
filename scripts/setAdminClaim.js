const admin = require("firebase-admin");

// Initialize with application default credentials or a service account key
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
admin.initializeApp();

async function setAdminClaim(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Successfully added admin claim to user ${uid}`);
    
    // Also update their Firestore document to reflect 'admin' role for UI ease if needed
    const db = admin.firestore();
    await db.collection('users').doc(uid).set({
      role: 'admin'
    }, { merge: true });
    
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
}

// Example usage:
const uid = process.argv[2];
if (uid) {
  setAdminClaim(uid);
} else {
  console.log("Usage: node setAdminClaim.js <user-uid>");
}
