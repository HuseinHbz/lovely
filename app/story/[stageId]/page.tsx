import { notFound } from 'next/navigation';
import { getStage, STAGES } from '@/lib/engine';
import { StageView } from '@/components/StageView';

/** هر مرحله در زمان build ساخته می‌شود — چیزی برای fetch کردن وجود ندارد. */
export function generateStaticParams() {
  return STAGES.map((stage) => ({ stageId: stage.id }));
}

export const dynamicParams = false;

export default async function StagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId } = await params;
  const stage = getStage(stageId);
  if (stage === undefined) notFound();

  return <StageView stage={stage} />;
}
