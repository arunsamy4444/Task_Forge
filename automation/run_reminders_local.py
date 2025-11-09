# automation/run_reminders_local.py
import time
from send_reminders import send_task_reminders
from datetime import datetime, timezone

print("🟢 Local reminder runner started")

while True:
    print("\n🔄 Running reminder check at:", datetime.now(timezone.utc))
    try:
        send_task_reminders()
    except Exception as e:
        print(f"❌ Error in send_task_reminders: {e}")
    
    print("⏳ Sleeping for 2 minutes...")
    time.sleep(2 * 60)  # 2 minutes
