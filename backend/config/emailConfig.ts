import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { IProduct } from "../models/Products";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Configuration Error:", error);
  } else {
    console.log("SMTP is configured properly and ready to send emails.");
  }
});

const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"MYSMME" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (
  to: string,
  token: string,
  name: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #333333;
        }
        .message {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 24px;
          font-size: 16px;
          color: #ffffff !important;
          background-color: #4f46e5;
          text-decoration: none;
          border-radius: 6px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="message">
          <p>Hi ${name},</p>
          <p>Thanks for registering with <strong>MYSMME</strong>. Please click the button below to verify your email address and complete your registration.</p>
          <a href="${verificationUrl}" class="btn">Verify Email</a>
          <p>If you did not create this account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} MySSME. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail(to, "Please verify your account", html);
};

export const sendPasswordResetEmail = async (
  to: string,
  token: string,
  name: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #333333;
        }
        .message {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 24px;
          font-size: 16px;
          color: #ffffff !important;
          background-color: #d63384;
          text-decoration: none;
          border-radius: 6px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="message">
          <p>Hi ${name},</p>
          <p>You recently requested to reset your password for your <strong>MYSMME</strong> account. Click the button below to proceed:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p>This password reset link is only valid for a limited time. If you didn’t request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} MySSME. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail(to, "Please reset your account password", html);
};

// export const sendProductAdvertisement = async (
//   to: string,
//   product: IProduct
// ) => {
//   const productUrl = `${process.env.FRONTEND_URL}/products/${product.slug}`;

//   const html = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//     <title>${product.title} - Special Offer</title>
//     <style>
//       body {
//         margin: 0;
//         padding: 0;
//         font-family: 'Arial', sans-serif;
//         background-color: #f4f4f7;
//         color: #333;
//       }
//       .container {
//         max-width: 600px;
//         margin: 40px auto;
//         background-color: #fff;
//         border-radius: 8px;
//         padding: 20px;
//         box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//       }
//       .header {
//         text-align: center;
//         margin-bottom: 20px;
//       }
//       .header img {
//         max-height: 50px;
//       }
//       h1 {
//         font-size: 22px;
//         color: #ff3d6c;
//         margin: 10px 0;
//       }
//       p {
//         line-height: 1.5;
//         margin: 8px 0;
//       }
//       .price {
//         font-weight: bold;
//         font-size: 18px;
//         margin: 10px 0;
//       }
//       .images {
//         display: flex;
//         overflow-x: auto;
//         padding: 10px 0;
//       }
//       .images img {
//         max-height: 120px;
//         border-radius: 8px;
//         margin-right: 10px;
//       }
//       .images img:last-child {
//         margin-right: 0;
//       }
//       .btn {
//         display: inline-block;
//         padding: 12px 24px;
//         margin: 20px 0;
//         background-color: #ff3d6c;
//         color: #ffffff !important;
//         text-decoration: none;
//         border-radius: 6px;
//         font-weight: bold;
//         text-align: center;
//       }
//       .cta {
//         font-size: 14px;
//         color: #555;
//         margin-top: 10px;
//         text-align: center;
//       }
//       .footer {
//         text-align: center;
//         font-size: 12px;
//         color: #999;
//         margin-top: 30px;
//       }
//       @media (max-width: 600px) {
//         .images {
//           flex-direction: column;
//         }
//         .images img {
//           max-width: 100%;
//           margin-bottom: 10px;
//         }
//       }
//     </style>
//   </head>
//   <body>
//     <div class="container">
//       <div class="header">
//       </div>
//       <h1>${product.title}</h1>
//       <p>${product.description || "No description available."}</p>
//       <p class="price">Price: $${product.price} | Final Price: $${
//     product.finalPrice
//   }</p>

//       ${
//         product.images?.length
//           ? `<div class="images">${product.images
//               .map((img) => `<img src="${img}" alt="${product.title}" />`)
//               .join("")}</div>`
//           : ""
//       }

//       <a href="${productUrl}" class="btn">Buy Now</a>
//       <p class="cta">Hurry! Limited stock available. Grab your copy today and enjoy exclusive deals.</p>

//       <div class="footer">
//         &copy; ${new Date().getFullYear()} MYSMME. All rights reserved.
//       </div>
//     </div>
//   </body>
//   </html>
//   `;

//   await sendEmail(to, `Special Offer: ${product.title}`, html);
// };

export const sendProductAdvertisement = async (
  to: string,
  product: IProduct
) => {
  const productUrl = `${process.env.FRONTEND_URL}/products/${product.slug}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${product.title} - Special Offer</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      h1 {
        font-size: 22px;
        color: #ff3d6c;
        margin: 10px 0;
      }
      p {
        line-height: 1.5;
        margin: 8px 0;
      }
      .price {
        font-weight: bold;
        font-size: 18px;
        margin: 10px 0;
      }
      .btn {
        display: inline-block;
        padding: 12px 24px;
        margin: 20px 0;
        background-color: #ff3d6c;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        text-align: center;
      }
      .cta {
        font-size: 14px;
        color: #555;
        margin-top: 10px;
        text-align: center;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: 30px;
      }
      table.images-table {
        width: 100%;
        border-collapse: collapse;
      }
      table.images-table td {
        padding: 5px;
        text-align: center;
      }
      table.images-table img {
        max-width: 100%;
        height: auto;
        border-radius: 6px;
      }
      @media (max-width: 600px) {
        table.images-table td {
          display: block;
          width: 100%;
          margin-bottom: 10px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${product.title}</h1>
      <p>${product.description || "No description available."}</p>
      <p class="price">Price: $${product.price} | Final Price: $${
    product.finalPrice
  }</p>

      ${
        product.images?.length
          ? `<table class="images-table"><tr>${product.images
              .map(
                (img) => `<td><img src="${img}" alt="${product.title}" /></td>`
              )
              .join("")}</tr></table>`
          : ""
      }

      <a href="${productUrl}" class="btn">Buy Now</a>
      <p class="cta">Hurry! Limited stock available. Grab your copy today and enjoy exclusive deals.</p>

      <div class="footer">
        &copy; ${new Date().getFullYear()} MYSMME. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

  await sendEmail(to, `Special Offer: ${product.title}`, html);
};
