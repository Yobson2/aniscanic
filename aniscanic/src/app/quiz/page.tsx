import PageHeader from '@/components/page-header';
import QuizGame from '@/components/quiz/quiz-game';
import { getQuestionCounts } from '@/lib/api/opentdb';

export const metadata = { title: 'Quiz anime - Aniscanic' };

export default async function QuizPage() {
  const counts = await getQuestionCounts().catch(() => null);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Quiz anime"
        subtitle="Dix questions sur l’anime et le manga, tirées au hasard à chaque partie. Choisis un niveau et vois jusqu’où tu tiens."
      />
      <QuizGame counts={counts} />
    </div>
  );
}
