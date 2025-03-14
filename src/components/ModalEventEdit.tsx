import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function EditModal({
  event,
  onClose,
  onSubmit,
}: {
  event: any; // Додаємо параметр для передавання існуючого івенту
  onClose: () => void;
  onSubmit: (updatedEventData: any) => void;
}) {
  const [eventData, setEventData] = useState({
    title: event.title,
    date: event.date,
    description: event.description,
    photo: null as File | null,
    oldPhotoUrl: event.image_url, // Зберігаємо стару URL адресу фото, якщо є
  });

  useEffect(() => {
    setEventData({
      title: event.title,
      date: event.date,
      description: event.description,
      photo: null,
      oldPhotoUrl: event.image_url,
    });
  }, [event]);

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

    const { title, description, date, photo, oldPhotoUrl } = eventData;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData) {
      console.error('User not found or error fetching user');
      return;
    }
    const userId = userData.user.id;

    let photoUrl: string | null = oldPhotoUrl; // Якщо фото не змінено, залишаємо старий URL
    if (photo) {
      const fileExt = photo.name.split('.').pop();
      const fileName = uuidv4();
      const filePath = `${fileName}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, photo);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from('events')
        .getPublicUrl(uploadData?.path || '');
      photoUrl = data.publicUrl;
    }

    // Оновлюємо івент у базі даних
    const { data, error } = await supabase
      .from('events')
      .update({
        user_id: userId,
        title,
        description,
        date,
        image_url: photoUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', event.id); // Оновлюємо за ідентифікатором івенту

    if (error) {
      console.error('Error updating event:', error.message);
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Edit Event</h2>
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
          {eventData.oldPhotoUrl && (
            <div className="mt-2">
              <p>Current photo:</p>
              <img src={eventData.oldPhotoUrl} alt="Event" className="w-24 h-24 object-cover mt-2" />
            </div>
          )}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
