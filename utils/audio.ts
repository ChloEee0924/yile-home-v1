// Simple audio utility using Web Audio API

export const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();

        // Define a helper to play a tone
        const playTone = (freq: number, startTime: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Envelope
            osc.start(startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05); // Attack
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay

            osc.stop(startTime + duration);
        };

        // Apple Pay-ish Chime: a chord of high sine waves
        // E.g., C6 (1046.5Hz) + E6 (1318.5Hz)
        const now = ctx.currentTime;
        playTone(1046.5, now, 0.6);
        playTone(1318.5, now + 0.1, 0.6); // Slightly delayed second note and higher pitch

    } catch (e) {
        console.error("Audio playback failed", e);
    }
};
