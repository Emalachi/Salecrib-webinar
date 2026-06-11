### Production Firebase Setup

To fully secure this application and take it into production, please follow these steps in your Firebase console:

1. **Enable Firebase App Check**:
   - Go to App Check in the Firebase console.
   - Register your web app using reCAPTCHA Enterprise or reCAPTCHA v3.
   - Ensure the App Check script is included (recommended to be done in `src/main.tsx` or `firebase.ts`).

2. **Restrict Web API Key**:
   - Go to the Google Cloud Console.
   - Navigate to APIs & Services > Credentials.
   - Edit the "Browser key (auto created by Firebase)".
   - Add HTTP referrers (web sites) under Application restrictions so only your live production URLs (e.g. `https://your-domain.com/*`) can use the key.

3. **Deploy Security Rules**:
   - Install the Firebase CLI (`npm install -g firebase-tools`).
   - Run `firebase deploy --only firestore:rules` to deploy the robust `firestore.rules` provided.

4. **Grant Admin Access**:
   - Since users can no longer assign themselves the admin role from the client, you must grant the admin claim securely.
   - Use the provided script at `scripts/setAdminClaim.js` via the Firebase Admin SDK.
   - Setup Node.js with a service account key, then run: `node scripts/setAdminClaim.js <USER_UID>`
