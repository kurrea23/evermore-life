import {Video} from '@remotion/media';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const FPS = 30;
const CLIP_FRAMES = 5 * FPS;
const TRANSITION_FRAMES = 9;
const END_CARD_FRAMES = 3 * FPS;

type Caption = {
  start_seconds: number;
  end_seconds: number;
  text: string;
};

export type ActivationItem = {
  creative_id: string;
  slug: string;
  title: string;
  clips: string[];
  illustrative_story: boolean;
  captions: Caption[];
};

type ActivationVideoProps = {
  item: ActivationItem;
};

export const calculateDuration = (clipCount: number) =>
  clipCount * CLIP_FRAMES - clipCount * TRANSITION_FRAMES + END_CARD_FRAMES;

const ClipScene = ({path}: {path: string}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0d1f2d'}}>
      <Video
        src={staticFile(path)}
        muted
        objectFit="cover"
        style={{width: '100%', height: '100%'}}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5,14,21,0.16) 0%, rgba(5,14,21,0.02) 45%, rgba(5,14,21,0.78) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const CaptionCard = ({
  text,
  durationInFrames,
}: {
  text: string;
  durationInFrames: number;
}) => {
  const frame = useCurrentFrame();
  const fadeOutStart = Math.max(11, durationInFrames - 10);
  const opacity = interpolate(frame, [0, 10, fadeOutStart, durationInFrames], [0, 1, 1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 14], [18, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 84px 250px',
      }}
    >
      <div
        style={{
          color: '#f7f1e7',
          fontFamily: 'Georgia, serif',
          fontSize: 64,
          lineHeight: 1.12,
          letterSpacing: 0.3,
          textAlign: 'center',
          textShadow: '0 3px 18px rgba(0,0,0,0.9)',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const StoryLabel = () => (
  <div
    style={{
      position: 'absolute',
      top: 94,
      left: 0,
      right: 0,
      color: 'rgba(247,241,231,0.82)',
      fontFamily: 'Arial, sans-serif',
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: 5,
      textAlign: 'center',
      textTransform: 'uppercase',
      textShadow: '0 2px 12px rgba(0,0,0,0.75)',
    }}
  >
    A story about legacy
  </div>
);

const EndCard = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0d1f2d',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#f7f1e7',
        textAlign: 'center',
        opacity,
      }}
    >
      <div
        style={{
          color: '#c9a84c',
          fontFamily: 'Georgia, serif',
          fontSize: 86,
          lineHeight: 1.05,
          marginBottom: 28,
        }}
      >
        Be there evermore.
      </div>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}
      >
        evermorelife.org
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          maxWidth: 860,
          fontFamily: 'Arial, sans-serif',
          fontSize: 22,
          lineHeight: 1.35,
          color: 'rgba(247,241,231,0.72)',
        }}
      >
        Coverage options vary by age, health, state, carrier, and eligibility.
        Not all applicants qualify.
      </div>
    </AbsoluteFill>
  );
};

export const ActivationVideo = ({item}: ActivationVideoProps) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0d1f2d'}}>
      <TransitionSeries>
        {item.clips.map((clip, index) => (
          <TransitionSeries.Sequence key={clip} durationInFrames={CLIP_FRAMES}>
            <ClipScene path={clip} />
            {index === 0 && item.illustrative_story ? <StoryLabel /> : null}
          </TransitionSeries.Sequence>
        )).flatMap((sequence, index) =>
          index === item.clips.length - 1
            ? [sequence]
            : [
                sequence,
                <TransitionSeries.Transition
                  key={`transition-${item.clips[index]}`}
                  presentation={fade()}
                  timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
                />,
              ],
        )}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />
        <TransitionSeries.Sequence durationInFrames={END_CARD_FRAMES}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {item.captions.map((caption) => {
        const durationInFrames = Math.max(
          1,
          Math.round((caption.end_seconds - caption.start_seconds) * FPS),
        );
        return (
          <Sequence
            key={`${caption.start_seconds}-${caption.text}`}
            from={Math.round(caption.start_seconds * FPS)}
            durationInFrames={durationInFrames}
            premountFor={FPS}
          >
            <CaptionCard text={caption.text} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
