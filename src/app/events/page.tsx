'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Event } from '@/types';
import AddModal from '@/components/ModalEventAdd';
import EditModal from '@/components/ModalEventEdit'; 
import InstallPrompt from '@/components/InstallPrompt';


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Стан для модалки редагування
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // За замовчуванням 6 івентів на сторінку
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Для вибору івенту для редагування
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push('/');
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    const fetchEvents = async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false }) // Сортуємо від новіших до старіших
        .range(from, to);

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
        checkNextPage();
      }
    };

    const checkNextPage = async () => {
      const nextFrom = page * limit;
      const nextTo = nextFrom + limit - 1;

      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })
        .range(nextFrom, nextTo);

      setHasNextPage(data != null && data.length > 0);
    };

    fetchEvents();
  }, [page, limit]);

  const handleAddEvent = async (eventData: any) => {
    const { error } = await supabase.from('events').insert([eventData]);
    if (error) {
      console.error(error);
    } else {
      setIsAddModalOpen(false);
      setPage(1); // Повертаємось на першу сторінку після додавання
    }
  };

  const handleEditEvent = async (eventData: any) => {
    const { error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventData.id); // Оновлюємо за id

    if (error) {
      console.error(error);
    } else {
      setIsEditModalOpen(false);
      setPage(1); // Повертаємось на першу сторінку після редагування
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return user ? (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Events</h1>

      {/* Вибір кількості елементів на сторінку */}
      <div className="mb-4 flex justify-center space-x-4">
        <span className="text-lg font-medium">Показати:</span>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border rounded px-3 py-1"
        >
          <option value={3}>3</option>
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
        </select>
      </div>

      {/* Список івентів */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className={`bg-white p-4 rounded-lg shadow-md border relative ${
              event.date < today ? 'opacity-70' : ''
            }`}
          >
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-40 object-contain rounded-md mb-3"
              />
            )}
            <h3 className="text-xl font-semibold text-black">{event.title}</h3>
            <p className="text-gray-700">{event.date}</p>
            <p className="text-gray-500">{event.description}</p>
            {event.date < today && (
              <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                Минуло
              </span>
            )}
            {/* Кнопка редагування */}
            <button
              onClick={() => {
                setSelectedEvent(event);
                setIsEditModalOpen(true);
              }}
              className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600"
            >
              ✏️
            </button>
          </div>
        ))}
      </div>

      {/* Пагінація */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Назад
        </button>
        <span className="text-lg font-medium">Сторінка {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Вперед
        </button>
      </div>

      {/* Кнопка для додавання івенту */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
      >
        +
      </button>

      {isAddModalOpen && <AddModal onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddEvent} />}
      {isEditModalOpen && selectedEvent && (
        <EditModal
          event={selectedEvent}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditEvent}
        />
      )}
      <InstallPrompt />
    </div>
  ) : (
    <p>Loading...</p>
  );
}
