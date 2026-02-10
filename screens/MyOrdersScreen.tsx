
import React from 'react';

interface MyOrdersScreenProps {
  onBack: () => void;
}

const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({ onBack }) => {
  const orders = [
    { title: 'Community Haircut', date: 'Oct 24, 2024', cost: 3, status: 'Active', code: 'YILE-1024' },
    { title: 'Organic Veggie Pack', date: 'Oct 20, 2024', cost: 1, status: 'Completed', code: 'YILE-8821' },
    { title: 'Acupuncture Session', date: 'Oct 15, 2024', cost: 5, status: 'Completed', code: 'YILE-0092' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">My Vouchers</h1>
      </header>

      <main className="p-6 space-y-4">
        {orders.map((order, i) => (
          <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-black/5">
            <div className="p-6 flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-accent-black">{order.title}</h3>
                <p className="text-xs text-gray-400 font-bold">{order.date}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                order.status === 'Active' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-400'
              }`}>
                {order.status}
              </div>
            </div>
            <div className="bg-background-beige/30 p-4 border-t border-dashed border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-sm filled">stars</span>
                <span className="text-sm font-bold">{order.cost} Stamps Used</span>
              </div>
              <button className="text-primary-dark font-bold text-sm flex items-center gap-1">
                View QR <span className="material-symbols-outlined text-lg">qr_code_2</span>
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MyOrdersScreen;
