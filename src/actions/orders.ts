"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getOrders() {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, orders };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function createOrder(data: {
  customer: string;
  phone: string;
  email?: string;
  address?: string;
  items: string;
  amount: number;
  cartItems?: { productId: string; quantity: number }[];
}) {
  try {
    // Start a transaction to ensure both order creation and stock updates happen or fail together
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const newOrder = await tx.order.create({
        data: {
          customer: data.customer,
          phone: data.phone,
          ...(data.email && { email: data.email }),
          ...(data.address && { address: data.address }),
          items: data.items,
          amount: data.amount,
          status: "Pending",
          date: new Date(),
        },
      });

      // 2. Decrement stock if cartItems provided
      if (data.cartItems && data.cartItems.length > 0) {
        for (const item of data.cartItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return newOrder;
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    // Revalidate products as stock has changed
    revalidatePath("/admin/products"); 
    revalidatePath("/");

    return { success: true, order };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function deleteOrder(id: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.order.delete({
      where: { id },
    });
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}
