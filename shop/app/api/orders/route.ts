import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/prisma/client';



export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: true,
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch orders', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const userEmail = data.userId;

    // Fetch the user to get their ObjectId
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create the order with the correct ObjectId for userId
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id, 
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            category: item.category,
            image: item.image,
          })),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
