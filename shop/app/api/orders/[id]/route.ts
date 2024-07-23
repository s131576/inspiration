// app/api/orders/[id]/route.ts or pages/api/orders/[id].ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.$transaction(async (prisma) => {
      // Delete related OrderItems first
      await prisma.orderItem.deleteMany({
        where: { orderId: params.id },
      });

      // Delete the Order
      await prisma.order.delete({
        where: { id: params.id },
      });
    });

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
    const body = await request.json();
    const quantity = parseInt(body.quantity, 10);

    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // Assuming we're updating the entire order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        items: {
          update: {
            where: { id: body.itemId }, // Specific item
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