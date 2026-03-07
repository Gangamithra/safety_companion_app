import React, { useState, useEffect } from "react";
import axios from "axios";

function EmergencyContacts() {

  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    relationship: ""
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fetchContacts = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5001/api/contacts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setContacts(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5001/api/contacts/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setForm({
        name: "",
        phone: "",
        relationship: ""
      });

      fetchContacts();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Emergency Contacts
      </h1>

      {/* Add Contact Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 w-96"
      >

        <input
          type="text"
          name="name"
          placeholder="Contact Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="relationship"
          placeholder="Relationship"
          value={form.relationship}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Contact
        </button>

      </form>

      {/* Contact List */}

      <div className="grid grid-cols-3 gap-4">

        {contacts.map((contact) => (

          <div
            key={contact._id}
            className="bg-white p-4 rounded shadow"
          >

            <h3 className="font-bold">
              {contact.name}
            </h3>

            <p>{contact.phone}</p>

            <p className="text-gray-500">
              {contact.relationship}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default EmergencyContacts;