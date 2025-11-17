// app/explore/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Tipe interface untuk data produk dari DummyJSON
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string; // URL gambar kecil
  category: string;
}

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Kita ambil 12 produk dari kategori "laptops" dan "smartphones"
        const res = await fetch('https://dummyjson.com/products/search?q=phone&limit=6');
        
        if (!res.ok) {
          throw new Error('Gagal mengambil data dari API');
        }
        
        const data = await res.json();
        setProducts(data.products); // API-nya mengembalikan array di dalam properti 'products'
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan yang tidak diketahui');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Array kosong berarti useEffect ini hanya berjalan sekali saat halaman dimuat

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 text-dark">Explore Produk</h1>
        <Link href="/" className="btn btn-outline-secondary">
          Kembali ke Wishlist
        </Link>
      </div>

      {/* Tampilkan pesan Loading */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Memuat produk...</p>
        </div>
      )}

      {/* Tampilkan pesan Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Tampilkan list produk menggunakan Card Bootstrap */}
      {!loading && !error && (
        <div className="row g-4">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={product.thumbnail} 
                    className="card-img-top" 
                    alt={product.title} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark">{product.title}</h5>
                    <p className="card-text text-muted small flex-grow-1">
                      {product.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary">{product.category}</span>
                      <h4 className="text-success mb-0">
                        ${product.price}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">Tidak ada produk untuk ditampilkan.</p>
          )}
        </div>
      )}
    </main>
  );
}