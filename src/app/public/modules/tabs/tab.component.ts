import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

let uniqueId = 0;

@Component({
  selector: 'sky-tab',
  templateUrl: './tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTabComponent {

  @Input()
  public isCloseable: boolean = false;

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return this._disabled || false;
  }

  @Input()
  public heading: string;

  @Input()
  public headingCount: string | number;

  @Input()
  public set queryParamValue(value: string) {
    this._queryParamValue = this.sanitizeKey(value);
  }

  public get queryParamValue(): string {
    return this._queryParamValue || this.sanitizeKey(this.heading);
  }

  public get buttonId(): string {
    return `sky-tab-button-${this.tabId}`;
  }

  public get panelId(): string {
    return `sky-tab-panel-${this.tabId}`;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
    this.changeDetector.markForCheck();
  }

  public get isActive(): boolean {
    return this._isActive || false;
  }

  private tabId: number;

  private _disabled: boolean = false;

  private _isActive: boolean = false;

  private _queryParamValue: string;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
    this.tabId = uniqueId++;
  }

  private sanitizeKey(value: string): string {
    if (!value) {
      return;
    }

    const sanitized = value.toLowerCase()

      // Remove special characters.
      .replace(/[\_\~\`\@\!\#\$\%\^\&\*\(\)\[\]\{\}\;\:\'\/\\\<\>\,\.\?\=\+\|"]/g, '')

      // Replace space characters with a dash.
      .replace(/\s/g, '-')

      // Remove any double-dashes.
      .replace(/--/g, '-');

    return sanitized;
  }
}
