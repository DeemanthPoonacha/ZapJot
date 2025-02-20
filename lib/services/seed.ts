import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const seedData = async () => {
  try {
    console.log("🔥 Seeding Firestore...");

    const userId = "testUser123"; // Dummy user

    // 📝 Seed Journals & Chapters
    const journalRef = await addDoc(collection(db, "journals"), {
      userId,
      title: "Paris 2025",
      description: "Dream vacation journal",
      createdAt: new Date(),
    });

    const chapterRef = await addDoc(
      collection(db, `journals/${journalRef.id}/chapters`),
      {
        title: "Day 1 - Arrival",
        description: "Landed in Paris and explored.",
        createdAt: new Date(),
      }
    );

    await addDoc(
      collection(
        db,
        `journals/${journalRef.id}/chapters/${chapterRef.id}/posts`
      ),
      {
        title: "Visited Eiffel Tower",
        description: "Stunning night view!",
        coverImg: "https://source.unsplash.com/800x600/?eiffel",
        date: new Date(),
      }
    );

    // ✅ Seed Planner (Tasks, Goals, Events)
    await addDoc(collection(db, `planners/${userId}/tasks`), {
      title: "Book Hotel",
      status: "pending",
      createdAt: new Date(),
    });

    await addDoc(collection(db, `planners/${userId}/goals`), {
      objective: "Learn French",
      progress: 30,
      remaining: 70,
      createdAt: new Date(),
    });

    await addDoc(collection(db, `planners/${userId}/events`), {
      title: "Flight to Paris",
      timestamp: new Date(),
      location: "JFK Airport",
    });

    // 👥 Seed Characters
    await addDoc(collection(db, `characters/${userId}/contacts`), {
      name: "Alex",
      relation: "Best Friend",
      birthday: "1995-06-12",
    });

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

// Run script
seedData();
