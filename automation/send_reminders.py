import os
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
from bson import ObjectId
import yagmail

# Environment variables
MONGO_URI = os.getenv("MONGO_URI")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

if not MONGO_URI or not EMAIL_USER or not EMAIL_PASS:
    raise RuntimeError("❌ Missing environment variables")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.get_database()
tasks_col = db["tasks"]
logs_col = db["logs"]
users_col = db["users"]

# Setup email
yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASS)

def send_task_reminders():
    now_utc = datetime.now(timezone.utc)
    two_minutes_ago = now_utc - timedelta(minutes=2)

    # 1️⃣ Mark overdue
    overdue_result = tasks_col.update_many(
        {"dueDate": {"$lt": now_utc}, "status": {"$ne": "completed"}},
        {"$set": {"status": "overdue"}}
    )
    print(f"✅ Marked {overdue_result.modified_count} tasks as overdue")

    # 2️⃣ Find pending/in-progress tasks
    tasks_due = tasks_col.find({
        "status": {"$in": ["pending", "in-progress"]}
    })

    count_sent = 0
    for task in tasks_due:
        user = users_col.find_one({"_id": ObjectId(task["createdBy"])})
        if not user or not user.get("email"):
            continue

        # Avoid duplicates in last 2 minutes
        recent_log = logs_col.find_one({
            "taskId": ObjectId(task["_id"]),
            "action": "reminder_sent",
            "createdAt": {"$gte": two_minutes_ago}
        })
        if recent_log:
            continue

        # Send email
        subject = f"[TEST] Reminder: Task '{task['title']}'"
        body = f"""
Hello {user.get('username')},

Your task '{task.get('title')}' is due on {task.get('dueDate'):%Y-%m-%d %H:%M UTC}.

– TaskForge Bot (Test)
"""
        try:
            yag.send(to=user["email"], subject=subject, contents=body)
            logs_col.insert_one({
                "userId": ObjectId(task["createdBy"]),
                "taskId": ObjectId(task["_id"]),
                "action": "reminder_sent",
                "details": f"Test email sent for task '{task['title']}'",
                "createdAt": now_utc,
                "updatedAt": now_utc
            })
            count_sent += 1
            print(f"✅ Sent test reminder for task '{task['title']}' to {user.get('email')}")
        except Exception as e:
            print(f"❌ Failed to send reminder for '{task['title']}': {e}")

    print(f"✅ Total test reminders sent: {count_sent}")

if __name__ == "__main__":
    send_task_reminders()



# import os
# from datetime import datetime, timedelta, timezone
# from pymongo import MongoClient
# from bson import ObjectId
# import yagmail

# # Load secrets from environment (GitHub Actions injects them)
# MONGO_URI = os.getenv("MONGO_URI")
# EMAIL_USER = os.getenv("EMAIL_USER")
# EMAIL_PASS = os.getenv("EMAIL_PASS")

# if not MONGO_URI or not EMAIL_USER or not EMAIL_PASS:
#     raise RuntimeError("❌ Missing environment variables: MONGO_URI, EMAIL_USER, EMAIL_PASS")

# # Connect to Mongo
# client = MongoClient(MONGO_URI)
# db = client.get_database()
# tasks_col = db["tasks"]
# logs_col = db["logs"]
# users_col = db["users"]

# # Email client
# yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASS)

# def send_task_reminders():
#     """Check tasks and send reminder emails"""
#     now_utc = datetime.now(timezone.utc)
#     today_utc = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
#     tomorrow_utc = today_utc + timedelta(days=1)

#     # 1. Mark overdue tasks
#     overdue_result = tasks_col.update_many(
#         {"dueDate": {"$lt": today_utc}, "status": {"$ne": "completed"}},
#         {"$set": {"status": "overdue"}}
#     )
#     print(f"✅ Marked {overdue_result.modified_count} tasks as overdue")

#     # 2. Find tasks due today
#     tasks_due = tasks_col.find({
#         "dueDate": {"$lt": tomorrow_utc},
#         "status": {"$in": ["pending", "in-progress"]}
#     })

#     # 3. Send reminders
#     count_sent = 0
#     for task in tasks_due:
#         user = users_col.find_one({"_id": ObjectId(task["createdBy"])})
#         if not user or not user.get("email"):
#             continue

#         subject = f"Reminder: Task '{task.get('title')}' is due soon!"
#         body = f"""
#         Hello {user.get('username')},

#         Your task '{task.get('title')}' is due on {task.get('dueDate')}.
        
#         – TaskForge Bot
#         """

#         try:
#             yag.send(to=user["email"], subject=subject, contents=body)
#             logs_col.insert_one({
#                 "userId": ObjectId(task["createdBy"]),
#                 "action": "reminder_sent",
#                 "taskId": ObjectId(task["_id"]),
#                 "details": f"Email reminder sent for task '{task['title']}'",
#                 "createdAt": datetime.now(timezone.utc),
#                 "updatedAt": datetime.now(timezone.utc)
#             })
#             count_sent += 1
#         except Exception as e:
#             print(f"❌ Failed to send email for task '{task.get('title')}': {e}")

#     print(f"✅ Sent {count_sent} reminder emails")

# if __name__ == "__main__":
#     send_task_reminders()

