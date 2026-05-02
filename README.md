# TaskForge - Workflow Automation System

A workflow automation prototype designed to replace manual task follow-ups with scheduled, event-driven processing using a database-backed task pipeline.

GitHub Repository: https://github.com/arunsamy4444/Task_Forge

---

## System Context

In small operational teams, task tracking is often fragmented across messages, spreadsheets, or memory-based follow-ups. This leads to missed deadlines and inconsistent execution loops.

TaskForge explores a minimal automation pipeline:

task creation → persistent storage → scheduled evaluation → automated notification delivery

The goal is not UI complexity, but reliable task-state processing with automation hooks.

---

## Core Capabilities

### Authentication Layer
- JWT-based authentication system
- Role separation (user / admin)
- Stateless session handling using tokens

### Task Lifecycle Management
- Create tasks with structured metadata (title, deadline, priority, status)
- Update task state transitions (Pending → In Progress → Completed)
- Delete task records
- User-specific task dashboard for visibility

### Automation Engine
- Scheduled execution via GitHub Actions (cron-based trigger)
- Python worker script runs at fixed interval (7:00 PM)
- Queries MongoDB for pending and overdue tasks
- Generates email notifications via SMTP

### Administrative Layer
- Global task visibility across users
- Basic workload distribution overview
- Role elevation handled via database-level configuration

---

## Design Intent

The system is intentionally structured as a **lightweight workflow engine**, not a production scheduler.

Key design decisions:
- GitHub Actions used instead of dedicated job scheduler (cost + simplicity tradeoff)
- Python worker isolated from backend to simulate event-driven processing
- MongoDB used for flexible task state storage rather than strict relational schema

---

## Execution Flow

1. User creates a task with metadata (deadline, priority)
2. Task is stored in MongoDB as a persistent record
3. GitHub Actions triggers a scheduled Python worker
4. Worker queries for pending/overdue tasks
5. Email notifications are dispatched via SMTP

---

## Tech Stack

Frontend: React, React Router, CSS  
Backend: Node.js, Express  
Database: MongoDB  
Authentication: JWT  
Automation Layer: Python + GitHub Actions  
Notification System: SMTP Email  
Deployment: Vercel (Frontend)

---

## Limitations

- No distributed job queue (single-worker execution model)
- No retry mechanism for failed email delivery
- Not optimized for high-frequency task updates
- GitHub Actions introduces fixed scheduling latency

---

## Use Case

Designed for small operational environments where:

- Tasks are manually created but need automated follow-ups
- Deadline tracking is inconsistent across team members
- Lightweight automation is preferred over enterprise scheduling systems

---

## Summary

TaskForge is a prototype for exploring **workflow automation using minimal infrastructure**, focusing on:

- Scheduled execution
- State-based task processing
- Lightweight notification automation
