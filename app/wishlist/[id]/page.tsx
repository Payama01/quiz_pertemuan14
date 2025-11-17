"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface WishlistItem {
  id: string;
  nama: string;
  harga: number;
}

const STORAGE_KEY = 'myWishlist';

export default function WishlistDetail() {
  const router = useRouter();
  const params = useParams();
  
  const [item, setItem] = useState<WishlistItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = params;

    if (id) {
      const dataTersimpan = localStorage.getItem(STORAGE_KEY);
      
      if (dataTersimpan) {
        const semuaItem: WishlistItem[] = JSON.parse(dataTersimpan);
        
        const itemDitemukan = semuaItem.find(i => i.id === id);
        
        if (itemDitemukan) {
          setItem(itemDitemukan);
        }
      }
    }
    setLoading(false);
  }, [params]); 

  if (loading) {
    return <div className="container mt-4">Memuat data...</div>;
  }

  if (!item) {
    return (
      <div className="container mt-4">
        <p>Item tidak ditemukan.</p>
        <button className="btn btn-secondary" onClick={() => router.back()}>
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          Detail Barang
        </div>
        <div className="card-body">
          <h5 className="card-title">{item.nama}</h5>
          <p className="card-text">
            Perkiraan Harga: Rp {item.harga.toLocaleString('id-ID')}
          </p>
          
          <button 
            className="btn btn-primary" 
            onClick={() => router.back()}
          >
            Kembali ke List
          </button>
        </div>
      </div>
    </div>
  );
}