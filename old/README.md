# Saga & Adam's Wedding Website

A beautiful, password-protected wedding website with RSVP functionality connected to Google Sheets.

## Features

- 🔒 **Password Protection**: Enter page with password protection (fabian007 or Fabian007)
- 💕 **Beautiful Design**: Light, romantic color scheme with smooth animations
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 📅 **Schedule**: Complete weekend itinerary with all locations and times
- 📝 **RSVP Form**: Collects guest responses and sends to Google Sheets
- 📧 **Contact Section**: Easy way for guests to reach the couple
- ✨ **Interactive**: Hover effects, smooth scrolling, and Easter eggs

## Setup Instructions

### 1. Basic Setup
1. Upload all files to your web hosting service
2. Make sure `index.html` is in the root directory
3. Test the password protection with either:
   - `fabian007`
   - `Fabian007`

### 2. Google Sheets Integration (RSVP Form)

#### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Saga & Adam Wedding RSVPs"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

#### Step 2: Set up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Google Sheet ID
5. Update email addresses in the script:
   - Replace `saga@email.com` and `adam@email.com` with real email addresses
   - Replace `your-email@gmail.com` with the Gmail account you want to send from
6. Save the project (name it "Wedding RSVP Handler")

#### Step 3: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Click the gear icon and choose "Web app"
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the Web App URL

#### Step 4: Connect to Website
1. Open `script.js`
2. Find the line with `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE`
3. Replace it with the Web App URL you copied
4. Save and upload the updated `script.js`

#### Step 5: Test
1. Run the `testRSVP()` function in Google Apps Script to verify setup
2. Submit a test RSVP through your website
3. Check that it appears in your Google Sheet

### 3. Customize Content

#### Update Contact Information
In `index.html`, replace placeholder contact details:
- Email addresses for Saga and Adam
- Phone numbers
- Any other contact information

#### Add Your Photo
Replace the password page background:
1. Add your photo to the website directory
2. In `styles.css`, find `.password-container` background property
3. Replace the current background with: `url('your-photo.jpg')`

#### Customize Colors (Optional)
The website uses a light, romantic color scheme. To customize:
- Primary color: `#8e6a5b` (warm brown)
- Accent gradients throughout the CSS file
- Update these in `styles.css` if desired

### 4. Hosting Options

#### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files
3. Enable GitHub Pages in repository settings
4. Your site will be available at `username.github.io/repository-name`

#### Option 2: Netlify (Free)
1. Create account at [Netlify](https://netlify.com)
2. Drag and drop your website folder
3. Get instant hosting with HTTPS

#### Option 3: Traditional Web Hosting
Upload all files to your web hosting provider's public folder (usually `public_html` or `www`)

## File Structure

```
wedding-website/
├── index.html              # Main website file
├── styles.css              # All styling and animations
├── script.js               # Password protection and RSVP functionality
├── google-apps-script.js   # Google Apps Script for Google Sheets
└── README.md               # This file
```

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Security Notes

- Password protection is client-side (suitable for wedding guests)
- For higher security, consider server-side authentication
- HTTPS is recommended for the RSVP form data

## Troubleshooting

### RSVP Form Not Working
1. Check Google Apps Script URL is correct in `script.js`
2. Verify Google Apps Script permissions are set correctly
3. Check browser console for error messages

### Password Not Working
- Ensure you're using exactly: `fabian007` or `Fabian007`
- Check for extra spaces or characters

### Mobile Issues
- The site is fully responsive, but test on actual devices
- Clear browser cache if styles don't load correctly

## Customization Ideas

- Add photo gallery section
- Include accommodation information
- Add gift registry links
- Create a countdown timer
- Add music playlist

## Support

If you need help with setup, check:
1. Browser developer console for error messages
2. Google Apps Script execution logs
3. Google Sheets for RSVP data

---

Made with ❤️ for Saga & Adam's special day!

*Wedding Date: August 8th, 2024 • Viken, Sweden*