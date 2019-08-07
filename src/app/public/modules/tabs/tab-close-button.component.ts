import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-tab-close-button',
  templateUrl: './tab-close-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTabCloseButtonComponent {

  @Input()
  public disabled = false;

  @Input()
  public tabIndex: number = -1;

  /**
   * Prevents screen readers from reading out the "Close button"
   * label when the tab is focused.
   * @ignore
   */
  public isCloseButtonFocused = false;

  public onCloseButtonBlur(): void {
    this.isCloseButtonFocused = false;
  }

  public onCloseButtonFocus(): void {
    this.isCloseButtonFocused = true;
  }
}
