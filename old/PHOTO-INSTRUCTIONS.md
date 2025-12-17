# How to Add Your Background Photo

## Step 1: Add Your Photo File
1. Place your photo in the same folder as your website files (`/Users/fabiancarle/Desktop/Saga&adam/`)
2. Name your photo file something simple like:
   - `wedding-photo.jpg`
   - `background.jpg` 
   - `saga-adam.jpg`

## Step 2: Update the CSS
1. Open `styles.css`
2. Find this line (around line 10):
   ```css
   background: url('your-photo.jpg') center center fixed;
   ```
3. Replace `your-photo.jpg` with your actual photo filename:
   ```css
   background: url('wedding-photo.jpg') center center fixed;
   ```

## Photo Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 1920x1080 or larger for best quality
- **Aspect**: Landscape orientation works best
- **Quality**: High resolution for sharp background

## Example
If your photo is named `saga-adam-photo.jpg`, change the CSS to:
```css
background: url('saga-adam-photo.jpg') center center fixed;
```

## Result
- Your photo will be the fixed background for the entire website
- The password page and all navigation pages will appear as cards floating over your photo
- The background stays in place while pages flip like cards on top of it

## Testing
1. Save your changes
2. Refresh your browser at `http://localhost:8000`
3. You should see your photo as the background with the white cards floating on top

## Troubleshooting
- If photo doesn't show: Check the filename spelling and make sure the photo is in the same folder
- If photo looks stretched: Try a different photo with landscape orientation
- If photo is too dark: The cards have semi-transparent backgrounds to ensure readability