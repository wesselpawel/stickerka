import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { unstable_noStore } from "next/cache";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID,
};

/** One sticker = one document in this collection */
const STICKERS_COLLECTION = "stickers";

/**
 * Checkouts & blog still use single documents with array fields (legacy shape).
 * Paths: app_config / checkouts  → { checkouts: [...] }
 *        app_config / blog       → { posts: [...] }
 */
const CONFIG_COLLECTION = "app_config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

function normalizeStickerDoc(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    image_thumbnail: data.image_thumbnail || data.image_source || "",
  };
}

// checkouts (single aggregate document)
async function getCheckout(id) {
  const docRef = doc(db, CONFIG_COLLECTION, "checkouts");
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (data) {
    const checkouts = data.checkouts;
    const checkout = checkouts.find((checkout) => checkout.id === id);
    return checkout;
  }
  return null;
}
async function getCheckouts() {
  const docRef = doc(db, CONFIG_COLLECTION, "checkouts");
  const docSnap = await getDoc(docRef);

  return docSnap.data();
}
async function updateCheckout(checkoutId, updatedCheckout) {
  const docRef = doc(db, CONFIG_COLLECTION, "checkouts");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const checkouts = docSnap.data().checkouts;
    const checkoutIndex = checkouts.findIndex(
      (checkout) => checkout.id === checkoutId
    );
    if (checkoutIndex !== -1) {
      const updatedCheckouts = [...checkouts];
      updatedCheckouts[checkoutIndex] = {
        ...updatedCheckout,
        payment_status: "paid",
      };
      await updateDoc(docRef, { checkouts: updatedCheckouts });
    }
  }
}
async function addCheckout(checkout) {
  const docRef = doc(db, CONFIG_COLLECTION, "checkouts");
  const docSnap = await getDoc(docRef);
  if (!docSnap.data()) {
    await setDoc(doc(db, CONFIG_COLLECTION, "checkouts"), {
      checkouts: [checkout],
    });
  } else {
    await updateDoc(doc(db, CONFIG_COLLECTION, "checkouts"), {
      checkouts: arrayUnion(checkout),
    });
  }
}

// stickers — one Firestore document per sticker
async function getProducts() {
  unstable_noStore();
  const colRef = collection(db, STICKERS_COLLECTION);
  const snapshot = await getDocs(colRef);
  const products = snapshot.docs.map((d) => normalizeStickerDoc(d));
  return { products };
}

async function addProduct(imageData) {
  const thumb = imageData.image_thumbnail || imageData.image_source;
  await addDoc(collection(db, STICKERS_COLLECTION), {
    title: imageData.title,
    categories: imageData.categories || [],
    image_source: imageData.image_source,
    image_thumbnail: thumb,
    createdAt: serverTimestamp(),
  });
}

async function addArrayOfProducts(imageArray) {
  const { products: existing = [] } = await getProducts();
  const usedTitles = new Set(existing.map((p) => p.title));

  for (const raw of imageArray) {
    let title = raw.title;
    let n = 1;
    while (usedTitles.has(title)) {
      title = `${raw.title} ${n}`;
      n += 1;
    }
    usedTitles.add(title);
    const thumb = raw.image_thumbnail || raw.image_source;
    await addDoc(collection(db, STICKERS_COLLECTION), {
      title,
      categories: raw.categories || [],
      image_source: raw.image_source,
      image_thumbnail: thumb,
      createdAt: serverTimestamp(),
    });
  }
}

/** Pass Firestore document id (string), or legacy full object (uses object.id if set) */
async function deleteProduct(imageDataOrId) {
  const id =
    typeof imageDataOrId === "string"
      ? imageDataOrId
      : imageDataOrId?.id;
  if (!id || typeof id !== "string") {
    throw new Error("deleteProduct: pass sticker document id (string)");
  }
  await deleteDoc(doc(db, STICKERS_COLLECTION, id));
}

/** @param {string} stickerId - Firestore document id */
async function updateProduct(stickerId, updatedProduct) {
  if (!stickerId || typeof stickerId !== "string") {
    throw new Error("updateProduct: first argument must be sticker document id");
  }
  const { id: _ignore, ...fields } = updatedProduct;
  const thumb =
    fields.image_thumbnail || fields.image_source;
  await updateDoc(doc(db, STICKERS_COLLECTION, stickerId), {
    ...fields,
    image_thumbnail: thumb,
    updatedAt: serverTimestamp(),
  });
}

// blog
async function getBlogPosts() {
  const docRef = doc(db, CONFIG_COLLECTION, "blog");
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}
async function addBlogPost(post) {
  const docRef = doc(db, CONFIG_COLLECTION, "blog");
  const docSnap = await getDoc(docRef);
  if (!docSnap.data()) {
    await setDoc(doc(db, CONFIG_COLLECTION, "blog"), { posts: [post] });
  } else {
    await updateDoc(doc(db, CONFIG_COLLECTION, "blog"), {
      posts: arrayUnion(post),
    });
  }
}
async function updateBlogPost(postId, updatedPost) {
  const docRef = doc(db, CONFIG_COLLECTION, "blog");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const posts = docSnap.data().posts;
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      posts[postIndex] = updatedPost;
      await updateDoc(docRef, { posts });
    }
  }
}

