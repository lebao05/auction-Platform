import React, { useRef, useState, useEffect, useCallback } from "react";

/**
 * Props:
 * - value?: number | [number, number]      (controlled)
 * - defaultValue?: number | [number, number] (uncontrolled)
 * - min = 0, max = 100, step = 1
 * - onValueChange?: (value) => void
 * - onChangeEnd?: (value) => void
 * - className?: string
 * - trackClassName, rangeClassName, thumbClassName for styling
 *
 * Usage:
 * <Slider min={0} max={100} defaultValue={[10,80]} onValueChange={v => console.log(v)} />
 * <Slider min={0} max={10} value={5} onValueChange={v => setV(v)} />
 */
export function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  onChangeEnd,
  className = "",
  trackClassName = "h-2 bg-gray-200 rounded",
  rangeClassName = "absolute h-2 bg-blue-500 rounded",
  thumbClassName = "w-4 h-4 rounded-full bg-white border shadow",
}) {
  const trackRef = useRef(null);
  const [internal, setInternal] = useState(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    // default to min for single, [min, max] for range
    return Array.isArray(defaultValue) ? [min, max] : min;
  });

  // derive controlled vs uncontrolled
  const isControlled = value !== undefined;
  const stateValue = isControlled ? value : internal;

  // normalize to array for internal calculations
  const asArray = Array.isArray(stateValue)
    ? stateValue.slice(0, 2)
    : [stateValue, stateValue];

  const clamp = useCallback((v) => Math.min(max, Math.max(min, v)), [min, max]);

  const toPercent = useCallback(
    (v) => ((clamp(v) - min) / (max - min)) * 100,
    [min, max, clamp]
  );

  const stepify = useCallback(
    (v) => {
      const steps = Math.round((v - min) / step);
      return clamp(Number((min + steps * step).toFixed(6)));
    },
    [min, step, clamp]
  );

  // set value helper
  const setValue = useCallback(
    (next) => {
      if (!isControlled) setInternal(next);
      if (onValueChange) onValueChange(next);
    },
    [isControlled, onValueChange]
  );

  // convert clientX to value
  const clientXToValue = (clientX) => {
    const track = trackRef.current;
    if (!track) return min;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const valueAt = min + ratio * (max - min);
    return stepify(valueAt);
  };

  // pointer drag handling
  const dragging = useRef(null); // null | 0 | 1 -> which thumb index (0 for left, 1 for right)
  useEffect(() => {
    const onPointerMove = (e) => {
      if (dragging.current === null) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      if (clientX == null) return;
      const v = clientXToValue(clientX);
      let [a, b] = asArray;
      if (asArray[0] === asArray[1]) {
        // single-value mode: both equal; treat as single
        if (Array.isArray(stateValue) && stateValue[0] === stateValue[1]) {
          // range but collapsed -> handle as range
        }
      }
      if (Array.isArray(stateValue) && stateValue.length === 2) {
        if (dragging.current === 0) {
          // left thumb: ensure <= right
          a = Math.min(v, b);
        } else {
          b = Math.max(v, a);
        }
        setValue([a, b]);
      } else {
        // single value
        setValue(v);
      }
    };

    const onPointerUp = () => {
      if (dragging.current !== null && onChangeEnd) {
        onChangeEnd(stateValue);
      }
      dragging.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };

    if (dragging.current !== null) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("touchmove", onPointerMove, { passive: false });
      window.addEventListener("touchend", onPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asArray, stateValue, setValue, clientXToValue, onChangeEnd]);

  const startDrag = (thumbIndex, ev) => {
    // prefer pointer events; support touch
    ev.preventDefault && ev.preventDefault();
    dragging.current = thumbIndex;
    // ensure browser will send pointer events
    if (ev.nativeEvent && ev.nativeEvent.pointerId != null) {
      // pointer event already
    } else {
      // fallback: add listeners in effect
    }
  };

  // clicking the track moves nearest thumb (or single value)
  const onTrackClick = (e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    if (clientX == null) return;
    const v = clientXToValue(clientX);
    if (Array.isArray(stateValue) && stateValue.length === 2) {
      // move nearest thumb
      const dist0 = Math.abs(v - asArray[0]);
      const dist1 = Math.abs(v - asArray[1]);
      if (dist0 <= dist1) {
        setValue([Math.min(v, asArray[1]), asArray[1]]);
      } else {
        setValue([asArray[0], Math.max(v, asArray[0])]);
      }
    } else {
      setValue(v);
    }
    if (onChangeEnd) onChangeEnd(stateValue);
  };

  // keyboard handlers on thumbs
  const onThumbKeyDown = (idx, e) => {
    const key = e.key;
    let delta = 0;
    if (key === "ArrowLeft" || key === "ArrowDown") delta = -step;
    if (key === "ArrowRight" || key === "ArrowUp") delta = step;
    if (key === "PageDown") delta = -step * 10;
    if (key === "PageUp") delta = step * 10;
    if (key === "Home") {
      if (Array.isArray(stateValue)) {
        if (idx === 0) setValue([min, asArray[1]]);
        else setValue([asArray[0], max]);
      } else {
        setValue(min);
      }
      if (onChangeEnd) onChangeEnd(stateValue);
      e.preventDefault();
      return;
    }
    if (key === "End") {
      if (Array.isArray(stateValue)) {
        if (idx === 0) setValue([min, asArray[1]]);
        else setValue([asArray[0], max]);
      } else {
        setValue(max);
      }
      if (onChangeEnd) onChangeEnd(stateValue);
      e.preventDefault();
      return;
    }
    if (delta !== 0) {
      if (Array.isArray(stateValue) && stateValue.length === 2) {
        let [a, b] = asArray;
        if (idx === 0) {
          a = stepify(a + delta);
          a = Math.min(a, b);
        } else {
          b = stepify(b + delta);
          b = Math.max(b, a);
        }
        setValue([a, b]);
      } else {
        setValue(stepify(stateValue + delta));
      }
      if (onChangeEnd) onChangeEnd(stateValue);
      e.preventDefault();
    }
  };

  // render positions
  const leftPercent = toPercent(asArray[0]);
  const rightPercent = toPercent(asArray[1]);

  // detect single vs range mode: if incoming prop is array of length 2 it is range.
  const isRange = Array.isArray(stateValue) && stateValue.length === 2;

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={trackRef}
        className={`relative ${trackClassName}`}
        onMouseDown={(e) => {
          // click on track: move nearest thumb / value
          onTrackClick(e);
        }}
        onTouchStart={(e) => {
          onTrackClick(e);
        }}
        style={{ touchAction: "none" }}
      >
        {/* range selection bar */}
        <div
          aria-hidden
          className={rangeClassName}
          style={{
            left: `${isRange ? leftPercent : 0}%`,
            width: `${isRange ? rightPercent - leftPercent : leftPercent}%`,
          }}
        />

        {/* left thumb */}
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={asArray[0]}
          aria-label={isRange ? "Minimum value" : "Value"}
          onKeyDown={(e) => onThumbKeyDown(0, e)}
          onPointerDown={(e) => startDrag(0, e)}
          onTouchStart={(e) => startDrag(0, e)}
          className={`absolute -top-1/2 transform -translate-x-1/2 ${thumbClassName}`}
          style={{ left: `${leftPercent}%` }}
        />

        {/* right thumb (only for range) */}
        {isRange && (
          <div
            role="slider"
            tabIndex={0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={asArray[1]}
            aria-label="Maximum value"
            onKeyDown={(e) => onThumbKeyDown(1, e)}
            onPointerDown={(e) => startDrag(1, e)}
            onTouchStart={(e) => startDrag(1, e)}
            className={`absolute -top-1/2 transform -translate-x-1/2 ${thumbClassName}`}
            style={{ left: `${rightPercent}%` }}
          />
        )}
      </div>
    </div>
  );
}

export default Slider;
