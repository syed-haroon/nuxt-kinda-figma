import type { CanvasSizePreset } from '~/types/canvas-editor';

// Canvas configuration constants
export const CANVAS_CONFIG = {
  size: {
    default: 800,
    min: 100,
    max: 2000,
  },
  snap: {
    threshold: 20,
    edgeMargin: 20,
  },
  text: {
    minFontSize: 12,
    maxFontSize: 200,
    defaultFontSize: 48,
    minWidth: 50,
    defaultWidth: 300,
  },
  image: {
    maxInitialSize: 300,
    minSize: 20,
  },
  shape: {
    minSize: 10,
    defaultStrokeWidth: 2,
    defaultLineLength: 200,
    lineHitStrokeWidth: 20,
  },
  rotation: {
    snapAngles: [0, 45, 90, 135, 180, 225, 270, 315, 360],
    snapThreshold: 5,
  },
  transformer: {
    anchorSize: 10,
    rotateAnchorOffset: 40,
    lineRotateAnchorOffset: 30,
    borderStrokeWidth: 2,
    anchorStrokeWidth: 2,
  },
} as const;

// Font families available in the editor
export const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Impact',
] as const;

// Canvas size presets
export const CANVAS_SIZE_PRESETS: CanvasSizePreset[] = [
  { width: 800, height: 800, label: '800×800', tooltip: 'Default' },
  { width: 1080, height: 1080, label: '1080×1080', tooltip: 'Instagram Square' },
  { width: 1080, height: 1920, label: '1080×1920', tooltip: 'Instagram Story / Reels' },
  { width: 1920, height: 1080, label: '1920×1080', tooltip: 'YouTube Thumbnail / HD' },
  { width: 1200, height: 628, label: '1200×628', tooltip: 'Facebook / LinkedIn Post' },
  { width: 1200, height: 675, label: '1200×675', tooltip: 'Twitter Post' },
];

// Transformer base configuration
export const TRANSFORMER_BASE_CONFIG = {
  enabledAnchors: [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center',
    'middle-left',
    'middle-right',
  ],
  rotateAnchorOffset: CANVAS_CONFIG.transformer.rotateAnchorOffset,
  borderStroke: '#0099ff',
  borderStrokeWidth: CANVAS_CONFIG.transformer.borderStrokeWidth,
  anchorFill: '#0099ff',
  anchorStroke: '#ffffff',
  anchorStrokeWidth: CANVAS_CONFIG.transformer.anchorStrokeWidth,
  anchorSize: CANVAS_CONFIG.transformer.anchorSize,
};

// Line-specific transformer configuration (rotation and length only)
export const TRANSFORMER_LINE_CONFIG = {
  enabledAnchors: ['middle-left', 'middle-right'],
  rotateEnabled: true,
  rotateAnchorOffset: CANVAS_CONFIG.transformer.lineRotateAnchorOffset,
  borderStroke: '#0099ff',
  borderStrokeWidth: CANVAS_CONFIG.transformer.borderStrokeWidth,
  anchorFill: '#0099ff',
  anchorStroke: '#ffffff',
  anchorStrokeWidth: CANVAS_CONFIG.transformer.anchorStrokeWidth,
  anchorSize: CANVAS_CONFIG.transformer.anchorSize,
  keepRatio: false,
};

// Default colors for new shapes
export const DEFAULT_COLORS = {
  text: '#000000',
  line: '#000000',
  rect: {
    fill: '#3b82f6',
    stroke: '#1e40af',
  },
  circle: {
    fill: '#10b981',
    stroke: '#047857',
  },
  background: '#ffffff',
  gradient: [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ],
} as const;

// Composable for accessing canvas config
export function useCanvasConfig() {
  return {
    config: CANVAS_CONFIG,
    fontFamilies: FONT_FAMILIES,
    sizePresets: CANVAS_SIZE_PRESETS,
    transformerBaseConfig: TRANSFORMER_BASE_CONFIG,
    transformerLineConfig: TRANSFORMER_LINE_CONFIG,
    defaultColors: DEFAULT_COLORS,
  };
}
