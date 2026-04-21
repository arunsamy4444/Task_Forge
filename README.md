# TaskForge - Workflow Automation System

A full-stack system for managing tasks and automating reminder workflows using scheduled execution and database-driven triggers.

GitHub Repository: https://github.com/arunsamy4444/Task_Forge

## Context

In small teams and operational environments, task tracking is often manual or loosely managed. This leads to missed deadlines and inconsistent follow-ups.

This system tests a simple structure:
task input → database storage → scheduled processing → automated notification.

## Features

### Authentication
- User Signup & Login (JWT-based)
- Role-based Access (user/admin)
- Session Management (token-based)

### Task Management
- Create tasks (title, description, due date, priority, status)
- Update task status (Pending, In Progress, Completed)
- Delete tasks
- Dashboard for task visibility

### Automation
- Scheduled execution using GitHub Actions (cron jobs)
- Python script processes tasks daily at 7 PM
- Fetches pending tasks from MongoDB
- Sends email reminders via SMTP

### Admin
- View all users' tasks
- Basic task distribution insights
- Admin access via role update in database

## Use Case

A team or supervisor can:
- Assign and track tasks centrally
- Store deadlines in a structured system
- Automatically trigger reminders without manual follow-up

This reduces reliance on memory-based tracking and repeated manual communication.

## Tech Stack

Frontend: React, CSS3, React Router  
Backend: Node.js, Express  
Database: MongoDB  
Auth: JWT  
Automation: Python, GitHub Actions  
Email: SMTP  
Deployment: Vercel (frontend)

## How It Works

1. User creates tasks with deadlines
2. Tasks are stored in MongoDB
3. GitHub Actions triggers a Python script daily
4. Script fetches pending tasks
5. Email reminders are sent automatically

## Notes

- Designed as a prototype for workflow automation
- Uses GitHub Actions instead of a dedicated scheduler service
- Not intended for high-scale or real-time processing
