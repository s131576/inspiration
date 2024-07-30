'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FaRegArrowAltCircleUp } from "react-icons/fa";

const OrderHistory: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [paidOrders, setPaidOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/payed/${userEmail}`);
        setPaidOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch paid orders', error);
      }
    };

    fetchPaidOrders();
  }, [userEmail]);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    const margin = 20;
    const imageWidth = 50;
    const textOffsetX = margin + imageWidth + 10; // Space between image and text
    const textWidth = 170 - imageWidth - 10; // Width available for text to wrap
  
    paidOrders.forEach((order: any, orderIndex: number) => {
      doc.setFontSize(18);
      doc.text(`Order ID: ${order.id}`, margin, 20);
      doc.setFontSize(12);
      doc.text(`Total Amount: $${order.totalAmount}`, margin, 30);
      doc.text(`Paid At: ${order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Not Paid'}`, margin, 40);
  
      let y = 50;
  
      order.orderDetails.forEach((orderDetail: any) => {
        orderDetail.items.forEach((item: any) => {
          const imageUrl = item.image;
          const img = new Image();
          img.src = imageUrl;
          
          // Draw bordered box
          doc.setLineWidth(0.5);
          doc.rect(margin, y, 170, 60);
  
          if (img) {
            doc.addImage(img, 'JPEG', margin + 5, y + 5, imageWidth, 50);
          }
  
          doc.setFontSize(12);
          const productNameLines = doc.splitTextToSize(`Product: ${item.name}`, textWidth);
          const textY = y + 10;
  
          doc.text(productNameLines, textOffsetX, textY);
  
          doc.setFontSize(10);
          doc.text(`Quantity:${item.quantity}`, textOffsetX, textY + 20);
          doc.text(`Price/per item:$${item.price}`, textOffsetX, textY + 25);
          doc.text(`Total:$${item.quantity * item.price}`, textOffsetX, textY + 30);
  
          y += 70;
  
          if (y > 200) { // Check if y position is near the end of the page
            doc.addPage();
            y = 20; // Reset y position for the new page
          }
        });
      });
  
      if (orderIndex < paidOrders.length - 1) {
        doc.addPage();
      }
    });
  
    doc.save('order-history.pdf');
  };
  

  const handleInfoOrders = (orderId: string) => {
    setExpandedOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId));
  };

  if (paidOrders.length === 0) {
    return <p>You have not bought any items yet.</p>;
  }

  return (
    <div>
      <button onClick={generatePDF} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Download PDF
      </button>
      {paidOrders.map((order: any) => (
        <div key={order.id} className="mb-4 p-4 border rounded-md">
          <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
          <p>Total Amount: ${order.totalAmount}</p>
          <p>Paid At: {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Not Paid'}</p>
          <div className="">
            {expandedOrderId === order.id ? (
              <div className='flex flex-row items-center justify-end'>
              <FaRegArrowAltCircleUp onClick={() => handleInfoOrders(order.id)} />

              </div>
            ) : (
              <div className='flex flex-row items-center justify-end'>
            <span className='mr-2'>Info</span>
              <FaRegArrowAltCircleDown onClick={() => handleInfoOrders(order.id)} />
              </div>
            )}
          </div>
          {expandedOrderId === order.id && (
            <div>
              {order.orderDetails.map((orderDetail: any) => (
                <div key={orderDetail.id}>
                  {orderDetail.items.map((item: any) => (
                    <div key={item.id} className="ml-4 my-4 p-4 border rounded-md flex">
                      <img src={item.image} alt={item.name} style={{ width: '100px', marginRight: '16px' }} />
                      <div>
                        <p><strong>Product:</strong> {item.name}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Price:</strong> ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
