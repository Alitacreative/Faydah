import { Injectable } from '@angular/core';
import * as confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {
  private canvas: HTMLCanvasElement | null = null;

  async triggerConfetti() {
    if (!this.canvas) {
      this.canvas = await this.createFullscreenCanvas();
    }
    
    const confettiInstance = confetti.create(this.canvas, {
      resize: true,
      useWorker: true
    });
  
    confettiInstance({
      particleCount: 150,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['circle', 'square']
    });
  
    // Nettoyage automatique après 6 secondes
    setTimeout(() => {
      this.clearConfetti();
    }, 6000);
  }

  private createFullscreenCanvas(): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      
      document.body.appendChild(canvas);
      
      setTimeout(() => {
        resolve(canvas);
      }, 50);
    });
  }

  // Méthode pour nettoyer le canvas
  clearConfetti() {
    // Vérifie si le canvas existe ET est toujours dans le DOM
    if (this.canvas && document.body.contains(this.canvas)) {
      document.body.removeChild(this.canvas);
      this.canvas = null;
    }
  }
}