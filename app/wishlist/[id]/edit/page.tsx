"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditWishlistItem() {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const params = useParams(); 
  const router = useRouter();
  
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await fetch(`/api/wishlist/${id}`);
          if (!res.ok) throw new Error('Item tidak ditemukan');
          const data = await res.json();
          
          setNama(data.nama);
          setHarga(data.harga);
        } catch (error) {
          console.error(error);
          alert('Gagal memuat data item.');
          router.push('/');
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/wishlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, harga }),
      });

      if (!res.ok) throw new Error('Gagal menyimpan perubahan');

      alert('Update berhasil!');
      router.push('/'); 
      router.refresh(); 
      
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan perubahan ke database.');
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Memuat data item...</div>;
  }

  return (
    <main className="container py-5">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <h1 className="display-5 text-center mb-4 text-dark">Edit Item</h1>
          
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Perkiraan Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    value={harga}
                    onChange={(e) => setHarga(Number(e.target.value))}
                    required
                  />
                </div>
                
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => router.back()}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}