# Gmail App Password Setup Guide

## Why You Need an App Password

Gmail no longer allows third-party applications to use your regular Gmail password for security reasons. You must generate an "App Password" specifically for nodemailer.

## Step-by-Step Instructions

### 1. Enable 2-Step Verification (Required)

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", find "2-Step Verification"
4. Click on "2-Step Verification" and follow the setup process
5. You'll need to verify your phone number

### 2. Generate App Password

1. After enabling 2-Step Verification, go back to Security
2. Under "How you sign in to Google", find "App passwords"
3. Click on "App passwords"
4. You may need to sign in again
5. In the "Select app" dropdown, choose "Mail"
6. In the "Select device" dropdown, choose "Other (Custom name)"
7. Type "GNN Ecommerce" or any name you prefer
8. Click "Generate"
9. Google will show you a 16-character password (like: `abcd efgh ijkl mnop`)
10. **IMPORTANT**: Copy this password immediately - you won't be able to see it again!

### 3. Update Backend Environment Variables

Open `backend/.env` and update the EMAIL_PASS:

```env
EMAIL_USER=gnntech33@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Note**: Remove all spaces from the app password when pasting it.

### 4. Update Render Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your backend service (gnn-ecommerce-1)
3. Go to the "Environment" tab
4. Find or add these variables:
   - `EMAIL_USER` = `gnntech33@gmail.com`
   - `EMAIL_PASS` = `your_16_character_app_password` (no spaces)
5. Click "Save Changes"
6. Render will automatically redeploy your service

### 5. Restart Backend Server

If running locally:
```bash
cd backend
npm run dev
```

The server should start without errors.

### 6. Test Email Functionality

1. Place a test order on your website
2. Check the backend console logs for:
   - "Attempting to send email to: [email]"
   - "Order confirmation email sent successfully: [messageId]"
3. Check the customer's email inbox (jayshinde4554@gmail.com or your test email)
4. If email doesn't arrive, check spam folder

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

This means you're using your regular Gmail password instead of an App Password.
- Solution: Generate an App Password following steps above

### Error: "Missing credentials for PLAIN"

This means EMAIL_USER or EMAIL_PASS is not set in environment variables.
- Solution: Check backend/.env file has both variables

### Error: "Connection timeout"

This could mean:
- Firewall blocking port 587 or 465
- Gmail is blocking the connection
- Solution: Try using port 465 with secure: true

### Email Not Received

1. Check backend logs for email sending confirmation
2. Check spam/junk folder
3. Verify the recipient email is correct
4. Try sending to a different email address

### Alternative: Use Port 465

If port 587 doesn't work, update the transporter config in `backend/controllers/orderController.js`:

```javascript
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
```

## Testing Email Locally

You can test email sending with this simple script:

Create `backend/test-email.js`:

```javascript
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "jayshinde4554@gmail.com",
    subject: "Test Email from GNN Ecommerce",
    html: "<h1>Test Email</h1><p>If you receive this, email is working!</p>",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Email sent:", info.messageId);
    }
});
```

Run it:
```bash
cd backend
node test-email.js
```

## Current Configuration

Your current setup:
- Email: `gnntech33@gmail.com`
- Password in .env: `Kundan@0245` (This is NOT an App Password!)

**ACTION REQUIRED**: Replace `Kundan@0245` with a proper Gmail App Password.

## Security Notes

- Never commit .env files to Git
- Never share your App Password
- If compromised, revoke the App Password and generate a new one
- App Passwords can be revoked anytime from Google Account settings

## Additional Resources

- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Nodemailer Gmail Setup: https://nodemailer.com/usage/using-gmail/
- Google 2-Step Verification: https://www.google.com/landing/2step/
