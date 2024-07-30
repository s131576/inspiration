import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { connectToDatabase } from '@/helpers/server-helpers';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.pathname.split('/').pop(); // get the email from the path --> /orders/payed/[email]

  if (!email) {
    console.error('Email parameter is missing');
    return NextResponse.json({ error: 'Email parameter is missing' }, { status: 400 });
  }

  try {
    connectToDatabase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // await prisma.$transaction(async (prisma) => {
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
    // });

    return NextResponse.json({ message: 'User and related data deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json({ error: 'Failed to delete user data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.pathname.split('/').pop(); // get the email from the path --> /orders/payed/[email]

  if (!email) {
    console.error('Email parameter is missing');
    return NextResponse.json({ error: 'Email parameter is missing' }, { status: 400 });
  }

  try {
   connectToDatabase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, img: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 }); 
  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json({ error: 'Failed to delete user data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
export async function PATCH(request: NextRequest) {
  const { oldEmail, newEmail, name } = await request.json();

  if (!oldEmail || !name || !newEmail) {
    return NextResponse.json({ error: 'Old email, new email, and name are required' }, { status: 400 });
  }

  try {
    connectToDatabase();

    const user = await prisma.user.findUnique({
      where: { email: oldEmail },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingUserWithNewEmail = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUserWithNewEmail && existingUserWithNewEmail.email !== oldEmail) {
      return NextResponse.json({ error: 'New email is already in use' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: oldEmail }, 
      data: {
        email: newEmail, 
        name:name, 
      },
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}