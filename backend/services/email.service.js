// Load environment variables first
require("dotenv").config();
const { transporter } = require("../utils/email");

class EmailService {
  constructor() {
    this.transporter = transporter;
    this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  }

  /**
   * Send email with error handling and logging
   */
  async sendEmail(emailOptions) {
    console.log("Email options:", emailOptions);
    if (!this.transporter) {
      console.warn('Email service not available - skipping email send');
      return null;
    }

    try {
      const info = await this.transporter.sendMail(emailOptions);
      console.log(`✅ Email sent successfully to ${emailOptions.to}`);
      console.log(`   Message ID: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`❌ Email sending failed to ${emailOptions.to}:`, error.message);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Create base email template
   */
  createBaseTemplate(subject, content) {
    return {
      from: `"RBAC System" <${process.env.EMAIL_USER}>`,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #1976d2, #1565c0);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 30px 20px;
              background: #f9f9f9;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #1976d2;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              margin: 20px 0;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background: #1565c0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #e0e0e0;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              color: #856404;
            }
            .success {
              background: #d4edda;
              border: 1px solid #c3e6cb;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              color: #155724;
            }
            .info-box {
              background: #e3f2fd;
              border: 1px solid #bbdefb;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              color: #1565c0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RBAC System</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>This is an automated message from RBAC System.</p>
              <p>If you didn't request this email, please ignore it or contact your administrator.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Welcome Email
   */
  async sendWelcomeEmail(user) {
    const content = `
      <h2>Welcome to RBAC System! 🎉</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your account has been successfully created with the following details:</p>
      
      <div class="info-box">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role?.name || 'Not assigned'}</p>
        <p><strong>Account Status:</strong> ${user.isBlocked ? 'Blocked' : 'Active'}</p>
      </div>

      <p>You can now access the dashboard and start using the system.</p>
      
      <a href="${this.frontendUrl}/login" class="button">Login to Dashboard</a>
      
      <div class="success">
        <strong>Next Steps:</strong><br>
        • Login with your credentials<br>
        • Explore your dashboard<br>
        • Check your permissions and role
      </div>
    `;

    const emailOptions = this.createBaseTemplate("Welcome to RBAC System", content);
    emailOptions.to = user.email;

    return this.sendEmail(emailOptions);
  }

  /**
   * Password Reset Email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetLink = `${this.frontendUrl}/reset-password?token=${resetToken}`;
    
    const content = `
      <h2>🔐 Password Reset Request</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>We received a request to reset your password for your RBAC System account.</p>
      
      <p>Click the button below to reset your password:</p>
      
      <a href="${resetLink}" class="button">Reset Password</a>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">
        ${resetLink}
      </p>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong><br>
        • This link will expire in <strong>15 minutes</strong><br>
        • If you didn't request this, please ignore this email<br>
        • Never share this link with anyone<br>
        • RBAC System will never ask for your password via email
      </div>
      
      <p>If you continue to have problems, please contact your system administrator.</p>
    `;

    const emailOptions = this.createBaseTemplate("Password Reset Request - RBAC System", content);
    emailOptions.to = user.email;

    return this.sendEmail(emailOptions);
  }

  /**
   * Role Change Notification
   */
  async sendRoleChangeEmail(user, oldRole, newRole) {
    const content = `
      <h2>🔄 Role Update Notification</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your role in the RBAC System has been updated.</p>
      
      <div class="info-box">
        <p><strong>Previous Role:</strong> ${oldRole || 'Not assigned'}</p>
        <p><strong>New Role:</strong> ${newRole}</p>
        <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <p>This change affects your permissions and access levels in the system.</p>
      
      <a href="${this.frontendUrl}/login" class="button">Login to View Changes</a>
      
      <div class="warning">
        <strong>Important:</strong><br>
        • Your new permissions will take effect immediately<br>
        • You may need to refresh your session if currently logged in<br>
        • If you didn't request this change, contact your administrator immediately
      </div>
    `;

    const emailOptions = this.createBaseTemplate("Role Update - RBAC System", content);
    emailOptions.to = user.email;

    return this.sendEmail(emailOptions);
  }

  /**
   * Account Status Change (Blocked/Unblocked)
   */
  async sendAccountStatusEmail(user, status) {
    const isBlocked = status === 'blocked';
    
    const content = `
      <h2>${isBlocked ? '🔒 Account Suspended' : '✅ Account Reactivated'}</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your RBAC System account has been ${isBlocked ? 'suspended' : 'reactivated'}.</p>
      
      <div class="${isBlocked ? 'warning' : 'success'}">
        <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        <p><strong>Changed:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      ${isBlocked ? `
        <div class="warning">
          <strong>What this means:</strong><br>
          • You cannot login to the system<br>
          • Your access to all features is restricted<br>
          • Contact your administrator for more information
        </div>
      ` : `
        <div class="success">
          <strong>Welcome back!</strong><br>
          • You can now login to the system<br>
          • All your permissions have been restored<br>
          • Access your dashboard as usual
        </div>
        
        <a href="${this.frontendUrl}/login" class="button">Login Now</a>
      `}
    `;

    const emailOptions = this.createBaseTemplate(
      `Account ${isBlocked ? 'Suspended' : 'Reactivated'} - RBAC System`, 
      content
    );
    emailOptions.to = user.email;

    return this.sendEmail(emailOptions);
  }

  /**
   * Order Status Update
   */
  async sendOrderStatusEmail(user, order, newStatus) {
    // Format products for email
    const productItems = order.products?.map(item => 
      `<div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <p><strong>${item.product?.name || 'Product'}</strong></p>
        <p>Quantity: ${item.quantity} | Price: $${item.price}</p>
        <p>Subtotal: $${(item.quantity * item.price).toFixed(2)}</p>
      </div>`
    ).join('') || '<p>No product details available</p>';

    // Status-specific messages
    const statusMessages = {
      pending: "Your order has been received and is being processed.",
      confirmed: "Your order has been confirmed and is being prepared.",
      shipped: "Your order has been shipped and is on its way!",
      delivered: "Your order has been delivered successfully.",
      cancelled: "Your order has been cancelled."
    };

    const statusMessage = statusMessages[newStatus] || "Your order status has been updated.";

    const content = `
      <h2>📦 Order Status Update</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>${statusMessage}</p>
      
      <div class="info-box">
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Status:</strong> <span style="color: #1976d2; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
        <p><strong>Total Amount:</strong> $${order.totalAmount?.toFixed(2) || '0.00'}</p>
        <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
      </div>

      <h3>Order Details:</h3>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        ${productItems}
      </div>
      
      <a href="${this.frontendUrl}/orders" class="button">View Order Details</a>
      
      <p>You can track all your orders in the dashboard.</p>
    `;

    const emailOptions = this.createBaseTemplate(`Order Status: ${newStatus.toUpperCase()}`, content);
    emailOptions.to = user.email;

    return this.sendEmail(emailOptions);
  }

  /**
   * Security Alert (Suspicious Login)
   */
  async sendSecurityAlert(user, loginInfo) {
    const content = `
      <h2>🚨 Security Alert</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>We detected a suspicious login attempt on your account.</p>
      
      <div class="warning">
        <p><strong>Login Details:</strong></p>
        <p>• IP Address: ${loginInfo.ip}</p>
        <p>• Location: ${loginInfo.location || 'Unknown'}</p>
        <p>• Device: ${loginInfo.userAgent || 'Unknown'}</p>
        <p>• Time: ${new Date(loginInfo.timestamp).toLocaleString()}</p>
      </div>
      
      <p>If this was you, you can safely ignore this email.</p>
      
      <div class="warning">
        <strong>If this was NOT you:</strong><br>
        • Your account may be compromised<br>
        • Please change your password immediately<br>
        • Contact your administrator<br>
        • Consider enabling 2-factor authentication
      </div>
      
      <a href="${this.frontendUrl}/login" class="button">Secure Your Account</a>
    `;

    const emailOptions = this.createBaseTemplate("Security Alert - RBAC System", content);
    emailOptions.to = user.email;

    return this.sendEmail(emailOptions);
  }
}

module.exports = new EmailService();
