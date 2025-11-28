---
title: Cheroga Booking Automation
description:
  Complete No-Code automation system for managing rental bookings. Handles
  reservations, guest management, payments, and communication with guests via
  WhatsApp.
longDescription:
  End-to-end booking management system built with Make.com that automates the
  entire rental flow from inquiry to post-checkout, integrating with Google
  services, WhatsApp, and Airtable.
lang: en
category: client
tags: [Automation, No-Code, Make.com, Client Project]
technologies:
  [
    Make.com,
    Gmail,
    Google Calendar,
    Google Contacts,
    Google Sheets,
    Airtable,
    WhatsApp,
  ]
images:
  - ./_images/cheroga-automation/1.png
  - ./_images/cheroga-automation/2.png
mainImage: ./_images/cheroga-automation/1.png
featured: true
publishDate: 2021-08-01
order: 11
---

## Project Description

Managing rental bookings for a vacation property involves countless repetitive
tasks: responding to inquiries, sending confirmations, tracking payments,
coordinating with guests, and following up after their stay. For the owner of
Cheroga Casa Quinta, this meant hours of manual work per reservation.

This automation system transforms that entire process. From the moment a guest
submits a booking request to the thank-you message after checkout, everything
runs automatically.

## The Challenge

Before automation, the property owner had to:

- Manually respond to each inquiry
- Keep track of guest information across multiple places
- Create calendar events by hand
- Generate and send receipts manually
- Coordinate via WhatsApp with constant back-and-forth
- Remember to send reminders before check-in
- Follow up after checkout

This was time-consuming, error-prone, and didn't scale well as bookings
increased.

## The Solution

A comprehensive Make.com automation that handles the complete booking lifecycle:

### 1. Booking Request Processing

When a guest submits the booking form on the website:

- **Guest lookup**: Searches the database by phone number
- **Guest creation**: If new guest, creates a record in the database
- **Google Contacts sync**: Checks if the guest exists in Google Contacts
  - If exists: Updates their information
  - If new: Creates a contact automatically
  - This means the owner always has guest contacts saved on their Android phone

### 2. Calendar and Documentation

- **Calendar event**: Creates a Google Calendar event with all booking details
- **PDF receipt**: Generates a professional receipt with booking information
- **WhatsApp delivery**: Sends the receipt directly to the guest via WhatsApp

### 3. Financial Tracking

- **Google Sheets update**: Records payment information
  - Amount paid as deposit
  - Outstanding balance
  - Payment due dates
  - Booking status

### 4. Guest Communication Hub

- **WhatsApp group creation**: Automatically creates a group including:
  - Property owner
  - Main guest
  - Additional guests/companions
- **Information package**: Sends useful information about the rental, check-in
  instructions, and property rules

### 5. Automated Reminders

- **Pre-arrival message**: 1 day before check-in
  - Sends a reminder to the WhatsApp group
  - Includes useful arrival information
  - Check-in instructions and contact details

### 6. Post-Stay Follow-up

- **Thank you message**: 1 day after checkout
  - Sends a farewell message to the group
  - Thanks guests for their stay
  - Automatically deletes the group (cleanup)

## Technical Architecture

### Platform

Built entirely on **Make.com** (formerly Integromat), a powerful no-code
automation platform.

### Integrations

| Service             | Purpose                               |
| ------------------- | ------------------------------------- |
| **Gmail**           | Email notifications and confirmations |
| **Google Calendar** | Booking events and availability       |
| **Google Contacts** | Guest contact management              |
| **Google Sheets**   | Financial tracking and reporting      |
| **Airtable**        | Guest database and booking records    |
| **WhatsApp**        | Guest communication and groups        |

### Workflow Design

The automation consists of multiple interconnected scenarios:

1. **Booking intake**: Triggered by form submission
2. **Guest management**: Handles database and contacts
3. **Documentation**: Generates receipts and updates records
4. **Communication**: Manages WhatsApp groups and messages
5. **Scheduled tasks**: Pre-arrival and post-checkout messages

## Results

The automation delivered significant improvements:

- **Time saved**: Hours of manual work eliminated per booking
- **Consistency**: Every guest receives the same professional experience
- **No missed communications**: Automated reminders never forget
- **Better organization**: All information in one place
- **Scalability**: Can handle more bookings without more work
- **Professional image**: Polished and timely communications

## Why No-Code?

This project demonstrates the power of no-code automation:

- **Rapid development**: Built and deployed quickly
- **Easy maintenance**: Owner can understand and modify simple parts
- **Cost-effective**: No server infrastructure to maintain
- **Reliable**: Make.com handles scaling and uptime
- **Flexible**: Easy to add new integrations or modify workflows

## Lessons Learned

Building this system taught valuable lessons about:

- Designing resilient automations that handle edge cases
- Structuring data for multiple integrations
- Creating a seamless guest experience through automation
- Balancing automation with personal touch

## Client Relationship

This automation system complements the Cheroga Casa Quinta website, creating a
complete digital solution for the property's online presence and operations.
