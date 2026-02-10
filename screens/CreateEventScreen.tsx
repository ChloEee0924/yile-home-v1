
import React, { useState, useRef, useEffect } from 'react';
import WheelPicker from '../components/WheelPicker';
import { Activity } from '../types';

interface CreateEventScreenProps {
  onBack: () => void;
  onPublish: (activity: Activity) => void;
}

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ onBack, onPublish }) => {
  const [reward, setReward] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Wellness');
  const [image, setImage] = useState<string | null>(null);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [selectedDay, setSelectedDay] = useState(25);
  const [selectedMonth, setSelectedMonth] = useState('Oct');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Wellness', 'Arts', 'Social', 'Community'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];
  const periods = ['AM', 'PM'];

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!title.trim()) return;

    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      description: description || 'No description provided.',
      time: `${selectedMonth} ${selectedDay}, ${selectedHour}:${selectedMinute === 0 ? '00' : selectedMinute} ${selectedPeriod}`,
      imageUrl: image || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=400&auto=format&fit=crop',
      category: category,
      rating: 5.0,
      reviewCount: 0,
      cost: `${reward} Stamps`
    };

    onPublish(newActivity);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">New Community Event</h1>
      </header>

      <main className="p-6 space-y-8 pb-32">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Cover Image Picker */}
        <div
          onClick={handleImageClick}
          className="relative w-full aspect-[2/1] bg-white rounded-[2.5rem] shadow-soft border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden active:scale-[0.98] transition-all"
        >
          {image ? (
            <>
              <img src={image} className="w-full h-full object-cover" alt="Event" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-4xl">photo_camera</span>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="size-16 rounded-full bg-background-beige flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-4xl text-gray-300">add_photo_alternate</span>
              </div>
              <p className="text-gray-400 font-bold text-sm">Add Event Cover Photo</p>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">title</span>
            Event Title
          </label>
          <input
            type="text"
            placeholder="e.g. Morning Garden Walk"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-6 bg-white rounded-[1.5rem] border-none shadow-soft text-lg font-bold focus:ring-2 focus:ring-primary placeholder:text-gray-200"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">description</span>
            Description
          </label>
          <textarea
            placeholder="What will neighbors do? e.g. We will walk through the botanical garden and learn about herb identification..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-6 bg-white rounded-[1.5rem] border-none shadow-soft text-base font-medium focus:ring-2 focus:ring-primary placeholder:text-gray-200 resize-none leading-relaxed"
          />
        </div>

        {/* Category Toggles */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-3 rounded-full font-bold text-xs transition-all flex items-center gap-2 ${isActive ? 'bg-accent-black text-white shadow-lg scale-105' : 'bg-white text-gray-400 border border-black/5 hover:border-primary/20'
                    }`}
                >
                  <span className={`material-symbols-outlined text-sm ${isActive ? 'filled text-primary' : ''}`}>
                    {cat === 'Wellness' ? 'spa' : cat === 'Arts' ? 'palette' : cat === 'Social' ? 'groups' : 'volunteer_activism'}
                  </span>
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Scrolling Time/Date Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest">Time</label>
            <div
              onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
              className={`p-5 bg-white rounded-[1.2rem] shadow-soft flex items-center justify-between cursor-pointer border-2 transition-colors ${showTimePicker ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <span className="font-bold text-sm">{selectedHour}:{selectedMinute === 0 ? '00' : selectedMinute} {selectedPeriod}</span>
              </div>
              <span className="material-symbols-outlined text-gray-300">expand_more</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest">Date</label>
            <div
              onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
              className={`p-5 bg-white rounded-[1.2rem] shadow-soft flex items-center justify-between cursor-pointer border-2 transition-colors ${showDatePicker ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                <span className="font-bold text-sm">{selectedMonth} {selectedDay}</span>
              </div>
              <span className="material-symbols-outlined text-gray-300">edit</span>
            </div>
          </div>
        </div>

        {showTimePicker && (
          <div className="p-6 bg-white rounded-[2rem] shadow-floating flex flex-col gap-6 animate-in zoom-in duration-300">
            <div className="flex justify-around items-center h-32 overflow-hidden relative">
              {/* Selection Overlay Lines */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y border-primary/20 pointer-events-none z-10"></div>

              <div className="w-16 h-full z-0">
                <WheelPicker items={hours} value={selectedHour} onChange={setSelectedHour} />
              </div>

              <span className="text-2xl font-bold text-accent-black z-0">:</span>

              <div className="w-16 h-full z-0">
                <WheelPicker items={minutes.map(m => m === 0 ? '00' : m)} value={selectedMinute === 0 ? '00' : selectedMinute} onChange={(val) => setSelectedMinute(parseInt(val as string))} />
              </div>

              <div className="w-16 h-full border-l border-gray-100 ml-2 pl-2 z-0">
                <WheelPicker items={periods} value={selectedPeriod} onChange={setSelectedPeriod} />
              </div>
            </div>
            <button onClick={() => setShowTimePicker(false)} className="w-full py-3 bg-accent-black text-white rounded-xl font-bold text-sm">Set Time</button>
          </div>
        )}

        {showDatePicker && (
          <div className="p-6 bg-white rounded-[2rem] shadow-floating flex flex-col gap-6 animate-in zoom-in duration-300">
            <div className="flex justify-around items-center h-32 overflow-hidden relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y border-primary/20 pointer-events-none z-10"></div>

              <div className="w-20 h-full z-0">
                <WheelPicker items={months} value={selectedMonth} onChange={setSelectedMonth} />
              </div>

              <div className="w-16 h-full z-0">
                <WheelPicker items={days} value={selectedDay} onChange={setSelectedDay} />
              </div>
            </div>
            <button onClick={() => setShowDatePicker(false)} className="w-full py-3 bg-accent-black text-white rounded-xl font-bold text-sm">Set Date</button>
          </div>
        )}

        {/* Custom Stamp Reward */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest">Stamp Reward</label>
          <div className="bg-white rounded-[2.5rem] shadow-soft p-8 flex flex-col items-center">
            <div className="flex items-center gap-12">
              <button
                onClick={() => setReward(Math.max(1, reward - 1))}
                className="size-16 rounded-full bg-background-beige flex items-center justify-center text-accent-black active:scale-90 transition-transform shadow-sm hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-4xl font-bold">remove</span>
              </button>
              <div className="flex flex-col items-center">
                <span className="text-7xl font-bold text-primary tracking-tighter">{reward}</span>
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Stamps</span>
              </div>
              <button
                onClick={() => setReward(reward + 1)}
                className="size-16 rounded-full bg-background-beige flex items-center justify-center text-accent-black active:scale-90 transition-transform shadow-sm hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-4xl font-bold">add</span>
              </button>
            </div>
            <div className="w-full h-px bg-gray-100 my-8"></div>
            <p className="text-xs text-center text-gray-400 font-medium px-4 leading-relaxed">
              Standard activity reward is 5 stamps. Increasing this can encourage more residents to join.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-beige via-background-beige/80 to-transparent z-40">
        <button
          onClick={handlePublish}
          disabled={!title.trim()}
          className="w-full h-16 rounded-full bg-accent-black text-white font-bold text-xl shadow-floating active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20 hover:bg-black group"
        >
          <span>Publish Event</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
        </button>
      </div>
    </div>
  );
};

export default CreateEventScreen;
