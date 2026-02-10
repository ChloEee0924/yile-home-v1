import React, { useRef, useEffect, useState, useCallback } from 'react';

interface WheelPickerProps {
    items: (string | number)[];
    value: string | number;
    onChange: (value: any) => void;
    height?: string;
    itemHeight?: number;
}

// Simple click sound generator using Web Audio API to avoid external assets
const playClickSound = (() => {
    let audioCtx: AudioContext | null = null;

    return () => {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'triangle'; // Crisper sound with more harmonics
            oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime); // Sharp start
            oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.03); // Quick snap

            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Lower volume as triangle is louder
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.04);
        } catch (e) {
            // Audio context might be blocked or not supported
        }
    };
})();

const WheelPicker: React.FC<WheelPickerProps> = ({
    items,
    value,
    onChange,
    height = 'h-32',
    itemHeight = 40 // h-10 is 40px
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);
    const lastSelectedIndex = useRef<number>(-1);

    // Initial scroll to position
    useEffect(() => {
        if (containerRef.current && !isScrolling.current) {
            const index = items.indexOf(value);
            if (index !== -1) {
                containerRef.current.scrollTop = index * itemHeight;
                lastSelectedIndex.current = index;
            }
        }
    }, [value, items, itemHeight]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        isScrolling.current = true;

        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);

        // Boundary check
        const validIndex = Math.max(0, Math.min(index, items.length - 1));

        // Sound effect on index change
        if (lastSelectedIndex.current !== validIndex) {
            playClickSound();
            lastSelectedIndex.current = validIndex;

            // Update value logic could be here, but for "snap" feel, we might want to debounce or wait.
            // However, user asked for "auto update based on center".
            // We'll update immediately but maybe debounce the parent callback if it's heavy (state update is usually fine).
            if (items[validIndex] !== value) {
                onChange(items[validIndex]);
            }
        }

        // Reset scrolling flag after a timeout to allow external updates again
        // (Simple debounce to differentiate user scroll vs programmatic scroll)
        clearTimeout((containerRef.current as any).scrollTimeout);
        (containerRef.current as any).scrollTimeout = setTimeout(() => {
            isScrolling.current = false;
            // Force snap alignment just in case
            if (containerRef.current) {
                const snapTop = validIndex * itemHeight;
                if (Math.abs(containerRef.current.scrollTop - snapTop) > 2) {
                    containerRef.current.scrollTo({ top: snapTop, behavior: 'smooth' });
                }
            }
        }, 150);

    }, [items, itemHeight, value, onChange]);

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`flex flex-col items-center overflow-y-auto no-scrollbar snap-y snap-mandatory w-full ${height} relative`}
            style={{ scrollBehavior: 'smooth' }}
        >
            {/* Spacer to push first item to center */}
            <div style={{ height: (128 - itemHeight) / 2, flexShrink: 0 }} />

            {items.map((item) => (
                <button
                    key={item}
                    onClick={() => {
                        onChange(item);
                        // Click also triggers smooth scroll via the useEffect dependency on value
                    }}
                    className={`h-10 shrink-0 snap-center w-full text-center transition-all duration-200 flex items-center justify-center ${item === value
                        ? 'text-xl font-bold text-primary scale-110'
                        : 'text-lg font-medium text-gray-300 scale-90'
                        }`}
                    style={{ height: itemHeight }}
                >
                    {String(item).padStart(2, '0') === '00' && typeof item === 'number' ? '00' : item}
                </button>
            ))}

            {/* Spacer to allow last item to be centered */}
            <div style={{ height: (128 - itemHeight) / 2, flexShrink: 0 }} />
        </div>
    );
};

export default WheelPicker;
