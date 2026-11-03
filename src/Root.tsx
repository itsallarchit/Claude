import { Composition, staticFile } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Reel, ReelProps } from "./reel/Reel";
import { buildTimeline, Word } from "./reel/timing";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: "Hello, Remotion" }}
      />
      <Composition
        id="Reel01"
        component={Reel}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={FPS * 40}
        defaultProps={{ audio: null, words: null } as ReelProps}
        // public/reel01/voice.mp3 + words.json are picked up automatically when present
        calculateMetadata={async ({ props }) => {
          let words: Word[] | null = props.words;
          let audio = props.audio;
          if (!words) {
            try {
              const res = await fetch(staticFile("reel01/words.json"));
              if (res.ok) {
                words = (await res.json()) as Word[];
                audio = audio ?? "reel01/voice.mp3";
              }
            } catch {
              words = null;
            }
          }
          const { speechEnd } = buildTimeline(words, 999);
          return {
            durationInFrames: Math.ceil((speechEnd + 2.2) * FPS),
            props: { audio, words },
          };
        }}
      />
    </>
  );
};
