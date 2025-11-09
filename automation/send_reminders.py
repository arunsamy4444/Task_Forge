import os
from datetime import datetime, timezone
from pymongo import MongoClient
from bson import ObjectId
import yagmail
from dotenv import load_dotenv

load_dotenv()  # Load .env file

# Environment variables
MONGO_URI = os.getenv("MONGO_URI")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

if not MONGO_URI or not EMAIL_USER or not EMAIL_PASS:
    raise RuntimeError("❌ Missing environment variables")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.get_database("taskops")
tasks_col = db["tasks"]
logs_col = db["logs"]
users_col = db["users"]

# Email setup
yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASS)

def send_task_reminders():
    now_utc = datetime.now(timezone.utc)

    # Find all pending/in-progress tasks
    tasks_due = tasks_col.find({
        "status": {"$in": ["pending", "in-progress"]}
    })

    count_sent = 0
    for task in tasks_due:
        user = users_col.find_one({"_id": ObjectId(task["createdBy"])})
        if not user or not user.get("email"):
            continue

        # Skip if already reminded today
        start_of_day = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
        recent_log = logs_col.find_one({
            "taskId": ObjectId(task["_id"]),
            "action": "reminder_sent",
            "createdAt": {"$gte": start_of_day}
        })
        if recent_log:
            continue

        # Prepare email
        subject = f"Task Reminder: {task.get('title')}"
        due_date = task.get('dueDate')
        if due_date:
            due_str = due_date.strftime("%d-%m-%Y %H:%M UTC") if isinstance(due_date, datetime) else str(due_date)
        else:
            due_str = "No due date"

        body = f"""
Hello {user.get('username', 'User')},

You have a task:

Title: {task.get('title')}
Reason: {task.get('description', 'No description')}
Due Date: {due_str}

– TaskForge Bot
"""

        try:
            yag.send(to=user["email"], subject=subject, contents=body)
            logs_col.insert_one({
                "userId": ObjectId(task["createdBy"]),
                "taskId": ObjectId(task["_id"]),
                "action": "reminder_sent",
                "details": f"Reminder sent for task '{task['title']}'",
                "createdAt": now_utc,
                "updatedAt": now_utc
            })
            count_sent += 1
            print(f"✅ Sent reminder for '{task['title']}' to {user.get('email')}")
        except Exception as e:
            print(f"❌ Failed to send reminder for '{task['title']}': {e}")

    print(f"🎉 Total reminders sent this run: {count_sent}")


if __name__ == "__main__":
    print(f"🕒 Reminder script started at: {datetime.now(timezone.utc)}")
    send_task_reminders()
    print(f"🏁 Reminder script finished at: {datetime.now(timezone.utc)}")
