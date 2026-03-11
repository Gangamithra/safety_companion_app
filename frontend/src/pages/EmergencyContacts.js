import { useState, useEffect } from "react";
import axios from "axios";

function EmergencyContacts(){

  const API = "http://localhost:5001/api/contacts";

  const [contacts,setContacts] = useState([]);
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [error,setError] = useState("");
  const [editId,setEditId] = useState(null);

  // GET TOKEN
  const token = localStorage.getItem("token");

  const config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  };

  useEffect(()=>{
    fetchContacts();
  },[]);

  /* -------- FETCH CONTACTS -------- */

  const fetchContacts = async()=>{
    try{
      const res = await axios.get(API,config);
      setContacts(res.data);
    }
    catch(err){
      console.log(err);
    }
  };

  /* -------- PHONE VALIDATION -------- */
  const validatePhone = (phone) => {

    const phoneRegex = /^\+[1-9]\d{7,14}$/;
  
    if(!phoneRegex.test(phone)){
      setError("Enter phone number with country code (Example: +919876543210)");
      return false;
    }
  
    return true;
  };

  /* -------- ADD / UPDATE CONTACT -------- */

  const addContact = async(e)=>{
    e.preventDefault();

    if(!name || !phone){
      setError("All fields are required");
      return;
    }

    try{

      if(editId){
        await axios.put(`${API}/${editId}`,{name,phone},config);
        setEditId(null);
      }
      else{
        await axios.post(API,{name,phone},config);
      }

      setName("");
      setPhone("");
      setError("");

      fetchContacts();

    }
    catch(err){
      console.log(err);
    }
  };

  /* -------- DELETE CONTACT -------- */

  const deleteContact = async(id)=>{
    try{
      await axios.delete(`${API}/${id}`,config);
      fetchContacts();
    }
    catch(err){
      console.log(err);
    }
  };

  /* -------- EDIT CONTACT -------- */

  const editContact = (contact)=>{
    setName(contact.name);
    setPhone(contact.phone);
    setEditId(contact._id);
  };

  return(

  <div className="min-h-screen bg-gray-900 text-white p-10">

    <h1 className="text-3xl font-bold mb-8 text-center">
      Emergency Contacts
    </h1>

    {/* FORM */}

    <form
      onSubmit={addContact}
      className="bg-gray-800 p-6 rounded-xl w-96 mx-auto mb-10"
    >

      <input
        type="text"
        placeholder="Contact Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600"
      />

      <input
        type="text"
        placeholder="+919876543210"
        value={phone}
        onChange={(e)=>setPhone(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600"
      />

      {error && (
        <p className="text-red-400 mb-3 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700"
      >
        {editId ? "Update Contact" : "Add Contact"}
      </button>

    </form>


    {/* CONTACT LIST */}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {contacts.map((contact)=>(
        <div
          key={contact._id}
          className="bg-gray-800 p-6 rounded-xl shadow-lg"
        >

          <h2 className="text-xl font-semibold">
            {contact.name}
          </h2>

          <p className="text-gray-400 mt-2">
            {contact.phone}
          </p>

          <div className="flex gap-3 mt-4">

            <button
              onClick={()=>editContact(contact)}
              className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>

            <button
              onClick={()=>deleteContact(contact._id)}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>

  </div>

  );

}

export default EmergencyContacts;