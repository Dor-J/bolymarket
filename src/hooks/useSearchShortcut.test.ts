import { createRef } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchShortcut } from './useSearchShortcut';

describe('useSearchShortcut', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('focuses the input when / is pressed outside editable fields', () => {
    const inputRef = createRef<HTMLInputElement>();
    const input = document.createElement('input');
    const focus = vi.fn();
    input.focus = focus;
    inputRef.current = input;

    renderHook(() => useSearchShortcut(inputRef, true));

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: '/', bubbles: true }),
      );
    });

    expect(focus).toHaveBeenCalledTimes(1);
  });

  it('does not register a listener when disabled', () => {
    const inputRef = createRef<HTMLInputElement>();

    renderHook(() => useSearchShortcut(inputRef, false));

    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });

  it('does not focus when the target is already an input', () => {
    const inputRef = createRef<HTMLInputElement>();
    const searchInput = document.createElement('input');
    const focus = vi.fn();
    searchInput.focus = focus;
    inputRef.current = searchInput;

    const activeInput = document.createElement('input');
    document.body.appendChild(activeInput);
    activeInput.focus();

    renderHook(() => useSearchShortcut(inputRef, true));

    act(() => {
      activeInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: '/', bubbles: true }),
      );
    });

    expect(focus).not.toHaveBeenCalled();
    document.body.removeChild(activeInput);
  });

  it('removes the keydown listener on unmount', () => {
    const inputRef = createRef<HTMLInputElement>();

    const { unmount } = renderHook(() => useSearchShortcut(inputRef, true));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });
});
