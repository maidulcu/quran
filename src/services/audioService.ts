import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

class AudioService {
  private sound: Sound | null = null;
  private isPlaying: boolean = false;
  private currentAyahAudio: string | null = null;

  async initialize(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
      throw error;
    }
  }

  async playAyah(audioUrl: string): Promise<void> {
    try {
      // If same ayah is already playing, toggle play/pause
      if (this.currentAyahAudio === audioUrl && this.sound) {
        if (this.isPlaying) {
          await this.pause();
        } else {
          await this.resume();
        }
        return;
      }

      // Stop current playback if any
      await this.stop();

      // Load and play new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      this.sound = sound;
      this.currentAyahAudio = audioUrl;
      this.isPlaying = true;

      // Setup playback status update
      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          this.isPlaying = status.isPlaying;

          if (status.didJustFinish) {
            this.isPlaying = false;
            this.currentAyahAudio = null;
          }
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
      throw error;
    }
  }

  async resume(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error('Error resuming audio:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        this.isPlaying = false;
        this.currentAyahAudio = null;
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
      throw error;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentAudioUrl(): string | null {
    return this.currentAyahAudio;
  }

  async setVolume(volume: number): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.setVolumeAsync(volume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    await this.stop();
  }
}

export default new AudioService();
