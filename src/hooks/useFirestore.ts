import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useFirestore<T = any>(collectionName: string) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, setUser);
    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let q;
    
    // Admins can see all, Marketers see only theirs. 
    // We determine admin status asynchronously, but for simplifying queries let's fetch
    // token claims or depend on rules filtering? Firestore rules prevent marketers from accessing others data.
    // We MUST query explicitly matching where('ownerUid', '==', user.uid) if not admin, but
    // to be safe let's assume we query by ownerUid across the board for simplicity unless admin.
    
    user.getIdTokenResult().then(tokenResult => {
      if (tokenResult.claims.admin || ['templates', 'platform_settings', 'users'].includes(collectionName)) {
        q = query(collection(db, collectionName));
      } else {
        q = query(collection(db, collectionName), where('ownerUid', '==', user.uid));
      }
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let results = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as (T & { id: string })[];
        
        // Client-side sort to avoid composite index requirement
        results = results.sort((a: any, b: any) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA;
        });
        
        setData(results);
        setLoading(false);
      }, (err) => {
        console.error("Firestore Error:", err);
        setError(err.message);
        setLoading(false);
      });

      return unsubscribe;
    });

  }, [collectionName, user]);

  const addDocument = async (docData: any) => {
    if (!user) throw new Error("Must be logged in");
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...docData,
        ownerUid: user.uid,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const updateDocument = async (id: string, docData: any) => {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...docData,
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  return { data, loading, error, addDocument, updateDocument, deleteDocument };
}
