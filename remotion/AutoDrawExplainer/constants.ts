export const FPS = 30;
export const TOTAL_DURATION_SEC = 53;

const sec = (s) => s * FPS;

export const SCENES = [
  {
    id: 'intro',
    from: sec(0),
    duration: sec(5),
    title: "5 HABITS THAT WILL CHANGE YOUR LIFE",
    subtitle: "Aaj hum baat karenge 5 aise habits ke baare mein jo aapki zindagi badal sakte hain."
  },
  {
    id: 'habit-1',
    from: sec(5),
    duration: sec(8),
    title: "(1) WAKE UP EARLY",
    points: ["More time for yourself", "Better focus", "Positive start of the day"],
    subtitle: "Subah jaldi uthna aapko mental clarity deta hai aur din ki shuruaat productive hoti hai."
  },
  {
    id: 'habit-2',
    from: sec(13),
    duration: sec(8),
    title: "(2) PLAN YOUR DAY",
    points: ["Focus", "Productivity", "Discipline"],
    subtitle: "Plan karne se aapka focus badhta hai aur aap important cheezein complete kar pate ho."
  },
  {
    id: 'habit-3',
    from: sec(21),
    duration: sec(8),
    title: "(3) EXERCISE DAILY",
    points: ["Better Health", "Good Mood", "More Energy"],
    subtitle: "Roz thoda exercise karna aapki body aur mind dono ke liye bahut zaroori hai."
  },
  {
    id: 'habit-4',
    from: sec(29),
    duration: sec(8),
    title: "(4) READ BOOKS",
    points: ["New Knowledge", "Better Thinking", "Personal Growth"],
    subtitle: "Books aapka perspective badalti hain aur aapko aage badhne ki soch deti hain."
  },
  {
    id: 'habit-5',
    from: sec(37),
    duration: sec(8),
    title: "(5) STAY CONSISTENT",
    points: ["SMALL STEPS", "EVERYDAY", "BIG RESULTS"],
    subtitle: "Consistency sabse important hai. Roz thoda improvement, bada result deta hai."
  },
  {
    id: 'outro',
    from: sec(45),
    duration: sec(8),
    title: "SUMMARY",
    points: ["BETTER HABITS", "BETTER YOU", "BETTER LIFE"],
    subtitle: "In habits ko follow karo, aapki life 100% change ho jayegi. Start today!"
  }
];