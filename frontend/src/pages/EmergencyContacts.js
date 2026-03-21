import { useState, useEffect } from "react";
import axios from "axios";

function EmergencyContacts(){

  const API = "http://localhost:5001/api/contacts";

  const [contacts,setContacts] = useState([]);
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [error,setError] = useState("");
  const [editId,setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const config = {
    headers:{
      Authorization:`Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const fetchContacts = async()=>{
    try{
      const res = await axios.get(API,config);
      setContacts(res.data);
    }
    catch(err){
      console.log(err);
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if(!phoneRegex.test(phone)){
      setError("Use format: +919876543210");
      return false;
    }
    return true;
  };

  const addContact = async(e)=>{
    e.preventDefault();

    if(!name || !phone){
      setError("All fields are required");
      return;
    }

    if(!validatePhone(phone)) return;

    try{
      if(editId){
        await axios.put(`${API}/${editId}`,{name,phone},config);
        setEditId(null);
      } else {
        await axios.post(API,{name,phone},config);
      }

      setName("");
      setPhone("");
      setError("");
      fetchContacts();

    } catch(err){
      console.log(err);
    }
  };

  const deleteContact = async(id)=>{
    try{
      await axios.delete(`${API}/${id}`,config);
      fetchContacts();
    }
    catch(err){
      console.log(err);
    }
  };

  const editContact = (contact)=>{
    setName(contact.name);
    setPhone(contact.phone);
    setEditId(contact._id);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0,2);
  };

  return(

  <div className="min-h-screen bg-gray-900 text-white py-12">

    {/* 🔥 MAIN CONTAINER (CENTER EVERYTHING) */}
    <div className="max-w-6xl mx-auto px-6">

      {/* HEADER */}
      <div className="mb-10 text-center">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Emergency Contacts
        </h1>

        <p className="text-gray-400 mt-2">
          Quickly reach your trusted people during emergencies
        </p>

      </div>

      {/* FORM */}
      <div className="flex justify-center mb-12">

        <form
          onSubmit={addContact}
          className="w-full max-w-xl bg-gray-800/80 backdrop-blur-lg 
                     p-8 rounded-2xl shadow-lg border border-gray-700"
        >

          <h2 className="text-lg font-semibold text-center mb-6 text-gray-200">
            {editId ? "Update Contact" : "Add New Contact"}
          </h2>

          <div className="grid gap-5">

            <input
              type="text"
              placeholder="👤 Contact Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="📞 +91XXXXXXXXXX"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {error && (
            <p className="text-red-400 text-sm mt-4 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-700 hover:to-purple-700 
                       py-3 rounded-lg font-medium transition"
          >
            {editId ? "Update Contact" : "Add Contact"}
          </button>

        </form>

      </div>

      {/* CONTACT LIST */}
      <div>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-500">
            No contacts added yet
          </p>
        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {contacts.map((contact)=>(
              <div
                key={contact._id}
                className="bg-gray-800 p-6 rounded-2xl border border-gray-700 
                           hover:scale-[1.02] transition transform shadow-md"
              >

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-4">

                  <div className="w-12 h-12 flex items-center justify-center 
                                  rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                                  text-white font-bold">
                    {getInitials(contact.name)}
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-blue-400">
                      {contact.name}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {contact.phone}
                    </p>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">

                  <button
                    onClick={()=>editContact(contact)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteContact(contact._id)}
                    className="flex-1 bg-red-600/80 hover:bg-red-600 py-2 rounded-lg text-sm"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        )}

      </div>

    </div>

  </div>

  );

}

export default EmergencyContacts;