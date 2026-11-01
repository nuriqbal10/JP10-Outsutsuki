"use client";

export const runtime = "edge";

import { useParams } from "next/navigation";
import SeriesChapterViewer from "@/components/lms/SeriesChapterViewer";

export default function IrodoriA1ChapterPage() {
  const params = useParams();
  const chapterStr = params?.chapterNum as string;
  const chapterNum = parseInt(chapterStr, 10) || 1;

  return <SeriesChapterViewer courseId="irodori-a1" chapterNum={chapterNum} />;
}
