import { Component, OnInit } from '@angular/core';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-dahira',
  templateUrl: './dahira.page.html',
  styleUrls: ['./dahira.page.scss'],
  standalone: false
})
export class DahiraPage implements OnInit {

  ngOnInit(): void {
  }

  constructor(private confettiService: ConfettiService) {
  }

  startConfetti() {
    this.confettiService.triggerConfetti();
  }
}
