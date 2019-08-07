import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-tab-close-button',
  templateUrl: './tab-close-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTabCloseButtonComponent implements OnDestroy {

  @Input()
  public disabled: boolean = false;

  @Input()
  public tabIndex: number = -1;

  @Output()
  public close = new EventEmitter<void>();

  /**
   * Prevents screen readers from reading out the "Close button"
   * label when the tab is focused.
   * @ignore
   */
  public isFocused: boolean = false;

  public ngOnDestroy(): void {
    this.close.complete();
  }

  public onBlur(): void {
    this.isFocused = false;
  }

  public onClick(): void {
    this.close.emit();
  }

  public onFocus(): void {
    this.isFocused = true;
  }
}
