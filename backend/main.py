from typing import List
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import engine, Base, get_db, SessionLocal
from models import Mentor, Booking, ForumPost, Comment
from schemas import (
MentorCreate,
    MentorRead,
    BookingCreate,
    BookingRead,
    BookingStatusUpdate,
    PostCreate,
    PostRead,
    CommentCreate,
    CommentRead,
)


app = FastAPI(title="Alumni Mentorship Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://alumni-mentorship-platform-eight.vercel.app"],
    allow_origin_regex=r"https://alumni-mentorship-plat(form)?.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_data(session: Session):
    if session.scalars(select(Mentor)).first():
        return

    mentors = [
        Mentor(
            name="Priya Nair",
            domain="Product Management",
            experience="8 yrs - Google, Flipkart",
            bio="Helping students break into PM roles. Big on frameworks, not fluff.",
            availability="Tue & Thu evenings",
            tags="Product Strategy,Interviews,Career Switch",
        ),
        Mentor(
            name="Arjun Mehta",
            domain="Software Engineering",
            experience="6 yrs - Amazon",
            bio="Backend systems and interview prep. I was a first-gen grad too.",
            availability="Weekends, flexible",
            tags="System Design,DSA,Backend",
        ),
        Mentor(
            name="Sana Iqbal",
            domain="Design",
            experience="10 yrs - Freelance, Zomato",
            bio="Portfolio reviews, career pivots into UX, and honest feedback.",
            availability="Mon evenings",
            tags="UX,Portfolio Review,Freelancing",
        ),
    ]

    session.add_all(mentors)
    session.commit()

    post = ForumPost(
        author="Meera S.",
        role="Student",
        title="How early is too early to start applying for internships?",
        body="I'm in my 2nd year - should I wait or start now?",
    )

    session.add(post)
    session.commit()
    session.refresh(post)

    comment = Comment(
        post_id=post.id,
        author="Priya Nair",
        text="Start now. Applications teach you as much as offers do.",
    )

    session.add(comment)
    session.commit()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as session:
        seed_data(session)


@app.get("/mentors", response_model=List[MentorRead])
def list_mentors(db: Session = Depends(get_db)):
    return db.scalars(select(Mentor)).all()


@app.post("/mentors", response_model=MentorRead)
def create_mentor(payload: MentorCreate,db: Session = Depends(get_db)):
    mentor = Mentor(**payload.model_dump())

    db.add(mentor)
    db.commit()
    db.refresh(mentor)

    return mentor


@app.get("/bookings", response_model=List[BookingRead])
def list_bookings(db: Session = Depends(get_db)):
    return db.scalars(select(Booking).order_by(Booking.created_at.desc())).all()


@app.post("/bookings", response_model=BookingRead)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    mentor = db.get(Mentor, payload.mentor_id)

    if not mentor:
        raise HTTPException(
            status_code=404,
            detail="Mentor not found",
        )

    clash = db.scalars(
        select(Booking).where(
            Booking.mentor_id == payload.mentor_id,
            Booking.slot == payload.slot,
            Booking.status != "declined",
        )
    ).first()

    if clash:
        raise HTTPException(
            status_code=409,
            detail="This mentor already has a request for that slot",
        )

    booking = Booking(**payload.model_dump())


@app.patch("/bookings/{booking_id}", response_model=BookingRead)
def update_booking_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
):
    booking = db.get(Booking, booking_id)

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    booking.status = payload.status.value

    db.commit()
    db.refresh(booking)

    return booking

@app.delete("/bookings/{booking_id}", status_code=204)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.get(Booking, booking_id)

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    db.delete(booking)
    db.commit()

@app.get("/forum/posts")
def list_posts(db: Session = Depends(get_db)):
    posts = db.scalars(select(ForumPost).order_by(ForumPost.created_at.desc())).all()

    result = []

    for post in posts:
        result.append(
            {
                "id": post.id,
                "author": post.author,
                "role": post.role,
                "title": post.title,
                "body": post.body,
                "comments": [
                    {
                        "id": c.id,
                        "post_id": c.post_id,
                        "author": c.author,
                        "text": c.text,
                    }
                    for c in post.comments
                ],
            }
        )

    return result


@app.post("/forum/posts", response_model=PostRead)
def create_post(payload: PostCreate,db: Session = Depends(get_db)):
    post = ForumPost(**payload.model_dump())

    db.add(post)
    db.commit()
    db.refresh(post)

    return post


@app.post( "/forum/posts/{post_id}/comments",response_model=CommentRead,)
def add_comment(post_id: int,payload: CommentCreate,db: Session = Depends(get_db)):
    post = db.get(ForumPost, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    comment = Comment(post_id=post_id,**payload.model_dump())

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment


@app.get("/")
def health_check():
    return {"status": "ok"}
