import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";

const GOLD = "#D4AF37";
const GOLD_DIM = "#B8962E";

const words = [
  { text: "足底筋膜炎，", start: 0, end: 45 },
  { text: "真的是走路走出来的吗？", start: 30, end: 75 },
  { text: "错了。", start: 70, end: 100 },
  { text: "很多人天天踩着疼，", start: 100, end: 145 },
  { text: "却一直在治脚底。", start: 140, end: 185 },
  { text: "真正的问题，往往不在脚上。", start: 180, end: 240 },
  { text: "它是张力链失衡。", start: 250, end: 295 },
  { text: "小腿、髋、甚至腰背的肌肉太紧，", start: 290, end: 350 },
  { text: "把拉力一路传到足底筋膜。", start: 345, end: 395 },
  { text: "局部疼痛，常常是远处代偿的结果。", start: 390, end: 450 },
  { text: "所以脚在喊疼的时候，", start: 460, end: 505 },
  { text: "真正该松的，", start: 500, end: 535 },
  { text: "可能是整条后侧链条。", start: 530, end: 575 },
  { text: "治痛，要先找对发力点。", start: 570, end: 620 },
];

const lines = [
  "M 100 200 Q 400 100 700 300 T 1400 250",
  "M 200 600 Q 500 450 900 700 T 1600 550",
  "M 50 400 Q 600 300 1100 500 T 1700 400",
  "M 300 100 Q 700 250 1200 150 T 1800 300",
];

const Particle: React.FC<{ seed: number }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const x = random(seed) * width;
  const y = random(seed + 1) * height;
  const size = 1 + random(seed + 2) * 2.5;
  const speed = 0.15 + random(seed + 3) * 0.25;

  const opacity = interpolate(
    Math.sin((frame + seed * 10) * speed * 0.05),
    [-1, 1],
    [0.05, 0.35]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin((frame + seed) * 0.02) * 8,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: GOLD,
        opacity,
        boxShadow: `0 0 ${size * 3}px ${GOLD}`,
      }}
    />
  );
};

const GoldLine: React.FC<{ d: string; delay: number }> = ({ d, delay }) => {
  const frame = useCurrentFrame();
  const progress = spring({
    frame: frame - delay,
    fps: 30,
    config: { damping: 200, stiffness: 40 },
  });

  const dash = 1800;
  const offset = interpolate(progress, [0, 1], [dash, 0]);

  return (
    <path
      d={d}
      fill="none"
      stroke={GOLD}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeDasharray={dash}
      strokeDashoffset={offset}
      opacity={0.55}
      style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.4))" }}
    />
  );
};

const Word: React.FC<{
  text: string;
  start: number;
  end: number;
}> = ({ text, start, end }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [start, start + 8, end - 10, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = spring({
    frame: frame - start,
    fps: 30,
    config: { damping: 18, stiffness: 120 },
  });

  const y = interpolate(scale, [0, 1], [18, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${0.92 + scale * 0.08})`,
        fontSize: 64,
        fontWeight: 700,
        color: "#F5F0E6",
        letterSpacing: "0.04em",
        textShadow: `0 0 24px rgba(212,175,55,0.35)`,
        marginBottom: 12,
        lineHeight: 1.25,
      }}
    >
      {text}
    </div>
  );
};

export const FootTension: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "PingFang SC, Noto Sans SC, Microsoft YaHei, sans-serif",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 48 }).map((_, i) => (
        <Particle key={i} seed={i * 17.3} />
      ))}

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {lines.map((d, i) => (
          <GoldLine key={i} d={d} delay={i * 12} />
        ))}
      </svg>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 120px",
          textAlign: "center",
        }}
      >
        <div>
          {words.map((w, i) => (
            <Sequence key={i} from={0} durationInFrames={600}>
              <Word text={w.text} start={w.start} end={w.end} />
            </Sequence>
          ))}
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD_DIM}, transparent)`,
          opacity: interpolate(frame, [0, 60, 540, 600], [0, 0.4, 0.4, 0]),
        }}
      />
    </AbsoluteFill>
  );
};
