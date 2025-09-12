# send_reminders.py

import os
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import yagmail

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found in .env")
if not EMAIL_USER or not EMAIL_PASS:
    raise ValueError("Email credentials not found in .env")

# MongoDB setup
client = MongoClient(MONGO_URI)
db = client.get_database()
tasks_col = db["tasks"]
logs_col = db["logs"]
users_col = db["users"]  # to get user emails

# Setup email client
yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASS)

def task_remind():
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)

    tasks_due = tasks_col.find({
        "dueDate": {"$lt": tomorrow},
        "status": {"$ne": "completed"}
    })

    for task in tasks_due:
        title = task.get("title", "Untitled Task")
        due_date = task.get("dueDate")
        
        # Get user email
        user = users_col.find_one({"_id": ObjectId(task["createdBy"])})
        if not user:
            print(f"No user found for task '{title}'")
            continue
        user_email = user.get("email")
        if not user_email:
            print(f"No email for user {user.get('username')}")
            continue

        # Send email
        subject = f"Reminder: Task '{title}' is due soon!"
        body = f"Hello {user.get('username')},\n\nYour task '{title}' is due on {due_date}.\nPlease complete it on time.\n\n- TaskForge Reminder Bot"

        try:
            yag.send(to=user_email, subject=subject, contents=body)
            print(f"✅ Reminder sent to {user_email} for task '{title}'")

            # Log reminder
            logs_col.insert_one({
                "userId": ObjectId(task["createdBy"]),
                "action": "reminder_sent",
                "taskId": ObjectId(task["_id"]),
                "details": f"Email reminder sent for task '{title}'",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            })
        except Exception as e:
            print(f"❌ Failed to send email for task '{title}': {e}")

if __name__ == "__main__":
    task_remind()
