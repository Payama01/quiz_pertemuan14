import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const item = await prisma.wishlistItem.findUnique({
      where: { id: id },
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
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const body = await request.json();
    const { nama, harga } = body;

    const updatedItem = await prisma.wishlistItem.update({
      where: { id: id },
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
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    await prisma.wishlistItem.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'Item dihapus' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus item' }, { status: 500 });
  }
}