async function addCart(id, data) {
  await setDoc(doc(db, "carts", id), data);
  const docRef = doc(db, "carts", id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
}
async function getCartById(id) {
  const docRef = doc(db, "carts", id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
}
async function addOrder(id, data) {
  await setDoc(doc(db, "orders", id), data);

  const docRef = doc(db, "orders", id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
}

/**
 * Store metadata for a user-uploaded custom sticker (full-quality file lives in Storage).
 * Admin can list `custom_sticker_uploads` for QC; order line items also carry the download URL.
 */
async function registerCustomStickerUpload({
  downloadURL,
  storagePath,
  originalFileName,
  mimeType,
  sizeBytes,
}) {
  const docRef = await addDoc(collection(db, "custom_sticker_uploads"), {
    downloadURL,
    storagePath,
    originalFileName: originalFileName || "",
    mimeType: mimeType || "",
    sizeBytes: sizeBytes ?? 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

async function addContactMessage(message) {
  const docRef = await addDoc(collection(db, "contact_messages"), {
    name: message.name,
    email: message.email,
    subject: message.subject || "Wiadomość z formularza kontaktowego",
    message: message.message,
    status: "unread",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
async function updateOrder(keys, values, id) {
  if (id == null || id === "") {
    throw new Error("updateOrder: missing order id");
  }
  const docRef = doc(db, "orders", id);
  const docSnapshot = await getDoc(docRef);

  let updatedData;

  if (docSnapshot.exists()) {
    const existingData = docSnapshot.data();
    updatedData = { ...existingData };

    keys.forEach((key, index) => {
      updatedData[key] = values[index];
    });

    await updateDoc(docRef, updatedData);
  } else {
    const initialData = {};
    keys.forEach((key, index) => {
      initialData[key] = values[index];
    });

    await setDoc(docRef, initialData);
    updatedData = initialData;
  }

  return updatedData;
}
async function addSession(id, data) {
  await setDoc(doc(db, "sessions", id), data);

  const docRef = doc(db, "sessions", id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
}
async function updateSession(keys, values, id) {
  const docRef = doc(db, "sessions", id);
  const docSnapshot = await getDoc(docRef);

  let updatedData;

  if (docSnapshot.exists()) {
    const existingData = docSnapshot.data();
    updatedData = { ...existingData };

    keys.forEach((key, index) => {
      updatedData[key] = values[index];
    });

    await updateDoc(docRef, updatedData);
  } else {
    const initialData = {};
    keys.forEach((key, index) => {
      initialData[key] = values[index];
    });

    await setDoc(docRef, initialData);
    updatedData = initialData;
  }

  return updatedData;
}
async function getSessionById(id) {
  const docRef = doc(db, "sessions", id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
}

async function addCoupon(data) {
  await setDoc(doc(db, "coupons", data.id), data);

  const docRef = doc(db, "coupons", data.id);
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.data();
}
async function updateCoupon(id) {
  const docRef = doc(db, "coupons", id);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    const existingData = docSnapshot.data();
    const updatedData = { ...existingData, used: true };
    await updateDoc(docRef, updatedData);
    return updatedData;
  }
  return { error: true, message: "Coupon not found." };
}
async function getCouponById(id) {
  const docRef = doc(db, "coupons", id);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists()) {
    const existingData = docSnapshot.data();
    return existingData;
  } else {
    return { error: true };
  }
}
async function getCouponByValue(value) {
  const docRef = collection(db, "coupons");
  const response = await getDocs(docRef);
  const res = response.docs.find((doc) => doc.data().value === value);

  if (res) {
    if (res?.data()?.used === false) {
      return {
        coupon: res.data(),
        message: { error: false, value: "Kod promocyjny został aktywowany." },
      };
    } else {
      return {
        coupon: res.data(),
        message: {
          error: true,
          value: "Kod promocyjny został już użyty.",
        },
      };
    }
  } else {
    return {
      coupon: null,
      message: { error: true, value: "Kod promocyjny nie istnieje." },
    };
  }
}

async function getDocuments(collectionName) {
  const ref = collection(db, collectionName);
  const response = await getDocs(ref);
  const res = response.docs.map((doc) => doc.data());
  return res;
}
async function incrementGoogleCounter() {
  const counterRef = doc(db, "counters", "globalCounter");
  const docSnapshot = await getDoc(counterRef);

  if (docSnapshot.exists()) {
    const currentCount = docSnapshot.data().count || 0;
    await updateDoc(counterRef, { count: currentCount + 1 });
  } else {
    await setDoc(counterRef, { count: 1 });
  }

  const updatedSnapshot = await getDoc(counterRef);
  return updatedSnapshot.data();
}
export {
  getCheckout,
  getCheckouts,
  updateCheckout,
  addCheckout,
  storage,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  addSession,
  updateSession,
  getSessionById,
  addArrayOfProducts,
  getCouponById,
  getDocuments,
  addCoupon,
  updateCoupon,
  getCouponByValue,
  addCart,
  getCartById,
  addOrder,
  updateOrder,
  incrementGoogleCounter,
  registerCustomStickerUpload,
  addContactMessage,
  auth,
};
