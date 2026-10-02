from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import Transaction, MonthlyGoal

from PIL import Image, ImageOps, ImageEnhance
import pytesseract
import io
import re


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Wallet AI API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://smart-wallet-ai-two.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str
    description: str | None = None


class GoalCreate(BaseModel):
    amount: float


@app.get("/")
def root():
    return {
        "message": "Smart Wallet AI Backend is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "message": "Backend is working"
    }


@app.post("/api/transactions")
def add_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    new_transaction = Transaction(
        type=transaction.type,
        amount=transaction.amount,
        category=transaction.category,
        description=transaction.description
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return {
        "message": "Transaction added successfully",
        "transaction": {
            "id": new_transaction.id,
            "type": new_transaction.type,
            "amount": new_transaction.amount,
            "category": new_transaction.category,
            "description": new_transaction.description,
            "date": new_transaction.date
        }
    }


@app.get("/api/transactions")
def get_transactions(
    db: Session = Depends(get_db)
):
    transactions = (
        db.query(Transaction)
        .order_by(Transaction.date.desc())
        .all()
    )

    return [
        {
            "id": transaction.id,
            "type": transaction.type,
            "amount": transaction.amount,
            "category": transaction.category,
            "description": transaction.description,
            "date": transaction.date
        }
        for transaction in transactions
    ]


@app.get("/api/goals")
def get_goal(
    db: Session = Depends(get_db)
):
    goal = (
        db.query(MonthlyGoal)
        .order_by(MonthlyGoal.id.desc())
        .first()
    )

    if not goal:
        return {
            "amount": 20000
        }

    return {
        "id": goal.id,
        "amount": goal.amount,
        "created_at": goal.created_at,
        "updated_at": goal.updated_at
    }


@app.post("/api/goals")
def save_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db)
):
    if goal_data.amount <= 0:
        return {
            "message": "Goal amount must be greater than 0"
        }

    goal = (
        db.query(MonthlyGoal)
        .order_by(MonthlyGoal.id.desc())
        .first()
    )

    if goal:
        goal.amount = goal_data.amount
    else:
        goal = MonthlyGoal(
            amount=goal_data.amount
        )
        db.add(goal)

    db.commit()
    db.refresh(goal)

    return {
        "message": "Monthly goal saved successfully",
        "goal": {
            "id": goal.id,
            "amount": goal.amount,
            "created_at": goal.created_at,
            "updated_at": goal.updated_at
        }
    }


@app.post("/api/scan-receipt")
async def scan_receipt(
    file: UploadFile = File(...)
):
    try:
        contents = await file.read()

        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        image = ImageOps.grayscale(image)

        image = ImageEnhance.Contrast(
            image
        ).enhance(2.0)

        image = image.resize(
            (
                image.width * 2,
                image.height * 2
            )
        )

        text = pytesseract.image_to_string(
            image,
            config="--psm 6"
        )

        print("\nOCR TEXT:")
        print(text)

        amount = 0.0

        lines = text.splitlines()

        priority_patterns = [
            (100, r"\bgrand\s*total\b"),
            (95, r"\bgrandtotal\b"),
            (90, r"\btotal\s*amount\b"),
            (85, r"\bamount\s*paid\b"),
            (85, r"\bpaid\s*amount\b"),
            (80, r"\bnet\s*amount\b"),
            (75, r"\bbill\s*total\b"),
            (60, r"(?<!sub\s)\btotal\b")
        ]

        candidates = []

        for index, line in enumerate(lines):
            clean_line = line.lower().strip()

            if not clean_line:
                continue

            if re.search(
                r"\bsub\s*total\b|\bsubtotal\b",
                clean_line,
                re.IGNORECASE
            ):
                continue

            for priority, pattern in priority_patterns:
                if re.search(
                    pattern,
                    clean_line,
                    re.IGNORECASE
                ):
                    matches = re.findall(
                        r"(?<!\d)(?:₹|rs\.?|inr)?\s*([0-9]{1,7}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)(?!\d)",
                        line,
                        re.IGNORECASE
                    )

                    values = []

                    for value in matches:
                        try:
                            number = float(
                                value.replace(",", "")
                            )

                            if 1 <= number <= 1000000:
                                values.append(number)

                        except ValueError:
                            pass

                    if values:
                        candidates.append(
                            (
                                priority,
                                index,
                                values[-1]
                            )
                        )

                    break

        if candidates:
            candidates.sort(
                key=lambda item: (
                    item[0],
                    item[1]
                ),
                reverse=True
            )

            amount = candidates[0][2]

        if amount == 0:
            currency_matches = re.findall(
                r"(?:₹|rs\.?|inr)\s*([0-9,]+(?:\.[0-9]{1,2})?)",
                text,
                re.IGNORECASE
            )

            values = []

            for value in currency_matches:
                try:
                    number = float(
                        value.replace(",", "")
                    )

                    if 1 <= number <= 1000000:
                        values.append(number)

                except ValueError:
                    pass

            if values:
                amount = max(values)

        if amount == 0:
            decimal_matches = re.findall(
                r"\b([0-9]{1,7}\.[0-9]{1,2})\b",
                text
            )

            values = []

            for value in decimal_matches:
                try:
                    number = float(value)

                    if 1 <= number <= 1000000:
                        values.append(number)

                except ValueError:
                    pass

            if values:
                amount = max(values)

        print("DETECTED AMOUNT:", amount)

        return {
            "success": True,
            "text": text,
            "amount": amount
        }

    except Exception as error:
        print("OCR ERROR:", str(error))

        return {
            "success": False,
            "message": str(error),
            "amount": 0
        }