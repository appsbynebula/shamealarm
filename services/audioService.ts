
// This service handles the "Alarm" sound (Oscillators) and playing the Gemini TTS buffer

let audioContext: AudioContext | null = null;
let alarmOscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Create a really annoying siren sound using standard Web Audio API
export const startAlarm = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // Create oscillator
  alarmOscillator = ctx.createOscillator();
  alarmOscillator.type = 'sawtooth'; // Harsh sound
  alarmOscillator.frequency.value = 800; // Start freq

  // Create gain (volume)
  gainNode = ctx.createGain();
  gainNode.gain.value = 0.5; // Start volume

  // Connect
  alarmOscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Modulate frequency to create siren effect
  const now = ctx.currentTime;
  alarmOscillator.frequency.setValueAtTime(800, now);
  alarmOscillator.frequency.linearRampToValueAtTime(1200, now + 0.5);
  alarmOscillator.frequency.linearRampToValueAtTime(800, now + 1.0);
  
  // Loop the modulation
  // Note: For a simple implementation without complex loops, we just restart often or use an LFO. 
  // Here we use an LFO for the siren effect.
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 2; // 2Hz siren
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 400; // Range of frequency change
  
  lfo.connect(lfoGain);
  lfoGain.connect(alarmOscillator.frequency);
  lfo.start();

  alarmOscillator.start();
  
  // Cleanup reference for LFO so we can stop it later if we wanted to complicate this, 
  // but for "Shame" we usually just reload the page to stop it or click a button.
  // We'll attach the LFO stop to the oscillator stop for simplicity in this demo scope.
  const originalStop = alarmOscillator.stop.bind(alarmOscillator);
  alarmOscillator.stop = () => {
      lfo.stop();
      originalStop();
  };
};

export const stopAlarm = () => {
  if (alarmOscillator) {
    try {
      alarmOscillator.stop();
      alarmOscillator.disconnect();
    } catch (e) {
      // Ignore if already stopped
    }
    alarmOscillator = null;
  }
};

export const playBuffer = (buffer: AudioBuffer) => {
  const ctx = getAudioContext();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
};

// Utility to decode raw audio data from Gemini
export const decodeAudioData = async (base64String: string): Promise<AudioBuffer> => {
    const ctx = getAudioContext();
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return await ctx.decodeAudioData(bytes.buffer);
};

// Super Dopaminic Hit Sound (Ascending Major Arpeggio)
export const playLoginSound = () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Notes: C5, E5, G5, C6 (Major Chord)
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    
    frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        // Stagger start times slightly for arpeggio effect
        const startTime = now + (index * 0.1);
        
        // Envelope
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.6);
    });
};
