export interface SoundEffect {
    frequency: number;
    duration: number;
    type: OscillatorType;
    volume: number;
    fadeOut?: boolean;
}

export class AudioManager {
    private audioContext: AudioContext;
    private masterGain: GainNode;
    private musicGain: GainNode;
    private sfxGain: GainNode;
    private isMuted: boolean = true; // Start muted
    // Set by the platform (Ayvago); kept apart from the player's own M toggle.
    private platformMuted: boolean = false;
    private musicNodes: AudioNode[] = [];
    private activeOscillators: Set<OscillatorNode> = new Set();

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create master gain node
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        
        // Create separate gain nodes for music and SFX
        this.musicGain = this.audioContext.createGain();
        this.musicGain.connect(this.masterGain);
        this.musicGain.gain.value = 0.3;
        
        this.sfxGain = this.audioContext.createGain();
        this.sfxGain.connect(this.masterGain);
        this.sfxGain.gain.value = 0.7;
        
        this.setupMuteToggle();
        this.updateMuteState();
    }

    private setupMuteToggle(): void {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyM') {
                this.toggleMute();
            }
        });
    }

    private async ensureAudioContext(): Promise<void> {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    toggleMute(): void {
        this.isMuted = !this.isMuted;
        this.updateMuteState();
    }

    setPlatformMuted(muted: boolean): void {
        this.platformMuted = muted;
        this.updateMuteState();
    }

    private updateMuteState(): void {
        this.masterGain.gain.value = this.isMuted || this.platformMuted ? 0 : 1;
    }

    async playSoundEffect(effect: SoundEffect): Promise<void> {
        await this.ensureAudioContext();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = effect.type;
        oscillator.frequency.setValueAtTime(effect.frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(effect.volume, this.audioContext.currentTime);
        
        if (effect.fadeOut) {
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + effect.duration);
        } else {
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + effect.duration);
        }
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        this.activeOscillators.add(oscillator);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + effect.duration);
        
        oscillator.onended = () => {
            this.activeOscillators.delete(oscillator);
        };
    }

    // Sound effect presets
    async playScore(): Promise<void> {
        await this.playSoundEffect({
            frequency: 800,
            duration: 0.15,
            type: 'sine',
            volume: 0.3,
            fadeOut: true
        });
    }

    async playDeath(): Promise<void> {
        await this.playSoundEffect({
            frequency: 150,
            duration: 0.8,
            type: 'sawtooth',
            volume: 0.5,
            fadeOut: true
        });
    }

    async playFall(): Promise<void> {
        await this.ensureAudioContext();
        // Descending whoosh: pitch sweeps down rapidly, then a thud
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + 0.6);

        gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        this.activeOscillators.add(osc);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.8);
        osc.onended = () => { this.activeOscillators.delete(osc); };

        // Short low thud at end
        setTimeout(() => {
            this.playSoundEffect({
                frequency: 80,
                duration: 0.25,
                type: 'sine',
                volume: 0.4,
                fadeOut: true
            });
        }, 500);
    }

    async playMove(): Promise<void> {
        await this.playSoundEffect({
            frequency: 400,
            duration: 0.1,
            type: 'square',
            volume: 0.2
        });
    }

    async playPowerUp(): Promise<void> {
        // Play ascending tone sequence
        const frequencies = [400, 500, 600, 800];
        for (let i = 0; i < frequencies.length; i++) {
            setTimeout(() => {
                this.playSoundEffect({
                    frequency: frequencies[i],
                    duration: 0.15,
                    type: 'sine',
                    volume: 0.3,
                    fadeOut: true
                });
            }, i * 80);
        }
    }

    async startBackgroundMusic(): Promise<void> {
        // Background music disabled
    }

    stopBackgroundMusic(): void {
        this.musicNodes.forEach(node => {
            if (node instanceof AudioScheduledSourceNode) {
                try {
                    node.stop();
                } catch (e) {
                    // Already stopped
                }
            }
        });
        this.musicNodes = [];
    }

    pauseAll(): void {
        // Stop all active oscillators
        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Already stopped
            }
        });
        this.activeOscillators.clear();
    }

    resumeAll(): void {
        // Audio will resume naturally when new sounds are played
    }

    setMasterVolume(volume: number): void {
        this.masterGain.gain.value = this.isMuted || this.platformMuted ? 0 : Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume: number): void {
        this.musicGain.gain.value = Math.max(0, Math.min(1, volume));
    }

    setSFXVolume(volume: number): void {
        this.sfxGain.gain.value = Math.max(0, Math.min(1, volume));
    }
}