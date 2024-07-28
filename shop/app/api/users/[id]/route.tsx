import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.pathname.split('/').pop(); // get the email from the path --> /orders/payed/[email]

  if (!email) {
    console.error('Email parameter is missing');
    return NextResponse.json({ error: 'Email parameter is missing' }, { status: 400 });
  }

  try {
    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.$transaction(async (prisma) => {
      // Delete related OrderItems first
      await prisma.orderItem.deleteMany({
        where: {
          order: {
            userId: user.id,
          },
        },
      });

      // Delete related Orders
      await prisma.order.deleteMany({
        where: {
          userId: user.id,
        },
      });

      // Delete related PaidOrders
      await prisma.paidOrder.deleteMany({
        where: {
          userId: user.id,
        },
      });

      // Finally, delete the User
      await prisma.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json({ message: 'User and related data deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json({ error: 'Failed to delete user data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
