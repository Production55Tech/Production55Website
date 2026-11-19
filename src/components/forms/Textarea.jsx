import { useRef, useState, useEffect } from "react";
import { cx } from "@/utils/cx";

export default function Textarea({
  className = "",
  label,
  placeholder = "",
  value,
  onChange,
  rows = 3,
  minRows = 2,
  maxRows = 20,
  disabled = false,
  required = false,
  id,
  name,
  ...props
}) {
  const textareaRef = useRef(null);
  const handleRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [height, setHeight] = useState(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  // Auto-resize based on content
  useEffect(() => {
    if (textareaRef.current) {
      const ta = textareaRef.current;
      ta.style.height = "auto";
      const newHeight = Math.max(
        minRows * 1.5 * 16, // approximate line height
        Math.min(ta.scrollHeight, maxRows * 1.5 * 16),
      );
      setHeight(newHeight);
      ta.style.height = `${newHeight}px`;
    }
  }, [value, minRows, maxRows]);

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startY.current = e.clientY;
    startHeight.current = textareaRef.current?.offsetHeight || 0;
    document.body.style.cursor = "se-resize";
    document.body.style.userSelect = "none";
  };

  const onMouseMove = (e) => {
    if (!isResizing) return;
    const deltaY = e.clientY - startY.current;
    const newHeight = Math.max(
      minRows * 1.5 * 16,
      Math.min(startHeight.current + deltaY, maxRows * 1.5 * 16),
    );
    setHeight(newHeight);
  };

  const onMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  const textareaId = id || name || `textarea-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={cx("relative w-full", className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-300 mb-1.5 font-prodFont"
        >
          {label}
          {required && <span className="text-prod-pink ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          style={{
            height: height ? `${height}px` : undefined,
            resize: "none", // disable native resize
          }}
          className={cx(
            "w-full bg-white/5 border-2 border-white/40 rounded-lg font-prodFont text-white placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-prod-pink focus:border-transparent",
            "transition-colors duration-100",
            "px-3 py-2.5", // balanced padding for vertical centering
            disabled && "opacity-50 cursor-not-allowed",
            "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent",
          )}
          {...props}
        />
        {!disabled && (
          <div
            ref={handleRef}
            onMouseDown={startResize}
            onTouchStart={(e) => startResize(e.touches[0])}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center touch-none select-none"
            aria-label="Resize"
            role="slider"
            tabIndex={-1}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-prod-pink opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
            >
              <path d="M10 2L2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
