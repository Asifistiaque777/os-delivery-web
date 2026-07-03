/**
 * এই ফাংশনটি নতুন অর্ডার তৈরি হলে ট্রিগার হয় এবং ইমেইল পাঠায়।
 * Fixed: Firebase Functions v2 compatible environment variable handling
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineString } = require('firebase-functions/params');
const nodemailer = require('nodemailer');

// --- Firebase Functions Params (সবচেয়ে reliable পদ্ধতি) ---
// এগুলো deploy করার আগে আপনাকে একবার সেট করতে হবে (নিচে নির্দেশনা আছে)
const MAIL_USER = defineString('MAIL_USER');
const MAIL_PASS = defineString('MAIL_PASS');
const TARGET_EMAIL = defineString('TARGET_EMAIL');

// Firestore-এ নতুন অর্ডার তৈরি হলে ট্রিগার হয় (v2 style)
exports.sendOrderEmail = onDocumentCreated('artifacts/{appId}/public/data/orders/{orderId}', async (event) => {
    
    const order = event.data.data(); 
    const orderId = event.params.orderId;
    
    if (!order || !order.customerDetails || !order.receivedAt) {
        console.error("Order data is incomplete.");
        return null;
    }

    // --- Runtime এ value রিড করা ---
    const mailUser = MAIL_USER.value();
    const mailPass = MAIL_PASS.value();
    const targetEmail = TARGET_EMAIL.value();

    // Transporter এখন function এর ভেতরে তৈরি করা হচ্ছে (best practice)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailUser,
            pass: mailPass
        }
    });

    // --- আইটেমের তালিকা তৈরি (দোকানের নামসহ) ---
    const itemsList = order.items.map(item => {
        const shop = item.shopName || item.category || "Oriental Street";
        
        return `<li style="margin-bottom: 8px; border-bottom: 1px dashed #eee; padding-bottom: 5px;">
          <span style="font-weight: bold; color: #333;">${item.name}</span> (${item.quantity}x)<br/>
          <small style="color: #22C55E; font-weight: bold; text-transform: uppercase;">দোকান: ${shop}</small>
          <div style="text-align: right; font-weight: bold; color: #555;">${item.price * item.quantity} Taka</div>
        </li>`;
    }).join('');

    const charge = order.customerDetails.deliveryCharge || 0;
    const itemsTotal = order.totalAmount - charge;

    // টাইমস্ট্যাম্প কনভার্ট করা
    const receivedTime = new Date(order.receivedAt.seconds * 1000).toLocaleString('bn-BD', {
        timeZone: 'Asia/Dhaka', 
        dateStyle: 'short', 
        timeStyle: 'short'
    });

    const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
        <h2 style="color: #FF5722; text-align: center;">🔥 [OSD] নতুন অর্ডার এসেছে!</h2>
        <div style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>অর্ডার ID:</strong> ${orderId.substring(0, 8)}...</p>
          <p><strong>সময়:</strong> ${receivedTime}</p>
        </div>
        
        <h3 style="border-bottom: 2px solid #FF5722; padding-bottom: 5px;">📍 গ্রাহকের তথ্য</h3>
        <p><strong>নাম:</strong> ${order.customerDetails.name}</p>
        <p><strong>ফোন:</strong> ${order.customerDetails.phone}</p>
        <p><strong>ঠিকানা:</strong> ${order.customerDetails.location} <br/>
           (ব্লক: ${order.customerDetails.block}, রোড: ${order.customerDetails.road}, হাউজ: ${order.customerDetails.house})</p>
        <p><strong>মন্তব্য:</strong> ${order.customerDetails.comment || 'N/A'}</p>

        <h3 style="border-bottom: 2px solid #FF5722; padding-bottom: 5px;">🛒 অর্ডারের তালিকা</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${itemsList}
        </ul>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #ffcc80;">💸 পেমেন্ট সারাংশ</h3>
          <p>খাবারের মোট: <strong style="color: green;">${itemsTotal} Taka</strong></p>
          <p>ডেলিভারি চার্জ: <strong style="color: #2196F3;">${charge} Taka</strong></p>
          <h4 style="color: #FF5722; font-size: 1.3em; margin-bottom: 0;">গ্র্যান্ড টোটাল: ${order.totalAmount} Taka</h4>
        </div>
        
        <p style="margin-top: 30px; text-align: center;">
          <a href="https://osdelivery.shop/#riderpanel" target="_blank" style="background-color: #FF5722; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">রাইডার প্যানেলে দেখুন</a>
        </p>
      </div>
    `;

    const mailOptions = {
        from: `OS Delivery Order Alert <${mailUser}>`,
        to: targetEmail,
        subject: `🚨 [জরুরি] নতুন অর্ডার - ${order.customerDetails.name} (${orderId.substring(0, 8)})`,
        html: emailBody
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order email sent successfully for:', orderId);
        return null;
    } catch (error) {
        console.error('Failed to send order email:', error);
        return null;
    }
});