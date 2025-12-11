import type Konva from 'konva';

// Konva Event Type Aliases
export type KonvaMouseEvent = Konva.KonvaEventObject<MouseEvent>;
export type KonvaTouchEvent = Konva.KonvaEventObject<TouchEvent>;
export type KonvaDragEvent = Konva.KonvaEventObject<DragEvent>;
export type KonvaTransformEvent = Konva.KonvaEventObject<Event>;
export type KonvaPointerEvent = Konva.KonvaEventObject<MouseEvent | TouchEvent>;

// Ref types for Konva components
export interface StageRef {
  getNode: () => Konva.Stage;
}
export interface LayerRef {
  getNode: () => Konva.Layer;
}
export interface TransformerRef {
  getNode: () => Konva.Transformer;
}

// Transformer bounding box type
export interface TransformerBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

// Base item config shared by all items
interface BaseItemConfig {
  id: string;
  x: number;
  y: number;
  draggable: boolean;
  name: string;
  zIndex: number;
  opacity: number;
}

// Text item configuration
export interface TextItemConfig extends BaseItemConfig {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  fill: string;
  align: string;
  width: number;
  wrap: string;
}

// Image item configuration
export interface ImageItemConfig extends BaseItemConfig {
  image: HTMLImageElement | null;
  width: number;
  height: number;
}

// Line item configuration
export interface LineItemConfig extends BaseItemConfig {
  points: number[];
  stroke: string;
  strokeWidth: number;
  hitStrokeWidth: number;
  lineCap: string;
  lineJoin: string;
  rotation: number;
}

// Rectangle item configuration
export interface RectItemConfig extends BaseItemConfig {
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth: number;
  cornerRadius: number;
  fillEnabled: boolean;
  strokeEnabled: boolean;
}

// Circle item configuration
export interface CircleItemConfig extends BaseItemConfig {
  radius: number;
  fill?: string;
  stroke?: string;
  strokeWidth: number;
  fillEnabled: boolean;
  strokeEnabled: boolean;
}

// Discriminated union for all canvas items
export type CanvasItem
  = | (TextItemConfig & { type: 'text' })
    | (ImageItemConfig & { type: 'image' })
    | (LineItemConfig & { type: 'line' })
    | (RectItemConfig & { type: 'rect' })
    | (CircleItemConfig & { type: 'circle' });

// Item type literals
export type CanvasItemType = CanvasItem['type'];

// Type guards for canvas items
export const isTextItem = (item: CanvasItem): item is TextItemConfig & { type: 'text' } =>
  item.type === 'text';

export const isImageItem = (item: CanvasItem): item is ImageItemConfig & { type: 'image' } =>
  item.type === 'image';

export const isLineItem = (item: CanvasItem): item is LineItemConfig & { type: 'line' } =>
  item.type === 'line';

export const isRectItem = (item: CanvasItem): item is RectItemConfig & { type: 'rect' } =>
  item.type === 'rect';

export const isCircleItem = (item: CanvasItem): item is CircleItemConfig & { type: 'circle' } =>
  item.type === 'circle';

export const isShapeItem = (item: CanvasItem): item is (LineItemConfig & { type: 'line' }) | (RectItemConfig & { type: 'rect' }) | (CircleItemConfig & { type: 'circle' }) =>
  item.type === 'line' || item.type === 'rect' || item.type === 'circle';

// Gradient stop for background
export interface GradientStop {
  color: string;
  position: number;
}

// Background configuration
export type BackgroundType = 'solid' | 'gradient';

// Stage configuration
export interface StageConfig {
  width: number;
  height: number;
}

// Snap guides state
export interface SnapGuidesState {
  horizontal: boolean;
  vertical: boolean;
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

// Canvas size preset
export interface CanvasSizePreset {
  width: number;
  height: number;
  label: string;
  tooltip: string;
}

// View mode type
export type ViewMode = 'fit' | 'actual';

// Layer order direction
export type LayerOrderDirection = 'front' | 'forward' | 'backward' | 'back';

// Alignment direction
export type AlignmentDirection = 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v';

// Arrow key directions for nudging
export type ArrowDirection = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
