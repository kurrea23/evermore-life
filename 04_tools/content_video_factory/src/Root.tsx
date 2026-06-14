import {Composition, Folder} from 'remotion';
import manifest from '../../../04_content_narrative/ad_campaign_scaffold/activation_manifest.json';
import {ActivationVideo, calculateDuration, type ActivationItem} from './ActivationVideo';

const compositionIds: Record<string, string> = {
  'soccer-dad-legacy': 'SoccerDadLegacy',
  'chef-daughter-legacy': 'ChefDaughterLegacy',
  'graduation-legacy': 'GraduationLegacy',
  'final-expense-clarity': 'FinalExpenseClarity',
  'tree-keeps-growing': 'TreeKeepsGrowing',
};

const renderableItems = (manifest.items as ActivationItem[]).filter(
  (item) => item.clips.length > 0 && compositionIds[item.slug],
);

export const RemotionRoot = () => {
  return (
    <Folder name="Evermore-Rough-Cuts">
      {renderableItems.map((item) => (
        <Composition
          key={item.creative_id}
          id={compositionIds[item.slug]}
          component={ActivationVideo}
          durationInFrames={calculateDuration(item.clips.length)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{item}}
        />
      ))}
    </Folder>
  );
};
