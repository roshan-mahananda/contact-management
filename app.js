
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCA_0DyGBMDejod6y0KMiwPJiHGxcMyKT0",
    authDomain: "contact-manager-623bf.firebaseapp.com",
    projectId: "contact-manager-623bf",
    storageBucket: "contact-manager-623bf.firebasestorage.app",
    messagingSenderId: "681734455361",
    appId: "1:681734455361:web:9bcd5fe3270cd6c3fe86c0"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const contactsCollection = collection(db, "contacts");

const form = document.getElementById('contact-form');
const contactsList = document.getElementById('contacts-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

let editId = null;

async function loadContacts() {
    contactsList.innerHTML = '';
    const querySnapshot = await getDocs(contactsCollection);
    
    querySnapshot.forEach((doc) => {
        const contact = doc.data();
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.address}</td>
            <td>
                <button class="action-btn edit-btn" 
                    data-id="${doc.id}" 
                    data-name="${contact.name}" 
                    data-email="${contact.email}" 
                    data-phone="${contact.phone}" 
                    data-address="${contact.address}">Edit</button>
                <button class="action-btn delete-btn" data-id="${doc.id}">Delete</button>
            </td>
        `;
        contactsList.appendChild(tr);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contactData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    try {
        if (editId) {
            const contactRef = doc(db, "contacts", editId);
            await updateDoc(contactRef, contactData);
            resetForm();
        } else {
            await addDoc(contactsCollection, contactData);
        }
        form.reset();
        loadContacts();
    } catch (error) {
        console.error("Error saving document: ", error);
    }
});

contactsList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        if (confirm("Are you sure you want to delete this contact?")) {
            await deleteDoc(doc(db, "contacts", id));
            loadContacts();
        }
    }

    if (e.target.classList.contains('edit-btn')) {
        editId = e.target.getAttribute('data-id');
        document.getElementById('name').value = e.target.getAttribute('data-name');
        document.getElementById('email').value = e.target.getAttribute('data-email');
        document.getElementById('phone').value = e.target.getAttribute('data-phone');
        document.getElementById('address').value = e.target.getAttribute('data-address');
        
        submitBtn.textContent = "Update Contact";
        cancelBtn.style.display = "inline-block";
    }
});

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    editId = null;
    submitBtn.textContent = "Save Contact";
    cancelBtn.style.display = "none";
}

loadContacts();