"use client";

export const runtime = "edge";

import { useParams } from "next/navigation";
import SeriesChapterViewer from "@/components/lms/SeriesChapterViewer";

export default function IrodoriA21ChapterPage() {
  const params = useParams();
  const chapterStr = params?.chapterNum as string;
  const chapterNum = parseInt(chapterStr, 10) || 1;

  return <SeriesChapterViewer courseId="irodori-a2-1" chapterNum={chapterNum} />;
}
