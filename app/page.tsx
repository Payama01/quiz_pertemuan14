"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  nama: string;
  harga: number;
}

const STORAGE_KEY = 'myWishlist';

export default function HalamanUtama() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [namaBaru, setNamaBaru] = useState('');
  const [hargaBaru, setHargaBaru] = useState(0);

  useEffect(() => {
    const dataTersimpan = localStorage.getItem(STORAGE_KEY);
    if (dataTersimpan) {
      setItems(JSON.parse(dataTersimpan));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } else {
      const dataTersimpan = localStorage.getItem(STORAGE_KEY);
      if (dataTersimpan) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [items]);

  const handleAddItem = () => {
    if (!namaBaru) return;

    const newItem: WishlistItem = {
      id: crypto.randomUUID(),
      nama: namaBaru,
      harga: hargaBaru,
    };

    const listBaru = [...items, newItem];
    setItems(listBaru);
    
    setNamaBaru('');
    setHargaBaru(0);
  };

  const handleDeleteItem = (id: string) => {
    const listBaru = items.filter(item => item.id !== id);
    setItems(listBaru);
  };

  return (
    <main className="container py-5">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">

          <h1 className="display-4 text-center mb-5 text-dark">Wishlist Payama</h1>

          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <h5 className="mb-0">Tambah Item Baru</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Nama Barang</label>
                <input
                  type="text"
                  className="form-control"
                  value={namaBaru}
                  onChange={(e) => setNamaBaru(e.target.value)}
                  placeholder="Contoh: RTX 5060 Ti"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Perkiraan Harga</label>
                <input
                  type="number"
                  className="form-control"
                  value={hargaBaru}
                  onChange={(e) => setHargaBaru(Number(e.target.value))}
                />
              </div>
              <button className="btn btn-primary w-100" onClick={handleAddItem}>
                Tambah ke List
              </button>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h2 className="h4 mb-0">List Pengen</h2>
            </div>
            <div className="card-body">
              <p className="text-muted" style={{ marginTop: '-5px', marginBottom: '15px' }}>
                kalo dah dapet di delete yah
              </p>
              
              <ul className="list-group">
                {items.length === 0 && (
                  <li className="list-group-item text-center text-muted">
                    List masih kosong nih...
                  </li>
                )}

                {items.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    
                    <Link href={`/wishlist/${item.id}`} className="text-dark" style={{ textDecoration: 'none' }}>
                      {item.nama} - (Rp {item.harga.toLocaleString('id-ID')})
                    </Link>
                    
                    <button 
                      className="btn btn-outline-danger btn-sm" 
                      onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}