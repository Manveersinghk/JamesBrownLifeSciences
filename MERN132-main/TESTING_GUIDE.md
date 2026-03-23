# James Brown Life Sciences - Feature & Testing Guide

This document outlines the key features of the application and provides step-by-step instructions on how to test each one to ensure "Industry Level" quality.

## 🌟 Feature 1: Premium "Industry Level" UI/UX
**What it is:** A high-end design using deep navy/teal colors, glassmorphism (blurred transparency), and smooth animations.
**How to Test:**
1.  **Open the Homepage**: Go to `http://localhost:5173`.
2.  **Check Animations**: usage Refresh the page. Watch the text and buttons "fade in and fly up".
3.  **Check Glassmorphism**: Scroll down the page. Look at the **Navbar** at the top. It should turn semi-transparent and blurry (like frosted glass) as you scroll over content.
4.  **Hover Effects**: Hover your mouse over the "Get Started" button and the Service cards. They should lift up slightly and glow.

## 📝 Feature 2: Contact Form (Backend Integration)
**What it is:** A fully functional form that sends message data to your MongoDB database.
**How to Test:**
1.  Click **"Contact"** in the navigation bar.
2.  Fill in the form:
    - **Name**: `Test User`
    - **Email**: `test@example.com`
    - **Message**: `Testing the contact API.`
3.  Click **"Send Message"**.
4.  **Verification**: You should see a green success message saying "Message Sent!".
    - *Technical Check*: If you check your server terminal, you might see a log confirming the data was saved.

## 💼 Feature 3: Careers Application Portal
**What it is:** A specialized form for job seekers to apply with their resume links.
**How to Test:**
1.  Click **"Careers"** in the navigation bar.
2.  Scroll down to the application form.
3.  Fill in the form:
    - **Name**: `Job Applicant`
    - **Email**: `applicant@example.com`
    - **Position**: `Senior Researcher`
    - **Resume Link**: `https://linkedin.com/in/test`
4.  Click **"Submit Application"**.
5.  **Verification**: Confirm the success message appears.

## 📱 Feature 4: Mobile Responsiveness
**What it is:** The site adapts perfectly to phone and tablet screens.
**How to Test:**
1.  **Right-click** anywhere on the page and select **Inspect**.
2.  Click the **Mobile Icon** (top left of the developer tools) or drag the browser window to be very narrow (like a phone).
3.  **Check the Menu**: The top Navigation links should disappear and be replaced by a "Hamburger Menu" (three lines).
4.  **Click the Menu**: It should open a dropdown with the links.
5.  **Scroll**: Ensure no text is cut off and everything is stacked neatly in one column.

## 🛍️ Feature 5: Product Showcase
**What it is:** A catalog of services/products with categorized tagging.
**How to Test:**
1.  Click **"Products"** in the navigation.
2.  Verify you see 3 cards: "Pharmaceuticals", "Biotech Solutions", and "Medical Devices".
3.  Hover over the **tags** (e.g., "Clinical", "Research") to see the hover styling.

## 🤖 Feature 6: AI Chatbot Facility
**What it is:** An intelligent assistant (JBLS Assistant) that answers questions about the company.
**How to Test:**
1.  Look for the **Chat Bubble** icon in the bottom-right corner of the screen.
2.  Click to open the chat window.
3.  Type a question, e.g., *"What services do you offer?"* or *"How can I contact you?"*.
4.  Click **Send**.
5.  **Verification**: Wait a moment and observe the bot typing. It should reply with a relevant, coherent answer.

---
**Summary for Report:**
All these features verify that you have built a **Full Stack MERN Application** that looks professional and functions correctly.
