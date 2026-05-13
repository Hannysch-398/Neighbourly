import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-generic-button',
  imports: [],
  templateUrl: './generic-button.html',
  styleUrl: './generic-button.css',
})
export class GenericButton {
  label = input('Button');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  loading = input(false);

  clicked = output<Event>();

  handleClick(event: Event) {
    if (this.disabled() || this.loading()) return;
    this.clicked.emit(event);
  }
}
