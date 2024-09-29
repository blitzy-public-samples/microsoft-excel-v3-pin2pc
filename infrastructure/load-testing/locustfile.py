from locust import HttpUser, task, between
import random
import json

class ExcelUser(HttpUser):
    wait_time = between(1, 5)  # Wait 1-5 seconds between tasks

    def on_start(self):
        # Log in the user
        self.client.post("/login", json={"username": "testuser", "password": "testpassword"})
        # Create a new workbook or open an existing one
        response = self.client.post("/workbooks", json={"name": "TestWorkbook"})
        self.workbook_id = response.json()["id"]

    @task(1)
    def create_workbook(self):
        response = self.client.post("/workbooks", json={"name": f"Workbook_{random.randint(1000, 9999)}"})
        if response.status_code == 201:
            print(f"Created workbook: {response.json()['id']}")
        else:
            print(f"Failed to create workbook: {response.text}")

    @task(3)
    def open_workbook(self):
        response = self.client.get(f"/workbooks/{self.workbook_id}")
        if response.status_code == 200:
            print(f"Opened workbook: {self.workbook_id}")
        else:
            print(f"Failed to open workbook: {response.text}")

    @task(5)
    def edit_cell(self):
        worksheet_id = "Sheet1"  # Assuming a default sheet name
        cell_address = f"{random.choice('ABCDEFGHIJ')}{random.randint(1, 100)}"
        value = random.randint(1, 1000)
        response = self.client.patch(
            f"/workbooks/{self.workbook_id}/worksheets/{worksheet_id}/cells/{cell_address}",
            json={"value": value}
        )
        if response.status_code == 200:
            print(f"Edited cell {cell_address} with value {value}")
        else:
            print(f"Failed to edit cell: {response.text}")

    @task(2)
    def add_formula(self):
        worksheet_id = "Sheet1"
        cell_address = f"{random.choice('ABCDEFGHIJ')}{random.randint(1, 100)}"
        formula = f"=SUM({random.choice('ABCDEFGHIJ')}1:{random.choice('ABCDEFGHIJ')}10)"
        response = self.client.patch(
            f"/workbooks/{self.workbook_id}/worksheets/{worksheet_id}/cells/{cell_address}",
            json={"formula": formula}
        )
        if response.status_code == 200:
            print(f"Added formula {formula} to cell {cell_address}")
        else:
            print(f"Failed to add formula: {response.text}")

    @task(1)
    def create_chart(self):
        worksheet_id = "Sheet1"
        chart_data = {
            "type": random.choice(["bar", "line", "pie"]),
            "data": {
                "labels": ["A", "B", "C", "D", "E"],
                "datasets": [{
                    "data": [random.randint(1, 100) for _ in range(5)]
                }]
            }
        }
        response = self.client.post(
            f"/workbooks/{self.workbook_id}/worksheets/{worksheet_id}/charts",
            json=chart_data
        )
        if response.status_code == 201:
            print(f"Created chart: {response.json()['id']}")
        else:
            print(f"Failed to create chart: {response.text}")

    @task(2)
    def save_workbook(self):
        response = self.client.put(f"/workbooks/{self.workbook_id}/save")
        if response.status_code == 200:
            print(f"Saved workbook: {self.workbook_id}")
        else:
            print(f"Failed to save workbook: {response.text}")

def on_test_start(environment):
    print("Starting Excel API load test...")

def on_test_stop(environment):
    print("Excel API load test completed.")

# Pending human tasks:
# TODO: Configure the correct API endpoints and authentication mechanism for the Excel API
# TODO: Determine appropriate task weights based on expected user behavior
# TODO: Implement proper error handling and logging for failed requests
# TODO: Set up test data generation for realistic workbook content