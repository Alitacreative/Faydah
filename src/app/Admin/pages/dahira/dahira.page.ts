import { Component, OnInit } from '@angular/core';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-dahira',
  templateUrl: './dahira.page.html',
  styleUrls: ['./dahira.page.scss'],
  standalone: false
})
export class DahiraPage implements OnInit {

    ngOnInit(): void {
    }
  
    async triggerConfetti() {
      // Crée un canvas qui couvre tout l'écran
      const canvas = await this.createFullscreenCanvas();
      
      // Configuration pour le centre de l'écran
      const confettiInstance = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
  
      confettiInstance({
        particleCount: 150,
        spread: 70,
        origin: { 
          x: 0.5, // Centre horizontal (50%)
          y: 0.5  // Centre vertical (50%)
        },
        shapes: ['circle', 'square'],
        // colors: ['#C20404FF', '#007100FF', '#1B1B24FF', '#B89808FF']
      });
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
        
        // Petite pause pour permettre le rendu
        setTimeout(() => {
          resolve(canvas);
        }, 50);
      });
    }
  }
