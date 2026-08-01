# CAPTCHA Integration Guide for Booking Form

## Overview
This guide explains how to set up Google reCAPTCHA v2 on your booking form to protect against automated bot bookings.

## What is reCAPTCHA?
reCAPTCHA is a free service from Google that helps protect websites from spam and abuse by distinguishing between human users and automated bots.

## Setup Instructions

### Step 1: Register for reCAPTCHA

1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Click the "+" (Add) button to register a new site
4. Fill in the registration form:
   - **Label**: Enter a name for your site (e.g., "Guest House Booking")
   - **reCAPTCHA type**: Select **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
   - **Domains**: Add your website domain(s)
     - For production: `yourdomain.com`
     - For local testing: `localhost` or `127.0.0.1`
   - **Accept the reCAPTCHA Terms of Service**
5. Click **Submit**

### Step 2: Get Your Keys

After registration, you'll receive two keys:
- **Site Key**: Used in your HTML/JavaScript (public)
- **Secret Key**: Used for server-side verification (private)

**Important**: Keep your Secret Key secure and never expose it in client-side code!

### Step 3: Configure Your Booking Form

1. Open `booking.html`
2. Find this line (around line 428):
   ```html
   <input type="hidden" id="recaptchaSiteKey" value="YOUR_RECAPTCHA_SITE_KEY_HERE">
   ```
3. Replace `YOUR_RECAPTCHA_SITE_KEY_HERE` with your actual Site Key from Step 2

Example:
```html
<input type="hidden" id="recaptchaSiteKey" value="6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX">
```

### Step 4: Server-Side Verification (IMPORTANT)

For complete bot protection, you should verify the reCAPTCHA response on your server. Since you're using Google Apps Script, here's how to add verification:

#### In your Google Apps Script:

```javascript
function doPost(e) {
  var params = e.parameter;
  
  // Verify reCAPTCHA
  var recaptchaToken = params['g-recaptcha-response'];
  
  if (!recaptchaToken) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'CAPTCHA verification required'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Verify token with Google
  var secretKey = 'YOUR_SECRET_KEY_HERE'; // Store this securely!
  var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
  
  var payload = {
    'secret': secretKey,
    'response': recaptchaToken
  };
  
  var response = UrlFetchApp.fetch(verificationUrl, {
    'method': 'post',
    'payload': payload
  });
  
  var result = JSON.parse(response.getContentText());
  
  if (!result.success || result.score < 0.5) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'CAPTCHA verification failed'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // If verification passes, continue with your existing logic
  // ... rest of your code
}
```

### Step 5: Test Your Integration

1. Open your booking page in a browser
2. You should see the "I'm not a robot" checkbox before the submit button
3. Complete the CAPTCHA challenge
4. Submit the form
5. Check that the submission works correctly

## Troubleshooting

### CAPTCHA Not Showing
- Make sure you've replaced `YOUR_RECAPTCHA_SITE_KEY_HERE` with your actual site key
- Check browser console for errors
- Ensure your domain is registered in the reCAPTCHA admin console

### "Invalid domain" Error
- Add your current domain to the allowed domains list in reCAPTCHA admin console
- For local testing, make sure `localhost` or `127.0.0.1` is added

### CAPTCHA Always Fails
- Verify your Secret Key is correct in the server-side code
- Check that your server is properly sending the verification request to Google

## Best Practices

1. **Never expose your Secret Key** in client-side code
2. **Always verify on the server** - client-side validation alone is not enough
3. **Use environment variables** to store your Secret Key securely
4. **Monitor CAPTCHA failures** to detect potential attack patterns
5. **Consider reCAPTCHA v3** for invisible protection if the checkbox disrupts user experience

## Additional Security Measures

To further protect against bots:

1. **Rate Limiting**: Limit the number of submissions per IP address
2. **Email Verification**: Send confirmation emails that require clicking a link
3. **Phone Verification**: Send OTP via SMS for high-value bookings
4. **Time-based Analysis**: Flag submissions that are too fast (bots often fill forms instantly)
5. **Honeypot Fields**: Add hidden fields that bots will fill but humans won't see

## Support

If you encounter issues:
- Check the [official reCAPTCHA documentation](https://developers.google.com/recaptcha)
- Review browser console for JavaScript errors
- Check server logs for verification failures

---

**Note**: This implementation uses reCAPTCHA v2 Checkbox. If you prefer an invisible solution, consider upgrading to reCAPTCHA v3, which provides background protection without user interaction.
