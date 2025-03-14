import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function AddModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (eventData: any) => void }) {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: '',
    photo: null as File | null, // Правильний тип для фото
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEventData({ ...eventData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { title, description, date, photo } = eventData;
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData) {
      console.error('User not found or error fetching user');
      return;
    }
    const userId = userData.user.id; // Отримуємо user_id з даних користувача

    let photoUrl: string | null = null;
    if (photo) {
      const fileExt = photo.name.split('.').pop();
      const fileName = uuidv4();  // Generates a unique identifier
      const filePath = `${fileName}.${fileExt}`;  // Use the UUID as the file name
    
      // Upload the photo to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
       .from('events') // Your bucket name
       .upload(filePath, photo);
        
     if (uploadError) {
       console.error('Error uploading photo:', uploadError.message);
       return;
     }
  
     // Get the public URL of the uploaded photo using the path from uploadData
     const { data } = supabase.storage
       .from('events')
       .getPublicUrl(uploadData?.path || ''); // Use uploadData.path
  
     // Use the publicUrl from the response
     photoUrl = data.publicUrl;
    }
  
    // Додаємо івент до таблиці в Supabase
    const { data, error } = await supabase
    .from('events')
    .insert([
      {
        user_id: userId,  // Додаємо user_id
        title,  // Використовуємо title замість name
        description,
        date,
        image_url: photoUrl || null, // Використовуємо image_url для збереження URL фото
        created_at: new Date().toISOString(), // Встановлюємо created_at
      },
    ]);
  
    if (error) {
      console.error('Error adding event:', error.message);
    } else {
      // Якщо все пройшло успішно, викликаємо onSubmit з новим івентом
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Add Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Event Name"
            value={eventData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
          />
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={eventData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-red-500 hover:text-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
