import os
from datetime import datetime, timedelta, timezone
from pymongo import MongoClient
from bson import ObjectId
import yagmail

# Environment variables (set in Cloud Functions runtime)
MONGO_URI = os.getenv("MONGO_URI")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

client = MongoClient(MONGO_URI)
db = client.get_database()
tasks_col = db["tasks"]
logs_col = db["logs"]
users_col = db["users"]
yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASS)

def send_task_reminders(request=None):
    """Cloud Function entry point"""
    now_utc = datetime.now(timezone.utc)
    today_utc = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow_utc = today_utc + timedelta(days=1)

    # Mark overdue tasks
    tasks_col.update_many(
        {"dueDate": {"$lt": today_utc}, "status": {"$ne": "completed"}},
        {"$set": {"status": "overdue"}}
    )

    # Send reminders
    tasks_due = tasks_col.find({
        "dueDate": {"$lt": tomorrow_utc},
        "status": {"$in": ["pending", "in-progress"]}
    })

    for task in tasks_due:
        user = users_col.find_one({"_id": ObjectId(task["createdBy"])})
        if not user or not user.get("email"):
            continue

        subject = f"Reminder: Task '{task.get('title')}' is due soon!"
        body = f"Hello {user.get('username')},\nYour task '{task.get('title')}' is due on {task.get('dueDate')}.\n- TaskForge Bot"
        try:
            yag.send(to=user["email"], subject=subject, contents=body)
            logs_col.insert_one({
                "userId": ObjectId(task["createdBy"]),
                "action": "reminder_sent",
                "taskId": ObjectId(task["_id"]),
                "details": f"Email reminder sent for task '{task['title']}'",
                "createdAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc)
            })
        except Exception as e:
            print(f"Failed to send email: {e}")

    return "Task reminders processed."




# import os
# import time
# from datetime import datetime, timedelta, timezone
# from pymongo import MongoClient
# from bson import ObjectId
# from dotenv import load_dotenv
# import yagmail
# import schedule

# # Load environment variables
# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# EMAIL_USER = os.getenv("EMAIL_USER")
# EMAIL_PASS = os.getenv("EMAIL_PASS")

# if not MONGO_URI or not EMAIL_USER or not EMAIL_PASS:
#     raise ValueError("Missing environment variables")

# # MongoDB setup
# client = MongoClient(MONGO_URI)
# db = client.get_database()
# tasks_col = db["tasks"]
# logs_col = db["logs"]
# users_col = db["users"]

# # Email client
# yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASS)

# def task_remind():
#     now_utc = datetime.now(timezone.utc)
#     today_utc = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
#     tomorrow_utc = today_utc + timedelta(days=1)

#     # Mark overdue tasks
#     overdue_result = tasks_col.update_many(
#         {"dueDate": {"$lt": today_utc}, "status": {"$ne": "completed"}},
#         {"$set": {"status": "overdue"}}
#     )
#     if overdue_result.modified_count > 0:
#         print(f"⚠️ Marked {overdue_result.modified_count} task(s) as overdue")

#     # Fetch pending tasks
#     tasks_due = tasks_col.find({
#         "dueDate": {"$lt": tomorrow_utc},
#         "status": {"$in": ["pending", "in-progress"]}
#     })

#     for task in tasks_due:
#         user = users_col.find_one({"_id": ObjectId(task["createdBy"])})
#         if not user or not user.get("email"):
#             continue

#         subject = f"Reminder: Task '{task.get('title')}' is due soon!"
#         body = (
#             f"Hello {user.get('username')},\n\n"
#             f"Your task '{task.get('title')}' is due on {task.get('dueDate')}.\n"
#             "Please complete it on time.\n\n"
#             "- TaskForge Reminder Bot"
#         )

#         try:
#             yag.send(to=user["email"], subject=subject, contents=body)
#             print(f"✅ Reminder sent to {user['email']} for task '{task['title']}'")

#             logs_col.insert_one({
#                 "userId": ObjectId(task["createdBy"]),
#                 "action": "reminder_sent",
#                 "taskId": ObjectId(task["_id"]),
#                 "details": f"Email reminder sent for task '{task['title']}'",
#                 "createdAt": datetime.now(timezone.utc),
#                 "updatedAt": datetime.now(timezone.utc)
#             })
#         except Exception as e:
#             print(f"❌ Failed to send email for task '{task['title']}': {e}")

# # Schedule every 1 minute for testing
# schedule.every(1).minutes.do(task_remind)

# print("📅 Test scheduler running... Press Ctrl+C to stop.")
# while True:
#     schedule.run_pending()
#     time.sleep(10)











# # send_reminders.py

# import os
# from datetime import datetime, timedelta
# from pymongo import MongoClient
# from bson import ObjectId
# from dotenv import load_dotenv
# import yagmail

# # Load environment variables
# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# EMAIL_USER = os.getenv("EMAIL_USER")
# EMAIL_PASS = os.getenv("EMAIL_PASS")

# if not MONGO_URI:
#     raise ValueError("MONGO_URI not found in .env")
# if not EMAIL_USER or not EMAIL_PASS:
#     raise ValueError("Email credentials not found in .env")

# # MongoDB setup
# client = MongoClient(MONGO_URI)
# db = client.get_database()
# tasks_col = db["tasks"]
# logs_col = db["logs"]
# users_col = db["users"]  # to get user emails

# # Setup email client
# yag = yagmail.SMTP(EMAIL_USER, EMAIL_PASS)

# def task_remind():
#     today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
#     tomorrow = today + timedelta(days=1)

#     tasks_due = tasks_col.find({
#         "dueDate": {"$lt": tomorrow},
#         "status": {"$ne": "completed"}
#     })

#     for task in tasks_due:
#         title = task.get("title", "Untitled Task")
#         due_date = task.get("dueDate")
        
#         # Get user email
#         user = users_col.find_one({"_id": ObjectId(task["createdBy"])})
#         if not user:
#             print(f"No user found for task '{title}'")
#             continue
#         user_email = user.get("email")
#         if not user_email:
#             print(f"No email for user {user.get('username')}")
#             continue

#         # Send email
#         subject = f"Reminder: Task '{title}' is due soon!"
#         body = f"Hello {user.get('username')},\n\nYour task '{title}' is due on {due_date}.\nPlease complete it on time.\n\n- TaskForge Reminder Bot"

#         try:
#             yag.send(to=user_email, subject=subject, contents=body)
#             print(f"✅ Reminder sent to {user_email} for task '{title}'")

#             # Log reminder
#             logs_col.insert_one({
#                 "userId": ObjectId(task["createdBy"]),
#                 "action": "reminder_sent",
#                 "taskId": ObjectId(task["_id"]),
#                 "details": f"Email reminder sent for task '{title}'",
#                 "createdAt": datetime.now(),
#                 "updatedAt": datetime.now()
#             })
#         except Exception as e:
#             print(f"❌ Failed to send email for task '{title}': {e}")

# if __name__ == "__main__":
#     task_remind()
