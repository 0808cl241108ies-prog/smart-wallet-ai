from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    type = Column(String, nullable=False)

    amount = Column(Float, nullable=False)

    category = Column(String, nullable=False)

    description = Column(String, nullable=True)

    date = Column(
        DateTime,
        default=datetime.utcnow
    )


class MonthlyGoal(Base):
    __tablename__ = "monthly_goals"

    id = Column(Integer, primary_key=True, index=True)

    amount = Column(Float, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )