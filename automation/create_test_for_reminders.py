# automation/create_test_for_reminders.py
import os
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database("taskops")
tasks_col = db["tasks"]
users_col = db["users"]

# Get the first user
user = users_col.find_one()
if not user:
    print("❌ No users found! Please create a user in your app first.")
    exit()

print(f"👤 Using user: {user['username']} ({user['email']})")

# Create a task that's due in 1 HOUR (so it's not overdue)
test_task = {
    "title": "TEST: Urgent Task - Complete by deadline",
    "description": "This is a test task for email reminders",
    "status": "pending",
    "dueDate": datetime.now(timezone.utc) + timedelta(hours=1),  # Due in 1 hour
    "createdBy": user["_id"],
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc)
}

# Delete any existing test tasks
tasks_col.delete_many({"title": {"$regex": "TEST: Urgent Task", "$options": "i"}})

result = tasks_col.insert_one(test_task)
print(f"✅ Created test task:")
print(f"   📝 Title: {test_task['title']}")
print(f"   📊 Status: {test_task['status']}")
print(f"   ⏰ Due: {test_task['dueDate']}")
print(f"   📧 Will send to: {user['email']}")
print(f"   🆔 Task ID: {result.inserted_id}")