import type Konva from 'konva';
import type { CanvasItem } from '~/types/canvas-editor';
import { useCanvasEditorStore } from '~/stores/canvasEditor';

export interface TextEditorOptions {
  scaleFactor: Ref<number>;
}

/**
 * Composable for managing inline text editing
 * Uses the canvas editor store for state updates
 */
export function useTextEditor(options: TextEditorOptions) {
  const { scaleFactor } = options;
  const store = useCanvasEditorStore();

  // Editing state
  const isEditing = ref(false);
  const editingTextId = ref<string | null>(null);

  /**
   * Start inline editing for a text node
   */
  const startEditing = (textNode: Konva.Text, item: CanvasItem & { type: 'text' }) => {
    const stage = textNode.getStage();
    if (!stage) return;

    const scale = scaleFactor.value;
    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    const areaPosition = {
      x: stageBox.left + textPosition.x * scale,
      y: stageBox.top + textPosition.y * scale,
    };

    isEditing.value = true;
    editingTextId.value = item.id;

    // Create textarea for editing
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // Configure textarea styles
    textarea.value = textNode.text();
    Object.assign(textarea.style, {
      position: 'absolute',
      top: `${areaPosition.y}px`,
      left: `${areaPosition.x}px`,
      width: `${(textNode.width() - textNode.padding() * 2) * scale}px`,
      height: `${(textNode.height() - textNode.padding() * 2 + 5) * scale}px`,
      fontSize: `${textNode.fontSize() * scale}px`,
      border: 'none',
      padding: '0px',
      margin: '0px',
      overflow: 'hidden',
      background: 'none',
      outline: 'none',
      resize: 'none',
      lineHeight: String(textNode.lineHeight()),
      fontFamily: textNode.fontFamily(),
      transformOrigin: 'left top',
      textAlign: textNode.align(),
      color: textNode.fill() as string,
    });

    // Handle rotation
    const rotation = textNode.rotation();
    if (rotation) {
      textarea.style.transform = `rotateZ(${rotation}deg)`;
    }

    // Auto-height
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 3}px`;
    textarea.focus();

    // Cleanup function
    const removeTextarea = () => {
      if (textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
      isEditing.value = false;
      editingTextId.value = null;
    };

    // Width adjustment function
    const setTextareaWidth = (newWidth: number) => {
      textarea.style.width = `${(newWidth || textNode.fontSize() * 10) * scale}px`;
    };

    // Keyboard event handler
    const handleKeydown = (evt: KeyboardEvent) => {
      if (evt.key === 'Enter' && !evt.shiftKey) {
        evt.preventDefault();
        const newText = textarea.value || 'Text';
        store.updateItem(item.id, { text: newText });
        removeTextarea();
      }
      if (evt.key === 'Escape') {
        removeTextarea();
      }
    };

    // Input event handler
    const handleInput = () => {
      const nodeScale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * nodeScale);
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + textNode.fontSize() * scale}px`;
    };

    // Outside click handler
    const handleOutsideClick = (evt: MouseEvent | TouchEvent) => {
      if (evt.target !== textarea) {
        const newText = textarea.value || 'Text';
        store.updateItem(item.id, { text: newText });
        removeTextarea();
      }
    };

    // Attach event listeners
    textarea.addEventListener('keydown', handleKeydown);
    textarea.addEventListener('input', handleInput);

    // Delay outside click listener to prevent immediate closure
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
      window.addEventListener('touchstart', handleOutsideClick);
    });
  };

  /**
   * Cancel current editing session
   */
  const cancelEditing = () => {
    isEditing.value = false;
    editingTextId.value = null;
  };

  return {
    isEditing: readonly(isEditing),
    editingTextId: readonly(editingTextId),
    startEditing,
    cancelEditing,
  };
}
