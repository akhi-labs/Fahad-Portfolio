import { BackChip } from '@/components/work/BackChip';
import { ProjectFooter } from '@/components/work/ProjectFooter';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackChip />
      <main>{children}</main>
      <ProjectFooter />
    </>
  );
}
