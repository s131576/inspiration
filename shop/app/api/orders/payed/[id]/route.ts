import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { connectToDatabase } from '@/helpers/server-helpers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userEmail = url.pathname.split('/').pop();

  if (!userEmail) {
    return NextResponse.json({ error: 'User email is required' }, { status: 400 });
  }

  try {
    connectToDatabase();
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const paidOrders = await prisma.paidOrder.findMany({
      where: { userId: user.id },
      include: {
        Order: {
          include: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(paidOrders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch paid orders' }, { status: 500 });
  }finally {
    await prisma.$disconnect();
  }
}
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.pathname.split('/').pop(); // get the email from the path --> /orders/payed/[email]

  if (!email) {
    console.error('Email parameter is missing');
    return NextResponse.json({ error: 'Email parameter is missing' }, { status: 400 });
  }

  try {
    connectToDatabase();

    // Fetch the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch existing orders for the user
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true }
    });

    if (orders.length === 0) {
      return NextResponse.json({ error: 'No orders found for the user' }, { status: 404 });
    }

    // Calculate total amount
    const totalAmount = orders.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => orderSum + item.price * item.quantity, 0);
    }, 0);

    // Create the paid order and store the order details as JSON
    const newPaidOrder = await prisma.paidOrder.create({
      data: {
        userId: user.id,
        isPaid: true,
        totalAmount: totalAmount,
        paidAt: new Date(),
        orderDetails: orders 
      },
    });

    // Clear the original orders after creating the paid order
    await prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: orders.map(order => order.id)
        }
      }
    });

    await prisma.order.deleteMany({
      where: {
        id: {
          in: orders.map(order => order.id)
        }
      }
    });

    return NextResponse.json(newPaidOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create paid order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
