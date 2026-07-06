from pydantic import BaseModel, Field, ConfigDict
from enum import Enum
from datetime import datetime


class BookingStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"


class MentorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    domain: str
    experience: str
    bio: str
    availability: str
    tags: str

class MentorCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str = Field(..., min_length=2, max_length=100)
    domain: str = Field(..., min_length=2, max_length=100)
    experience: str = Field(..., min_length=1, max_length=100)
    bio: str = Field(..., min_length=10, max_length=1000)
    availability: str = Field(..., min_length=1, max_length=200)
    tags: str = Field(default="", max_length=500)


class BookingCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    mentor_id: int = Field(..., gt=0)
    student_name: str = Field(..., min_length=2, max_length=100)
    topic: str = Field(..., min_length=2, max_length=200)
    slot: str = Field(..., min_length=1, max_length=100)


class BookingStatusUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status: BookingStatus


class PostCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    author: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., pattern="^(Student|Alumni)$")
    title: str = Field(..., min_length=5, max_length=200)
    body: str = Field(..., min_length=10, max_length=5000)


class CommentCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    author: str = Field(..., min_length=2, max_length=100)
    text: str = Field(..., min_length=1, max_length=1000)


class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author: str
    role: str
    title: str
    body: str
    created_at: datetime

class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mentor_id: int
    student_name: str
    topic: str
    slot: str
    status: str
    created_at: datetime

class CommentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    post_id: int
    author: str
    text: str
    created_at: datetime
