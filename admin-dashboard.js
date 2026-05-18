// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD BACKEND SERVICE
// Place in: src/services/adminService.js
// ═══════════════════════════════════════════════════════════════

import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_URL = process.env.REACT_APP_BACKEND_URL;

/* ══��════════════════════════════════════════════════════════════
   PRODUCTS MANAGEMENT
   ═══════════════════════════════════════════════════════════════ */

export async function createProduct(productData, imageFile, token) {
  try {
    let imageURL = null;

    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(storageRef);
    }

    // Create product via backend
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...productData,
        image: imageURL,
      }),
    });

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(productId, productData, imageFile, token) {
  try {
    let imageURL = productData.image;

    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(storageRef);
    }

    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...productData,
        image: imageURL,
      }),
    });

    const data = await response.json();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId, token) {
  try {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getProductStats(token) {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const products = data.products || [];

    return {
      success: true,
      stats: {
        totalProducts: products.length,
        lowStock: products.filter(p => p.inventory < 5).length,
        featured: products.filter(p => p.featured).length,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/* ═══════════════════════════════════════════════════════════════
   ORDERS MANAGEMENT
   ═══════════════════════════════════════════════════════════════ */

export async function getAllOrders(token) {
  try {
    const response = await fetch(`${API_URL}/api/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { success: true, orders: data.orders || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId, status, token) {
  try {
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/* ═══════════════════════════════════════════════════════════════
   USERS MANAGEMENT
   ═══════════════════════════════════════════════════════════════ */

export async function getAllUsers(token) {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, users };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId, role, token) {
  try {
    await updateDoc(doc(db, 'users', userId), { role });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserStats() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => doc.data());

    const stats = {
      totalUsers: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      creators: users.filter(u => u.role === 'creator').length,
      regularUsers: users.filter(u => u.role === 'user').length,
    };

    return { success: true, stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS
   ═══════════════════════════════════════════════════════════════ */

export async function getAnalytics(token) {
  try {
    const response = await fetch(`${API_URL}/api/admin/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { success: true, analytics: data.analytics };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/* ═══════════════════════════════════════════════════════════════
   COMICS MANAGEMENT
   ═══════════════════════════════════════════════════════════════ */

export async function createComic(comicData, coverImageFile, token) {
  try {
    let coverImageURL = null;

    if (coverImageFile) {
      const storageRef = ref(storage, `comics/${Date.now()}-${coverImageFile.name}`);
      await uploadBytes(storageRef, coverImageFile);
      coverImageURL = await getDownloadURL(storageRef);
    }

    const response = await fetch(`${API_URL}/api/comics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...comicData,
        image: coverImageURL,
      }),
    });

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function uploadComicChapter(comicId, chapterData, pages, token) {
  try {
    const uploadedPages = [];

    for (let page of pages) {
      const storageRef = ref(storage, `comics/${comicId}/pages/${Date.now()}-${page.name}`);
      await uploadBytes(storageRef, page);
      const pageURL = await getDownloadURL(storageRef);
      uploadedPages.push(pageURL);
    }

    const response = await fetch(`${API_URL}/api/comics/${comicId}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...chapterData,
        pages: uploadedPages,
      }),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/* ═══════════════════════════════════════════════════════════════
   DROP SCHEDULING
   ═══════════════════════════════════════════════════════════════ */

export async function scheduleDrop(dropData, token) {
  try {
    await addDoc(collection(db, 'scheduledDrops'), {
      ...dropData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getScheduledDrops() {
  try {
    const q = query(
      collection(db, 'scheduledDrops'),
      where('status', '==', 'scheduled'),
      orderBy('dropTime', 'asc')
    );
    const snapshot = await getDocs(q);
    const drops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, drops };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
