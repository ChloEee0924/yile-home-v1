
import React, { useState } from 'react';

interface AddressSettingsScreenProps {
  onBack: () => void;
}

const AddressSettingsScreen: React.FC<AddressSettingsScreenProps> = ({ onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: '1', label: 'Main Residence', value: 'Block 8, Unit 202', isMain: true }
  ]);
  const [newAddress, setNewAddress] = useState('');

  const handleAdd = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, { id: Date.now().toString(), label: 'Secondary Address', value: newAddress, isMain: false }]);
      setNewAddress('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">My Location</h1>
      </header>

      <main className="p-6 space-y-8">
        <section className="space-y-4">
           {addresses.map((addr) => (
             <div key={addr.id} className={`p-6 bg-white rounded-[2.5rem] shadow-soft flex items-center gap-4 border-2 animate-in fade-in slide-in-from-top duration-300 ${addr.isMain ? 'border-primary' : 'border-transparent'}`}>
                <div className={`size-12 rounded-full flex items-center justify-center ${addr.isMain ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                   <span className={`material-symbols-outlined ${addr.isMain ? 'filled' : ''}`}>home</span>
                </div>
                <div className="flex-1">
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{addr.label}</p>
                   <p className="text-lg font-bold text-accent-black">{addr.value}</p>
                </div>
                <button className="text-primary material-symbols-outlined">edit</button>
             </div>
           ))}

           {isAdding ? (
             <div className="p-6 bg-white rounded-[2.5rem] shadow-floating border-2 border-primary/20 space-y-4 animate-in zoom-in duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Address Detail</label>
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Enter unit/block number..."
                    className="w-full p-4 bg-background-beige border-none rounded-2xl text-lg font-bold text-accent-black focus:ring-2 focus:ring-primary"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm active:scale-95 transition-transform"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAdd}
                    className="flex-[2] py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md active:scale-95 transition-transform"
                  >
                    Add Location
                  </button>
                </div>
             </div>
           ) : (
             <button 
              onClick={() => setIsAdding(true)}
              className="w-full p-6 bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex items-center gap-4 active:scale-[0.98] transition-all hover:bg-white"
             >
                <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                   <span className="material-symbols-outlined">add</span>
                </div>
                <p className="text-lg font-bold text-gray-400">Add other location</p>
             </button>
           )}
        </section>

        <section className="bg-white p-8 rounded-[3rem] shadow-soft relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">security</span>
               Privacy Note
             </h3>
             <p className="text-gray-500 text-sm leading-relaxed mb-6">
               Your address is only visible to verified volunteers and community staff when they are assisting you with a request.
             </p>
             <div className="flex items-center gap-3 p-4 bg-background-beige rounded-2xl">
                <span className="material-symbols-outlined text-primary filled">verified_user</span>
                <span className="text-xs font-bold text-accent-black tracking-tight">Data Protected by Community Policy</span>
             </div>
           </div>
           <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
             <span className="material-symbols-outlined text-9xl">privacy_tip</span>
           </div>
        </section>
      </main>
    </div>
  );
};

export default AddressSettingsScreen;
