/**
 * Google Apps Script for Wedding RSVP Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Save the project with a name like "Wedding RSVP Handler"
 * 5. Create a new Google Sheet for storing RSVPs
 * 6. Copy the Google Sheet ID from the URL and replace SHEET_ID below
 * 7. Deploy as a web app:
 *    - Click "Deploy" > "New deployment"
 *    - Choose "Web app" as the type
 *    - Set "Execute as" to "Me"
 *    - Set "Who has access" to "Anyone"
 *    - Click "Deploy" and copy the web app URL
 * 8. Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' in script.js with the actual URL
 */

// Replace this with your Google Sheet ID
const SHEET_ID = '1-6MzNF8qhLsfSPpRSLnVRBUiaEWNvuQv0RoVuzjNAw4';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Open the Google Sheet
    const sheet = getOrCreateSheet();
    
    // Add headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Email',
        'Attendance',
        'Events',
        'Dietary Restrictions',
        'Questions',
        'Submitted At (Sweden Time)'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#8e6a5b');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // Prepare the row data
    const rowData = [
      data.timestamp,
      data.name,
      data.email,
      data.attendance,
      data.events || '',
      data.dietary || '',
      data.questions || '',
      data.submittedAt
    ];
    
    // Add the new row
    sheet.appendRow(rowData);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);
    
    // Send confirmation email (optional) - DISABLED
    // sendConfirmationEmail(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'RSVP received successfully!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing RSVP:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Error processing RSVP: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Wedding RSVP API is working!'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  try {
    // Try to open existing spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // Create the sheet if it doesn't exist
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    return sheet;
  } catch (error) {
    // If sheet doesn't exist, create a new one
    const spreadsheet = SpreadsheetApp.create('Saga & Adam Wedding RSVPs');
    const sheet = spreadsheet.getActiveSheet();
    sheet.setName(SHEET_NAME);
    
    // Log the new sheet ID for reference
    console.log('Created new spreadsheet with ID:', spreadsheet.getId());
    console.log('Please update SHEET_ID in the script with this ID');
    
    return sheet;
  }
}

function sendConfirmationEmail(data) {
  try {
    // Email configuration
    const senderEmail = 'your-email@gmail.com'; // Replace with your email
    const subject = 'RSVP Confirmation - Saga & Adam\'s Wedding';
    
    let eventsList = '';
    if (data.events) {
      const eventsArray = data.events.split(', ').map(event => {
        switch(event) {
          case 'friday': return 'Friday - Adam\'s Birthday Party';
          case 'saturday-ceremony': return 'Saturday - Wedding Ceremony';
          case 'saturday-reception': return 'Saturday - Reception & Party';
          case 'sunday': return 'Sunday - Farewell Brunch';
          default: return event;
        }
      });
      eventsList = eventsArray.join('\n• ');
    }
    
    const attendanceText = data.attendance === 'yes' ? 'Yes' : 'No';
    
    const emailBody = `
Dear ${data.name},

Thank you for your RSVP! We're so excited to celebrate with you.

Here are your RSVP details:
• Name: ${data.name}
• Email: ${data.email}
• Attendance: ${attendanceText}
${data.events ? `• Events attending:\n  • ${eventsList}` : ''}
${data.dietary ? `• Dietary restrictions: ${data.dietary}` : ''}
${data.questions ? `• Your questions: "${data.questions}"` : ''}

We'll send more details about the weekend closer to the date.

With love and excitement,
Saga & Adam

---
Weekend Schedule Reminder:

Friday, 7th August - Adam's Birthday Party
📍 Bläsinge Gård (5:00 PM - 10:00 PM)

Saturday, 8th August - The Wedding Day
📍 Ceremony: Viken Church (12:00 PM - 1:00 PM)
📍 Drinks & Canapés: Viken (1:00 PM - 3:00 PM)
📍 Evening Party: Bläsinge Gård

Sunday, 9th August - Farewell Brunch
📍 Viken (Around 1:00 PM)
    `;
    
    // Send email to the person who submitted RSVP
    GmailApp.sendEmail(data.email, subject, emailBody);
    
    // Optional: Send notification to bride and groom
    const notificationSubject = `New RSVP from ${data.name}`;
    const notificationBody = `
New RSVP received:

Name: ${data.name}
Email: ${data.email}
Attendance: ${attendanceText}
${data.events ? `Events: ${eventsList}` : ''}
${data.dietary ? `Dietary: ${data.dietary}` : ''}
${data.questions ? `Questions: "${data.questions}"` : ''}

Submitted: ${data.submittedAt}
    `;
    
    // Replace with actual email addresses
    const brideGroomEmails = ['saga.m.carle@gmail.com', 'adamdwalker91@gmail.com'];
    brideGroomEmails.forEach(email => {
      GmailApp.sendEmail(email, notificationSubject, notificationBody);
    });
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't fail the entire operation if email fails
  }
}

/**
 * Test function to verify the setup
 * Run this function to test your configuration
 */
function testRSVP() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    attendance: 'yes',
    events: 'friday,saturday-ceremony,saturday-reception,sunday',
    dietary: 'No restrictions',
    questions: 'So excited for your special day!',
    timestamp: new Date().toISOString(),
    submittedAt: new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Stockholm',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  try {
    const sheet = getOrCreateSheet();
    console.log('Sheet found/created successfully');
    console.log('Sheet ID:', sheet.getParent().getId());
    console.log('Test completed successfully!');
    return 'Test passed!';
  } catch (error) {
    console.error('Test failed:', error);
    return 'Test failed: ' + error.toString();
  }
}