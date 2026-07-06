from typing import Optional
from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import engine, Base


class Mentor(Base):
    __tablename__ = "mentors"

    id : Mapped[int] = mapped_column(Integer, primary_key= True)
    name : Mapped[str] = mapped_column(String, nullable = False)
    domain : Mapped[str] = mapped_column(String, nullable = False)
    experience : Mapped[str] = mapped_column(String)
    bio : Mapped[str] = mapped_column(String)
    availability : Mapped[str] = mapped_column(String)
    tags: Mapped[str] = mapped_column(String, default = "") 

    bookings = relationship("Booking", back_populates="mentor")



class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mentor_id: Mapped[int] = mapped_column(ForeignKey("mentors.id"), nullable=False, index=True)
    student_name: Mapped[str] = mapped_column(String, nullable=False)
    topic: Mapped[str] = mapped_column(String, nullable=False)
    slot: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    mentor = relationship("Mentor", back_populates="bookings")



class ForumPost(Base):
    __tablename__ = "forum_posts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    author: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    comments = relationship("Comment", back_populates="post")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("forum_posts.id"), nullable=False, index=True)
    author: Mapped[str] = mapped_column(String, nullable=False)
    text: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    post = relationship("ForumPost", back_populates="comments")
