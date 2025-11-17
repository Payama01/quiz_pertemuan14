"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'; 

interface WishlistItem {
  id: string;
  nama: string;
  harga: number;
}

export default function HalamanUtama() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [namaBaru, setNamaBaru] = useState('');
  const [hargaBaru, setHargaBaru] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data: WishlistItem[] = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
      alert('Gagal memuat data dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []); 

  const handleAddItem = async () => {
    if (!namaBaru) return;

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: namaBaru,
          harga: hargaBaru,
        }),
      });

      if (!res.ok) throw new Error('Gagal menambah item');

      const newItem: WishlistItem = await res.json();

      setItems([newItem, ...items]); 
      
      setNamaBaru('');
      setHargaBaru(0);
    } catch (error) {
      console.error(error);
      alert('Gagal menambah item ke database.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Yakin mau hapus item ini?')) return;

    try {
      const res = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Gagal menghapus item');

      setItems(items.filter(item => item.id !== id));

    } catch (error) {
      console.error(error);
      alert('Gagal menghapus item dari database.');
    }
  };

  return (
    <main className="container py-5">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">

          <h1 className="display-4 text-center mb-4 text-dark">Wishlist Payama</h1>
          <div className="d-grid gap-2 mb-4">
            <Link href="/explore" className="btn btn-info shadow-sm">
              Explore Produk Lain (dari API Eksternal)
            </Link>
          </div>

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
                {loading && (
                  <li className="list-group-item text-center text-muted">
                    Memuat data...
                  </li>
                )}

                {!loading && items.length === 0 && (
                  <li className="list-group-item text-center text-muted">
                    List masih kosong nih...
                  </li>
                )}

                {items.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    
                    <span className="text-dark">
                      {item.nama} - (Rp {item.harga.toLocaleString('id-ID')})
                    </span>
                    
                    <div className="d-flex gap-2">
                      <Link href={`/wishlist/${item.id}/edit`} className="btn btn-outline-secondary btn-sm">
                        Edit
                      </Link>

                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </button>
                    </div>
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