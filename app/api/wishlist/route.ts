import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.wishlistItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("ERROR SAAT GET WISHLIST:", error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, harga } = body;

    if (!nama || harga === undefined) {
      return NextResponse.json({ error: 'Nama dan harga diperlukan' }, { status: 400 });
    }

    const newItem = await prisma.wishlistItem.create({
      data: {
        nama: nama,
        harga: Number(harga), 
      },
    });
    
    return NextResponse.json(newItem, { status: 201 }); 
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat item' }, { status: 500 });
  }
}