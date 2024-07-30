import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { connectToDatabase } from '@/helpers/server-helpers';

// interface Params {
//   params: { email: string };
// }

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.pathname.split('/').pop(); // get the email from the pad --> /orders/email pop gets the last element

  if (!email) {
    console.error('Email parameter is missing');
    return NextResponse.json({ error: 'Email parameter is missing' }, { status: 400 });
  }

  try {
    connectToDatabase();
    const user = await prisma.user.findUnique({
      where: { email: email },
    });


    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    connectToDatabase();
    // await prisma.$transaction(async (prisma) => {
      // Delete related OrderItems first
      await prisma.orderItem.deleteMany({
        where: { orderId: params.id },
      });

      // Delete the Order
      await prisma.order.delete({
        where: { id: params.id },
      });
    // });

    return NextResponse.json({ message: 'Order and related items deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    connectToDatabase();
    const body = await request.json();
    const quantity = parseInt(body.quantity, 10);

    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        items: {
          update: {
            where: { id: body.itemId }, 
            data: { quantity }
          }
        }
      }
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order item quantity:', error);
    return NextResponse.json({ error: 'Failed to update order item' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}