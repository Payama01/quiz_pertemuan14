import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Definisikan tipe untuk context-nya
type RouteContext = {
  // 'params' adalah Promise, ini adalah perubahan di Next.js baru
  params: Promise<{
    id: string;
  }>
};

export async function GET(
  request: Request,
  // Terima context, yang berisi params
  context: RouteContext
) {
  // 'await' properti params, BUKAN seluruh context
  const { id } = await context.params; 

  try {
    const item = await prisma.wishlistItem.findUnique({
      where: { id: id }, // 'id' sekarang akan berisi string
    });

    if (!item) {
      return NextResponse.json({ error: 'Item tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext // Gunakan tipe yang sama
) {
  // 'await' properti params
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { nama, harga } = body;

    const updatedItem = await prisma.wishlistItem.update({
      where: { id: id }, // 'id' sekarang sudah benar
      data: {
        nama: nama,
        harga: Number(harga),
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal meng-update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext // Gunakan tipe yang sama
) {
  // 'await' properti params
  const { id } = await context.params;

  try {
    await prisma.wishlistItem.delete({
      where: { id: id }, // 'id' sekarang sudah benar
    });
    return NextResponse.json({ message: 'Item dihapus' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus item' }, { status: 500 });
  }
}